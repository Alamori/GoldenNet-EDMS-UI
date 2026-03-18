import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  ChevronRight,
  ChevronLeft,
  Search,
  Bell
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "الرئيسية", icon: Home, href: "/dashboard" },
  { label: "المراسلات الواردة", icon: Inbox, href: "/incoming", badge: "3" },
  { label: "المراسلات الصادرة", icon: Send, href: "/outgoing" },
  { label: "قيد المراجعة", icon: Clock, href: "/workflow", badge: "12" },
  { label: "الوثائق السرية", icon: Lock, href: "/library?filter=سري" },
  { label: "كل المراسلات", icon: FolderOpen, href: "/library" },
  { label: "سجل الأحداث", icon: BarChart, href: "/activity-log" },
  { label: "الإعدادات", icon: Settings, href: "/settings" },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
      <motion.aside 
        animate={{ width: isSidebarCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
        "fixed md:static inset-y-0 right-0 z-40 bg-sidebar text-sidebar-foreground shadow-xl flex flex-col overflow-hidden shrink-0",
        isMobileMenuOpen ? "translate-x-0 w-64" : "translate-x-full md:translate-x-0"
      )}>
        <div className="p-4 md:p-6 flex items-center justify-between border-b border-white/10 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-yellow-600 flex items-center justify-center shadow-lg shadow-accent/20 shrink-0">
              <span className="text-accent-foreground font-bold text-xl leading-none">G</span>
            </div>
            <AnimatePresence>
              {!isSidebarCollapsed && (
                <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="whitespace-nowrap overflow-hidden">
                  <h1 className="font-bold text-xl tracking-wide">GoldenNet</h1>
                  <p className="text-xs text-white/50">EDMS</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex absolute left-4 w-6 h-6 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto hide-scrollbar">
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs font-semibold text-white/40 mb-4 px-2 uppercase tracking-wider whitespace-nowrap">القائمة الرئيسية</motion.p>
            )}
          </AnimatePresence>
          
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "#" && item.href !== "/library");
              return (
                <Link key={item.label} href={item.href} className="block">
                  <div 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={cn(
                    "flex items-center px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer relative",
                    isSidebarCollapsed ? "justify-center" : "gap-3",
                    isActive 
                      ? "bg-accent/10 text-accent font-semibold overflow-hidden" 
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
                      "transition-colors shrink-0", 
                      isActive ? "text-accent" : "text-white/40 group-hover:text-white/70"
                    )} />
                    
                    {!isSidebarCollapsed && (
                      <span className="whitespace-nowrap">{item.label}</span>
                    )}

                    {!isSidebarCollapsed && item.badge && (
                       <span className="mr-auto bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                         {item.badge}
                       </span>
                    )}
                    {isSidebarCollapsed && item.badge && (
                       <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full" />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 md:p-6 border-t border-white/10">
          <div className={cn("bg-white/5 rounded-2xl flex items-center transition-all", isSidebarCollapsed ? "p-2 justify-center" : "p-4 flex-col text-center")}>
            <div className={cn("rounded-full bg-primary flex items-center justify-center border-2 border-accent shadow-lg shrink-0", isSidebarCollapsed ? "w-10 h-10" : "w-12 h-12 mb-3")}>
              <User size={20} className="text-white" />
            </div>
            {!isSidebarCollapsed && (
              <>
                <p className="font-bold text-sm mb-1 whitespace-nowrap">{user?.name}</p>
                <p className="text-xs text-white/50 mb-4 whitespace-nowrap">مدير النظام</p>
                <button 
                  onClick={logout}
                  className="flex items-center justify-center gap-2 w-full py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors whitespace-nowrap"
                >
                  <LogOut size={16} />
                  <span>تسجيل الخروج</span>
                </button>
              </>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 bg-card border-b border-border/50 flex items-center justify-between px-4 lg:px-8 z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="font-bold text-foreground hidden lg:block ml-4 whitespace-nowrap">كلية القبس الأهلية</h2>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full hidden sm:block">
              <div className="absolute inset-y-0 right-0 pl-3 pr-4 flex items-center pointer-events-none text-muted-foreground">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                className="w-full bg-muted/50 border border-transparent focus:border-primary/30 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none transition-all"
                placeholder="ابحث في الوثائق..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            <button className="relative p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-card">5</span>
            </button>

            <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>

            {/* User Avatar Dropdown (Mock) */}
            <div className="hidden sm:flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded-full transition-colors pr-3">
              <div className="text-right">
                <p className="text-sm font-bold text-foreground leading-none">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground">مدير النظام</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <User size={16} />
              </div>
            </div>

            <Link href="/upload" className="block ml-2">
              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5">
                <Send size={16} />
                <span className="hidden sm:inline">رفع وثيقة</span>
              </button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-auto p-4 sm:p-6 lg:p-10 relative bg-background"
          >
            {children}
          </motion.div>
        </AnimatePresence>
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
