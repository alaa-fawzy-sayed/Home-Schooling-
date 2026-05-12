import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/i18n";
import { courses, departments } from "@/lib/mock-data";
import { Modal, ModalInput, ModalSelect, ModalTextarea, BtnPrimary, BtnSecondary, SuccessToast } from "@/components/modal";
import {
  Search, Plus, Star, Users, Clock, BookOpen, MoreVertical, Edit, Trash2, Eye,
  LayoutGrid, List, Filter, Download, TrendingUp, AlertTriangle
} from "lucide-react";

export const Route = createFileRoute("/admin/courses")({
  component: AdminCoursesPage,
});

type CourseData = typeof courses[0];

function AdminCoursesPage() {
  const { lang } = useApp();
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [actionMenu, setActionMenu] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState<CourseData | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };
  const openView = (c: CourseData) => { setCurrent(c); setViewOpen(true); setActionMenu(null); };
  const openEdit = (c: CourseData) => { setCurrent(c); setEditOpen(true); setActionMenu(null); };
  const openDelete = (c: CourseData) => { setCurrent(c); setDeleteOpen(true); setActionMenu(null); };

  const filtered = courses.filter((c) => {
    const matchSearch = c.titleAr.includes(search) || c.titleEn.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "all" || c.dept === filterDept;
    return matchSearch && matchDept;
  });

  const totalStudents = courses.reduce((a, c) => a + c.students, 0);
  const avgRating = (courses.reduce((a, c) => a + c.rating, 0) / courses.length).toFixed(1);
  const deptOptions = departments.map((d) => ({ value: d.id, label: lang === "ar" ? d.nameAr : d.nameEn }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold"><span className="gradient-text">{lang === "ar" ? "إدارة الكورسات" : "Course Management"}</span></h1>
          <p className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "إنشاء وتعديل وإدارة الكورسات" : "Create, edit, and manage courses"}</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold neon-glow hover:scale-105 transition-transform">
          <Plus className="h-4 w-4" /> {lang === "ar" ? "كورس جديد" : "New Course"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: lang === "ar" ? "إجمالي الكورسات" : "Total Courses", value: courses.length, color: "text-purple-400" },
          { icon: Users, label: lang === "ar" ? "إجمالي المشتركين" : "Total Enrolled", value: totalStudents.toLocaleString(), color: "text-blue-400" },
          { icon: Star, label: lang === "ar" ? "متوسط التقييم" : "Avg Rating", value: avgRating, color: "text-yellow-400" },
          { icon: TrendingUp, label: lang === "ar" ? "نسبة النمو" : "Growth", value: "+18.4%", color: "text-green-400" },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 flex items-center gap-3"><s.icon className={`h-8 w-8 ${s.color}`} /><div><div className="text-lg font-bold">{s.value}</div><div className="text-[10px] text-muted-foreground">{s.label}</div></div></div>
        ))}
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "بحث عن كورس أو مدرّب..." : "Search course or instructor..."}
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
            <div className="flex rounded-xl border border-border/50 overflow-hidden">
              <button onClick={() => setViewMode("grid")} className={`p-2.5 ${viewMode === "grid" ? "bg-primary text-white" : "bg-accent/30 hover:bg-accent"} transition-colors`}><LayoutGrid className="h-4 w-4" /></button>
              <button onClick={() => setViewMode("list")} className={`p-2.5 ${viewMode === "list" ? "bg-primary text-white" : "bg-accent/30 hover:bg-accent"} transition-colors`}><List className="h-4 w-4" /></button>
            </div>
            <button onClick={() => showToast(lang === "ar" ? "تم تصدير البيانات ✓" : "Data exported ✓")} className="p-2.5 rounded-xl bg-accent/30 border border-border/50 hover:bg-accent transition-colors"><Download className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((course) => {
            const dept = departments.find((d) => d.id === course.dept);
            return (
              <div key={course.id} className="glass rounded-2xl overflow-hidden hover-lift group relative">
                <div className="relative h-36 overflow-hidden">
                  <Link to="/courses/$courseId" params={{ courseId: course.id.toString() }} className="block w-full h-full">
                    <img src={course.thumb} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </Link>
                  {dept && <span className={`absolute top-3 start-3 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-gradient-to-r ${dept.color} text-white`}>{lang === "ar" ? dept.nameAr : dept.nameEn}</span>}
                  <div className="absolute top-3 end-3 relative">
                    <button onClick={() => setActionMenu(actionMenu === course.id ? null : course.id)} className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors"><MoreVertical className="h-4 w-4" /></button>
                    {actionMenu === course.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActionMenu(null)} />
                        <div className="absolute end-0 top-full mt-1 w-40 glass-strong rounded-xl p-1.5 z-20 shadow-2xl">
                          <button onClick={() => openView(course)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-xs"><Eye className="h-3.5 w-3.5" /> {lang === "ar" ? "عرض" : "View"}</button>
                          <button onClick={() => openEdit(course)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-xs"><Edit className="h-3.5 w-3.5" /> {lang === "ar" ? "تعديل" : "Edit"}</button>
                          <button onClick={() => openDelete(course)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 text-xs"><Trash2 className="h-3.5 w-3.5" /> {lang === "ar" ? "حذف" : "Delete"}</button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="absolute bottom-3 start-3 flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /><span className="text-white text-xs font-bold">{course.rating}</span></div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-1 line-clamp-1">{lang === "ar" ? course.titleAr : course.titleEn}</h3>
                  <p className="text-[10px] text-muted-foreground mb-3">{course.instructor}</p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.students}</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.lessons} {lang === "ar" ? "درس" : "lessons"}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.hours}h</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "الكورس" : "Course"}</th>
                <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">{lang === "ar" ? "المدرّب" : "Instructor"}</th>
                <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">{lang === "ar" ? "القسم" : "Dept"}</th>
                <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "الطلاب" : "Students"}</th>
                <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">{lang === "ar" ? "التقييم" : "Rating"}</th>
                <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => {
                const dept = departments.find((d) => d.id === course.dept);
                return (
                  <tr key={course.id} className="border-b border-border/30 hover:bg-accent/10 transition-colors">
                    <td className="p-4"><div className="flex items-center gap-3"><Link to="/courses/$courseId" params={{ courseId: course.id.toString() }} className="block shrink-0"><img src={course.thumb} alt="" className="h-12 w-16 rounded-lg object-cover" /></Link><div><div className="text-sm font-semibold">{lang === "ar" ? course.titleAr : course.titleEn}</div><div className="text-[10px] text-muted-foreground">{course.lessons} {lang === "ar" ? "درس" : "lessons"} · {course.hours}h</div></div></div></td>
                    <td className="p-4 text-sm hidden md:table-cell">{course.instructor}</td>
                    <td className="p-4 hidden lg:table-cell">{dept && <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold bg-gradient-to-r ${dept.color} text-white`}>{lang === "ar" ? dept.nameAr : dept.nameEn}</span>}</td>
                    <td className="p-4 text-sm font-semibold">{course.students.toLocaleString()}</td>
                    <td className="p-4 hidden md:table-cell"><div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /><span className="text-sm font-semibold">{course.rating}</span></div></td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openView(course)} className="p-2 rounded-lg hover:bg-accent"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => openEdit(course)} className="p-2 rounded-lg hover:bg-accent"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => openDelete(course)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center text-xs text-muted-foreground">{lang === "ar" ? `عرض ${filtered.length} من ${courses.length} كورس` : `Showing ${filtered.length} of ${courses.length} courses`}</div>

      {/* Add Course Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={lang === "ar" ? "كورس جديد" : "New Course"} size="lg"
        footer={<><BtnSecondary onClick={() => setAddOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><BtnPrimary onClick={() => { setAddOpen(false); showToast(lang === "ar" ? "تم إنشاء الكورس بنجاح ✓" : "Course created ✓"); }}>{lang === "ar" ? "إنشاء" : "Create"}</BtnPrimary></>}>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <ModalInput label={lang === "ar" ? "اسم الكورس (عربي)" : "Course Name (Arabic)"} placeholder={lang === "ar" ? "أدخل اسم الكورس" : "Enter course name"} />
            <ModalInput label={lang === "ar" ? "اسم الكورس (إنجليزي)" : "Course Name (English)"} placeholder="Enter course name" />
            <ModalSelect label={lang === "ar" ? "القسم" : "Department"} options={deptOptions} />
            <ModalInput label={lang === "ar" ? "المدرّب" : "Instructor"} placeholder={lang === "ar" ? "اسم المدرّب" : "Instructor name"} />
            <ModalInput label={lang === "ar" ? "عدد الدروس" : "Lessons"} type="number" placeholder="0" />
            <ModalInput label={lang === "ar" ? "عدد الساعات" : "Hours"} type="number" placeholder="0" />
          </div>
          <ModalTextarea label={lang === "ar" ? "وصف الكورس" : "Description"} placeholder={lang === "ar" ? "وصف مختصر للكورس..." : "Brief course description..."} />
        </div>
      </Modal>

      {/* View Course Modal */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title={lang === "ar" ? "تفاصيل الكورس" : "Course Details"} size="md"
        footer={<><BtnSecondary onClick={() => setViewOpen(false)}>{lang === "ar" ? "إغلاق" : "Close"}</BtnSecondary><BtnPrimary onClick={() => { setViewOpen(false); if (current) openEdit(current); }}>{lang === "ar" ? "تعديل" : "Edit"}</BtnPrimary></>}>
        {current && (() => {
          const dept = departments.find((d) => d.id === current.dept);
          return (
            <div>
              <img src={current.thumb} alt="" className="w-full h-40 rounded-xl object-cover mb-4" />
              <h3 className="text-lg font-bold mb-1">{lang === "ar" ? current.titleAr : current.titleEn}</h3>
              <p className="text-xs text-muted-foreground mb-4">{current.instructor}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: lang === "ar" ? "القسم" : "Dept", value: dept ? (lang === "ar" ? dept.nameAr : dept.nameEn) : "-" },
                  { label: lang === "ar" ? "التقييم" : "Rating", value: `⭐ ${current.rating}` },
                  { label: lang === "ar" ? "الطلاب" : "Students", value: current.students.toLocaleString() },
                  { label: lang === "ar" ? "الدروس" : "Lessons", value: `${current.lessons} (${current.hours}h)` },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-accent/20"><div className="text-[10px] text-muted-foreground mb-0.5">{item.label}</div><div className="text-sm font-semibold">{item.value}</div></div>
                ))}
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Edit Course Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={lang === "ar" ? "تعديل الكورس" : "Edit Course"} size="lg"
        footer={<><BtnSecondary onClick={() => setEditOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><BtnPrimary onClick={() => { setEditOpen(false); showToast(lang === "ar" ? "تم تحديث الكورس ✓" : "Course updated ✓"); }}>{lang === "ar" ? "حفظ" : "Save"}</BtnPrimary></>}>
        {current && (
          <div className="grid sm:grid-cols-2 gap-4">
            <ModalInput label={lang === "ar" ? "اسم الكورس (عربي)" : "Name (Arabic)"} defaultValue={current.titleAr} />
            <ModalInput label={lang === "ar" ? "اسم الكورس (إنجليزي)" : "Name (English)"} defaultValue={current.titleEn} />
            <ModalSelect label={lang === "ar" ? "القسم" : "Department"} defaultValue={current.dept} options={deptOptions} />
            <ModalInput label={lang === "ar" ? "المدرّب" : "Instructor"} defaultValue={current.instructor} />
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title={lang === "ar" ? "حذف الكورس" : "Delete Course"} size="sm"
        footer={<><BtnSecondary onClick={() => setDeleteOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><button onClick={() => { setDeleteOpen(false); showToast(lang === "ar" ? "تم حذف الكورس ✓" : "Course deleted ✓"); }} className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">{lang === "ar" ? "حذف" : "Delete"}</button></>}>
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <p className="text-sm">{lang === "ar" ? "هل أنت متأكد من حذف:" : "Are you sure you want to delete:"}</p>
          {current && <p className="font-bold text-lg mt-1">{lang === "ar" ? current.titleAr : current.titleEn}</p>}
          <p className="text-xs text-muted-foreground mt-2">{lang === "ar" ? "سيتم حذف جميع بيانات الكورس نهائياً" : "All course data will be permanently deleted"}</p>
        </div>
      </Modal>

      <SuccessToast message={toast} show={!!toast} />
    </div>
  );
}
