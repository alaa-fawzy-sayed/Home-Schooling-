import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, LogIn, Zap, Eye, EyeOff } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Card, NeonButton } from "@/components/ui-kit";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { validateEmailSimple } from "@/lib/validation";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { t } = useApp();
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      toast.error("املأ جميع الحقول");
      return;
    }
    
    if (!validateEmailSimple(form.email)) {
      toast.error("البريد الإلكتروني غير صحيح");
      return;
    }
    
    const success = login(form.email, form.password);
    
    if (success) {
      toast.success(t("auth.loginSuccess"));
      navigate({ to: "/dashboard" });
    } else {
      toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  const handleDemo = () => {
    // Create a demo account
    const demoEmail = `demo${Date.now()}@nova.edu`;
    const demoPassword = "demo123";
    
    try {
      signup({
        name: "حساب تجريبي",
        email: demoEmail,
        dept: "computers",
        level: 2,
        password: demoPassword
      });
      
      toast.success("تم إنشاء حساب تجريبي");
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      toast.error(error.message || "فشل إنشاء الحساب التجريبي");
    }
  };

  return (
    <PageShell hideFooter>
      <div className="container mx-auto px-4 py-12 max-w-md min-h-[80vh] flex items-center">
        <Card className="w-full">
          <div className="text-center mb-6">
            <img src={logo} alt="" className="h-16 w-16 mx-auto mb-3 rounded-xl neon-glow animate-pulse-glow" />
            <h1 className="text-2xl font-bold gradient-text">{t("auth.login")}</h1>
            <p className="text-xs text-muted-foreground mt-1">{t("uni.name")}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2"><Mail className="h-4 w-4" />{t("auth.email")}</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl glass border border-border focus:neon-border outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2"><Lock className="h-4 w-4" />{t("auth.password")}</label>
              <div className="relative">
                <input required type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 pe-12 rounded-xl glass border border-border focus:neon-border outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 end-0 flex items-center px-4 text-muted-foreground hover:text-primary transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <NeonButton type="submit" className="w-full"><LogIn className="h-4 w-4" />{t("auth.login")}</NeonButton>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-card text-muted-foreground">أو</span></div>
          </div>

          <button
            type="button"
            onClick={handleDemo}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl neon-border text-primary hover:bg-primary/10 text-sm font-semibold"
          >
            <Zap className="h-4 w-4" /> دخول كحساب تجريبي
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("auth.noAccount")} <Link to="/signup" className="text-primary font-semibold hover:underline">{t("auth.signup")}</Link>
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
