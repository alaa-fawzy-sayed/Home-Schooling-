import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Mail, Lock, Sparkles, GraduationCap, ArrowRight, ArrowLeft, Stethoscope, SmilePlus, FlaskConical, PawPrint, Atom, HardHat, BrainCircuit, HeartPulse, Check, Eye, EyeOff } from "lucide-react";
import PageShell from "@/components/PageShell";
import { NeonButton } from "@/components/ui-kit";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { validateEmail, validatePassword } from "@/lib/validation";
import { departments } from "@/lib/mock-data";
import type { DeptId } from "@/lib/mock-data";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

const iconMap = { Stethoscope, SmilePlus, FlaskConical, PawPrint, Atom, HardHat, BrainCircuit, HeartPulse };

function SignupPage() {
  const { t, lang } = useApp();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [dept, setDept] = useState<DeptId | null>(null);
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);

  const next = () => {
    if (step === 1) {
      if (!form.name || !form.email || !form.password) { 
        toast.error("املأ كل الحقول"); 
        return; 
      }
      
      const emailValidation = validateEmail(form.email);
      if (!emailValidation.valid) {
        if (emailValidation.suggestion) {
          setEmailSuggestion(emailValidation.suggestion);
          toast.error(emailValidation.error || "البريد الإلكتروني غير صحيح");
        } else {
          toast.error(emailValidation.error || "البريد الإلكتروني غير صحيح");
        }
        return; 
      }

      // ✅ Check if email already exists BEFORE moving to next step
      const allUsersRaw = typeof window !== "undefined" ? localStorage.getItem("nova_all_users") : null;
      let allUsers: any[] = [];
      
      if (allUsersRaw) {
        try {
          allUsers = JSON.parse(allUsersRaw);
          if (!Array.isArray(allUsers)) allUsers = [];
        } catch {
          allUsers = [];
        }
      }

      const emailExists = allUsers.some(
        (user: any) => user?.email?.toLowerCase() === form.email.toLowerCase()
      );

      if (emailExists) {
        toast.error("البريد الإلكتروني مسجل مسبقاً");
        return;
      }
      
      if (form.password !== form.confirm) { 
        toast.error("كلمتا المرور غير متطابقتين"); 
        return; 
      }
      const passwordCheck = validatePassword(form.password);
      if (!passwordCheck.valid) { 
        toast.error(passwordCheck.errors[0]); 
        return; 
      }
      setStep(2);
    } else if (step === 2) {
      if (!dept) { toast.error("اختر قسمًا"); return; }
      setStep(3);
    } else {
      try {
        console.log('🚀 Attempting signup with email:', form.email);
        
        signup({ 
          name: form.name, 
          email: form.email, 
          dept: dept!, 
          level,
          password: form.password
        });
        
        console.log('✅ Signup successful!');
        toast.success(t("auth.signupSuccess"));
        navigate({ to: "/dashboard" });
      } catch (error: any) {
        console.error('❌ Signup failed:', error.message);
        toast.error(error.message || "حدث خطأ أثناء التسجيل");
      }
    }
  };

  const applySuggestion = () => {
    if (emailSuggestion) {
      setForm({ ...form, email: emailSuggestion });
      setEmailSuggestion(null);
      toast.success("تم تصحيح البريد الإلكتروني");
    }
  };

  const ArrowFwd = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <PageShell hideFooter>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="text-center mb-8">
          <img src={logo} alt="" className="h-16 w-16 mx-auto mb-3 rounded-xl neon-glow animate-pulse-glow" />
          <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-1">{t("auth.welcome")}</h1>
          <p className="text-sm text-muted-foreground">{t("auth.welcomeSub")}</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step >= s ? "gradient-primary text-white neon-glow" : "glass border border-border text-muted-foreground"
              }`}>
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-strong rounded-2xl p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> البيانات الشخصية
              </h2>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2"><User className="h-4 w-4" />{t("auth.name")}</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl glass border border-border focus:neon-border outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2"><Mail className="h-4 w-4" />{t("auth.email")}</label>
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setEmailSuggestion(null);
                  }} 
                  className="w-full px-4 py-3 rounded-xl glass border border-border focus:neon-border outline-none" 
                />
                {emailSuggestion && (
                  <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">هل تقصد:</p>
                      <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">{emailSuggestion}</p>
                    </div>
                    <button
                      type="button"
                      onClick={applySuggestion}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium transition-colors"
                    >
                      استخدم هذا
                    </button>
                  </div>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2"><Lock className="h-4 w-4" />{t("auth.password")}</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 pe-12 rounded-xl glass border border-border focus:neon-border outline-none" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 end-0 flex items-center px-4 text-muted-foreground hover:text-primary transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2"><Lock className="h-4 w-4" />{t("auth.confirm")}</label>
                  <div className="relative">
                    <input type={showConfirm ? "text" : "password"} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="w-full px-4 py-3 pe-12 rounded-xl glass border border-border focus:neon-border outline-none" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 end-0 flex items-center px-4 text-muted-foreground hover:text-primary transition-colors">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" /> {t("auth.dept")}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {departments.map((d) => {
                  const Icon = iconMap[d.icon as keyof typeof iconMap];
                  const selected = dept === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setDept(d.id)}
                      type="button"
                      className={`relative text-start p-4 rounded-xl transition-all ${
                        selected ? "neon-border bg-primary/10 scale-[1.02]" : "glass hover:bg-accent/30"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${d.color} flex items-center justify-center mb-3`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="font-semibold text-sm mb-1">{lang === "ar" ? d.nameAr : d.nameEn}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{lang === "ar" ? d.descAr : d.descEn}</div>
                      {selected && (
                        <div className="absolute top-2 end-2 w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" /> {t("auth.level")}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {([1, 2, 3, 4] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={`p-6 rounded-xl text-center transition-all ${
                      level === l ? "neon-border bg-primary/10 scale-[1.02]" : "glass hover:bg-accent/30"
                    }`}
                  >
                    <div className="text-3xl font-display font-black gradient-text mb-2">{l}</div>
                    <div className="text-xs font-medium">{t(`auth.level${l}` as never)}</div>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl glass">
                <div className="text-xs text-muted-foreground mb-1">سيتم إنشاء رقمك الجامعي تلقائيًا</div>
                <div className="font-display text-lg gradient-text">NOVA-{new Date().getFullYear()}-XXXX</div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1) as 1 | 2 | 3)}
              disabled={step === 1}
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent disabled:opacity-30"
            >
              {t("common.back")}
            </button>
            <NeonButton onClick={next}>
              {step === 3 ? t("auth.signup") : "التالي"}
              <ArrowFwd className="h-4 w-4" />
            </NeonButton>
          </div>
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t("auth.haveAccount")} <Link to="/login" className="text-primary font-semibold hover:underline">{t("auth.login")}</Link>
        </p>
      </div>
    </PageShell>
  );
}
