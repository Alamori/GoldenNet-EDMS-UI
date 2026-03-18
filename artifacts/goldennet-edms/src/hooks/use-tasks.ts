import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentType } from "./use-documents";

export interface WorkflowTask {
  id: string;
  documentTitle: string;
  documentType: DocumentType;
  dueDate: string;
  daysRemaining: number;
  stages: {
    role: string;
    status: "completed" | "pending" | "waiting";
  }[];
}

let MOCK_TASKS: WorkflowTask[] = [
  {
    id: "t1",
    documentTitle: "طلب إجازة اعتيادية - أحمد محمد",
    documentType: "داخلي",
    dueDate: "2024/03/20",
    daysRemaining: 2,
    stages: [
      { role: "موظف", status: "completed" },
      { role: "مدير القسم", status: "pending" },
      { role: "العميد", status: "waiting" },
    ]
  },
  {
    id: "t2",
    documentTitle: "مشتريات مختبر الحاسوب",
    documentType: "داخلي",
    dueDate: "2024/03/25",
    daysRemaining: 7,
    stages: [
      { role: "مسؤول المختبر", status: "completed" },
      { role: "مدير القسم", status: "pending" },
      { role: "العميد", status: "waiting" },
    ]
  },
  {
    id: "t3",
    documentTitle: "مذكرة تفاهم خارجية",
    documentType: "صادر",
    dueDate: "2024/03/18",
    daysRemaining: 0,
    stages: [
      { role: "موظف", status: "completed" },
      { role: "الشؤون القانونية", status: "completed" },
      { role: "العميد", status: "pending" },
    ]
  }
];

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 400));
      return [...MOCK_TASKS];
    }
  });
}

export function useProcessTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, action }: { id: string, action: "approve" | "reject" }) => {
      await new Promise(r => setTimeout(r, 800));
      MOCK_TASKS = MOCK_TASKS.filter(t => t.id !== id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });
}
