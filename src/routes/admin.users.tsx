import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/i18n";
import { managedStudents } from "@/lib/admin-data";
import { departments } from "@/lib/mock-data";
import { Modal, ModalInput, ModalSelect, BtnPrimary, BtnSecondary } from "@/components/modal";
import {
  Search, Filter, UserPlus, MoreVertical, Eye, Edit, Trash2, Download,
  ChevronLeft, ChevronRight, Users, CheckCircle2, XCircle, Clock, GraduationCap, AlertTriangle
} from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

type StudentData = typeof managedStudents[0];

function AdminUsersPage() {
  const { lang } = useApp();
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  // Modal states
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSelectedOpen, setDeleteSelectedOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<StudentData | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formDept, setFormDept] = useState("programming");
  const [formLevel, setFormLevel] = useState("1");
  const [formGpa, setFormGpa] = useState("0.00");
  const [formStatus, setFormStatus] = useState("active");

  const resetForm = () => { setFormName(""); setFormEmail(""); setFormDept("programming"); setFormLevel("1"); setFormGpa("0.00"); setFormStatus("active"); };

  const openView = (s: StudentData) => { setCurrentStudent(s); setViewOpen(true); setActionMenu(null); };
  const openEdit = (s: StudentData) => {
    setCurrentStudent(s); setFormName(s.name); setFormEmail(s.email); setFormDept(s.dept);
    setFormLevel(String(s.level)); setFormGpa(s.gpa.toFixed(2)); setFormStatus(s.status);
    setEditOpen(true); setActionMenu(null);
  };
  const openDelete = (s: StudentData) => { setCurrentStudent(s); setDeleteOpen(true); setActionMenu(null); };

  const handleAdd = () => { setAddOpen(false); resetForm(); toast.success(lang === "ar" ? "تم إضافة الطالب بنجاح ✓" : "Student added successfully ✓"); };
  const handleEdit = () => { setEditOpen(false); toast.success(lang === "ar" ? "تم تحديث بيانات الطالب ✓" : "Student updated successfully ✓"); };
  const handleDelete = () => { setDeleteOpen(false); setCurrentStudent(null); toast.success(lang === "ar" ? "تم حذف الطالب ✓" : "Student deleted ✓"); };
  const handleDeleteSelected = () => { setDeleteSelectedOpen(false); setSelectedRows([]); toast.success(lang === "ar" ? `تم حذف ${selectedRows.length} طالب ✓` : `${selectedRows.length} students deleted ✓`); };
  const handleExport = () => { toast.success(lang === "ar" ? "تم تصدير البيانات بنجاح ✓" : "Data exported successfully ✓"); };

  const filtered = managedStudents.filter((s) => {
    const matchSearch = s.name.includes(search) || s.nameEn.toLowerCase().includes(search.toLowerCase()) || s.email.includes(search) || s.id.includes(search);
    const matchDept = filterDept === "all" || s.dept === filterDept;
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const toggleRow = (id: string) => setSelectedRows((p) => p.includes(id) ? p.filter((r) => r !== id) : [...p, id]);
  const toggleAll = () => setSelectedRows((p) => p.length === filtered.length ? [] : filtered.map((s) => s.id));

  const statusConfig = {
    active: { color: "bg-green-500/10 text-green-400 border-green-500/20", icon: CheckCircle2, label: lang === "ar" ? "نشط" : "Active" },
    suspended: { color: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle, label: lang === "ar" ? "موقوف" : "Suspended" },
    inactive: { color: "bg-gray-500/10 text-gray-400 border-gray-500/20", icon: Clock, label: lang === "ar" ? "غير نشط" : "Inactive" },
  };

  const totalActive = managedStudents.filter((s) => s.status === "active").length;
  const totalSuspended = managedStudents.filter((s) => s.status === "suspended").length;
  const avgGpa = (managedStudents.reduce((a, s) => a + s.gpa, 0) / managedStudents.length).toFixed(2);
  const deptOptions = departments.map((d) => ({ value: d.id, label: lang === "ar" ? d.nameAr : d.nameEn }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold"><span className="gradient-text">{lang === "ar" ? "إدارة الطلاب" : "Student Management"}</span></h1>
          <p className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "إدارة وتتبع جميع طلاب المنصة" : "Manage and track all platform students"}</p>
        </div>
        <button onClick={() => { resetForm(); setAddOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold neon-glow hover:scale-105 transition-transform">
          <UserPlus className="h-4 w-4" /> {lang === "ar" ? "إضافة طالب" : "Add Student"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: lang === "ar" ? "إجمالي الطلاب" : "Total Students", value: managedStudents.length, color: "text-blue-400" },
          { icon: CheckCircle2, label: lang === "ar" ? "طلاب نشطين" : "Active", value: totalActive, color: "text-green-400" },
          { icon: XCircle, label: lang === "ar" ? "موقوفين" : "Suspended", value: totalSuspended, color: "text-red-400" },
          { icon: GraduationCap, label: lang === "ar" ? "متوسط المعدل" : "Avg GPA", value: avgGpa, color: "text-purple-400" },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 flex items-center gap-3">
            <s.icon className={`h-8 w-8 ${s.color}`} /><div><div className="text-lg font-bold">{s.value}</div><div className="text-[10px] text-muted-foreground">{s.label}</div></div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "بحث بالاسم، الإيميل، أو الرقم..." : "Search by name, email, or ID..."}
              className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none focus:border-primary transition-colors" />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="ps-9 pe-4 py-2.5 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none appearance-none cursor-pointer min-w-[140px]">
                <option value="all">{lang === "ar" ? "كل الأقسام" : "All Depts"}</option>
                {departments.map((d) => (<option key={d.id} value={d.id}>{lang === "ar" ? d.nameAr : d.nameEn}</option>))}
              </select>
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none appearance-none cursor-pointer min-w-[120px]">
              <option value="all">{lang === "ar" ? "كل الحالات" : "All Status"}</option>
              <option value="active">{lang === "ar" ? "نشط" : "Active"}</option>
              <option value="suspended">{lang === "ar" ? "موقوف" : "Suspended"}</option>
              <option value="inactive">{lang === "ar" ? "غير نشط" : "Inactive"}</option>
            </select>
            <button onClick={handleExport} className="p-2.5 rounded-xl bg-accent/30 border border-border/50 hover:bg-accent transition-colors"><Download className="h-4 w-4" /></button>
          </div>
        </div>
        {selectedRows.length > 0 && (
          <div className="mt-3 flex items-center gap-3 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20">
            <span className="text-xs font-semibold text-primary">{selectedRows.length} {lang === "ar" ? "محدد" : "selected"}</span>
            <button onClick={() => setDeleteSelectedOpen(true)} className="text-xs text-red-400 hover:underline">{lang === "ar" ? "حذف المحدد" : "Delete Selected"}</button>
            <button onClick={handleExport} className="text-xs text-primary hover:underline">{lang === "ar" ? "تصدير" : "Export"}</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="p-4 text-start"><input type="checkbox" checked={selectedRows.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded accent-primary" /></th>
                <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "الطالب" : "Student"}</th>
                <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">{lang === "ar" ? "القسم" : "Department"}</th>
                <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">{lang === "ar" ? "المستوى" : "Level"}</th>
                <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">{lang === "ar" ? "المعدل" : "GPA"}</th>
                <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "الحالة" : "Status"}</th>
                <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => {
                const dept = departments.find((d) => d.id === student.dept);
                const status = statusConfig[student.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={student.id} className="border-b border-border/30 hover:bg-accent/10 transition-colors">
                    <td className="p-4"><input type="checkbox" checked={selectedRows.includes(student.id)} onChange={() => toggleRow(student.id)} className="rounded accent-primary" /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.email}`} alt="" className="h-10 w-10 rounded-full bg-card border border-border/50" />
                        <div>
                          <div className="text-sm font-semibold">{lang === "ar" ? student.name : student.nameEn}</div>
                          <div className="text-[10px] text-muted-foreground">{student.email}</div>
                          <div className="text-[10px] text-primary font-mono">{student.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">{dept && <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-semibold bg-gradient-to-r ${dept.color} text-white`}>{lang === "ar" ? dept.nameAr : dept.nameEn}</span>}</td>
                    <td className="p-4 hidden lg:table-cell"><span className="text-sm font-medium">{lang === "ar" ? `السنة ${student.level}` : `Year ${student.level}`}</span></td>
                    <td className="p-4 hidden lg:table-cell"><span className={`text-sm font-bold ${student.gpa >= 3.5 ? "text-green-400" : student.gpa >= 3.0 ? "text-yellow-400" : "text-red-400"}`}>{student.gpa.toFixed(2)}</span></td>
                    <td className="p-4"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border ${status.color}`}><StatusIcon className="h-3 w-3" />{status.label}</span></td>
                    <td className="p-4">
                      <div className="relative">
                        <button onClick={() => setActionMenu(actionMenu === student.id ? null : student.id)} className="p-2 rounded-lg hover:bg-accent transition-colors"><MoreVertical className="h-4 w-4" /></button>
                        {actionMenu === student.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActionMenu(null)} />
                            <div className="absolute end-0 top-full mt-1 w-44 glass-strong rounded-xl p-1.5 z-20 shadow-2xl border border-border/50">
                              <button onClick={() => openView(student)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-sm"><Eye className="h-3.5 w-3.5" /> {lang === "ar" ? "عرض الملف" : "View Profile"}</button>
                              <button onClick={() => openEdit(student)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-sm"><Edit className="h-3.5 w-3.5" /> {lang === "ar" ? "تعديل" : "Edit"}</button>
                              <button onClick={() => openDelete(student)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 text-sm"><Trash2 className="h-3.5 w-3.5" /> {lang === "ar" ? "حذف" : "Delete"}</button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-border/30">
          <span className="text-xs text-muted-foreground">{lang === "ar" ? `عرض ${filtered.length} من ${managedStudents.length} طالب` : `Showing ${filtered.length} of ${managedStudents.length} students`}</span>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-accent disabled:opacity-30"><ChevronRight className="h-4 w-4 rtl:rotate-180" /></button>
            <button className="w-8 h-8 rounded-lg gradient-primary text-white text-xs font-bold">1</button>
            <button className="w-8 h-8 rounded-lg hover:bg-accent text-xs">2</button>
            <button className="p-2 rounded-lg hover:bg-accent"><ChevronLeft className="h-4 w-4 rtl:rotate-180" /></button>
          </div>
        </div>
      </div>

      {/* === MODALS === */}

      {/* Add Student Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={lang === "ar" ? "إضافة طالب جديد" : "Add New Student"} size="lg"
        footer={<><BtnSecondary onClick={() => setAddOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><BtnPrimary onClick={handleAdd}>{lang === "ar" ? "إضافة الطالب" : "Add Student"}</BtnPrimary></>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <ModalInput label={lang === "ar" ? "الاسم الكامل" : "Full Name"} placeholder={lang === "ar" ? "أدخل اسم الطالب" : "Enter student name"} value={formName} onChange={(e) => setFormName(e.target.value)} />
          <ModalInput label={lang === "ar" ? "البريد الإلكتروني" : "Email"} type="email" placeholder="student@nova.edu" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
          <ModalSelect label={lang === "ar" ? "القسم" : "Department"} value={formDept} onChange={(e) => setFormDept(e.target.value)} options={deptOptions} />
          <ModalSelect label={lang === "ar" ? "المستوى" : "Level"} value={formLevel} onChange={(e) => setFormLevel(e.target.value)}
            options={[{ value: "1", label: lang === "ar" ? "السنة 1" : "Year 1" }, { value: "2", label: lang === "ar" ? "السنة 2" : "Year 2" }, { value: "3", label: lang === "ar" ? "السنة 3" : "Year 3" }, { value: "4", label: lang === "ar" ? "السنة 4" : "Year 4" }]} />
          <ModalInput label={lang === "ar" ? "المعدل التراكمي" : "GPA"} type="number" step="0.01" min="0" max="4" value={formGpa} onChange={(e) => setFormGpa(e.target.value)} />
          <ModalSelect label={lang === "ar" ? "الحالة" : "Status"} value={formStatus} onChange={(e) => setFormStatus(e.target.value)}
            options={[{ value: "active", label: lang === "ar" ? "نشط" : "Active" }, { value: "suspended", label: lang === "ar" ? "موقوف" : "Suspended" }, { value: "inactive", label: lang === "ar" ? "غير نشط" : "Inactive" }]} />
        </div>
      </Modal>

      {/* View Profile Modal */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title={lang === "ar" ? "ملف الطالب" : "Student Profile"} size="md"
        footer={<><BtnSecondary onClick={() => setViewOpen(false)}>{lang === "ar" ? "إغلاق" : "Close"}</BtnSecondary><BtnPrimary onClick={() => { setViewOpen(false); if (currentStudent) openEdit(currentStudent); }}>{lang === "ar" ? "تعديل" : "Edit"}</BtnPrimary></>}>
        {currentStudent && (() => {
          const dept = departments.find((d) => d.id === currentStudent.dept);
          return (
            <div className="text-center">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentStudent.email}`} alt="" className="h-24 w-24 rounded-full neon-border bg-card mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-0.5">{lang === "ar" ? currentStudent.name : currentStudent.nameEn}</h3>
              <p className="text-xs text-muted-foreground mb-1">{currentStudent.email}</p>
              <p className="text-xs text-primary font-mono mb-4">{currentStudent.id}</p>
              <div className="grid grid-cols-2 gap-3 text-start">
                {[
                  { label: lang === "ar" ? "القسم" : "Department", value: dept ? (lang === "ar" ? dept.nameAr : dept.nameEn) : "-" },
                  { label: lang === "ar" ? "المستوى" : "Level", value: lang === "ar" ? `السنة ${currentStudent.level}` : `Year ${currentStudent.level}` },
                  { label: lang === "ar" ? "المعدل" : "GPA", value: currentStudent.gpa.toFixed(2) },
                  { label: lang === "ar" ? "تاريخ الانضمام" : "Join Date", value: currentStudent.joinDate },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-accent/20">
                    <div className="text-[10px] text-muted-foreground mb-0.5">{item.label}</div>
                    <div className="text-sm font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Edit Student Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={lang === "ar" ? "تعديل بيانات الطالب" : "Edit Student"} size="lg"
        footer={<><BtnSecondary onClick={() => setEditOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><BtnPrimary onClick={handleEdit}>{lang === "ar" ? "حفظ التعديلات" : "Save Changes"}</BtnPrimary></>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <ModalInput label={lang === "ar" ? "الاسم الكامل" : "Full Name"} value={formName} onChange={(e) => setFormName(e.target.value)} />
          <ModalInput label={lang === "ar" ? "البريد الإلكتروني" : "Email"} type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
          <ModalSelect label={lang === "ar" ? "القسم" : "Department"} value={formDept} onChange={(e) => setFormDept(e.target.value)} options={deptOptions} />
          <ModalSelect label={lang === "ar" ? "المستوى" : "Level"} value={formLevel} onChange={(e) => setFormLevel(e.target.value)}
            options={[{ value: "1", label: lang === "ar" ? "السنة 1" : "Year 1" }, { value: "2", label: lang === "ar" ? "السنة 2" : "Year 2" }, { value: "3", label: lang === "ar" ? "السنة 3" : "Year 3" }, { value: "4", label: lang === "ar" ? "السنة 4" : "Year 4" }]} />
          <ModalInput label={lang === "ar" ? "المعدل التراكمي" : "GPA"} type="number" step="0.01" min="0" max="4" value={formGpa} onChange={(e) => setFormGpa(e.target.value)} />
          <ModalSelect label={lang === "ar" ? "الحالة" : "Status"} value={formStatus} onChange={(e) => setFormStatus(e.target.value)}
            options={[{ value: "active", label: lang === "ar" ? "نشط" : "Active" }, { value: "suspended", label: lang === "ar" ? "موقوف" : "Suspended" }, { value: "inactive", label: lang === "ar" ? "غير نشط" : "Inactive" }]} />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title={lang === "ar" ? "تأكيد الحذف" : "Confirm Delete"} size="sm"
        footer={<><BtnSecondary onClick={() => setDeleteOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><button onClick={handleDelete} className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">{lang === "ar" ? "حذف" : "Delete"}</button></>}>
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <p className="text-sm mb-1">{lang === "ar" ? "هل أنت متأكد من حذف الطالب:" : "Are you sure you want to delete:"}</p>
          <p className="font-bold text-lg">{currentStudent ? (lang === "ar" ? currentStudent.name : currentStudent.nameEn) : ""}</p>
          <p className="text-xs text-muted-foreground mt-2">{lang === "ar" ? "لا يمكن التراجع عن هذا الإجراء" : "This action cannot be undone"}</p>
        </div>
      </Modal>

      {/* Delete Selected Modal */}
      <Modal open={deleteSelectedOpen} onClose={() => setDeleteSelectedOpen(false)} title={lang === "ar" ? "حذف المحدد" : "Delete Selected"} size="sm"
        footer={<><BtnSecondary onClick={() => setDeleteSelectedOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><button onClick={handleDeleteSelected} className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">{lang === "ar" ? "حذف الكل" : "Delete All"}</button></>}>
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <p className="text-sm">{lang === "ar" ? `هل أنت متأكد من حذف ${selectedRows.length} طالب؟` : `Are you sure you want to delete ${selectedRows.length} students?`}</p>
          <p className="text-xs text-muted-foreground mt-2">{lang === "ar" ? "لا يمكن التراجع عن هذا الإجراء" : "This action cannot be undone"}</p>
        </div>
      </Modal>

    </div>
  );
}
