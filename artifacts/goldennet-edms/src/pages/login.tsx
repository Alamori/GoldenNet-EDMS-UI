import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Lock, User } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const result = await login(username, password);
    if (!result.success) {
      setError(result.error || "اسم المستخدم أو كلمة المرور غير صحيحة");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0A192F] rtl">
      {/* Background Image/Effect */}
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}images/login-bg.png`}
          alt="Background"
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-[#0A192F]/80" />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] z-0" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-primary/40 rounded-full blur-[100px] z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 relative z-10 glass-panel rounded-3xl mx-4"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-yellow-600 flex items-center justify-center shadow-xl shadow-accent/30 mb-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-white font-bold text-3xl leading-none shadow-sm">G</span>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">GoldenNet EDMS</h1>
          <p className="text-muted-foreground text-center font-medium">كلية القبس الأهلية<br/>نظام إدارة الوثائق</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary mr-1">اسم المستخدم</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pl-3 pr-4 flex items-center pointer-events-none text-muted-foreground">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/50 border-2 border-primary/10 rounded-xl py-3 pl-4 pr-11 text-foreground focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                placeholder="أدخل اسم المستخدم"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-primary mr-1">كلمة المرور</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pl-3 pr-4 flex items-center pointer-events-none text-muted-foreground">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/50 border-2 border-primary/10 rounded-xl py-3 pl-4 pr-11 text-foreground focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                placeholder="أدخل كلمة المرور"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl py-3.5 mt-4 shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>جاري الدخول...</span>
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-primary/70 hover:text-accent transition-colors font-semibold">
            نسيت كلمة المرور؟
          </a>
        </div>
      </motion.div>
    </div>
  );
}
