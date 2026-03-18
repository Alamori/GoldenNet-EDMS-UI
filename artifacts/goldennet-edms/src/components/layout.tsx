import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Home, 
  Inbox, 
  Send, 
  Clock, 
  Lock, 
  FolderOpen, 
  BarChart, 
  Settings,
  LogOut,
  User,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "الرئيسية", icon: Home, href: "/dashboard" },
  { label: "المراسلات الواردة", icon: Inbox, href: "/library?filter=وارد" },
  { label: "المراسلات الصادرة", icon: Send, href: "/library?filter=صادر" },
  { label: "قيد المراجعة", icon: Clock, href: "/workflow" },
  { label: "الوثائق السرية", icon: Lock, href: "#" },
  { label: "كل المراسلات", icon: FolderOpen, href: "/library" },
  { label: "سجل الأحداث", icon: BarChart, href: "#" },
  { label: "الإعدادات", icon: Settings, href: "#" },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row w-full rtl">
      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-sidebar text-sidebar-foreground z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-lg leading-none">G</span>
          </div>
          <span className="font-bold text-lg tracking-wide">GoldenNet</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 right-0 z-40 w-64 bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3 border-b border-white/10 hidden md:flex">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-yellow-600 flex items-center justify-center shadow-lg shadow-accent/20">
            <span className="text-accent-foreground font-bold text-xl leading-none">G</span>
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-wide">GoldenNet</h1>
            <p className="text-xs text-white/50">EDMS</p>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs font-semibold text-white/40 mb-4 px-2 uppercase tracking-wider">القائمة الرئيسية</p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "#" && item.href !== "/library");
              return (
                <Link key={item.label} href={item.href} className="block">
                  <div onClick={() => setIsMobileMenuOpen(false)} className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                    isActive 
                      ? "bg-accent/10 text-accent font-semibold relative overflow-hidden" 
                      : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-white"
                  )}>
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav" 
                        className="absolute right-0 top-0 bottom-0 w-1 bg-accent rounded-l-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon size={20} className={cn(
                      "transition-colors", 
                      isActive ? "text-accent" : "text-white/40 group-hover:text-white/70"
                    )} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border-2 border-accent mb-3 shadow-lg">
              <User size={20} className="text-white" />
            </div>
            <p className="font-bold text-sm mb-1">{user?.name}</p>
            <p className="text-xs text-white/50 mb-4">مدير النظام</p>
            <button 
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 bg-card border-b border-border/50 flex items-center justify-between px-6 lg:px-10 z-10 shrink-0">
          <h2 className="font-bold text-foreground hidden sm:block">كلية القبس الأهلية - نظام إدارة الوثائق</h2>
          <div className="flex items-center gap-4 mr-auto">
            <Link href="/upload" className="block">
              <button className="hidden sm:flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5">
                <Send size={16} />
                <span>رفع وثيقة</span>
              </button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-10 relative">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
