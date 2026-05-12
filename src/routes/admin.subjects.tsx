import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye, Grid, List, X, Save } from "lucide-react";
import { useApp } from "@/lib/i18n";
import { subjects as initialSubjects, departments, DeptId } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/subjects")({
  component: AdminSubjectsPage,
});

type SubjectType = typeof initialSubjects[0];

function AdminSubjectsPage() {
  const { lang } = useApp();
  
  // State for CRUD
  const [subjectsList, setSubjectsList] = useState<SubjectType[]>(initialSubjects);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [actionMenu, setActionMenu] = useState<number | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectType | null>(null);
  const [formData, setFormData] = useState<Partial<SubjectType>>({});

  const filtered = subjectsList.filter((s) => {
    const matchQ =
      s.titleAr.includes(searchQuery) ||
      s.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchD = selectedDept === "all" || s.dept === selectedDept;
    return matchQ && matchD;
  });

  const handleDelete = (id: number) => {
    if (confirm(lang === "ar" ? "هل أنت متأكد من حذف هذا المقرر؟" : "Are you sure you want to delete this subject?")) {
      setSubjectsList(prev => prev.filter(s => s.id !== id));
      setActionMenu(null);
    }
  };

  const openModal = (subject?: SubjectType) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData(subject);
    } else {
      setEditingSubject(null);
      setFormData({
        code: "",
        titleAr: "",
        titleEn: "",
        credits: 3,
        academicYear: 1,
        semester: 1,
        type: "major",
        dept: "computers",
        prerequisites: [],
      });
    }
    setIsModalOpen(true);
    setActionMenu(null);
  };

  const handleSave = () => {
    if (!formData.code || !formData.titleAr || !formData.titleEn) {
      alert(lang === "ar" ? "يرجى تعبئة الحقول الأساسية" : "Please fill required fields");
      return;
    }

    if (editingSubject) {
      setSubjectsList(prev => prev.map(s => s.id === editingSubject.id ? { ...s, ...formData } as SubjectType : s));
    } else {
      const newId = Math.max(...subjectsList.map(s => s.id), 0) + 1;
      setSubjectsList([{ ...formData, id: newId } as SubjectType, ...subjectsList]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
            {lang === "ar" ? "إدارة المقررات الجامعية" : "Academic Subjects Management"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lang === "ar"
              ? "إضافة وتعديل المقررات الدراسية الأساسية للكليات"
              : "Add and edit core academic subjects for faculties"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            <span>{lang === "ar" ? "مقرر جديد" : "New Subject"}</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={lang === "ar" ? "ابحث عن مقرر أو كود المادة..." : "Search subjects or codes..."}
            className="w-full bg-background/50 border border-border/50 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-background/50 rounded-xl p-1 border border-border/50">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "table" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
          <div className="relative flex-1 md:w-48">
            <Filter className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <select
              className="w-full bg-background/50 border border-border/50 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="all">{lang === "ar" ? "جميع الكليات" : "All Faculties"}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {lang === "ar" ? d.nameAr : d.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-accent/30 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold text-start">{lang === "ar" ? "كود واسم المادة" : "Code & Subject"}</th>
                  <th className="p-4 font-semibold text-start hidden md:table-cell">{lang === "ar" ? "الساعات" : "Credits"}</th>
                  <th className="p-4 font-semibold text-start hidden lg:table-cell">{lang === "ar" ? "الكلية" : "Faculty"}</th>
                  <th className="p-4 font-semibold text-start hidden sm:table-cell">{lang === "ar" ? "السنة / الفصل" : "Year / Sem"}</th>
                  <th className="p-4 font-semibold text-start">{lang === "ar" ? "النوع" : "Type"}</th>
                  <th className="p-4 font-semibold text-end"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filtered.map((subject) => {
                  const dept = departments.find((d) => d.id === subject.dept);
                  return (
                    <tr key={subject.id} className="border-b border-border/30 hover:bg-accent/10 transition-colors">
                      <td className="p-4">
                        <div>
                          <div className="text-sm font-bold flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-accent/50 px-1.5 rounded">{subject.code}</span>
                            {lang === "ar" ? subject.titleAr : subject.titleEn}
                          </div>
                          {subject.prerequisites && subject.prerequisites.length > 0 && (
                            <div className="text-[10px] text-red-400 mt-1">
                              {lang === "ar" ? "المتطلبات السابقة:" : "Prerequisites:"}{" "}
                              {subject.prerequisites.map(pid => subjectsList.find(s => s.id === pid)?.code).join(", ")}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-mono hidden md:table-cell">{subject.credits} CH</td>
                      <td className="p-4 hidden lg:table-cell">
                        {dept && (
                          <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold bg-gradient-to-r ${dept.color} text-white`}>
                            {lang === "ar" ? dept.nameAr : dept.nameEn}
                          </span>
                        )}
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        Y{subject.academicYear} - S{subject.semester}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          subject.type === "major" ? "bg-green-500/20 text-green-400" :
                          subject.type === "faculty" ? "bg-purple-500/20 text-purple-400" :
                          "bg-blue-500/20 text-blue-400"
                        }`}>
                          {subject.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-end relative">
                        <button
                          onClick={() => setActionMenu(actionMenu === subject.id ? null : subject.id)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {actionMenu === subject.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActionMenu(null)} />
                            <div className="absolute end-10 top-4 w-40 glass-strong rounded-xl p-1.5 z-20 shadow-2xl text-start">
                              <Link
                                to="/subjects/$subjectId"
                                params={{ subjectId: subject.id.toString() }}
                                className="w-full text-start px-3 py-2 text-sm rounded-lg hover:bg-accent text-foreground flex items-center gap-2 transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5" /> {lang === "ar" ? "معاينة المادة" : "Preview"}
                              </Link>
                              <button onClick={() => openModal(subject)} className="w-full text-start px-3 py-2 text-sm rounded-lg hover:bg-accent text-foreground flex items-center gap-2 transition-colors">
                                <Edit2 className="h-3.5 w-3.5" /> {lang === "ar" ? "تعديل" : "Edit"}
                              </button>
                              <button onClick={() => handleDelete(subject.id)} className="w-full text-start px-3 py-2 text-sm rounded-lg hover:bg-destructive/20 text-destructive flex items-center gap-2 transition-colors mt-1">
                                <Trash2 className="h-3.5 w-3.5" /> {lang === "ar" ? "حذف" : "Delete"}
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                {lang === "ar" ? "لم يتم العثور على مقررات مطابقة للبحث." : "No subjects found matching your search."}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((subject) => {
            const dept = departments.find((d) => d.id === subject.dept);
            return (
              <div key={subject.id} className="glass rounded-2xl p-5 hover-lift group relative border border-border/50 hover:border-primary/50 transition-all text-start">
                {dept && (
                  <span className={`absolute top-4 start-4 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-gradient-to-r ${dept.color} text-white`}>
                    {lang === "ar" ? dept.nameAr : dept.nameEn}
                  </span>
                )}
                <div className="absolute top-4 end-4 relative">
                  <button onClick={() => setActionMenu(actionMenu === subject.id ? null : subject.id)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {actionMenu === subject.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setActionMenu(null)} />
                      <div className="absolute end-0 top-full mt-1 w-40 glass-strong rounded-xl p-1.5 z-20 shadow-2xl">
                        <Link to="/subjects/$subjectId" params={{ subjectId: subject.id.toString() }} className="w-full text-start px-3 py-2 text-sm rounded-lg hover:bg-accent text-foreground flex items-center gap-2 transition-colors">
                          <Eye className="h-3.5 w-3.5" /> {lang === "ar" ? "معاينة" : "Preview"}
                        </Link>
                        <button onClick={() => openModal(subject)} className="w-full text-start px-3 py-2 text-sm rounded-lg hover:bg-accent text-foreground flex items-center gap-2 transition-colors">
                          <Edit2 className="h-3.5 w-3.5" /> {lang === "ar" ? "تعديل" : "Edit"}
                        </button>
                        <button onClick={() => handleDelete(subject.id)} className="w-full text-start px-3 py-2 text-sm rounded-lg hover:bg-destructive/20 text-destructive flex items-center gap-2 transition-colors mt-1">
                          <Trash2 className="h-3.5 w-3.5" /> {lang === "ar" ? "حذف" : "Delete"}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 mb-2">
                  <div className="flex gap-2 items-center mb-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                      subject.type === "major" ? "bg-green-500/20 text-green-400" :
                      subject.type === "faculty" ? "bg-purple-500/20 text-purple-400" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {subject.type.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground bg-accent/50 px-1.5 rounded">
                      {subject.code}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg leading-tight line-clamp-2">
                    {lang === "ar" ? subject.titleAr : subject.titleEn}
                  </h3>
                </div>

                <div className="flex justify-between items-center text-xs text-muted-foreground border-t border-border/50 pt-3 mt-4">
                  <span>{subject.credits} CH</span>
                  <span>Y{subject.academicYear} - S{subject.semester}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-strong rounded-3xl border border-white/10 w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">
                {editingSubject 
                  ? (lang === "ar" ? "تعديل بيانات المقرر" : "Edit Subject") 
                  : (lang === "ar" ? "إضافة مقرر جديد" : "Add New Subject")}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">{lang === "ar" ? "كود المادة" : "Subject Code"}</label>
                  <input type="text" value={formData.code || ""} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">{lang === "ar" ? "الكلية" : "Faculty"}</label>
                  <select value={formData.dept || "computers"} onChange={e => setFormData({...formData, dept: e.target.value as DeptId})} className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none appearance-none">
                    {departments.map(d => <option key={d.id} value={d.id}>{lang === "ar" ? d.nameAr : d.nameEn}</option>)}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">{lang === "ar" ? "اسم المادة (عربي)" : "Title (Arabic)"}</label>
                  <input type="text" value={formData.titleAr || ""} onChange={e => setFormData({...formData, titleAr: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">{lang === "ar" ? "اسم المادة (إنجليزي)" : "Title (English)"}</label>
                  <input type="text" value={formData.titleEn || ""} onChange={e => setFormData({...formData, titleEn: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">{lang === "ar" ? "نوع المتطلب" : "Subject Type"}</label>
                  <select value={formData.type || "major"} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none appearance-none">
                    <option value="major">{lang === "ar" ? "متطلب تخصص" : "Major Requirement"}</option>
                    <option value="faculty">{lang === "ar" ? "متطلب كلية" : "Faculty Requirement"}</option>
                    <option value="university">{lang === "ar" ? "متطلب جامعة" : "University Requirement"}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">{lang === "ar" ? "الساعات المعتمدة" : "Credits"}</label>
                  <input type="number" min="1" max="6" value={formData.credits || 3} onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})} className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">{lang === "ar" ? "السنة الدراسية" : "Academic Year"}</label>
                  <input type="number" min="1" max="7" value={formData.academicYear || 1} onChange={e => setFormData({...formData, academicYear: parseInt(e.target.value)})} className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">{lang === "ar" ? "الفصل الدراسي" : "Semester"}</label>
                  <input type="number" min="1" max="2" value={formData.semester || 1} onChange={e => setFormData({...formData, semester: parseInt(e.target.value)})} className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none" />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl bg-accent text-foreground font-bold hover:bg-accent/80 transition-colors">
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button onClick={handleSave} className="px-6 py-2 rounded-xl gradient-primary text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-primary/20">
                <Save className="h-4 w-4" /> {lang === "ar" ? "حفظ التغييرات" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
