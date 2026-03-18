import { motion } from "framer-motion";
import { Link } from "wouter";
import { Save, UploadCloud, User, Building, Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/dashboard" className="hover:text-primary">الرئيسية</Link>
        <span>/</span>
        <span className="text-foreground font-semibold">الإعدادات</span>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">الإعدادات</h1>
        <p className="text-muted-foreground">تخصيص إعدادات النظام ومعلومات المستخدم والمؤسسة</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-8">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <Building className="text-primary" size={24} />
              <h2 className="text-xl font-bold">معلومات المؤسسة</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">اسم المؤسسة</label>
                <input type="text" defaultValue="كلية القبس الأهلية" className="w-full border border-border rounded-xl px-4 py-2.5 bg-muted/30 focus:outline-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">العنوان</label>
                <input type="text" defaultValue="الموصل، نينوى، العراق" className="w-full border border-border rounded-xl px-4 py-2.5 bg-muted/30 focus:outline-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">البريد الإلكتروني الرسمي</label>
                <input type="email" defaultValue="info@alqabas.edu.iq" className="w-full border border-border rounded-xl px-4 py-2.5 bg-muted/30 focus:outline-primary" />
              </div>
              <div className="pt-2">
                <label className="block text-sm font-bold mb-2">شعار المؤسسة</label>
                <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-6 flex flex-col items-center justify-center bg-muted/10 cursor-pointer transition-colors">
                  <UploadCloud className="text-muted-foreground mb-2" size={32} />
                  <span className="text-sm font-semibold">انقر لرفع شعار جديد</span>
                  <span className="text-xs text-muted-foreground mt-1">PNG, JPG (Max 2MB)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <User className="text-primary" size={24} />
              <h2 className="text-xl font-bold">معلومات المستخدم</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">الاسم الكامل</label>
                <input type="text" defaultValue="أحمد محمد" className="w-full border border-border rounded-xl px-4 py-2.5 bg-muted/30 focus:outline-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">الصلاحية</label>
                <select className="w-full border border-border rounded-xl px-4 py-2.5 bg-muted/30 focus:outline-primary appearance-none">
                  <option>موظف</option>
                  <option>مدير قسم</option>
                  <option>عميد</option>
                </select>
              </div>
              <div className="pt-2">
                <label className="block text-sm font-bold mb-2">تغيير كلمة المرور</label>
                <input type="password" placeholder="كلمة المرور الجديدة" className="w-full border border-border rounded-xl px-4 py-2.5 bg-muted/30 focus:outline-primary mb-3" />
                <input type="password" placeholder="تأكيد كلمة المرور" className="w-full border border-border rounded-xl px-4 py-2.5 bg-muted/30 focus:outline-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <SettingsIcon className="text-primary" size={24} />
              <h2 className="text-xl font-bold">إعدادات النظام</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">إشعارات البريد الإلكتروني</h4>
                  <p className="text-xs text-muted-foreground mt-1">تلقي تنبيهات عند ورود مهام جديدة</p>
                </div>
                <div className="w-12 h-6 bg-success rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">وضع السرية التلقائي</h4>
                  <p className="text-xs text-muted-foreground mt-1">تعيين درجة "سري" افتراضياً للوثائق الصادرة</p>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">لغة النظام</label>
                <select className="w-full border border-border rounded-xl px-4 py-2.5 bg-muted/30 focus:outline-primary appearance-none">
                  <option value="ar">العربية (Arabic)</option>
                  <option value="en">English (الإنجليزية)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <Save size={20} /> حفظ التغييرات
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
