import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useRoute } from "wouter";
import { ChevronRight, CheckCircle, XCircle, RotateCcw, Download, Printer, FileIcon, Loader2, Share2, Archive } from "lucide-react";
import { useDocuments } from "@/hooks/use-documents";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/confirm-modal";
import { toast } from "sonner";

export default function DocumentDetail() {
  const [, params] = useRoute("/document/:id");
  const docId = params?.id;
  const { data: documents } = useDocuments();
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState<"approve" | "reject" | null>(null);
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const docData = documents?.find(d => d.id === docId);
  const doc = docData ? { ...docData, status: localStatus || docData.status } : {
    id: docId || "unknown",
    number: `كتاب/${docId || "unknown"}`,
    type: "وارد",
    entity: "وزارة مجهولة",
    date: "2024/03/15",
    status: localStatus || "قيد المراجعة",
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
    if (conf === "سري للغاية" || conf === "سري جداً") return "bg-red-500";
    if (conf === "سري") return "bg-orange-500";
    return "bg-green-500";
  };

  const handleAction = (type: "approve" | "reject") => {
    setConfirmType(type);
    setShowConfirm(true);
  };

  const executeAction = () => {
    if (confirmType === "approve") {
      setLocalStatus("مُعتمد");
      toast.success("تمت الموافقة بنجاح ✅");
    } else {
      setLocalStatus("مرفوض");
      toast.error("تم رفض الوثيقة ❌");
    }
    setShowConfirm(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto space-y-6 pb-20"
    >
      <div className="flex items-center text-sm text-muted-foreground gap-2 mb-4">
        <Link href="/dashboard" className="hover:text-primary transition-colors">الرئيسية</Link>
        <ChevronRight size={14} className="rotate-180" />
        <Link href="/library" className="hover:text-primary transition-colors">مكتبة الوثائق</Link>
        <ChevronRight size={14} className="rotate-180" />
        <span className="text-foreground font-semibold">{doc.number}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{doc.title}</h1>
              <Badge className="text-sm px-4 py-1.5 whitespace-nowrap" variant={getStatusVariant(doc.status)}>{doc.status}</Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-6 border-y border-border/50 py-6">
              <div>
                <span className="text-muted-foreground block mb-1">رقم الكتاب</span>
                <span className="font-semibold text-base">{doc.number}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">تاريخ الكتاب</span>
                <span className="font-semibold text-base">{doc.date}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">نوع المراسلة</span>
                <Badge variant="outline" className="font-semibold">{doc.type}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">درجة السرية</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${(doc as any).confidentiality ? getConfidentialityColor((doc as any).confidentiality) : 'bg-green-500'}`}></div>
                  <span className="font-semibold">{(doc as any).confidentiality || 'عادي'}</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">الجهة</span>
                <span className="font-semibold text-base">{doc.entity}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">الحالة</span>
                <span className="font-semibold text-base">{doc.status}</span>
              </div>
              <div className="sm:col-span-2 mt-2">
                <span className="text-muted-foreground block mb-1">ملاحظات</span>
                <p className="bg-muted/30 p-4 rounded-xl border border-border/50 text-foreground leading-relaxed">
                  يرجى المراجعة والاعتماد في أقرب وقت ممكن نظراً لأهمية الموضوع.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold mb-6 border-b border-border/50 pb-2">مسار الاعتماد</h3>
              <div className="space-y-6 relative before:absolute before:right-4 before:top-2 before:h-[80%] before:w-0.5 before:bg-border">
                <div className="relative flex items-start gap-4 z-10">
                  <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center shrink-0 border-4 border-card">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">موظف الاستلام - أحمد علي</p>
                    <p className="text-xs text-muted-foreground mt-1">تمت الموافقة · 2024/03/15 09:30</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 border-card ${doc.status === "مُعتمد" ? "bg-success text-white" : doc.status === "مرفوض" ? "bg-danger text-white" : "bg-warning text-white"}`}>
                    {doc.status === "مُعتمد" ? <CheckCircle size={16} /> : doc.status === "مرفوض" ? <XCircle size={16} /> : <Loader2 size={16} className="animate-spin" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">مدير القسم - محمد حسن</p>
                    <p className="text-xs text-muted-foreground mt-1">{doc.status === "مُعتمد" ? "تمت الموافقة" : doc.status === "مرفوض" ? "تم الرفض" : "قيد المراجعة · منذ يوم"}</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 border-card ${doc.status === "مُعتمد" ? "bg-success text-white" : "bg-gray-200"}`}>
                    {doc.status === "مُعتمد" && <CheckCircle size={16} />}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${doc.status === "مُعتمد" ? "text-foreground" : "text-muted-foreground"}`}>العميد - د. خالد إبراهيم</p>
                    <p className="text-xs text-muted-foreground mt-1">{doc.status === "مُعتمد" ? "تم الاعتماد النهائي" : "في انتظار اعتماد المرحلة السابقة"}</p>
                  </div>
                </div>
              </div>
            </div>

            {doc.status === "قيد المراجعة" && (
              <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 mb-8 shadow-sm">
                <label className="block text-sm font-bold mb-3">ملاحظات القرار</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background resize-none mb-4" 
                  rows={3} 
                  placeholder="أدخل ملاحظاتك هنا قبل اتخاذ القرار..."
                />
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => handleAction("approve")} className="flex items-center justify-center gap-2 bg-success text-white px-6 py-3 rounded-xl font-bold hover:bg-success/90 transition-colors shadow-sm flex-1 sm:flex-none">
                    <CheckCircle size={18} /> موافقة واعتماد
                  </button>
                  <button onClick={() => handleAction("reject")} className="flex items-center justify-center gap-2 bg-danger text-white px-6 py-3 rounded-xl font-bold hover:bg-danger/90 transition-colors shadow-sm flex-1 sm:flex-none">
                    <XCircle size={18} /> إرجاع/رفض
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border/50">
              <h3 className="text-lg font-bold mb-4">سجل إجراءات هذه الوثيقة</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-success"></div>
                  <span className="text-muted-foreground"><span className="text-foreground font-semibold">رفع الوثيقة</span> · أحمد · 09:30</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-warning"></div>
                  <span className="text-muted-foreground"><span className="text-foreground font-semibold">إرسال للمراجعة</span> · النظام</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-muted/50 border border-border rounded-2xl flex flex-col shadow-sm overflow-hidden h-[500px]">
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
               <div className="w-20 h-20 bg-white shadow-md rounded-xl flex items-center justify-center mb-6">
                 <FileIcon size={40} className="text-muted-foreground/40" />
               </div>
               <h4 className="font-bold text-lg mb-2">معاينة PDF</h4>
               <p className="text-muted-foreground text-sm max-w-[200px]">سيتم عرض الوثيقة هنا في بيئة الإنتاج باستخدام react-pdf</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-card border border-border text-foreground px-4 py-3 rounded-xl font-bold hover:bg-muted transition-colors shadow-sm hover:border-primary/30">
              <Download size={18} /> تحميل
            </button>
            <button className="flex items-center justify-center gap-2 bg-card border border-border text-foreground px-4 py-3 rounded-xl font-bold hover:bg-muted transition-colors shadow-sm hover:border-primary/30">
              <Printer size={18} /> طباعة
            </button>
            <button className="flex items-center justify-center gap-2 bg-card border border-border text-foreground px-4 py-3 rounded-xl font-bold hover:bg-muted transition-colors shadow-sm hover:border-primary/30">
              <Share2 size={18} /> مشاركة
            </button>
            <button className="flex items-center justify-center gap-2 bg-card border border-border text-foreground px-4 py-3 rounded-xl font-bold hover:bg-muted transition-colors shadow-sm hover:border-primary/30">
              <Archive size={18} /> أرشفة
            </button>
          </div>
        </div>

      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title={confirmType === "approve" ? "تأكيد الموافقة" : "تأكيد الرفض"}
        message={confirmType === "approve" ? "هل أنت متأكد من الموافقة على هذه الوثيقة؟" : "هل أنت متأكد من رفض هذه الوثيقة؟ سيتم إرجاعها إلى المنشئ."}
        onConfirm={executeAction}
        onCancel={() => setShowConfirm(false)}
        variant={confirmType === "approve" ? "success" : "danger"}
      />
    </motion.div>
  );
}
