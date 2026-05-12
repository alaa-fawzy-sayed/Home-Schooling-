import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, Eye, EyeOff, Zap, Lock, Mail } from "lucide-react";
import { useApp } from "@/lib/i18n";
import { validateEmailSimple } from "@/lib/validation";
import { ADMIN_CREDENTIALS } from "@/lib/admin-data";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/admin-login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateEmailSimple(email)) {
      setError(lang === "ar" ? "البريد الإلكتروني غير صحيح" : "Invalid email format");
      return;
    }
    
    setLoading(true);

    setTimeout(() => {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem("nova_admin_auth", JSON.stringify({ email, loggedAt: Date.now() }));
        navigate({ to: "/admin" });
      } else {
        setError(lang === "ar" ? "بيانات الدخول غير صحيحة" : "Invalid credentials");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 end-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      {[
        [15,82],[73,18],[42,65],[88,40],[27,93],[56,8],[9,52],[67,76],[34,28],[81,61],
        [48,44],[92,88],[20,35],[61,12],[38,71],[76,55],[5,19],[53,97],[84,33],[30,70],
      ].map(([x, y], i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary animate-pulse"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            animationDelay: `${(i % 6) * 0.5}s`,
            animationDuration: `${2 + (i % 4)}s`,
          }}
        />
      ))}


      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 neon-border shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <img src={logo} alt="" className="h-20 w-20 rounded-2xl neon-glow mx-auto" style={{ animation: "pulse-glow 3s ease-in-out infinite" }} />
              <div className="absolute -bottom-1 -end-1 w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1">
              <span className="gradient-text">NOVA ADMIN</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {lang === "ar" ? "لوحة التحكم الإدارية" : "Administrative Control Panel"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                {lang === "ar" ? "البريد الإلكتروني" : "Email"}
              </label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nova.edu"
                  required
                  className="w-full ps-10 pe-4 py-3 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                {lang === "ar" ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full ps-10 pe-12 py-3 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute end-3 top-1/2 -translate-y-1/2 p-1 hover:text-primary transition-colors">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-primary text-white font-semibold text-sm neon-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  {lang === "ar" ? "دخول لوحة التحكم" : "Access Control Panel"}
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <div className="text-[10px] text-muted-foreground text-center mb-1.5 font-semibold uppercase tracking-wider">
              {lang === "ar" ? "بيانات تجريبية" : "Demo Credentials"}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Email:</span>
              <code className="text-primary font-mono">admin@nova.edu</code>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-muted-foreground">Pass:</span>
              <code className="text-primary font-mono">admin123</code>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-muted-foreground/60">
          <Lock className="h-3 w-3" />
          {lang === "ar" ? "اتصال مشفّر وآمن — SSL 256-bit" : "Encrypted & Secure Connection — SSL 256-bit"}
        </div>
      </div>
    </div>
  );
}
