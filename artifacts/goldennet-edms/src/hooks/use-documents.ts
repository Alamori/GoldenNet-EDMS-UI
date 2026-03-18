import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDocuments as alfrescoGetDocuments,
  uploadDocument as alfrescoUpload,
  isLoggedIn,
} from "@/services/alfrescoApi";

export type DocumentStatus = "جديد" | "قيد المراجعة" | "مُعتمد" | "مرفوض";
export type DocumentType = "وارد" | "صادر" | "داخلي";

export interface Document {
  id: string;
  number: string;
  type: DocumentType;
  entity: string;
  date: string;
  status: DocumentStatus;
  title?: string;
  isFolder?: boolean;
  mimeType?: string;
  modifiedBy?: string;
  nodeId?: string;
}

// Mock data – used as fallback when Alfresco is unreachable
const MOCK_DOCUMENTS: Document[] = [
  { id: "1", number: "كتاب/155", type: "وارد", entity: "وزارة التعليم العالي", date: "2024/03/15", status: "مُعتمد", title: "توجيهات وزارية" },
  { id: "2", number: "أمر إداري/88", type: "داخلي", entity: "شعبة الشؤون الإدارية", date: "2024/03/14", status: "قيد المراجعة", title: "ترقية موظفين" },
  { id: "3", number: "كتاب/221", type: "وارد", entity: "ديوان محافظة نينوى", date: "2024/03/13", status: "جديد", title: "دعوة اجتماع" },
  { id: "4", number: "قرار مجلس/44", type: "داخلي", entity: "قسم الأمن السيبراني", date: "2024/03/12", status: "مُعتمد", title: "مقررات الجلسة الرابعة" },
  { id: "5", number: "كتاب/178", type: "صادر", entity: "جامعة الموصل", date: "2024/03/11", status: "مُعتمد", title: "مذكرة تفاهم" },
  { id: "6", number: "مذكرة داخلية/33", type: "داخلي", entity: "قسم الحوسبة", date: "2024/03/10", status: "مرفوض", title: "طلب تجهيز أجهزة" },
];

function mapAlfrescoNode(entry: any): Document {
  const props = entry.properties || {};
  const created = entry.createdAt
    ? new Date(entry.createdAt).toLocaleDateString("ar-IQ")
    : "";

  return {
    id: entry.id,
    nodeId: entry.id,
    number: props["cm:title"] || entry.name || "",
    title: props["cm:description"] || entry.name || "",
    type: "وارد",
    entity: props["cm:author"] || entry.createdByUser?.displayName || "—",
    date: created,
    status: "جديد",
    isFolder: entry.isFolder,
    mimeType: entry.content?.mimeType,
    modifiedBy: entry.modifiedByUser?.displayName,
  };
}

async function fetchDocumentsFromAlfresco(): Promise<Document[]> {
  const ticket = localStorage.getItem("alf_ticket");
  if (!ticket || ticket === "MOCK_TICKET") {
    return [...MOCK_DOCUMENTS];
  }

  try {
    const list = await alfrescoGetDocuments("-root-");
    const entries = list.entries || [];
    return entries.map((e: any) => mapAlfrescoNode(e.entry));
  } catch {
    // Alfresco unreachable – return mock data
    return [...MOCK_DOCUMENTS];
  }
}

export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocumentsFromAlfresco,
  });
}

export function useDocumentCount() {
  const { data } = useDocuments();
  return data?.length ?? 0;
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doc: Omit<Document, "id">) => {
      const newDoc = { ...doc, id: Math.random().toString() };
      return newDoc;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // placeholder – will wire to Alfresco delete later
      await new Promise((r) => setTimeout(r, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}
