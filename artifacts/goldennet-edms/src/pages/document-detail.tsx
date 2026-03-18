import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ChevronRight, FileText, CheckCircle, XCircle, RotateCcw, Download, Printer, FileIcon, Loader2 } from "lucide-react";
import { useDocuments } from "@/hooks/use-documents";
import { Badge } from "@/components/ui/badge";

export default function DocumentDetail({ params }: { params: { id: string } }) {
  const { data: documents } = useDocuments();
  const docId = params.id;
  const doc = documents?.find(d => d.id === docId) || {
    id: docId,
    number: `كتاب/${docId}`,
    type: "وارد",
    entity: "وزارة مجهولة",
    date: "2024/03/15",
    status: "قيد المراجعة",
    title: "وثيقة غير موجودة (بيانات تجريبية)",
    confidentiality: "سري"
  };

  const getStatusVariant = (status: string) => {
    switch(status) {
      case "جديد": return "info";
      case "قيد المراجعة": return "warning";
      case "مُعتمد": return "success";
      case "مرفوض": return "danger";
      default: return "default";
    }
  };

  const getConfidentialityColor = (conf: string) => {
    if (conf === "سري جداً") return "bg-red-500";
    if (conf === "سري") return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground gap-2 mb-4">
        <Link href="/dashboard" className="hover:text-primary transition-colors">الرئيسية</Link>
        <ChevronRight size={14} className="rotate-180" />
        <Link href="/library" className="hover:text-primary transition-colors">مكتبة الوثائق</Link>
        <ChevronRight size={14} className="rotate-180" />
        <span className="text-foreground font-semibold">{doc.number}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">{doc.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Metadata & Timeline) */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          
          {/* Metadata Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 border-b border-border/50 pb-2">تفاصيل الوثيقة</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">رقم الكتاب</span>
                <span className="font-semibold">{doc.number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">الموضوع</span>
                <span className="font-semibold text-left line-clamp-1" title={doc.title}>{doc.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">تاريخ الكتاب</span>
                <span className="font-semibold">{doc.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">نوع المراسلة</span>
                <Badge variant="outline">{doc.type}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">الجهة</span>
                <span className="font-semibold truncate max-w-[140px]">{doc.entity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">درجة السرية</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${(doc as any).confidentiality ? getConfidentialityColor((doc as any).confidentiality) : 'bg-green-500'}`}></div>
                  <span className="font-semibold">{(doc as any).confidentiality || 'عادي'}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">الحالة</span>
                <Badge variant={getStatusVariant(doc.status)}>{doc.status}</Badge>
              </div>
              <div className="pt-2">
                <span className="text-muted-foreground block mb-1">ملاحظات</span>
                <p className="text-sm bg-muted/50 p-3 rounded-lg border border-border/50">
                  يرجى المراجعة والاعتماد في أقرب وقت ممكن نظراً لأهمية الموضوع.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex-1">
            <h3 className="text-lg font-bold mb-4 border-b border-border/50 pb-2">مسار الاعتماد</h3>
            <div className="space-y-6 relative before:absolute before:right-4 before:top-2 before:h-full before:w-0.5 before:bg-border">
              
              {/* Stage 1 */}
              <div className="relative flex items-start gap-4 z-10">
                <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center shrink-0 border-4 border-card">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <p className="font-bold text-sm">موظف الاستلام - Ahmed Ali</p>
                  <p className="text-xs text-success font-semibold">مكتمل</p>
                  <p className="text-xs text-muted-foreground mt-1">{doc.date} - استغرق 2 ساعة</p>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="relative flex items-start gap-4 z-10">
                <div className="w-8 h-8 rounded-full bg-warning text-white flex items-center justify-center shrink-0 border-4 border-card">
                  <Loader2 size={16} className="animate-spin" />
                </div>
                <div>
                  <p className="font-bold text-sm">مدير القسم - Mohammed Hassan</p>
                  <p className="text-xs text-warning font-semibold">قيد المراجعة</p>
                  <p className="text-xs text-muted-foreground mt-1">منذ يوم أمس</p>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="relative flex items-start gap-4 z-10">
                <div className="w-8 h-8 rounded-full bg-gray-200 border-4 border-card shrink-0"></div>
                <div>
                  <p className="font-bold text-sm text-muted-foreground">العميد - Dr. Khalid Ibrahim</p>
                  <p className="text-xs text-muted-foreground font-semibold">في الانتظار</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column (PDF Preview & Actions) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-2xl flex flex-col shadow-sm overflow-hidden h-[600px]">
            <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2 text-primary font-bold">
                <FileIcon size={20} /> معاينة الوثيقة المرفقة
              </div>
              <button className="flex items-center gap-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                <Download size={16} /> تحميل الملف
              </button>
            </div>
            
            <div className="flex-1 bg-muted/30 flex items-center justify-center p-8">
              <div className="bg-white border border-border/80 shadow-lg w-full max-w-lg aspect-[1/1.4] rounded flex flex-col items-center justify-center text-center p-8">
                 <FileIcon size={64} className="text-muted-foreground/30 mb-4" />
                 <h4 className="font-bold text-lg mb-2">معاينة PDF غير متوفرة</h4>
                 <p className="text-muted-foreground text-sm max-w-xs">في بيئة الإنتاج سيتم عرض محتوى ملف PDF هنا باستخدام مكتبة مثل react-pdf.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center justify-center lg:justify-start">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-success text-white px-6 py-3 rounded-xl font-bold hover:bg-success/90 transition-colors shadow-sm shadow-success/20">
              <CheckCircle size={20} /> موافقة
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-danger text-white px-6 py-3 rounded-xl font-bold hover:bg-danger/90 transition-colors shadow-sm shadow-danger/20">
              <XCircle size={20} /> رفض
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-warning text-white px-6 py-3 rounded-xl font-bold hover:bg-warning/90 transition-colors shadow-sm shadow-warning/20">
              <RotateCcw size={20} /> إرجاع
            </button>
            
            <div className="w-px h-10 bg-border hidden sm:block mx-2"></div>
            
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/20">
              <Download size={20} /> تحميل
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors">
              <Printer size={20} /> طباعة
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
