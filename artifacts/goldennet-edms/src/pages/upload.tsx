import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, File, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useUploadDocument } from "@/hooks/use-documents";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { mutate, isPending, isSuccess } = useUploadDocument();

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
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    mutate({
      number: formData.get("number") as string,
      date: formData.get("date") as string,
      type: formData.get("type") as any,
      entity: formData.get("entity") as string,
      status: formData.get("status") as any,
      title: formData.get("title") as string,
    }, {
      onSuccess: () => {
        setFile(null);
        e.currentTarget.reset();
        setTimeout(() => {
          // hack to remove success state after a bit
        }, 3000);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">رفع وثيقة جديدة</h1>
        <p className="text-muted-foreground">أدخل تفاصيل المراسلة وارفع الملف المرفق لحفظه في النظام</p>
      </div>

      {isSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-success/10 border border-success/20 text-success p-4 rounded-xl flex items-center gap-3"
        >
          <CheckCircle2 size={24} />
          <div>
            <h4 className="font-bold">تم الرفع بنجاح!</h4>
            <p className="text-sm">تم إضافة الوثيقة إلى النظام بنجاح ويمكن العثور عليها في المكتبة.</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="bg-card rounded-3xl shadow-lg border border-border overflow-hidden">
        
        {/* Upload Zone */}
        <div className="p-8 border-b border-border bg-gray-50/50">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all ${
              isDragging 
                ? "border-primary bg-primary/5" 
                : file ? "border-success/50 bg-success/5" : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
            }`}
          >
            {file ? (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mb-4">
                  <File size={32} />
                </div>
                <h4 className="font-bold text-lg mb-1">{file.name}</h4>
                <p className="text-muted-foreground text-sm mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button 
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-danger flex items-center gap-1 text-sm font-semibold hover:underline"
                >
                  <X size={16} /> إزالة الملف
                </button>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-4">
                  <UploadCloud size={40} />
                </div>
                <h4 className="font-bold text-xl mb-2 text-foreground">اسحب الملفات هنا</h4>
                <p className="text-muted-foreground text-sm mb-6">أو انقر لاختيار ملف من جهازك (PDF, JPG, PNG)</p>
                <label className="bg-white border-2 border-border hover:border-primary text-foreground font-bold py-2.5 px-6 rounded-xl cursor-pointer transition-all shadow-sm">
                  تصفح الملفات
                  <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                </label>
              </>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-full md:col-span-1">
            <label className="text-sm font-bold text-foreground">الموضوع / العنوان <span className="text-danger">*</span></label>
            <input required name="title" type="text" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background" placeholder="مثال: دعوة لحضور اجتماع" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">رقم الكتاب <span className="text-danger">*</span></label>
            <input required name="number" type="text" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background" placeholder="مثال: كتاب/123" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">تاريخ الكتاب <span className="text-danger">*</span></label>
            <input required name="date" type="date" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">نوع المراسلة <span className="text-danger">*</span></label>
            <select required name="type" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background appearance-none">
              <option value="وارد">وارد</option>
              <option value="صادر">صادر</option>
              <option value="داخلي">داخلي</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">الجهة المستلمة أو المُرسِلة <span className="text-danger">*</span></label>
            <input required name="entity" type="text" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background" placeholder="مثال: وزارة التعليم العالي" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">درجة السرية</label>
            <select name="confidentiality" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background appearance-none">
              <option value="عادي">عادي</option>
              <option value="سري">سري</option>
              <option value="سري للغاية">سري للغاية</option>
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
            <label className="text-sm font-bold text-foreground">ملاحظات إضافية</label>
            <textarea name="notes" rows={4} className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background resize-none" placeholder="أضف أي ملاحظات أو توجيهات هنا..."></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50/50 border-t border-border flex justify-end gap-4">
          <button type="button" className="px-6 py-3 rounded-xl font-bold text-muted-foreground hover:bg-gray-200 transition-colors">
            إلغاء
          </button>
          <button 
            type="submit" 
            disabled={isPending || !file}
            className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
          >
            {isPending ? "جاري الرفع..." : "رفع وحفظ الوثيقة"}
          </button>
        </div>
      </form>
    </div>
  );
}
