import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Filter, Eye, Edit, Download } from "lucide-react";
import { useDocuments } from "@/hooks/use-documents";
import { Badge } from "@/components/ui/badge";

const tabs = ["الكل", "وارد", "صادر", "داخلي"];

export default function Library() {
  const { data: documents, isLoading } = useDocuments();
  const [activeTab, setActiveTab] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documents?.filter(doc => {
    const matchesTab = activeTab === "الكل" || doc.type === activeTab;
    const matchesSearch = doc.number.includes(searchQuery) || 
                          doc.entity.includes(searchQuery) || 
                          (doc.title && doc.title.includes(searchQuery));
    return matchesTab && matchesSearch;
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">مكتبة الوثائق</h1>
          <p className="text-muted-foreground">تصفح وابحث في جميع المراسلات المؤرشفة</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row gap-4 justify-between">
        
        {/* Search */}
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

        {/* Tabs */}
        <div className="flex p-1 bg-muted/50 rounded-xl overflow-x-auto hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
          <button className="ml-2 px-4 py-2 text-muted-foreground hover:text-foreground flex items-center gap-2 border-r border-border pr-4 shrink-0">
            <Filter size={16} />
            <span className="text-sm font-bold">تصفية</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          [1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border shadow-sm animate-pulse h-48"></div>
          ))
        ) : filteredDocs?.length === 0 ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
            <p className="text-muted-foreground">لم نتمكن من العثور على وثائق تطابق بحثك</p>
          </div>
        ) : (
          filteredDocs?.map((doc, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              key={doc.id}
              className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group flex flex-col h-full relative overflow-hidden"
            >
              {/* Type indicator line */}
              <div className={`absolute top-0 right-0 w-1 h-full ${
                doc.type === "وارد" ? "bg-blue-500" : 
                doc.type === "صادر" ? "bg-green-500" : "bg-purple-500"
              }`} />

              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <Badge variant={getStatusVariant(doc.status)}>{doc.status}</Badge>
              </div>
              
              <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1">{doc.title || "وثيقة بدون عنوان"}</h3>
              
              <div className="space-y-2 mt-auto pt-4 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">رقم الكتاب:</span>
                  <span className="font-semibold text-foreground">{doc.number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الجهة:</span>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">{doc.entity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">التاريخ:</span>
                  <span className="font-semibold text-foreground">{doc.date}</span>
                </div>
              </div>

              {/* Actions Overlay on Hover (Desktop) / Inline (Mobile) */}
              <div className="mt-6 flex items-center justify-between gap-2 pt-2">
                 <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors font-semibold text-sm">
                   <Eye size={16} /> عرض
                 </button>
                 <div className="flex gap-2">
                   <button className="p-2 bg-gray-100 text-gray-600 hover:bg-accent hover:text-white rounded-lg transition-colors" title="تعديل">
                     <Edit size={16} />
                   </button>
                   <button className="p-2 bg-gray-100 text-gray-600 hover:bg-green-600 hover:text-white rounded-lg transition-colors" title="تحميل">
                     <Download size={16} />
                   </button>
                 </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
