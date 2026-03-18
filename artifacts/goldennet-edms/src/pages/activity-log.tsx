import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle, XCircle, RotateCcw, Edit, Eye, Archive, Download } from "lucide-react";
import { Link } from "wouter";

// Mock Data
const MOCK_ACTIVITY = [
  { id: 1, type: "upload", user: "أحمد محمد", role: "موظف", action: "رفع وثيقة جديدة", doc: "كتاب/155 - توجيهات وزارية", time: "10:30 ص", date: "اليوم", docId: "1" },
  { id: 2, type: "approve", user: "د. خالد إبراهيم", role: "العميد", action: "موافقة على", doc: "قرار مجلس/44", time: "09:15 ص", date: "اليوم", docId: "4" },
  { id: 3, type: "view", user: "سارة علي", role: "مدير قسم", action: "عرض الوثيقة", doc: "كتاب/178", time: "08:00 ص", date: "اليوم", docId: "5" },
  
  { id: 4, type: "reject", user: "محمد حسن", role: "معاون العميد", action: "رفض المراسلة", doc: "مذكرة داخلية/33", time: "14:20 م", date: "أمس", docId: "6" },
  { id: 5, type: "upload", user: "أحمد محمد", role: "موظف", action: "رفع وثيقة جديدة", doc: "أمر إداري/88", time: "11:00 ص", date: "أمس", docId: "2" },
  { id: 6, type: "archive", user: "النظام", role: "تلقائي", action: "أرشفة تلقائية", doc: "كتاب/102", time: "09:00 ص", date: "أمس", docId: "7" },
  
  { id: 7, type: "return", user: "د. خالد إبراهيم", role: "العميد", action: "إرجاع للمراجعة", doc: "كتاب/221", time: "13:45 م", date: "2024/03/13", docId: "3" },
  { id: 8, type: "edit", user: "علي محمود", role: "موظف", action: "تعديل بيانات", doc: "كتاب/221", time: "11:20 ص", date: "2024/03/13", docId: "3" },
  { id: 9, type: "upload", user: "علي محمود", role: "موظف", action: "رفع وثيقة جديدة", doc: "كتاب/221", time: "10:00 ص", date: "2024/03/13", docId: "3" },
];

export default function ActivityLog() {
  const [filter, setFilter] = useState("الكل");
  const filterButtons = ["الكل", "اليوم", "هذا الأسبوع", "مرفوعات", "موافقات", "مرفوضات"];

  const getIcon = (type: string) => {
    switch(type) {
      case "upload": return <div className="bg-blue-500/10 text-blue-500 p-2 rounded-full"><Upload size={18} /></div>;
      case "approve": return <div className="bg-green-500/10 text-green-500 p-2 rounded-full"><CheckCircle size={18} /></div>;
      case "reject": return <div className="bg-red-500/10 text-red-500 p-2 rounded-full"><XCircle size={18} /></div>;
      case "edit": return <div className="bg-orange-500/10 text-orange-500 p-2 rounded-full"><Edit size={18} /></div>;
      case "return": return <div className="bg-yellow-500/10 text-yellow-600 p-2 rounded-full"><RotateCcw size={18} /></div>;
      case "view": return <div className="bg-gray-500/10 text-gray-500 p-2 rounded-full"><Eye size={18} /></div>;
      case "archive": return <div className="bg-purple-500/10 text-purple-500 p-2 rounded-full"><Archive size={18} /></div>;
      default: return null;
    }
  };

  // Group by date
  const groupedActivity = MOCK_ACTIVITY.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, typeof MOCK_ACTIVITY>);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-6 pb-12">
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
        <button className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-xl text-sm font-bold transition-colors border border-border">
          <Download size={16} /> تصدير Excel
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {filterButtons.map(btn => (
          <button
            key={btn}
            onClick={() => setFilter(btn)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              filter === btn 
                ? "bg-primary text-white" 
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {btn}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
        <div className="relative before:absolute before:inset-0 before:right-6 before:-translate-x-px md:before:right-8 before:h-full before:w-0.5 before:bg-border">
          
          {Object.entries(groupedActivity).map(([date, items]) => (
            <div key={date}>
              <div className="text-center mb-8 relative z-10">
                <span className="bg-muted border border-border text-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                  {date}
                </span>
              </div>
              
              {items.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.id} 
                  className="relative flex items-start gap-4 mb-8 last:mb-12"
                >
                  <div className="z-10 bg-card border-4 border-card rounded-full mt-1 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 bg-muted/30 border border-border/50 rounded-xl p-4 ml-4 md:ml-0 hover:shadow-md hover:border-primary/20 transition-all group">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                          {item.user.split(' ')[0][0]}{item.user.split(' ').length > 1 ? item.user.split(' ')[1][0] : ''}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-foreground block">{item.user}</span>
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
          ))}
          
        </div>

        <div className="mt-4 flex justify-center">
          <button className="text-sm font-bold text-primary hover:text-primary/80 py-2 px-6 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors">
            تحميل المزيد...
          </button>
        </div>
      </div>
    </motion.div>
  );
}
