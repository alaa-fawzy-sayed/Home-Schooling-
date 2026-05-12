import { createFileRoute, Link, Outlet, useLocation, useNavigate, redirect } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, BookOpen, BarChart3, Settings, LogOut, Shield, Menu, X, Bell,
  ChevronDown, Search, Moon, Sun, Globe, GraduationCap, Activity, FolderKanban, UserCog, Key,
  Award, DollarSign, Megaphone
} from "lucide-react";
import { useState, useEffect } from "react";
import { useApp } from "@/lib/i18n";
import { adminUser } from "@/lib/admin-data";
import logo from "@/assets/logo.png";

const ADMIN_KEY = "nova_admin_auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem(ADMIN_KEY);
      if (!auth) throw redirect({ to: "/admin-login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { lang, theme, toggleLang, toggleTheme } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { to: "/admin", label: lang === "ar" ? "لوحة التحكم" : "Dashboard", labelEn: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/users", label: lang === "ar" ? "إدارة الطلاب" : "Students", labelEn: "Students", icon: Users },
    { to: "/admin/courses", label: lang === "ar" ? "الكورسات الإضافية" : "Courses", labelEn: "Courses", icon: BookOpen },
    { to: "/admin/subjects", label: lang === "ar" ? "المقررات الجامعية" : "Subjects", labelEn: "Subjects", icon: FolderKanban },
    { to: "/admin/departments", label: lang === "ar" ? "الأقسام والكليات" : "Departments", labelEn: "Departments", icon: LayoutDashboard },
    { to: "/admin/instructors", label: lang === "ar" ? "أعضاء هيئة التدريس" : "Professors", labelEn: "Professors", icon: UserCog },
    { to: "/admin/permissions", label: lang === "ar" ? "الصلاحيات" : "Permissions", labelEn: "Permissions", icon: Key },
    { to: "/admin/certificates", label: lang === "ar" ? "الشهادات" : "Certificates", labelEn: "Certificates", icon: Award },
    { to: "/admin/finance", label: lang === "ar" ? "المالية" : "Finance", labelEn: "Finance", icon: DollarSign },
    { to: "/admin/announcements", label: lang === "ar" ? "الإعلانات" : "Announcements", labelEn: "Announcements", icon: Megaphone },
    { to: "/admin/analytics", label: lang === "ar" ? "التقارير" : "Analytics", labelEn: "Analytics", icon: BarChart3 },
    { to: "/admin/settings", label: lang === "ar" ? "الإعدادات" : "Settings", labelEn: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY);
    navigate({ to: "/admin-login" });
  };

  const notifications = [
    { id: 1, text: lang === "ar" ? "342 تسجيل جديد هذا الأسبوع" : "342 new signups this week", time: "5m", type: "info" },
    { id: 2, text: lang === "ar" ? "3 بلاغات محتوى بانتظار المراجعة" : "3 content reports pending", time: "1h", type: "warning" },
    { id: 3, text: lang === "ar" ? "تم اكتمال النسخ الاحتياطي" : "Backup completed", time: "3h", type: "success" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="fixed top-0 start-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 end-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 z-50 h-screen transition-all duration-300 ease-in-out
          ${lang === "ar" ? "right-0" : "left-0"}
          ${collapsed ? "w-20" : "w-72"}
          ${sidebarOpen ? "translate-x-0" : lang === "ar" ? "translate-x-full" : "-translate-x-full"}
          lg:translate-x-0
          bg-gradient-to-b from-[oklch(0.10_0.03_250)] to-[oklch(0.06_0.02_250)]
          border-e border-white/5 shadow-2xl`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="relative">
              <img src={logo} alt="" className="h-10 w-10 rounded-xl neon-glow group-hover:scale-110 transition-transform" />
              <Shield className="absolute -top-1 -end-1 h-4 w-4 text-primary" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <div className="text-xs font-display gradient-text leading-tight font-bold">NOVA ADMIN</div>
                <div className="text-[10px] text-muted-foreground leading-tight">Control Panel</div>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${collapsed ? "rotate-90 rtl:-rotate-90" : "-rotate-90 rtl:rotate-90"}`} />
          </button>
        </div>

        {/* Admin Card */}
        {!collapsed && (
          <div className="mx-3 mt-4 mb-2 p-3 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
            <div className="flex items-center gap-3">
              <img src={adminUser.avatar} alt="" className="h-10 w-10 rounded-full neon-border bg-card" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{adminUser.name}</div>
                <div className="text-[10px] text-primary font-medium flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  {lang === "ar" ? "مدير النظام" : "Super Admin"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="px-3 mt-4 space-y-1 flex-1">
          {!collapsed && (
            <div className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider px-3 mb-2">
              {lang === "ar" ? "القائمة الرئيسية" : "MAIN MENU"}
            </div>
          )}
          {navItems.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to) && item.to !== "/admin";
            const isOverview = item.exact && location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
                  ${active || isOverview
                    ? "gradient-primary text-white shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active || isOverview ? "" : "group-hover:text-primary transition-colors"}`} />
                {!collapsed && <span>{item.label}</span>}
                {collapsed && (
                  <div className="absolute start-full ms-2 px-2 py-1 rounded-md bg-card text-foreground text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 start-0 end-0 p-3 border-t border-white/5">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 mb-1"
          >
            <GraduationCap className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{lang === "ar" ? "الموقع الرئيسي" : "Main Site"}</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{lang === "ar" ? "تسجيل الخروج" : "Logout"}</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${collapsed ? "lg:ms-20" : "lg:ms-72"}`} style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-white/5">
          <div className="h-16 px-4 lg:px-6 flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-accent">
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/30 border border-border/50 w-80">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={lang === "ar" ? "بحث في لوحة التحكم..." : "Search dashboard..."}
                  className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground/60"
                />
                <kbd className="hidden lg:inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono bg-background/50 text-muted-foreground border border-border/50">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Live clock */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/20 text-xs font-mono text-muted-foreground">
                <Activity className="h-3 w-3 text-green-400 animate-pulse" />
                {currentTime.toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US")}
              </div>

              <button onClick={toggleLang} className="p-2 rounded-lg hover:bg-accent transition-colors">
                <Globe className="h-4 w-4" />
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-colors">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 rounded-lg hover:bg-accent relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </button>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                    <div className="absolute end-0 top-full mt-2 w-80 glass-strong rounded-xl p-3 z-20 shadow-2xl border border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-sm">{lang === "ar" ? "الإشعارات" : "Notifications"}</div>
                        <span className="text-[10px] text-primary cursor-pointer hover:underline">
                          {lang === "ar" ? "تعيين الكل كمقروء" : "Mark all read"}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {notifications.map((n) => (
                          <div key={n.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent/30 cursor-pointer">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${
                              n.type === "warning" ? "bg-yellow-400" : n.type === "success" ? "bg-green-400" : "bg-blue-400"
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm leading-snug">{n.text}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">{n.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Admin Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors"
                >
                  <img src={adminUser.avatar} alt="" className="h-8 w-8 rounded-full neon-border bg-card" />
                  <div className="hidden md:block text-start">
                    <div className="text-xs font-semibold leading-tight">{adminUser.name}</div>
                    <div className="text-[10px] text-primary leading-tight">Admin</div>
                  </div>
                  <ChevronDown className="h-3 w-3 hidden md:block" />
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute end-0 top-full mt-2 w-48 glass-strong rounded-xl p-2 z-20 shadow-2xl border border-border/50">
                      <Link
                        to="/admin/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-sm"
                      >
                        <Settings className="h-4 w-4" /> {lang === "ar" ? "الإعدادات" : "Settings"}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 text-sm"
                      >
                        <LogOut className="h-4 w-4" /> {lang === "ar" ? "خروج" : "Logout"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6 relative z-10 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
