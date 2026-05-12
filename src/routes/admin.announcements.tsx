import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/i18n";
import { Modal, ModalInput, ModalSelect, ModalTextarea, BtnPrimary, BtnSecondary, SuccessToast } from "@/components/modal";
import { toast } from "sonner";
import {
  Megaphone, Plus, Pin, Eye, Edit, Trash2, Send, Users, Globe, Calendar,
  CheckCircle2, Clock, AlertTriangle, Info, Star
} from "lucide-react";

export const Route = createFileRoute("/admin/announcements")({
  component: AdminAnnouncementsPage,
});

const announcements = [
  { id: 1, titleAr: "بدء التسجيل للفصل الدراسي الجديد", titleEn: "New Semester Registration Open", contentAr: "يسر إدارة الجامعة الإعلان عن فتح باب التسجيل للفصل الدراسي الثاني. آخر موعد للتسجيل 30 أبريل.", contentEn: "The university administration announces the opening of registration for the second semester. Registration deadline: April 30.", audience: "all" as const, priority: "high" as const, pinned: true, date: "2026-04-20", reads: 18420, status: "published" as const },
  { id: 2, titleAr: "تحديث نظام الامتحانات الإلكترونية", titleEn: "Online Exam System Update", contentAr: "تم تحديث نظام الامتحانات الإلكترونية بمميزات جديدة تشمل مراقبة AI ونظام مضاد للغش.", contentEn: "The online exam system has been updated with new features including AI proctoring and anti-cheating.", audience: "students" as const, priority: "medium" as const, pinned: false, date: "2026-04-18", reads: 12350, status: "published" as const },
  { id: 3, titleAr: "ورشة عمل: الذكاء الاصطناعي في التعليم", titleEn: "Workshop: AI in Education", contentAr: "دعوة لحضور ورشة عمل عن تطبيقات الذكاء الاصطناعي في التعليم. السبت القادم الساعة 10 صباحاً.", contentEn: "Join our workshop on AI applications in education. Next Saturday at 10 AM.", audience: "instructors" as const, priority: "low" as const, pinned: false, date: "2026-04-16", reads: 3200, status: "published" as const },
  { id: 4, titleAr: "إعلان مهم: صيانة الخوادم", titleEn: "Important: Server Maintenance", contentAr: "سيتم إجراء صيانة مجدولة للخوادم يوم الجمعة من 2-6 صباحاً. قد تتأثر بعض الخدمات.", contentEn: "Scheduled server maintenance on Friday from 2-6 AM. Some services may be affected.", audience: "all" as const, priority: "high" as const, pinned: true, date: "2026-04-15", reads: 22100, status: "published" as const },
  { id: 5, titleAr: "مسابقة أفضل مشروع تخرج", titleEn: "Best Graduation Project Contest", contentAr: "شارك في مسابقة أفضل مشروع تخرج لعام 2026. الجائزة: 10,000 ج.م + فرصة تدريب.", contentEn: "Participate in the Best Graduation Project Contest 2026. Prize: 10,000 EGP + internship.", audience: "students" as const, priority: "medium" as const, pinned: false, date: "2026-04-12", reads: 8900, status: "draft" as const },
];

type AnnData = typeof announcements[0];

const priorityConfig = {
  high: { labelAr: "مهم", labelEn: "High", icon: AlertTriangle, color: "text-red-400 bg-red-500/10" },
  medium: { labelAr: "متوسط", labelEn: "Medium", icon: Info, color: "text-amber-400 bg-amber-500/10" },
  low: { labelAr: "منخفض", labelEn: "Low", icon: Star, color: "text-blue-400 bg-blue-500/10" },
};

const audienceConfig = {
  all: { labelAr: "الجميع", labelEn: "Everyone", icon: Globe },
  students: { labelAr: "الطلاب", labelEn: "Students", icon: Users },
  instructors: { labelAr: "المدربين", labelEn: "Instructors", icon: Users },
};

function AdminAnnouncementsPage() {
  const { lang } = useApp();
  const [filterAudience, setFilterAudience] = useState("all");
  const [newOpen, setNewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [current, setCurrent] = useState<AnnData | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const filtered = announcements.filter((a) => filterAudience === "all" || a.audience === filterAudience);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold"><span className="gradient-text">{lang === "ar" ? "الإعلانات والتنبيهات" : "Announcements"}</span></h1>
          <p className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "نشر وإدارة الإعلانات الجامعية" : "Publish and manage university announcements"}</p>
        </div>
        <button onClick={() => setNewOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold neon-glow hover:scale-105 transition-transform">
          <Plus className="h-4 w-4" /> {lang === "ar" ? "إعلان جديد" : "New Announcement"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Megaphone, label: lang === "ar" ? "إجمالي الإعلانات" : "Total", value: announcements.length, color: "text-purple-400" },
          { icon: Pin, label: lang === "ar" ? "مثبّتة" : "Pinned", value: announcements.filter((a) => a.pinned).length, color: "text-red-400" },
          { icon: Eye, label: lang === "ar" ? "إجمالي المشاهدات" : "Total Views", value: `${(announcements.reduce((a, ann) => a + ann.reads, 0) / 1000).toFixed(1)}K`, color: "text-blue-400" },
          { icon: Send, label: lang === "ar" ? "منشورة" : "Published", value: announcements.filter((a) => a.status === "published").length, color: "text-green-400" },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 flex items-center gap-3"><s.icon className={`h-8 w-8 ${s.color}`} /><div><div className="text-lg font-bold">{s.value}</div><div className="text-[10px] text-muted-foreground">{s.label}</div></div></div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["all", "students", "instructors"] as const).map((aud) => (
          <button key={aud} onClick={() => setFilterAudience(aud)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filterAudience === aud ? "gradient-primary text-white shadow-lg" : "glass hover:bg-accent"}`}>
            {aud === "all" ? (lang === "ar" ? "الجميع" : "All") : aud === "students" ? (lang === "ar" ? "الطلاب" : "Students") : (lang === "ar" ? "المدربين" : "Instructors")}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((ann) => {
          const priority = priorityConfig[ann.priority];
          const PriorityIcon = priority.icon;
          const audience = audienceConfig[ann.audience];
          const AudienceIcon = audience.icon;
          return (
            <div key={ann.id} className={`glass rounded-2xl p-6 hover-lift relative overflow-hidden ${ann.pinned ? "border border-primary/20" : ""}`}>
              {ann.pinned && (<div className="absolute top-0 end-0 px-3 py-1 rounded-bl-xl gradient-primary text-white text-[10px] font-bold flex items-center gap-1"><Pin className="h-3 w-3" /> {lang === "ar" ? "مثبّت" : "Pinned"}</div>)}
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => { setCurrent(ann); setViewOpen(true); }}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${priority.color}`}><PriorityIcon className="h-3 w-3" /> {lang === "ar" ? priority.labelAr : priority.labelEn}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/30 text-muted-foreground"><AudienceIcon className="h-3 w-3" /> {lang === "ar" ? audience.labelAr : audience.labelEn}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${ann.status === "published" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}>
                      {ann.status === "published" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {ann.status === "published" ? (lang === "ar" ? "منشور" : "Published") : (lang === "ar" ? "مسودة" : "Draft")}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-1">{lang === "ar" ? ann.titleAr : ann.titleEn}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{lang === "ar" ? ann.contentAr : ann.contentEn}</p>
                  <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {ann.date}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {ann.reads.toLocaleString()} {lang === "ar" ? "مشاهدة" : "views"}</span>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2">
                  <button onClick={() => { setCurrent(ann); setEditOpen(true); }} className="p-2 rounded-lg hover:bg-accent transition-colors"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => { setCurrent(ann); setDeleteOpen(true); }} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Announcement Modal */}
      <Modal open={newOpen} onClose={() => setNewOpen(false)} title={lang === "ar" ? "إعلان جديد" : "New Announcement"} size="lg"
        footer={<><BtnSecondary onClick={() => setNewOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><BtnPrimary onClick={() => { setNewOpen(false); showToast(lang === "ar" ? "تم نشر الإعلان بنجاح ✓" : "Announcement published ✓"); }}>{lang === "ar" ? "نشر" : "Publish"}</BtnPrimary></>}>
        <div className="space-y-4">
          <ModalInput label={lang === "ar" ? "العنوان" : "Title"} placeholder={lang === "ar" ? "عنوان الإعلان..." : "Announcement title..."} />
          <ModalTextarea label={lang === "ar" ? "المحتوى" : "Content"} placeholder={lang === "ar" ? "اكتب محتوى الإعلان هنا..." : "Write announcement content here..."} />
          <div className="grid sm:grid-cols-2 gap-4">
            <ModalSelect label={lang === "ar" ? "الجمهور المستهدف" : "Target Audience"}
              options={[{ value: "all", label: lang === "ar" ? "الجميع" : "Everyone" }, { value: "students", label: lang === "ar" ? "الطلاب" : "Students" }, { value: "instructors", label: lang === "ar" ? "المدربين" : "Instructors" }]} />
            <ModalSelect label={lang === "ar" ? "الأولوية" : "Priority"}
              options={[{ value: "high", label: lang === "ar" ? "مهم" : "High" }, { value: "medium", label: lang === "ar" ? "متوسط" : "Medium" }, { value: "low", label: lang === "ar" ? "منخفض" : "Low" }]} />
          </div>
        </div>
      </Modal>

      {/* View Announcement Modal */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title={lang === "ar" ? "تفاصيل الإعلان" : "Announcement Details"} size="md"
        footer={<BtnSecondary onClick={() => setViewOpen(false)}>{lang === "ar" ? "إغلاق" : "Close"}</BtnSecondary>}>
        {current && (
          <div>
            <h3 className="text-lg font-bold mb-3">{lang === "ar" ? current.titleAr : current.titleEn}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{lang === "ar" ? current.contentAr : current.contentEn}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-accent/20"><div className="text-[10px] text-muted-foreground">{lang === "ar" ? "التاريخ" : "Date"}</div><div className="text-sm font-semibold">{current.date}</div></div>
              <div className="p-3 rounded-xl bg-accent/20"><div className="text-[10px] text-muted-foreground">{lang === "ar" ? "المشاهدات" : "Views"}</div><div className="text-sm font-semibold">{current.reads.toLocaleString()}</div></div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={lang === "ar" ? "تعديل الإعلان" : "Edit Announcement"} size="lg"
        footer={<><BtnSecondary onClick={() => setEditOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><BtnPrimary onClick={() => { setEditOpen(false); showToast(lang === "ar" ? "تم تحديث الإعلان ✓" : "Announcement updated ✓"); }}>{lang === "ar" ? "حفظ" : "Save"}</BtnPrimary></>}>
        {current && (
          <div className="space-y-4">
            <ModalInput label={lang === "ar" ? "العنوان" : "Title"} defaultValue={lang === "ar" ? current.titleAr : current.titleEn} />
            <ModalTextarea label={lang === "ar" ? "المحتوى" : "Content"} defaultValue={lang === "ar" ? current.contentAr : current.contentEn} />
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title={lang === "ar" ? "حذف الإعلان" : "Delete Announcement"} size="sm"
        footer={<><BtnSecondary onClick={() => setDeleteOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><button onClick={() => { setDeleteOpen(false); showToast(lang === "ar" ? "تم حذف الإعلان ✓" : "Announcement deleted ✓"); }} className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">{lang === "ar" ? "حذف" : "Delete"}</button></>}>
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <p className="text-sm">{lang === "ar" ? "هل أنت متأكد من حذف هذا الإعلان؟" : "Are you sure you want to delete this announcement?"}</p>
          {current && <p className="font-bold mt-2">{lang === "ar" ? current.titleAr : current.titleEn}</p>}
        </div>
      </Modal>

      <SuccessToast message={toast} show={!!toast} />
    </div>
  );
}
