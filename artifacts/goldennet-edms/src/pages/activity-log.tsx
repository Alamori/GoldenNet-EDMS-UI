import { motion } from "framer-motion";
import { Upload, CheckCircle, XCircle, RotateCcw, Edit, Search } from "lucide-react";
import { Link } from "wouter";

// Mock Data
const MOCK_ACTIVITY = [
  { id: 1, type: "upload", user: "أحمد محمد", role: "موظف", action: "رفع وثيقة جديدة", doc: "كتاب/155 - توجيهات وزارية", time: "منذ 10 دقائق", docId: "1" },
  { id: 2, type: "approve", user: "د. خالد إبراهيم", role: "العميد", action: "موافقة على", doc: "قرار مجلس/44", time: "منذ ساعتين", docId: "4" },
  { id: 3, type: "edit", user: "سارة علي", role: "مدير قسم", action: "تعديل بيانات", doc: "كتاب/178", time: "اليوم 10:30 ص", docId: "5" },
  { id: 4, type: "reject", user: "محمد حسن", role: "معاون العميد", action: "رفض المراسلة", doc: "مذكرة داخلية/33", time: "أمس", docId: "6" },
  { id: 5, type: "upload", user: "أحمد محمد", role: "موظف", action: "رفع وثيقة جديدة", doc: "أمر إداري/88", time: "أمس", docId: "2" },
  { id: 6, type: "return", user: "د. خالد إبراهيم", role: "العميد", action: "إرجاع للمراجعة", doc: "كتاب/221", time: "12 مارس", docId: "3" },
];

export default function ActivityLog() {
  const getIcon = (type: string) => {
    switch(type) {
      case "upload": return <div className="bg-blue-500/10 text-blue-500 p-2 rounded-full"><Upload size={18} /></div>;
      case "approve": return <div className="bg-green-500/10 text-green-500 p-2 rounded-full"><CheckCircle size={18} /></div>;
      case "reject": return <div className="bg-red-500/10 text-red-500 p-2 rounded-full"><XCircle size={18} /></div>;
      case "edit": return <div className="bg-orange-500/10 text-orange-500 p-2 rounded-full"><Edit size={18} /></div>;
      case "return": return <div className="bg-yellow-500/10 text-yellow-600 p-2 rounded-full"><RotateCcw size={18} /></div>;
      default: return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/dashboard" className="hover:text-primary">الرئيسية</Link>
        <span>/</span>
        <span className="text-foreground font-semibold">سجل الأحداث</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">سجل الأحداث</h1>
          <p className="text-muted-foreground">متابعة كافة النشاطات والإجراءات المتخذة على النظام</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="date" className="border border-border bg-card rounded-lg px-3 py-2 text-sm focus:outline-primary" />
          <span className="text-muted-foreground">إلى</span>
          <input type="date" className="border border-border bg-card rounded-lg px-3 py-2 text-sm focus:outline-primary" />
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
        <div className="relative before:absolute before:inset-0 before:right-6 before:-translate-x-px md:before:right-8 before:h-full before:w-0.5 before:bg-border">
          
          {MOCK_ACTIVITY.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={item.id} 
              className="relative flex items-start gap-4 mb-8 last:mb-0"
            >
              <div className="z-10 bg-card border-4 border-card rounded-full mt-1 shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 bg-muted/30 border border-border/50 rounded-xl p-4 ml-4 md:ml-0 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {item.user.split(' ')[0][0]}{item.user.split(' ').length > 1 ? item.user.split(' ')[1][0] : ''}
                    </div>
                    <div>
                      <span className="font-bold text-sm block">{item.user}</span>
                      <span className="text-xs text-muted-foreground">{item.role}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground bg-white px-2 py-1 rounded border border-border/50">
                    {item.time}
                  </span>
                </div>
                <div className="text-sm pr-11 sm:pr-0">
                  <span className="text-muted-foreground">{item.action} </span>
                  <Link href={`/document/${item.docId}`} className="font-bold text-primary hover:underline">
                    {item.doc}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          
        </div>

        <div className="mt-8 flex justify-center">
          <button className="text-sm font-bold text-primary hover:text-primary/80 py-2 px-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
            تحميل المزيد...
          </button>
        </div>
      </div>
    </motion.div>
  );
}
