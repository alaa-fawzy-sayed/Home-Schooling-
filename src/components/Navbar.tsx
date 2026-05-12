import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Globe, Moon, Sun, Sparkles, GraduationCap, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/logo.png";

export default function Navbar() {
  const { t, lang, theme, toggleLang, toggleTheme } = useApp();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/courses", label: t("nav.courses") },
    { to: "/departments", label: t("nav.departments") },
    { to: "/books", label: t("nav.books") },
    { to: "/live", label: t("nav.live") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img src={logo} alt="E-Learning Nova" className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg neon-glow group-hover:scale-110 transition-transform" />
              <GraduationCap className="absolute -top-1 -right-1 h-4 w-4 text-primary" />
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-xs lg:text-sm gradient-text leading-tight">E-Learning Nova</div>
              <div className="font-display font-black text-sm lg:text-base neon-text leading-tight">UNIVERSITY</div>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {links.map((l) => {
              const active = location.pathname === l.to || (l.to !== "/" && location.pathname.startsWith(l.to));
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    active ? "text-primary" : "text-foreground/80 hover:text-primary"
                  }`}
                >
                  {l.label}
                  {active && <span className="absolute inset-x-2 -bottom-0.5 h-0.5 bg-primary rounded-full neon-glow" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="Language">
              <Globe className="h-5 w-5" />
              <span className="sr-only">{lang}</span>
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="Theme">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors"
                >
                  <img src={user.avatar} alt="" className="h-8 w-8 rounded-full neon-border bg-card" />
                  <div className="text-start">
                    <div className="text-xs font-semibold leading-tight">{user.name}</div>
                    <div className="text-[10px] text-muted-foreground leading-tight">{user.studentId}</div>
                  </div>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {userMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                    <div className="absolute end-0 top-full mt-2 w-56 glass-strong rounded-xl p-2 z-20 shadow-2xl">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-sm"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {t("auth.dashboard")}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive text-sm"
                      >
                        <LogOut className="h-4 w-4" />
                        {t("auth.logout")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden md:inline-flex px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors">
                  {t("nav.login")}
                </Link>
                <Link to="/signup" className="hidden md:inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg gradient-primary text-white hover:opacity-90 neon-glow transition-all">
                  <Sparkles className="h-4 w-4" />
                  {t("nav.signup")}
                </Link>
              </>
            )}
            <button onClick={() => setOpen(!open)} className="xl:hidden p-2 rounded-lg hover:bg-accent" aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="xl:hidden pb-4 border-t border-border pt-4 animate-in fade-in slide-in-from-top-2">
            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent"
                >
                  {l.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {t("auth.dashboard")}
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("auth.logout")}
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setOpen(false)} className="flex-1 px-4 py-2 text-sm text-center rounded-lg border border-border">
                    {t("nav.login")}
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="flex-1 px-4 py-2 text-sm text-center rounded-lg gradient-primary text-white">
                    {t("nav.signup")}
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
