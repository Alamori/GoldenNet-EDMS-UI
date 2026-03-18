import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Save, UploadCloud, User, Building, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<"institution" | "account">("institution");

  const handlePasswordChange = () => {
    toast.success("تم تحديث كلمة المرور بنجاح ✅");
  };

  const handleSaveInstitution = () => {
    toast.success("تم حفظ إعدادات المؤسسة بنجاح ✅");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/dashboard" className="hover:text-primary">الرئيسية</Link>
        <span>/</span>
        <span className="text-foreground font-semibold">الإعدادات</span>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">الإعدادات</h1>
        <p className="text-muted-foreground">تخصيص إعدادات النظام ومعلومات الحساب الشخصي</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-muted/50 rounded-xl max-w-sm border border-border shadow-inner">
        <button
          onClick={() => setActiveTab("institution")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "institution" 
              ? "bg-white text-primary shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-white/50"
          }`}
        >
          <Building size={16} /> معلومات المؤسسة
        </button>
        <button
          onClick={() => setActiveTab("account")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "account" 
              ? "bg-white text-primary shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-white/50"
          }`}
        >
          <User size={16} /> الحساب الشخصي
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "institution" && (
          <motion.div 
            key="institution"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity">
                  <span className="text-4xl font-black text-white">G</span>
                </div>
                <p className="text-sm font-semibold text-primary cursor-pointer hover:underline">انقر لتغيير الشعار</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-foreground">اسم المؤسسة</label>
                  <input type="text" defaultValue="كلية القبس الأهلية" className="w-full border border-border rounded-xl px-4 py-3 bg-muted/30 focus:outline-primary focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-foreground">رمز المؤسسة</label>
                  <input type="text" defaultValue="QABAS" className="w-full border border-border rounded-xl px-4 py-3 bg-muted/30 focus:outline-primary focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2 col-span-full">
                  <label className="block text-sm font-bold text-foreground">العنوان / الموقع</label>
                  <input type="text" defaultValue="الموصل، نينوى، العراق" className="w-full border border-border rounded-xl px-4 py-3 bg-muted/30 focus:outline-primary focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2 col-span-full">
                  <label className="block text-sm font-bold text-foreground">البريد الإلكتروني الرسمي</label>
                  <input type="email" defaultValue="info@alqabas.edu.iq" className="w-full border border-border rounded-xl px-4 py-3 bg-muted/30 focus:outline-primary focus:bg-white transition-colors text-left" dir="ltr" />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={handleSaveInstitution} className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                  <Save size={20} /> حفظ التغييرات
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "account" && (
          <motion.div 
            key="account"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="w-20 h-20 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg mb-4 text-2xl font-bold">
                  أم
                </div>
                <h3 className="font-bold text-lg text-foreground">أحمد محمد</h3>
                <p className="text-sm text-muted-foreground">مدير النظام</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-foreground">الاسم الكامل</label>
                  <input type="text" defaultValue="أحمد محمد" readOnly className="w-full border border-border rounded-xl px-4 py-3 bg-muted/50 text-muted-foreground cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-foreground">البريد الإلكتروني</label>
                  <input type="email" defaultValue="ahmed@alqabas.edu.iq" readOnly className="w-full border border-border rounded-xl px-4 py-3 bg-muted/50 text-muted-foreground cursor-not-allowed text-left" dir="ltr" />
                </div>
                <div className="space-y-2 col-span-full">
                  <label className="block text-sm font-bold text-foreground">الصلاحية</label>
                  <select disabled className="w-full border border-border rounded-xl px-4 py-3 bg-muted/50 text-muted-foreground cursor-not-allowed appearance-none">
                    <option>مدير النظام</option>
                  </select>
                </div>
              </div>

              <div className="border border-border rounded-xl p-6 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="text-slate-800" size={20} />
                  <h3 className="font-bold text-lg text-foreground">تغيير كلمة المرور</h3>
                </div>
                
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-foreground">كلمة المرور الحالية</label>
                    <input type="password" placeholder="••••••••" className="w-full border border-border rounded-xl px-4 py-3 bg-white focus:outline-primary transition-colors text-left" dir="ltr" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-foreground">كلمة المرور الجديدة</label>
                    <input type="password" placeholder="••••••••" className="w-full border border-border rounded-xl px-4 py-3 bg-white focus:outline-primary transition-colors text-left" dir="ltr" />
                    <div className="flex gap-1 h-1.5 mt-2">
                      <div className="flex-1 bg-success rounded-full"></div>
                      <div className="flex-1 bg-success rounded-full"></div>
                      <div className="flex-1 bg-success rounded-full"></div>
                      <div className="flex-1 bg-muted rounded-full"></div>
                    </div>
                    <p className="text-xs text-muted-foreground">كلمة مرور قوية</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-foreground">تأكيد كلمة المرور</label>
                    <input type="password" placeholder="••••••••" className="w-full border border-border rounded-xl px-4 py-3 bg-white focus:outline-primary transition-colors text-left" dir="ltr" />
                  </div>

                  <button onClick={handlePasswordChange} className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-colors mt-6">
                    تغيير كلمة المرور
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
