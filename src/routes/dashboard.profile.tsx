import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { User as UserIcon, Mail, GraduationCap, Calendar, Save, Edit3, Lock, Eye, EyeOff, Shield, Camera, Upload } from "lucide-react";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { validatePassword } from "@/lib/validation";
import api from "@/lib/api";
import { departments } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { t, lang } = useApp();
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Password change state
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPassword: "",
    confirm: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  if (!user) return null;
  const dept = departments.find((d) => d.id === user.dept);

  const save = () => {
    updateUser({ name });
    toast.success("تم حفظ التغييرات");
    setEditing(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error(lang === "ar" ? "يرجى اختيار صورة فقط" : "Please select an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(lang === "ar" ? "حجم الصورة يجب أن يكون أقل من 5 ميجابايت" : "Image size must be less than 5MB");
      return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateUser({ avatar: base64String });
      toast.success(lang === "ar" ? "تم تحديث صورة الملف الشخصي" : "Profile picture updated");
    };
    reader.onerror = () => {
      toast.error(lang === "ar" ? "حدث خطأ أثناء رفع الصورة" : "Error uploading image");
    };
    reader.readAsDataURL(file);
  };

  const changePassword = async () => {
    // Validate current password
    if (!passwordForm.current) {
      toast.error("أدخل كلمة المرور الحالية");
      return;
    }

    // Check if current password matches stored password
    if (user?.password && user.password !== passwordForm.current) {
      toast.error("كلمة المرور الحالية غير صحيحة");
      return;
    }

    // Validate new password
    const validation = validatePassword(passwordForm.newPassword);
    if (!validation.valid) {
      toast.error(validation.errors[0]);
      return;
    }

    // Check if passwords match
    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast.error("كلمتا المرور الجديدة غير متطابقتين");
      return;
    }

    // Check if new password is different from current
    if (passwordForm.current === passwordForm.newPassword) {
      toast.error("كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية");
      return;
    }

    try {
      // Update password in localStorage (⚠️ NOT SECURE - for development only!)
      updateUser({ password: passwordForm.newPassword });
      
      // Optionally call API if backend is connected
      // await api.changePassword(passwordForm.current, passwordForm.newPassword, passwordForm.confirm);
      
      toast.success("تم تغيير كلمة المرور بنجاح");
      setPasswordForm({ current: "", newPassword: "", confirm: "" });
      setChangingPassword(false);
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تغيير كلمة المرور");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-1">{t("dash.profile")}</h1>
        <p className="text-sm text-muted-foreground">معلوماتك الأكاديمية والشخصية</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="glass rounded-2xl p-6 text-center">
          <div className="relative inline-block mb-4">
            <img 
              src={user.avatar} 
              alt="" 
              className="h-32 w-32 rounded-full neon-border bg-card object-cover" 
            />
            <button
              onClick={handleImageClick}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center hover:scale-110 transition-transform neon-glow"
              title={lang === "ar" ? "تغيير الصورة" : "Change picture"}
            >
              <Camera className="h-5 w-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <h2 className="text-xl font-bold gradient-text mb-1">{user.name}</h2>
          <p className="text-xs text-muted-foreground mb-3">{user.email}</p>
          {dept && (
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${dept.color} text-white mb-2`}>
              {lang === "ar" ? dept.nameAr : dept.nameEn}
            </div>
          )}
          <div className="text-xs text-muted-foreground">عضو منذ {new Date(user.joinedAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}</div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">المعلومات</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-xs hover:bg-accent">
                <Edit3 className="h-3 w-3" /> تعديل
              </button>
            ) : (
              <button onClick={save} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg gradient-primary text-white text-xs font-semibold">
                <Save className="h-3 w-3" /> حفظ
              </button>
            )}
          </div>

          <Field icon={UserIcon} label={t("auth.name")}>
            {editing ? (
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-accent/30 border border-border focus:neon-border outline-none text-sm" />
            ) : (
              <div className="text-sm font-medium">{user.name}</div>
            )}
          </Field>

          <Field icon={Mail} label={t("auth.email")}>
            <div className="text-sm font-medium">{user.email}</div>
          </Field>

          <Field icon={GraduationCap} label={t("dash.studentId")}>
            <div className="text-sm font-mono gradient-text font-bold">{user.studentId}</div>
          </Field>

          <Field icon={GraduationCap} label={t("dash.dept")}>
            <div className="text-sm font-medium">{dept ? (lang === "ar" ? dept.nameAr : dept.nameEn) : "-"}</div>
          </Field>

          <Field icon={Calendar} label={t("dash.level")}>
            <div className="text-sm font-medium">{t(`auth.level${user.level}` as never)}</div>
          </Field>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold">الأمان وكلمة المرور</h3>
              <p className="text-xs text-muted-foreground">قم بتحديث كلمة المرور الخاصة بك</p>
            </div>
          </div>
        </div>

        {!changingPassword ? (
          <button
            onClick={() => setChangingPassword(true)}
            className="w-full px-4 py-3 rounded-xl glass hover:bg-accent transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <Lock className="h-4 w-4" />
            تغيير كلمة المرور
          </button>
        ) : (
          <div className="space-y-4">
            {/* Security Notice */}
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  <strong>للأمان:</strong> يجب إدخال كلمة المرور الحالية للتأكد من هويتك قبل تغييرها
                </div>
              </div>
            </div>

            {/* Current Password */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                كلمة المرور الحالية
              </label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full ps-10 pe-10 py-3 rounded-xl bg-accent/30 border border-border focus:neon-border outline-none text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full ps-10 pe-10 py-3 rounded-xl bg-accent/30 border border-border focus:neon-border outline-none text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                يجب أن تكون 8 أحرف على الأقل
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                تأكيد كلمة المرور الجديدة
              </label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className="w-full ps-10 pe-10 py-3 rounded-xl bg-accent/30 border border-border focus:neon-border outline-none text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={changePassword}
                className="flex-1 px-4 py-3 rounded-xl gradient-primary text-white text-sm font-semibold hover:scale-[1.02] transition-transform"
              >
                حفظ كلمة المرور الجديدة
              </button>
              <button
                onClick={() => {
                  setChangingPassword(false);
                  setPasswordForm({ current: "", newPassword: "", confirm: "" });
                }}
                className="px-4 py-3 rounded-xl glass hover:bg-accent text-sm font-medium transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-accent/20">
      <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-muted-foreground mb-1">{label}</div>
        {children}
      </div>
    </div>
  );
}
