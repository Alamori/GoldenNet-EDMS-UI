import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, File, X, CheckCircle2, AlertCircle, FileIcon } from "lucide-react";
import { useUploadDocument } from "@/hooks/use-documents";
import { Link } from "wouter";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [confidentiality, setConfidentiality] = useState("عادي");
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { mutate, isPending, isSuccess } = useUploadDocument();

  useEffect(() => {
    if (isPending) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(p => p >= 90 ? p : p + 10);
      }, 200);
      return () => clearInterval(interval);
    } else if (isSuccess) {
      setUploadProgress(100);
    }
  }, [isPending, isSuccess]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const validateForm = (formData: FormData) => {
    const errors: Record<string, string> = {};
    if (!formData.get("title")) errors.title = "حقل الموضوع/العنوان مطلوب";
    if (!formData.get("number")) errors.number = "رقم الكتاب مطلوب";
    if (!formData.get("date")) errors.date = "يرجى اختيار تاريخ الكتاب";
    if (!formData.get("entity")) errors.entity = "يرجى تحديد الجهة";
    if (!file) errors.file = "يرجى رفع ملف الوثيقة";
    return errors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    mutate({
      number: formData.get("number") as string,
      date: formData.get("date") as string,
      type: formData.get("type") as any,
      entity: formData.get("entity") as string,
      status: formData.get("status") as any,
      title: formData.get("title") as string,
      // @ts-ignore
      confidentiality: confidentiality,
    }, {
      onSuccess: () => {
        setShowSuccess(true);
      }
    });
  };

  const confOptions = [
    { value: "سري للغاية", label: "سري للغاية", color: "text-red-600", dot: "bg-red-500", border: "border-red-400", bg: "bg-red-50" },
    { value: "سري", label: "سري", color: "text-orange-600", dot: "bg-orange-500", border: "border-orange-400", bg: "bg-orange-50" },
    { value: "عادي", label: "عادي", color: "text-green-600", dot: "bg-green-500", border: "border-green-400", bg: "bg-green-50" },
  ];

  if (isSuccess && showSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-20 space-y-6">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">تم رفع الوثيقة بنجاح!</h2>
        <p className="text-muted-foreground">تم إضافة الوثيقة إلى النظام وهي الآن في انتظار المراجعة</p>
        <div className="bg-muted/50 border border-border rounded-xl px-6 py-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">رقم المرجع</p>
          <p className="text-2xl font-bold text-primary tracking-wider">DOC-2024-{Math.floor(Math.random()*100)+550}</p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/library">
            <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">عرض المكتبة</button>
          </Link>
          <button 
            onClick={() => {
              setShowSuccess(false);
              setFile(null);
              setUploadProgress(0);
            }} 
            className="px-6 py-3 border border-border rounded-xl font-bold hover:bg-muted transition-colors text-foreground"
          >
            رفع وثيقة جديدة
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/dashboard" className="hover:text-primary">الرئيسية</Link>
        <span>/</span>
        <span className="text-foreground font-semibold">رفع وثيقة</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">رفع وثيقة جديدة</h1>
        <p className="text-muted-foreground">أدخل تفاصيل المراسلة وارفع الملف المرفق لحفظه في النظام</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-3xl shadow-lg border border-border overflow-hidden">
        
        {/* Upload Zone */}
        <div className="p-6 md:p-8 border-b border-border bg-gray-50/50">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${
              isDragging 
                ? "border-primary bg-primary/5 scale-[1.02]" 
                : file ? "border-success/50 bg-success/5" : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
            }`}
          >
            {file ? (
              <div className="w-full max-w-md">
                <div className="bg-white border border-border rounded-xl p-4 flex flex-col items-center shadow-sm">
                  <div className="w-16 h-16 bg-red-100 text-red-500 rounded-xl flex items-center justify-center mb-3">
                    <FileIcon size={32} />
                  </div>
                  <h4 className="font-bold text-base mb-1 truncate w-full text-center">{file.name}</h4>
                  <p className="text-muted-foreground text-xs mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
                  
                  <button 
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-danger flex items-center gap-1 text-sm font-semibold hover:underline bg-danger/10 px-4 py-1.5 rounded-lg"
                  >
                    <X size={14} /> إزالة الملف
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-4">
                  <UploadCloud size={40} />
                </div>
                <h4 className="font-bold text-xl mb-2 text-foreground">اسحب الملفات هنا</h4>
                <p className="text-muted-foreground text-sm mb-6">أو انقر لاختيار ملف من جهازك (PDF حصراً)</p>
                <label className="bg-white border border-border hover:border-primary text-foreground font-bold py-2.5 px-6 rounded-xl cursor-pointer transition-all shadow-sm">
                  تصفح الملفات
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])} />
                </label>
              </>
            )}
          </div>
          {formErrors.file && (
             <p className="text-center text-xs text-danger mt-3 font-semibold flex items-center justify-center gap-1">
                <AlertCircle size={12} /> {formErrors.file}
             </p>
          )}
        </div>

        {/* Form Fields */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-full md:col-span-1">
            <label className="text-sm font-bold text-foreground">الموضوع / العنوان <span className="text-danger">*</span></label>
            <input name="title" type="text" className={`w-full border ${formErrors.title ? 'border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary/20'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all bg-background`} placeholder="مثال: دعوة لحضور اجتماع" />
            {formErrors.title && <p className="text-xs text-danger flex items-center gap-1 mt-1"><AlertCircle size={12} /> {formErrors.title}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">رقم الكتاب <span className="text-danger">*</span></label>
            <input name="number" type="text" className={`w-full border ${formErrors.number ? 'border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary/20'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all bg-background`} placeholder="مثال: كتاب/123" />
            {formErrors.number && <p className="text-xs text-danger flex items-center gap-1 mt-1"><AlertCircle size={12} /> {formErrors.number}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">تاريخ الكتاب <span className="text-danger">*</span></label>
            <input name="date" type="date" className={`w-full border ${formErrors.date ? 'border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary/20'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all bg-background`} />
            {formErrors.date && <p className="text-xs text-danger flex items-center gap-1 mt-1"><AlertCircle size={12} /> {formErrors.date}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">الجهة المستلمة أو المُرسِلة <span className="text-danger">*</span></label>
            <input name="entity" type="text" className={`w-full border ${formErrors.entity ? 'border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary/20'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all bg-background`} placeholder="مثال: وزارة التعليم العالي" />
            {formErrors.entity && <p className="text-xs text-danger flex items-center gap-1 mt-1"><AlertCircle size={12} /> {formErrors.entity}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">نوع المراسلة <span className="text-danger">*</span></label>
            <select name="type" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background appearance-none">
              <option value="وارد">وارد</option>
              <option value="صادر">صادر</option>
              <option value="داخلي">داخلي</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">حالة الكتاب</label>
            <select name="status" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background appearance-none">
              <option value="جديد">جديد</option>
              <option value="قيد المراجعة">قيد المراجعة</option>
              <option value="مُعتمد">مُعتمد</option>
            </select>
          </div>

          <div className="space-y-2 col-span-full">
            <label className="text-sm font-bold text-foreground mb-2 block">درجة السرية</label>
            <div className="flex flex-wrap gap-3">
              {confOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setConfidentiality(opt.value)}
                  className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                    confidentiality === opt.value 
                      ? `${opt.border} ${opt.bg} ${opt.color}` 
                      : 'border-border bg-transparent hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${confidentiality === opt.value ? opt.dot : 'bg-muted-foreground/30'}`}></div>
                  <span className="font-bold text-sm">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 col-span-full">
            <label className="text-sm font-bold text-foreground">ملاحظات إضافية</label>
            <textarea name="notes" rows={4} className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background resize-none" placeholder="أضف أي ملاحظات أو توجيهات هنا..."></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 bg-gray-50/50 border-t border-border flex flex-col gap-4">
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
              <motion.div animate={{ width: `${uploadProgress}%` }} className="bg-primary h-2.5 rounded-full" />
            </div>
          )}
          
          <div className="flex justify-end gap-4 w-full">
            <Link href="/dashboard">
              <button type="button" className="px-6 py-3 rounded-xl font-bold text-muted-foreground hover:bg-gray-200 transition-colors">
                إلغاء
              </button>
            </Link>
            <button 
              type="submit" 
              disabled={isPending}
              className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {isPending ? "جاري الرفع والحفظ..." : "رفع وحفظ الوثيقة"}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
