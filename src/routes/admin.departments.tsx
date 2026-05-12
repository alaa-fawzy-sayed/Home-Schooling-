import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/i18n";
import { departments } from "@/lib/mock-data";
import { deptDistribution } from "@/lib/admin-data";
import { Modal, ModalInput, ModalTextarea, BtnPrimary, BtnSecondary, SuccessToast } from "@/components/modal";
import { Users, BookOpen, Edit, Settings, TrendingUp, Eye, Plus, FolderKanban } from "lucide-react";

export const Route = createFileRoute("/admin/departments")({
  component: AdminDepartmentsPage,
});

type DeptData = typeof departments[0];

function AdminDepartmentsPage() {
  const { lang } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState<DeptData | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };
  const openView = (d: DeptData) => { setCurrent(d); setViewOpen(true); };
  const openEdit = (d: DeptData) => { setCurrent(d); setEditOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold"><span className="gradient-text">{lang === "ar" ? "إدارة الأقسام" : "Department Management"}</span></h1>
          <p className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "عرض وإدارة أقسام الجامعة" : "View and manage university departments"}</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold neon-glow hover:scale-105 transition-transform">
          <Plus className="h-4 w-4" /> {lang === "ar" ? "إضافة قسم" : "Add Department"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 text-center"><div className="text-2xl font-bold gradient-text">{departments.length}</div><div className="text-xs text-muted-foreground">{lang === "ar" ? "أقسام" : "Departments"}</div></div>
        <div className="glass rounded-xl p-4 text-center"><div className="text-2xl font-bold gradient-text">{departments.reduce((a, d) => a + d.students, 0).toLocaleString()}</div><div className="text-xs text-muted-foreground">{lang === "ar" ? "إجمالي الطلاب" : "Total Students"}</div></div>
        <div className="glass rounded-xl p-4 text-center"><div className="text-2xl font-bold gradient-text">{departments.reduce((a, d) => a + d.courses, 0)}</div><div className="text-xs text-muted-foreground">{lang === "ar" ? "إجمالي الكورسات" : "Total Courses"}</div></div>
        <div className="glass rounded-xl p-4 text-center"><div className="text-2xl font-bold gradient-text">4</div><div className="text-xs text-muted-foreground">{lang === "ar" ? "كليات" : "Faculties"}</div></div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.map((dept, i) => {
          const dist = deptDistribution[i];
          return (
            <div key={dept.id} className="glass rounded-2xl p-5 hover-lift group relative overflow-hidden">
              <div className={`absolute -top-10 -end-10 w-32 h-32 rounded-full bg-gradient-to-br ${dept.color} opacity-10 blur-3xl group-hover:opacity-30 transition-opacity`} />
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${dept.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-base mb-1">{lang === "ar" ? dept.nameAr : dept.nameEn}</h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{lang === "ar" ? dept.descAr : dept.descEn}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-1 text-muted-foreground"><Users className="h-3 w-3" /> {lang === "ar" ? "الطلاب" : "Students"}</span><span className="font-semibold">{dept.students.toLocaleString()}</span></div>
                  <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-1 text-muted-foreground"><BookOpen className="h-3 w-3" /> {lang === "ar" ? "الكورسات" : "Courses"}</span><span className="font-semibold">{dept.courses}</span></div>
                  {dist && <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-1 text-muted-foreground"><TrendingUp className="h-3 w-3" /> {lang === "ar" ? "النسبة" : "Share"}</span><span className="font-semibold text-primary">{dist.percentage}%</span></div>}
                </div>
                {dist && <div className="h-1.5 bg-accent/30 rounded-full overflow-hidden mb-4"><div className={`h-full bg-gradient-to-r ${dept.color} rounded-full`} style={{ width: `${dist.percentage * 3.5}%` }} /></div>}
                <div className="flex gap-2">
                  <button onClick={() => openView(dept)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-accent/30 hover:bg-accent text-xs font-medium transition-colors"><Eye className="h-3.5 w-3.5" /> {lang === "ar" ? "عرض" : "View"}</button>
                  <button onClick={() => openEdit(dept)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-accent/30 hover:bg-accent text-xs font-medium transition-colors"><Edit className="h-3.5 w-3.5" /> {lang === "ar" ? "تعديل" : "Edit"}</button>
                  <button onClick={() => showToast(lang === "ar" ? "تم فتح الإعدادات ✓" : "Settings opened ✓")} className="p-2 rounded-xl bg-accent/30 hover:bg-accent transition-colors"><Settings className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Department Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={lang === "ar" ? "إضافة قسم جديد" : "Add New Department"} size="lg"
        footer={<><BtnSecondary onClick={() => setAddOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><BtnPrimary onClick={() => { setAddOpen(false); showToast(lang === "ar" ? "تم إضافة القسم بنجاح ✓" : "Department added ✓"); }}>{lang === "ar" ? "إضافة" : "Add"}</BtnPrimary></>}>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <ModalInput label={lang === "ar" ? "اسم القسم (عربي)" : "Name (Arabic)"} placeholder={lang === "ar" ? "مثال: علوم الحاسب" : "e.g. Computer Science"} />
            <ModalInput label={lang === "ar" ? "اسم القسم (إنجليزي)" : "Name (English)"} placeholder="e.g. Computer Science" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <ModalTextarea label={lang === "ar" ? "الوصف (عربي)" : "Description (Arabic)"} placeholder={lang === "ar" ? "وصف القسم..." : "Department description..."} />
            <ModalTextarea label={lang === "ar" ? "الوصف (إنجليزي)" : "Description (English)"} placeholder="Department description..." />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <ModalInput label={lang === "ar" ? "رئيس القسم" : "Department Head"} placeholder={lang === "ar" ? "اسم رئيس القسم" : "Head name"} />
            <ModalInput label={lang === "ar" ? "البريد الإلكتروني" : "Email"} type="email" placeholder="dept@nova.edu" />
          </div>
        </div>
      </Modal>

      {/* View Department Modal */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title={lang === "ar" ? "تفاصيل القسم" : "Department Details"} size="md"
        footer={<><BtnSecondary onClick={() => setViewOpen(false)}>{lang === "ar" ? "إغلاق" : "Close"}</BtnSecondary><BtnPrimary onClick={() => { setViewOpen(false); if (current) openEdit(current); }}>{lang === "ar" ? "تعديل" : "Edit"}</BtnPrimary></>}>
        {current && (() => {
          const dist = deptDistribution[departments.indexOf(current)];
          return (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${current.color} flex items-center justify-center shadow-lg`}><FolderKanban className="h-8 w-8 text-white" /></div>
                <div><h3 className="text-lg font-bold">{lang === "ar" ? current.nameAr : current.nameEn}</h3><p className="text-xs text-muted-foreground">{lang === "ar" ? current.descAr : current.descEn}</p></div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-accent/20 text-center"><div className="text-lg font-bold">{current.students.toLocaleString()}</div><div className="text-[10px] text-muted-foreground">{lang === "ar" ? "طلاب" : "Students"}</div></div>
                <div className="p-3 rounded-xl bg-accent/20 text-center"><div className="text-lg font-bold">{current.courses}</div><div className="text-[10px] text-muted-foreground">{lang === "ar" ? "كورسات" : "Courses"}</div></div>
                <div className="p-3 rounded-xl bg-accent/20 text-center"><div className="text-lg font-bold text-primary">{dist ? `${dist.percentage}%` : "-"}</div><div className="text-[10px] text-muted-foreground">{lang === "ar" ? "النسبة" : "Share"}</div></div>
              </div>
              {dist && <div className="h-2 bg-accent/30 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${current.color} rounded-full`} style={{ width: `${dist.percentage * 3.5}%` }} /></div>}
            </div>
          );
        })()}
      </Modal>

      {/* Edit Department Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={lang === "ar" ? "تعديل القسم" : "Edit Department"} size="lg"
        footer={<><BtnSecondary onClick={() => setEditOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><BtnPrimary onClick={() => { setEditOpen(false); showToast(lang === "ar" ? "تم تحديث القسم ✓" : "Department updated ✓"); }}>{lang === "ar" ? "حفظ" : "Save"}</BtnPrimary></>}>
        {current && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <ModalInput label={lang === "ar" ? "اسم القسم (عربي)" : "Name (Arabic)"} defaultValue={current.nameAr} />
              <ModalInput label={lang === "ar" ? "اسم القسم (إنجليزي)" : "Name (English)"} defaultValue={current.nameEn} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <ModalTextarea label={lang === "ar" ? "الوصف (عربي)" : "Description (Arabic)"} defaultValue={current.descAr} />
              <ModalTextarea label={lang === "ar" ? "الوصف (إنجليزي)" : "Description (English)"} defaultValue={current.descEn} />
            </div>
          </div>
        )}
      </Modal>

      <SuccessToast message={toast} show={!!toast} />
    </div>
  );
}
