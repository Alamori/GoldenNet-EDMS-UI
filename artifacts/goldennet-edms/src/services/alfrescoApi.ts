const BASE = "/alfresco/api/-default-/public";
const AUTH_URL = `${BASE}/authentication/versions/1/tickets`;
const REPO_URL = `${BASE}/alfresco/versions/1`;
const SEARCH_URL = `${BASE}/search/versions/1/search`;

function getTicket(): string | null {
  return localStorage.getItem("alf_ticket");
}

function setTicket(ticket: string): void {
  localStorage.setItem("alf_ticket", ticket);
}

export function clearTicket(): void {
  localStorage.removeItem("alf_ticket");
}

export function isLoggedIn(): boolean {
  return !!getTicket();
}

function handleAuthError(): void {
  clearTicket();
  window.location.href = "/login";
}

async function alfrescoFetch(url: string, options: RequestInit = {}): Promise<any> {
  const ticket = getTicket();
  if (!ticket) {
    handleAuthError();
    throw new Error("لا يوجد تذكرة مصادقة");
  }

  const separator = url.includes("?") ? "&" : "?";
  const authedUrl = `${url}${separator}alf_ticket=${ticket}`;

  let res: Response;
  try {
    res = await fetch(authedUrl, options);
  } catch {
    throw new Error("تعذر الاتصال بخادم Alfresco. تأكد من أن الخادم يعمل.");
  }

  if (res.status === 401 || res.status === 403) {
    handleAuthError();
    throw new Error("انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body?.error?.briefSummary || `خطأ من الخادم: ${res.status}`
    );
  }

  return res.json();
}

// ─── Authentication ──────────────────────────────────────
export async function login(username: string, password: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: username, password }),
    });
  } catch {
    throw new Error("ALFRESCO_UNREACHABLE");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body?.error?.briefSummary || "اسم المستخدم أو كلمة المرور غير صحيحة"
    );
  }

  const data = await res.json();
  const ticket = data.entry.id;
  setTicket(ticket);
  return ticket;
}

export async function logout(): Promise<void> {
  const ticket = getTicket();
  if (ticket) {
    try {
      await fetch(`${AUTH_URL}/-me-?alf_ticket=${ticket}`, {
        method: "DELETE",
      });
    } catch {
      // ignore – we clear locally regardless
    }
  }
  clearTicket();
}

// ─── Nodes / Documents ──────────────────────────────────
export async function getDocuments(
  parentId: string = "-root-",
  params: Record<string, string> = {}
): Promise<any> {
  const query = new URLSearchParams({
    include: "properties,path",
    ...params,
  }).toString();

  const data = await alfrescoFetch(
    `${REPO_URL}/nodes/${encodeURIComponent(parentId)}/children?${query}`
  );
  return data.list;
}

export async function getNodeMetadata(nodeId: string): Promise<any> {
  const data = await alfrescoFetch(
    `${REPO_URL}/nodes/${encodeURIComponent(nodeId)}?include=properties,path`
  );
  return data.entry;
}

export async function updateMetadata(
  nodeId: string,
  properties: Record<string, any>
): Promise<any> {
  const data = await alfrescoFetch(
    `${REPO_URL}/nodes/${encodeURIComponent(nodeId)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ properties }),
    }
  );
  return data.entry;
}

interface UploadMetadata {
  name?: string;
  title?: string;
  description?: string;
  nodeType?: string;
}

export async function uploadDocument(
  parentId: string,
  file: File,
  metadata: UploadMetadata = {}
): Promise<any> {
  const ticket = getTicket();
  if (!ticket) {
    handleAuthError();
    throw new Error("لا يوجد تذكرة مصادقة");
  }

  const formData = new FormData();
  formData.append("filedata", file);
  formData.append("name", metadata.name || file.name);
  if (metadata.title) formData.append("cm:title", metadata.title);
  if (metadata.description)
    formData.append("cm:description", metadata.description);
  if (metadata.nodeType)
    formData.append("nodeType", metadata.nodeType);
  else formData.append("nodeType", "cm:content");

  let res: Response;
  try {
    res = await fetch(
      `${REPO_URL}/nodes/${encodeURIComponent(parentId)}/children?alf_ticket=${ticket}`,
      { method: "POST", body: formData }
    );
  } catch {
    throw new Error("تعذر رفع الملف. تأكد من اتصالك بالخادم.");
  }

  if (res.status === 401 || res.status === 403) {
    handleAuthError();
    throw new Error("انتهت صلاحية الجلسة.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.briefSummary || `خطأ أثناء الرفع: ${res.status}`);
  }

  return res.json();
}

// ─── Search ─────────────────────────────────────────────
export async function searchDocuments(query: string): Promise<any> {
  const data = await alfrescoFetch(SEARCH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: {
        query: `cm:name:*${query}*`,
        language: "afts",
      },
      include: ["properties", "path"],
    }),
  });
  return data.list;
}
