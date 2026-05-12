import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/i18n";
import { Modal, BtnPrimary, BtnSecondary } from "@/components/modal";
import { toast } from "sonner";
import {
  Settings, Globe, Moon, Sun, Bell, Shield, Database, Mail, Palette, Save,
  CheckCircle2, ToggleLeft, ToggleRight, Server, Key, CloudUpload, Trash2, AlertTriangle
} from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="relative">
      {enabled ? (
        <ToggleRight className="h-7 w-7 text-primary" />
      ) : (
        <ToggleLeft className="h-7 w-7 text-muted-foreground" />
      )}
    </button>
  );
}

function AdminSettingsPage() {
  const { lang, theme, toggleTheme } = useApp();
  const [saved, setSaved] = useState(false);
  const [clearCacheOpen, setClearCacheOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "E-Learning Nova University",
    siteEmail: "admin@nova.edu",
    enableRegistration: true,
    emailNotifications: true,
    maintenanceMode: false,
    twoFactorAuth: true,
    autoBackup: true,
    debugMode: false,
    maxUploadSize: "50",
    sessionTimeout: "30",
    defaultLanguage: "ar",
    allowGuestAccess: true,
  });

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    {
      title: lang === "ar" ? "إعدادات عامة" : "General Settings",
      icon: Settings,
      items: [
        {
          label: lang === "ar" ? "اسم الموقع" : "Site Name",
          desc: lang === "ar" ? "الاسم الذي يظهر في العنوان والبريد" : "Name shown in title and emails",
          type: "text" as const,
          key: "siteName",
        },
        {
          label: lang === "ar" ? "البريد الرسمي" : "Official Email",
          desc: lang === "ar" ? "البريد المستخدم للإشعارات والتواصل" : "Email used for notifications",
          type: "text" as const,
          key: "siteEmail",
        },
        {
          label: lang === "ar" ? "اللغة الافتراضية" : "Default Language",
          desc: lang === "ar" ? "اللغة التي تظهر للزوار الجدد" : "Language shown to new visitors",
          type: "select" as const,
          key: "defaultLanguage",
          options: [{ value: "ar", label: "العربية" }, { value: "en", label: "English" }],
        },
      ],
    },
    {
      title: lang === "ar" ? "الأمان والخصوصية" : "Security & Privacy",
      icon: Shield,
      items: [
        {
          label: lang === "ar" ? "التحقق الثنائي (2FA)" : "Two-Factor Auth (2FA)",
          desc: lang === "ar" ? "طبقة حماية إضافية عند تسجيل الدخول" : "Extra security layer on login",
          type: "toggle" as const,
          key: "twoFactorAuth",
        },
        {
          label: lang === "ar" ? "السماح بالتسجيل" : "Allow Registration",
          desc: lang === "ar" ? "السماح للطلاب الجدد بإنشاء حساب" : "Allow new students to sign up",
          type: "toggle" as const,
          key: "enableRegistration",
        },
        {
          label: lang === "ar" ? "وصول الزوار" : "Guest Access",
          desc: lang === "ar" ? "السماح بتصفح بعض المحتوى بدون تسجيل" : "Allow browsing some content without login",
          type: "toggle" as const,
          key: "allowGuestAccess",
        },
        {
          label: lang === "ar" ? "مهلة الجلسة (دقيقة)" : "Session Timeout (min)",
          desc: lang === "ar" ? "المدة قبل تسجيل الخروج التلقائي" : "Time before automatic logout",
          type: "text" as const,
          key: "sessionTimeout",
        },
      ],
    },
    {
      title: lang === "ar" ? "الإشعارات" : "Notifications",
      icon: Bell,
      items: [
        {
          label: lang === "ar" ? "إشعارات البريد" : "Email Notifications",
          desc: lang === "ar" ? "إرسال إشعارات عبر البريد الإلكتروني" : "Send notifications via email",
          type: "toggle" as const,
          key: "emailNotifications",
        },
      ],
    },
    {
      title: lang === "ar" ? "النظام والخادم" : "System & Server",
      icon: Server,
      items: [
        {
          label: lang === "ar" ? "النسخ الاحتياطي التلقائي" : "Auto Backup",
          desc: lang === "ar" ? "نسخ احتياطي يومي تلقائي للبيانات" : "Daily automatic data backup",
          type: "toggle" as const,
          key: "autoBackup",
        },
        {
          label: lang === "ar" ? "وضع الصيانة" : "Maintenance Mode",
          desc: lang === "ar" ? "إيقاف الموقع مؤقتًا للصيانة" : "Temporarily disable the site",
          type: "toggle" as const,
          key: "maintenanceMode",
        },
        {
          label: lang === "ar" ? "وضع التطوير" : "Debug Mode",
          desc: lang === "ar" ? "عرض تفاصيل الأخطاء للمطورين فقط" : "Show error details for developers",
          type: "toggle" as const,
          key: "debugMode",
        },
        {
          label: lang === "ar" ? "حد الرفع (ميجا)" : "Max Upload Size (MB)",
          desc: lang === "ar" ? "الحد الأقصى لحجم الملفات المرفوعة" : "Maximum file upload size",
          type: "text" as const,
          key: "maxUploadSize",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            <span className="gradient-text">{lang === "ar" ? "إعدادات النظام" : "System Settings"}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "ar" ? "تحكم كامل في إعدادات المنصة" : "Full control over platform settings"}
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold neon-glow hover:scale-105 transition-transform"
        >
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? (lang === "ar" ? "تم الحفظ ✓" : "Saved ✓") : (lang === "ar" ? "حفظ التغييرات" : "Save Changes")}
        </button>
      </div>

      {/* Theme Quick Toggle */}
      <div className="glass rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-sm">{lang === "ar" ? "مظهر الواجهة" : "Interface Theme"}</div>
            <div className="text-xs text-muted-foreground">
              {theme === "dark" ? (lang === "ar" ? "الوضع الداكن مفعّل" : "Dark mode enabled") : (lang === "ar" ? "الوضع الفاتح مفعّل" : "Light mode enabled")}
            </div>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/30 hover:bg-accent border border-border/30 transition-colors"
        >
          {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span className="text-sm font-medium">{theme === "dark" ? (lang === "ar" ? "داكن" : "Dark") : (lang === "ar" ? "فاتح" : "Light")}</span>
        </button>
      </div>

      {/* Settings Sections */}
      {sections.map((section) => {
        const SectionIcon = section.icon;
        return (
          <div key={section.title} className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/30 flex items-center gap-3">
              <SectionIcon className="h-5 w-5 text-primary" />
              <h2 className="font-bold">{section.title}</h2>
            </div>
            <div className="divide-y divide-border/20">
              {section.items.map((item) => (
                <div key={item.key} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                  {item.type === "toggle" ? (
                    <ToggleSwitch
                      enabled={settings[item.key as keyof typeof settings] as boolean}
                      onToggle={() => updateSetting(item.key, !(settings[item.key as keyof typeof settings] as boolean))}
                    />
                  ) : item.type === "select" ? (
                    <select
                      value={settings[item.key as keyof typeof settings] as string}
                      onChange={(e) => updateSetting(item.key, e.target.value)}
                      className="px-3 py-2 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none appearance-none cursor-pointer min-w-[120px]"
                    >
                      {item.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={settings[item.key as keyof typeof settings] as string}
                      onChange={(e) => updateSetting(item.key, e.target.value)}
                      className="px-3 py-2 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none focus:border-primary transition-colors w-48 text-end"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Danger Zone */}
      <div className="rounded-2xl border-2 border-red-500/30 bg-red-500/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-500/20 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <h2 className="font-bold text-red-400">{lang === "ar" ? "منطقة الخطر" : "Danger Zone"}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">{lang === "ar" ? "مسح ذاكرة التخزين المؤقت" : "Clear Cache"}</div>
              <div className="text-xs text-muted-foreground">{lang === "ar" ? "مسح جميع البيانات المؤقتة" : "Remove all cached data"}</div>
            </div>
            <button onClick={() => setClearCacheOpen(true)} className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors flex items-center gap-2">
              <Database className="h-4 w-4" /> {lang === "ar" ? "مسح" : "Clear"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">{lang === "ar" ? "إعادة تعيين النظام" : "Reset System"}</div>
              <div className="text-xs text-muted-foreground">{lang === "ar" ? "إعادة جميع الإعدادات للوضع الافتراضي" : "Reset all settings to defaults"}</div>
            </div>
            <button onClick={() => setResetOpen(true)} className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> {lang === "ar" ? "إعادة" : "Reset"}
            </button>
          </div>
        </div>
      </div>

      {/* Clear Cache Modal */}
      <Modal open={clearCacheOpen} onClose={() => setClearCacheOpen(false)} title={lang === "ar" ? "مسح ذاكرة التخزين" : "Clear Cache"} size="sm"
        footer={<><BtnSecondary onClick={() => setClearCacheOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><button onClick={() => { setClearCacheOpen(false); toast.success(lang === "ar" ? "تم مسح الكاش بنجاح ✓" : "Cache cleared ✓"); }} className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">{lang === "ar" ? "مسح" : "Clear"}</button></>}>
        <div className="text-center"><AlertTriangle className="h-16 w-16 text-amber-400 mx-auto mb-4" /><p className="text-sm">{lang === "ar" ? "هل أنت متأكد من مسح ذاكرة التخزين المؤقت؟" : "Clear all cached data?"}</p></div>
      </Modal>

      {/* Reset System Modal */}
      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title={lang === "ar" ? "إعادة تعيين النظام" : "Reset System"} size="sm"
        footer={<><BtnSecondary onClick={() => setResetOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><button onClick={() => { setResetOpen(false); toast.success(lang === "ar" ? "تم إعادة التعيين ✓" : "System reset ✓"); }} className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">{lang === "ar" ? "إعادة" : "Reset"}</button></>}>
        <div className="text-center"><AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" /><p className="text-sm">{lang === "ar" ? "سيتم إعادة جميع الإعدادات للوضع الافتراضي! لا يمكن التراجع." : "All settings will be reset to defaults! This cannot be undone."}</p></div>
      </Modal>

    </div>
  );
}
