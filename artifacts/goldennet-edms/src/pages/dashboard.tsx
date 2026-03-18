import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, ArrowDownToLine, Clock, CheckCircle2, Eye, Edit, Download, Upload } from "lucide-react";
import { useDocuments, useDocumentCount, Document } from "@/hooks/use-documents";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

// Animated Number Component
function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <>{count}</>;
}

function StatCard({ title, value, icon: Icon, colorClass, bgColorClass }: any) {
  return (
    <motion.div variants={itemVariants} className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl ${bgColorClass} flex items-center justify-center shrink-0`}>
        <Icon className={colorClass} size={28} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-muted-foreground text-sm font-semibold mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-foreground">
          <AnimatedNumber value={parseInt(value) || 0} />
        </h3>
      </div>
    </motion.div>
  );
}

const barData = [
  { name: 'الأحد', وارد: 12, صادر: 8 },
  { name: 'الاثنين', وارد: 19, صادر: 10 },
  { name: 'الثلاثاء', وارد: 15, صادر: 14 },
  { name: 'الأربعاء', وارد: 22, صادر: 18 },
  { name: 'الخميس', وارد: 30, صادر: 25 },
  { name: 'الجمعة', وارد: 5, صادر: 2 },
  { name: 'السبت', وارد: 0, صادر: 0 },
];

const pieData = [
  { name: 'وارد', value: 45, color: '#3b82f6' }, // blue
  { name: 'صادر', value: 30, color: '#22c55e' }, // green
  { name: 'داخلي', value: 25, color: '#a855f7' }, // purple
];

export default function Dashboard() {
  const { data: documents, isLoading } = useDocuments();
  const totalDocs = useDocumentCount();

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
        <div className="text-sm font-semibold text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 shadow-sm">
          التاريخ: {new Date().toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="إجمالي الوثائق"
          value={String(totalDocs || 0)}
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border/50 p-6">
          <h2 className="text-lg font-bold text-foreground mb-6 border-b border-border/50 pb-2">نشاط الوثائق - آخر 7 أيام</h2>
          <div className="h-72 w-full rtl-chart" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '14px', fontWeight: 'bold'}} />
                <Bar dataKey="وارد" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="صادر" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div variants={itemVariants} className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
          <h2 className="text-lg font-bold text-foreground mb-6 border-b border-border/50 pb-2">توزيع المراسلات</h2>
          <div className="h-64 w-full flex items-center justify-center" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '14px', fontWeight: 'bold', marginRight: '20px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Recent Documents Table */}
        <motion.div variants={itemVariants} className="lg:col-span-3 bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/50 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold text-foreground">آخر المراسلات</h2>
            <Link href="/library" className="text-sm text-primary font-semibold hover:text-accent transition-colors">عرض الكل</Link>
          </div>
          
          <div className="overflow-x-auto flex-1">
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
                ) : documents?.slice(0, 5).map((doc: Document, idx: number) => (
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
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/document/${doc.id}`}>
                          <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="عرض">
                            <Eye size={18} />
                          </button>
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors" title="تعديل">
                          <Edit size={18} />
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

        {/* Activity Feed */}
        <motion.div variants={itemVariants} className="bg-card rounded-2xl shadow-sm border border-border/50 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-2">
             <h2 className="text-lg font-bold text-foreground">أحدث الإجراءات</h2>
             <Link href="/activity-log" className="text-xs font-bold text-primary hover:underline">الكل</Link>
          </div>
          
          <div className="space-y-4 flex-1">
            {[
              { icon: Upload, color: "text-blue-500", bg: "bg-blue-500/10", text: "تم رفع وثيقة جديدة", doc: "كتاب/155", time: "منذ 10 د" },
              { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", text: "موافقة العميد على", doc: "قرار/44", time: "منذ 1 س" },
              { icon: Edit, color: "text-orange-500", bg: "bg-orange-500/10", text: "تعديل بيانات", doc: "كتاب/178", time: "منذ 3 س" },
              { icon: Upload, color: "text-blue-500", bg: "bg-blue-500/10", text: "تم رفع وثيقة جديدة", doc: "أمر/88", time: "أمس" },
              { icon: ArrowDownToLine, color: "text-purple-500", bg: "bg-purple-500/10", text: "تسجيل كتاب وارد", doc: "كتاب/221", time: "أمس" }
            ].map((act, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${act.bg} ${act.color} shrink-0 mt-0.5`}>
                  <act.icon size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{act.text} <span className="text-primary">{act.doc}</span></p>
                  <p className="text-xs text-muted-foreground">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
