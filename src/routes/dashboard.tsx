import { createFileRoute, Link, Outlet, useLocation, useNavigate, redirect } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, Calendar, FileText, Award, Trophy, User as UserIcon, LogOut, GraduationCap, Bell, Menu, X, Activity, Search, Moon, Sun, Globe, ChevronDown, Settings, Brain, ClipboardCheck, Map } from "lucide-react";
import { useState, useEffect } from "react";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { departments, studentNotifications } from "@/lib/mock-data";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("nova_student");
      if (!raw) throw redirect({ to: "/login" });
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const { t, lang, theme, toggleLang, toggleTheme } = useApp();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  if (!user) return null;
  const dept = departments.find((d) => d.id === user.dept);

  const items = [
    { to: "/dashboard", label: t("dash.overview"), icon: LayoutDashboard, exact: true },
    { to: "/dashboard/courses", label: t("dash.myCourses"), icon: BookOpen },
    { to: "/dashboard/schedule", label: t("dash.schedule"), icon: Calendar },
    { to: "/dashboard/roadmap", label: lang === "ar" ? "الخطة الدراسية" : "Study Plan", icon: Map },
    { to: "/dashboard/assignments", label: t("dash.assignments"), icon: FileText },
    { to: "/dashboard/grades", label: t("dash.grades"), icon: Award },
    { to: "/quizzes", label: t("nav.quizzes"), icon: Brain },
    { to: "/exams", label: t("nav.exams"), icon: ClipboardCheck },
    { to: "/dashboard/achievements", label: t("dash.achievements"), icon: Trophy },
    { to: "/dashboard/profile", label: t("dash.profile"), icon: UserIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="fixed top-0 start-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 end-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 z-50 h-screen w-72 transition-all duration-300 ease-in-out
          ${lang === "ar" ? "right-0" : "left-0"}
          ${sidebarOpen ? "translate-x-0" : lang === "ar" ? "translate-x-full" : "-translate-x-full"}
          lg:translate-x-0
          bg-gradient-to-b from-[oklch(0.10_0.03_250)] to-[oklch(0.06_0.02_250)]
          border-e border-white/5 shadow-2xl`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src={logo} alt="" className="h-10 w-10 rounded-xl neon-glow group-hover:scale-110 transition-transform" />
              <GraduationCap className="absolute -top-1 -end-1 h-4 w-4 text-primary" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-display gradient-text leading-tight font-bold">E-Learning Nova</div>
              <div className="text-[10px] text-muted-foreground leading-tight">{t("auth.dashboard")}</div>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className="mx-3 mt-4 mb-2 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <img src={user.avatar} alt="" className="h-14 w-14 rounded-full neon-border bg-card" />
              <div className="absolute -bottom-1 -end-1 w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                {user.level}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">{user.name}</div>
              <div className="text-[10px] text-primary font-mono">{user.studentId}</div>
            </div>
          </div>
          {dept && (
            <div className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-gradient-to-r ${dept.color} text-white`}>
              {lang === "ar" ? dept.nameAr : dept.nameEn}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="px-3 mt-4 space-y-1 flex-1">
          <div className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider px-3 mb-2">
            {lang === "ar" ? "القائمة الرئيسية" : "MAIN MENU"}
          </div>
          {items.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${active
                    ? "gradient-primary text-white shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "" : "group-hover:text-primary transition-colors"}`} />
                <span>{item.label}</span>
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
            <span>{lang === "ar" ? "الموقع الرئيسي" : "Main Site"}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span>{t("auth.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <div className="transition-all duration-300 lg:ms-72">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-white/5">
          <div className="h-16 px-4 lg:px-6 flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-accent">
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/30 border border-border/50 w-72">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={lang === "ar" ? "بحث..." : "Search..."}
                  className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
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
                        <div className="font-semibold text-sm">{t("dash.notifications")}</div>
                        <span className="text-[10px] text-primary cursor-pointer hover:underline">
                          {lang === "ar" ? "تعيين الكل كمقروء" : "Mark all read"}
                        </span>
                      </div>
                      <div className="space-y-2 max-h-80 overflow-auto">
                        {studentNotifications.map((n) => (
                          <div key={n.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent/30 cursor-pointer">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${
                              n.type === "warning" ? "bg-yellow-400" : n.type === "success" ? "bg-green-400" : "bg-primary"
                            }`} />
                            <div className="flex-1">
                              <div className="text-sm">{lang === "ar" ? n.titleAr : n.titleEn}</div>
                              <div className="text-[10px] text-muted-foreground">{n.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors"
                >
                  <img src={user.avatar} alt="" className="h-8 w-8 rounded-full neon-border bg-card" />
                  <div className="hidden md:block text-start">
                    <div className="text-xs font-semibold leading-tight">{user.name}</div>
                    <div className="text-[10px] text-muted-foreground leading-tight">{user.studentId}</div>
                  </div>
                  <ChevronDown className="h-3 w-3 hidden md:block" />
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute end-0 top-full mt-2 w-52 glass-strong rounded-xl p-2 z-20 shadow-2xl border border-border/50">
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-sm"
                      >
                        <UserIcon className="h-4 w-4" /> {t("dash.profile")}
                      </Link>
                      <Link
                        to="/"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-sm"
                      >
                        <GraduationCap className="h-4 w-4" /> {lang === "ar" ? "الموقع الرئيسي" : "Main Site"}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 text-sm"
                      >
                        <LogOut className="h-4 w-4" /> {t("auth.logout")}
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
