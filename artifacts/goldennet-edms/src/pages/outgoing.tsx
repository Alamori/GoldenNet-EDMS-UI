import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Eye, Edit, Download, Send } from "lucide-react";
import { useDocuments } from "@/hooks/use-documents";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function Outgoing() {
  const { data: documents, isLoading } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");

  const outgoingDocs = documents?.filter(doc => doc.type === "صادر");
  
  const filteredDocs = outgoingDocs?.filter(doc => {
    return doc.number.includes(searchQuery) || 
           doc.entity.includes(searchQuery) || 
           (doc.title && doc.title.includes(searchQuery));
  });

  const getStatusVariant = (status: string) => {
    switch(status) {
      case "جديد": return "info";
      case "قيد المراجعة": return "warning";
      case "مُعتمد": return "success";
      case "مرفوض": return "danger";
      default: return "default";
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/dashboard" className="hover:text-primary">الرئيسية</Link>
        <span>/</span>
        <span className="text-foreground font-semibold">المراسلات الصادرة</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
            <Send size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">المراسلات الصادرة</h1>
            <p className="text-muted-foreground">استعرض جميع الكتب والوثائق الصادرة من المؤسسة</p>
          </div>
        </div>
        <div className="bg-card border border-border px-4 py-2 rounded-xl font-bold text-lg shadow-sm">
          العدد الكلي: <span className="text-green-500">{outgoingDocs?.length || 0}</span>
        </div>
      </div>

      <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 right-0 pl-3 pr-4 flex items-center pointer-events-none text-muted-foreground">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl py-2.5 pl-4 pr-11 text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="ابحث برقم الكتاب، الجهة، أو الموضوع..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          [1,2,3].map(i => <div key={i} className="bg-card rounded-2xl p-6 border border-border shadow-sm animate-pulse h-48"></div>)
        ) : filteredDocs?.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Send size={40} className="text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-bold mb-2">لا توجد مراسلات صادرة حالياً</h3>
            <p className="text-muted-foreground text-sm max-w-xs">لم يتم العثور على أي مراسلات صادرة. سيتم إظهارها هنا بعد إرسالها.</p>
          </div>
        ) : (
          filteredDocs?.map((doc, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={doc.id}
              className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl hover:border-green-500/30 transition-all group flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-1 h-full bg-green-500" />

              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                  <FileText size={24} />
                </div>
                <Badge variant={getStatusVariant(doc.status)}>{doc.status}</Badge>
              </div>
              
              <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1">{doc.title || "وثيقة بدون عنوان"}</h3>
              
              <div className="space-y-2 mt-auto pt-4 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">رقم الكتاب:</span>
                  <span className="font-semibold">{doc.number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الجهة المستلمة:</span>
                  <span className="font-semibold truncate max-w-[150px]">{doc.entity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">التاريخ:</span>
                  <span className="font-semibold">{doc.date}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-2 pt-2">
                 <Link href={`/document/${doc.id}`} className="flex-1">
                   <button className="w-full flex items-center justify-center gap-2 py-2 bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-colors font-semibold text-sm">
                     <Eye size={16} /> عرض الوثيقة
                   </button>
                 </Link>
                 <div className="flex gap-2">
                   <button className="p-2 bg-gray-100 text-gray-600 hover:bg-accent hover:text-white rounded-lg transition-colors" title="تعديل">
                     <Edit size={16} />
                   </button>
                   <button className="p-2 bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors" title="تحميل">
                     <Download size={16} />
                   </button>
                 </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
