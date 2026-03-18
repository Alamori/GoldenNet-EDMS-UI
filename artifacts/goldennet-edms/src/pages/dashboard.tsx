import { motion } from "framer-motion";
import { FileText, ArrowDownToLine, Clock, CheckCircle2, Eye, Edit, Download } from "lucide-react";
import { useDocuments, Document } from "@/hooks/use-documents";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function StatCard({ title, value, icon: Icon, colorClass, bgColorClass }: any) {
  return (
    <motion.div variants={itemVariants} className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl ${bgColorClass} flex items-center justify-center shrink-0`}>
        <Icon className={colorClass} size={28} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-muted-foreground text-sm font-semibold mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-foreground">{value}</h3>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { data: documents, isLoading } = useDocuments();

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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">لوحة القيادة</h1>
          <p className="text-muted-foreground">نظرة عامة على حالة المراسلات والوثائق</p>
        </div>
        <div className="text-sm font-semibold text-primary bg-primary/5 px-4 py-2 rounded-lg">
          التاريخ: {new Date().toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="إجمالي الوثائق" 
          value="586" 
          icon={FileText} 
          colorClass="text-primary" 
          bgColorClass="bg-primary/10" 
        />
        <StatCard 
          title="واردات هذا الشهر" 
          value="45" 
          icon={ArrowDownToLine} 
          colorClass="text-blue-500" 
          bgColorClass="bg-blue-500/10" 
        />
        <StatCard 
          title="قيد المراجعة" 
          value="12" 
          icon={Clock} 
          colorClass="text-orange-500" 
          bgColorClass="bg-orange-500/10" 
        />
        <StatCard 
          title="مُعتمدة اليوم" 
          value="8" 
          icon={CheckCircle2} 
          colorClass="text-green-500" 
          bgColorClass="bg-green-500/10" 
        />
      </div>

      {/* Recent Documents Table */}
      <motion.div variants={itemVariants} className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-foreground">آخر المراسلات</h2>
          <button className="text-sm text-primary font-semibold hover:text-accent transition-colors">عرض الكل</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-muted-foreground text-sm">
                <th className="p-4 font-semibold whitespace-nowrap">رقم الكتاب</th>
                <th className="p-4 font-semibold whitespace-nowrap">نوع المراسلة</th>
                <th className="p-4 font-semibold whitespace-nowrap">الجهة</th>
                <th className="p-4 font-semibold whitespace-nowrap">التاريخ</th>
                <th className="p-4 font-semibold whitespace-nowrap">الحالة</th>
                <th className="p-4 font-semibold text-center whitespace-nowrap">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="border-b border-border/50 animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                    <td className="p-4"><div className="h-8 bg-gray-200 rounded w-24 mx-auto"></div></td>
                  </tr>
                ))
              ) : documents?.map((doc: Document, idx: number) => (
                <motion.tr 
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors group"
                >
                  <td className="p-4 font-medium text-foreground whitespace-nowrap">{doc.number}</td>
                  <td className="p-4 whitespace-nowrap text-muted-foreground">{doc.type}</td>
                  <td className="p-4 whitespace-nowrap">{doc.entity}</td>
                  <td className="p-4 whitespace-nowrap text-muted-foreground">{doc.date}</td>
                  <td className="p-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(doc.status)}>{doc.status}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="عرض">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors" title="تعديل">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-600/10 rounded-lg transition-colors" title="تحميل">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {documents?.length === 0 && !isLoading && (
             <div className="p-8 text-center text-muted-foreground">
               لا توجد بيانات متاحة
             </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
