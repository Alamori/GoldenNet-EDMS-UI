import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
}

// Initial mock data
let MOCK_DOCUMENTS: Document[] = [
  { id: "1", number: "كتاب/155", type: "وارد", entity: "وزارة التعليم العالي", date: "2024/03/15", status: "مُعتمد", title: "توجيهات وزارية" },
  { id: "2", number: "أمر إداري/88", type: "داخلي", entity: "شعبة الشؤون الإدارية", date: "2024/03/14", status: "قيد المراجعة", title: "ترقية موظفين" },
  { id: "3", number: "كتاب/221", type: "وارد", entity: "ديوان محافظة نينوى", date: "2024/03/13", status: "جديد", title: "دعوة اجتماع" },
  { id: "4", number: "قرار مجلس/44", type: "داخلي", entity: "قسم الأمن السيبراني", date: "2024/03/12", status: "مُعتمد", title: "مقررات الجلسة الرابعة" },
  { id: "5", number: "كتاب/178", type: "صادر", entity: "جامعة الموصل", date: "2024/03/11", status: "مُعتمد", title: "مذكرة تفاهم" },
  { id: "6", number: "مذكرة داخلية/33", type: "داخلي", entity: "قسم الحوسبة", date: "2024/03/10", status: "مرفوض", title: "طلب تجهيز أجهزة" },
];

export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      // Simulate network
      await new Promise(r => setTimeout(r, 400));
      return [...MOCK_DOCUMENTS];
    }
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (doc: Omit<Document, "id">) => {
      await new Promise(r => setTimeout(r, 1000));
      const newDoc = { ...doc, id: Math.random().toString() };
      MOCK_DOCUMENTS = [newDoc, ...MOCK_DOCUMENTS];
      return newDoc;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    }
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise(r => setTimeout(r, 500));
      MOCK_DOCUMENTS = MOCK_DOCUMENTS.filter(d => d.id !== id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    }
  });
}
