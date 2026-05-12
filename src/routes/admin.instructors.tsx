import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/i18n";
import { instructors, allPermissions } from "@/lib/admin-data";
import { departments } from "@/lib/mock-data";
import { Modal, ModalInput, ModalSelect, BtnPrimary, BtnSecondary, SuccessToast } from "@/components/modal";
import {
  Search, UserPlus, Star, Users, BookOpen, DollarSign, Eye, Edit, Mail,
  Shield, CheckCircle2, XCircle, Clock, Download
} from "lucide-react";

export const Route = createFileRoute("/admin/instructors")({
  component: AdminInstructorsPage,
});

function AdminInstructorsPage() {
  const { lang } = useApp();
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const filtered = instructors.filter((inst) => {
    const matchSearch = inst.name.includes(search) || inst.nameEn.toLowerCase().includes(search.toLowerCase()) || inst.email.includes(search);
    const matchDept = filterDept === "all" || inst.dept === filterDept;
    const matchStatus = filterStatus === "all" || inst.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const activeCount = instructors.filter((i) => i.status === "active").length;
  const avgRating = (instructors.reduce((a, i) => a + i.rating, 0) / instructors.length).toFixed(1);
  const totalRevenue = instructors.reduce((a, i) => a + i.revenue, 0);

  const statusConfig = {
    active: { color: "bg-green-500/10 text-green-400 border-green-500/20", icon: CheckCircle2, label: lang === "ar" ? "نشط" : "Active" },
    inactive: { color: "bg-gray-500/10 text-gray-400 border-gray-500/20", icon: XCircle, label: lang === "ar" ? "غير نشط" : "Inactive" },
    pending: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: Clock, label: lang === "ar" ? "قيد المراجعة" : "Pending" },
  };

  const selected = selectedInstructor ? instructors.find((i) => i.id === selectedInstructor) : null;
  const deptOptions = departments.map((d) => ({ value: d.id, label: lang === "ar" ? d.nameAr : d.nameEn }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold"><span className="gradient-text">{lang === "ar" ? "إدارة أعضاء هيئة التدريس" : "Faculty Management"}</span></h1>
          <p className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "إدارة أعضاء هيئة التدريس وصلاحياتهم" : "Manage faculty members and their permissions"}</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold neon-glow hover:scale-105 transition-transform">
          <UserPlus className="h-4 w-4" /> {lang === "ar" ? "إضافة عضو هيئة تدريس" : "Add Faculty Member"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: lang === "ar" ? "إجمالي أعضاء هيئة التدريس" : "Total Faculty", value: instructors.length, color: "text-blue-400" },
          { icon: CheckCircle2, label: lang === "ar" ? "نشطين" : "Active", value: activeCount, color: "text-green-400" },
          { icon: Star, label: lang === "ar" ? "متوسط التقييم" : "Avg Rating", value: avgRating, color: "text-yellow-400" },
          { icon: DollarSign, label: lang === "ar" ? "إجمالي الإيرادات" : "Total Revenue", value: `${(totalRevenue / 1000).toFixed(0)}K`, color: "text-emerald-400" },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 flex items-center gap-3"><s.icon className={`h-8 w-8 ${s.color}`} /><div><div className="text-lg font-bold">{s.value}</div><div className="text-[10px] text-muted-foreground">{s.label}</div></div></div>
        ))}
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={lang === "ar" ? "بحث بالاسم أو الإيميل..." : "Search by name or email..."} className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none focus:border-primary transition-colors" />
          </div>
          <div className="flex gap-2">
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="px-4 py-2.5 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none appearance-none cursor-pointer min-w-[130px]">
              <option value="all">{lang === "ar" ? "كل الأقسام" : "All Depts"}</option>
              {departments.map((d) => (<option key={d.id} value={d.id}>{lang === "ar" ? d.nameAr : d.nameEn}</option>))}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none appearance-none cursor-pointer min-w-[120px]">
              <option value="all">{lang === "ar" ? "كل الحالات" : "All Status"}</option>
              <option value="active">{lang === "ar" ? "نشط" : "Active"}</option>
              <option value="inactive">{lang === "ar" ? "غير نشط" : "Inactive"}</option>
              <option value="pending">{lang === "ar" ? "قيد المراجعة" : "Pending"}</option>
            </select>
            <button onClick={() => showToast(lang === "ar" ? "تم تصدير البيانات ✓" : "Data exported ✓")} className="p-2.5 rounded-xl bg-accent/30 border border-border/50 hover:bg-accent"><Download className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {filtered.map((inst) => {
            const dept = departments.find((d) => d.id === inst.dept);
            const status = statusConfig[inst.status];
            const StatusIcon = status.icon;
            const isSelected = selectedInstructor === inst.id;
            return (
              <div key={inst.id} onClick={() => setSelectedInstructor(inst.id)} className={`glass rounded-2xl p-5 hover-lift cursor-pointer group relative overflow-hidden transition-all ${isSelected ? "ring-2 ring-primary shadow-lg shadow-primary/20" : ""}`}>
                <div className="absolute -top-8 -end-8 w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 blur-2xl group-hover:opacity-100 opacity-0 transition-opacity" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img src={inst.avatar} alt="" className="h-12 w-12 rounded-full neon-border bg-card" />
                      <div><div className="text-sm font-bold">{lang === "ar" ? inst.name : inst.nameEn}</div><div className="text-[10px] text-muted-foreground">{inst.email}</div></div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold border ${status.color}`}><StatusIcon className="h-2.5 w-2.5" /> {status.label}</span>
                  </div>
                  <div className="mb-3">
                    {dept && <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold bg-gradient-to-r ${dept.color} text-white me-1`}>{lang === "ar" ? dept.nameAr : dept.nameEn}</span>}
                    <span className="text-xs text-muted-foreground">{lang === "ar" ? inst.specialization : inst.specializationEn}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded-lg bg-accent/20"><BookOpen className="h-3.5 w-3.5 mx-auto text-purple-400 mb-0.5" /><div className="text-xs font-bold">{inst.courses}</div><div className="text-[8px] text-muted-foreground">{lang === "ar" ? "كورسات" : "Courses"}</div></div>
                    <div className="text-center p-2 rounded-lg bg-accent/20"><Users className="h-3.5 w-3.5 mx-auto text-blue-400 mb-0.5" /><div className="text-xs font-bold">{inst.students.toLocaleString()}</div><div className="text-[8px] text-muted-foreground">{lang === "ar" ? "طلاب" : "Students"}</div></div>
                    <div className="text-center p-2 rounded-lg bg-accent/20"><Star className="h-3.5 w-3.5 mx-auto text-yellow-400 mb-0.5" /><div className="text-xs font-bold">{inst.rating}</div><div className="text-[8px] text-muted-foreground">{lang === "ar" ? "تقييم" : "Rating"}</div></div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {inst.permissions.slice(0, 3).map((p) => { const perm = allPermissions.find((ap) => ap.id === p); return perm ? <span key={p} className="px-1.5 py-0.5 rounded text-[8px] bg-primary/10 text-primary font-medium">{lang === "ar" ? perm.nameAr : perm.nameEn}</span> : null; })}
                    {inst.permissions.length > 3 && <span className="px-1.5 py-0.5 rounded text-[8px] bg-accent/30 text-muted-foreground font-medium">+{inst.permissions.length - 3}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="glass rounded-2xl p-6 sticky top-20 h-fit">
          {selected ? (
            <>
              <div className="text-center mb-4">
                <img src={selected.avatar} alt="" className="h-20 w-20 rounded-full neon-border bg-card mx-auto mb-3" />
                <div className="font-bold text-lg">{lang === "ar" ? selected.name : selected.nameEn}</div>
                <div className="text-xs text-muted-foreground">{selected.email}</div>
                <div className="text-xs text-primary mt-1">{lang === "ar" ? selected.specialization : selected.specializationEn}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 rounded-xl bg-accent/20"><div className="text-lg font-bold">{selected.courses}</div><div className="text-[10px] text-muted-foreground">{lang === "ar" ? "كورسات" : "Courses"}</div></div>
                <div className="text-center p-3 rounded-xl bg-accent/20"><div className="text-lg font-bold">{selected.students.toLocaleString()}</div><div className="text-[10px] text-muted-foreground">{lang === "ar" ? "طلاب" : "Students"}</div></div>
                <div className="text-center p-3 rounded-xl bg-accent/20"><div className="text-lg font-bold text-yellow-400">⭐ {selected.rating}</div><div className="text-[10px] text-muted-foreground">{lang === "ar" ? "تقييم" : "Rating"}</div></div>
                <div className="text-center p-3 rounded-xl bg-accent/20"><div className="text-lg font-bold text-emerald-400">{(selected.revenue / 1000).toFixed(0)}K</div><div className="text-[10px] text-muted-foreground">{lang === "ar" ? "إيراد (ج.م)" : "Revenue"}</div></div>
              </div>
              <div>
                <h4 className="text-xs font-bold mb-2 flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-primary" />{lang === "ar" ? "الصلاحيات" : "Permissions"}</h4>
                <div className="space-y-1.5 max-h-48 overflow-auto">
                  {allPermissions.map((p) => {
                    const has = selected.permissions.includes(p.id);
                    return <div key={p.id} className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs ${has ? "bg-green-500/10" : "bg-accent/10 opacity-50"}`}><span>{lang === "ar" ? p.nameAr : p.nameEn}</span>{has ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <XCircle className="h-3.5 w-3.5 text-muted-foreground" />}</div>;
                  })}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => showToast(lang === "ar" ? "تم فتح محرر بيانات العضو ✓" : "Editing faculty member ✓")} className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl gradient-primary text-white text-xs font-semibold"><Edit className="h-3.5 w-3.5" /> {lang === "ar" ? "تعديل" : "Edit"}</button>
                <button onClick={() => showToast(lang === "ar" ? "تم إرسال رسالة ✓" : "Message sent ✓")} className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl bg-accent/30 hover:bg-accent text-xs font-medium transition-colors border border-border/30"><Mail className="h-3.5 w-3.5" /> {lang === "ar" ? "رسالة" : "Message"}</button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground"><Users className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="text-sm">{lang === "ar" ? "اختر عضو هيئة تدريس لعرض التفاصيل" : "Select a faculty member to view details"}</p></div>
          )}
        </div>
      </div>

      {/* Add Instructor Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={lang === "ar" ? "إضافة عضو هيئة تدريس جديد" : "Add New Faculty Member"} size="lg"
        footer={<><BtnSecondary onClick={() => setAddOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><BtnPrimary onClick={() => { setAddOpen(false); showToast(lang === "ar" ? "تم إضافة عضو هيئة التدريس بنجاح ✓" : "Faculty member added ✓"); }}>{lang === "ar" ? "إضافة" : "Add"}</BtnPrimary></>}>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <ModalInput label={lang === "ar" ? "الاسم الكامل (عربي)" : "Full Name (Arabic)"} placeholder={lang === "ar" ? "مثال: د. أحمد محمد" : "e.g. Dr. Ahmed Mohamed"} />
            <ModalInput label={lang === "ar" ? "الاسم الكامل (إنجليزي)" : "Full Name (English)"} placeholder="e.g. Dr. Ahmed Mohamed" />
            <ModalInput label={lang === "ar" ? "البريد الإلكتروني" : "Email"} type="email" placeholder="instructor@nova.edu" />
            <ModalSelect label={lang === "ar" ? "القسم" : "Department"} options={deptOptions} />
            <ModalInput label={lang === "ar" ? "التخصص (عربي)" : "Specialization (Arabic)"} placeholder={lang === "ar" ? "مثال: تطوير الويب" : "e.g. Web Dev"} />
            <ModalInput label={lang === "ar" ? "التخصص (إنجليزي)" : "Specialization (English)"} placeholder="e.g. Web Development" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">{lang === "ar" ? "الصلاحيات" : "Permissions"}</label>
            <div className="grid sm:grid-cols-2 gap-2 max-h-48 overflow-auto p-3 rounded-xl bg-accent/10 border border-border/30">
              {allPermissions.filter((p) => p.category !== "admin").map((p) => (
                <label key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent/20 cursor-pointer text-xs">
                  <input type="checkbox" className="rounded accent-primary" defaultChecked={["create_course", "edit_course", "upload_content", "grade_students"].includes(p.id)} />
                  {lang === "ar" ? p.nameAr : p.nameEn}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <SuccessToast message={toast} show={!!toast} />
    </div>
  );
}
