import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/i18n";
import { roles, allPermissions, instructors } from "@/lib/admin-data";
import { Modal, ModalInput, ModalSelect, BtnPrimary, BtnSecondary, SuccessToast } from "@/components/modal";
import {
  Shield, Users, CheckCircle2, XCircle, Edit, Plus, Key, Layers, BookOpen,
  Award, BarChart3, Settings, Save, Trash2, AlertTriangle, UserPlus, Lock,
  Eye, EyeOff, Copy, Mail
} from "lucide-react";

export const Route = createFileRoute("/admin/permissions")({
  component: AdminPermissionsPage,
});

const categoryConfig: Record<string, { icon: typeof Shield; label: string; labelEn: string; color: string }> = {
  courses: { icon: BookOpen, label: "الكورسات", labelEn: "Courses", color: "text-purple-400" },
  content: { icon: Layers, label: "المحتوى", labelEn: "Content", color: "text-blue-400" },
  students: { icon: Users, label: "الطلاب", labelEn: "Students", color: "text-cyan-400" },
  certificates: { icon: Award, label: "الشهادات", labelEn: "Certificates", color: "text-amber-400" },
  analytics: { icon: BarChart3, label: "التحليلات", labelEn: "Analytics", color: "text-emerald-400" },
  admin: { icon: Settings, label: "الإدارة", labelEn: "Administration", color: "text-red-400" },
};

// Simulated assigned users with credentials
const initialAssignedUsers = [
  { id: "AU001", instructorId: "I001", username: "dr.ahmed", password: "Nova@2026!", role: "instructor", permissions: ["create_course","edit_course","grade_students","view_analytics","upload_content","manage_assignments"], createdAt: "2026-01-15" },
  { id: "AU002", instructorId: "I002", username: "dr.sara", password: "Sara@Secure1", role: "instructor", permissions: ["create_course","edit_course","grade_students","view_analytics","upload_content","manage_assignments","issue_certificates"], createdAt: "2026-02-20" },
  { id: "AU003", instructorId: "I003", username: "eng.khaled", password: "Khaled@Cyber!", role: "instructor", permissions: ["create_course","edit_course","grade_students","upload_content","manage_assignments"], createdAt: "2026-03-10" },
  { id: "AU004", instructorId: "I006", username: "dr.hala", password: "Hala@Net2026", role: "admin", permissions: ["create_course","edit_course","grade_students","view_analytics","upload_content","manage_assignments","view_students","manage_students","issue_certificates","export_reports"], createdAt: "2026-01-20" },
];

function AdminPermissionsPage() {
  const { lang } = useApp();
  const [assignedUsers, setAssignedUsers] = useState(initialAssignedUsers);
  const [activeTab, setActiveTab] = useState<"users" | "roles" | "matrix">("users");
  const [assignOpen, setAssignOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [viewUserOpen, setViewUserOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  // Form state for assigning
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState("instructor");
  const [formPerms, setFormPerms] = useState<string[]>(["create_course", "edit_course", "upload_content", "grade_students"]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassInView, setShowPassInView] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };
  const categories = [...new Set(allPermissions.map((p) => p.category))];

  const togglePerm = (id: string) => {
    setFormPerms((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  };

  const toggleAllInCategory = (cat: string) => {
    const catPerms = allPermissions.filter((p) => p.category === cat).map((p) => p.id);
    const allEnabled = catPerms.every((p) => formPerms.includes(p));
    if (allEnabled) {
      setFormPerms((prev) => prev.filter((p) => !catPerms.includes(p)));
    } else {
      setFormPerms((prev) => [...new Set([...prev, ...catPerms])]);
    }
  };

  // Available instructors not yet assigned
  const assignedInstructorIds = assignedUsers.map((u) => u.instructorId);
  const availableInstructors = instructors.filter((i) => !assignedInstructorIds.includes(i.id));

  const resetForm = () => {
    setSelectedInstructor(""); setFormUsername(""); setFormPassword("");
    setFormRole("instructor"); setFormPerms(["create_course", "edit_course", "upload_content", "grade_students"]);
    setShowPassword(false);
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
    let pass = "";
    for (let i = 0; i < 12; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    setFormPassword(pass);
  };

  const handleSelectInstructor = (instId: string) => {
    setSelectedInstructor(instId);
    const inst = instructors.find((i) => i.id === instId);
    if (inst) {
      setFormUsername(inst.email.split("@")[0].replace(".", "_"));
      setFormPerms([...inst.permissions]);
    }
  };

  const handleAssign = () => {
    if (!selectedInstructor || !formUsername || !formPassword) return;
    const newUser = {
      id: `AU${String(assignedUsers.length + 1).padStart(3, "0")}`,
      instructorId: selectedInstructor,
      username: formUsername,
      password: formPassword,
      role: formRole,
      permissions: formPerms,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAssignedUsers((prev) => [...prev, newUser]);
    setAssignOpen(false);
    resetForm();
    showToast(lang === "ar" ? "تم تعيين الأستاذ وإنشاء حسابه بنجاح ✓" : "Professor assigned successfully ✓");
  };

  const handleEditUser = () => {
    if (!currentUserId) return;
    setAssignedUsers((prev) => prev.map((u) => u.id === currentUserId ? { ...u, username: formUsername, password: formPassword, role: formRole, permissions: formPerms } : u));
    setEditUserOpen(false);
    showToast(lang === "ar" ? "تم تحديث الصلاحيات بنجاح ✓" : "Permissions updated ✓");
  };

  const handleDeleteUser = () => {
    if (!currentUserId) return;
    setAssignedUsers((prev) => prev.filter((u) => u.id !== currentUserId));
    setDeleteUserOpen(false);
    setCurrentUserId(null);
    showToast(lang === "ar" ? "تم سحب الصلاحيات وحذف الحساب ✓" : "Access revoked ✓");
  };

  const openEditUser = (userId: string) => {
    const user = assignedUsers.find((u) => u.id === userId);
    if (!user) return;
    setCurrentUserId(userId);
    setFormUsername(user.username);
    setFormPassword(user.password);
    setFormRole(user.role);
    setFormPerms([...user.permissions]);
    setShowPassword(false);
    setEditUserOpen(true);
  };

  const openViewUser = (userId: string) => {
    setCurrentUserId(userId);
    setShowPassInView(false);
    setViewUserOpen(true);
  };

  const currentUser = currentUserId ? assignedUsers.find((u) => u.id === currentUserId) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold"><span className="gradient-text">{lang === "ar" ? "الأدوار والصلاحيات" : "Roles & Permissions"}</span></h1>
          <p className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "تعيين الأساتذة وتحديد صلاحياتهم ببيانات دخول خاصة" : "Assign professors with login credentials and specific permissions"}</p>
        </div>
        <button onClick={() => { resetForm(); setAssignOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold neon-glow hover:scale-105 transition-transform">
          <UserPlus className="h-4 w-4" /> {lang === "ar" ? "تعيين أستاذ" : "Assign Professor"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: lang === "ar" ? "أساتذة معيّنين" : "Assigned", value: assignedUsers.length, color: "text-blue-400" },
          { icon: Shield, label: lang === "ar" ? "أدوار" : "Roles", value: roles.length, color: "text-purple-400" },
          { icon: Key, label: lang === "ar" ? "صلاحيات" : "Permissions", value: allPermissions.length, color: "text-amber-400" },
          { icon: CheckCircle2, label: lang === "ar" ? "متاح للتعيين" : "Available", value: availableInstructors.length, color: "text-green-400" },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 flex items-center gap-3"><s.icon className={`h-8 w-8 ${s.color}`} /><div><div className="text-lg font-bold">{s.value}</div><div className="text-[10px] text-muted-foreground">{s.label}</div></div></div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: "users" as const, label: lang === "ar" ? "الأساتذة المعيّنين" : "Assigned Professors" },
          { id: "roles" as const, label: lang === "ar" ? "الأدوار" : "Roles" },
          { id: "matrix" as const, label: lang === "ar" ? "مصفوفة المقارنة" : "Comparison Matrix" },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === tab.id ? "gradient-primary text-white shadow-lg" : "glass hover:bg-accent"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Assigned Users */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {assignedUsers.map((aUser) => {
            const inst = instructors.find((i) => i.id === aUser.instructorId);
            if (!inst) return null;
            const role = roles.find((r) => r.id === aUser.role);
            return (
              <div key={aUser.id} className="glass rounded-2xl p-5 hover-lift">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <img src={inst.avatar} alt="" className="h-14 w-14 rounded-full neon-border bg-card" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold">{lang === "ar" ? inst.name : inst.nameEn}</span>
                        {role && <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold text-white bg-gradient-to-r ${role.color}`}>{lang === "ar" ? role.nameAr : role.nameEn}</span>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{inst.email}</div>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Key className="h-3 w-3 text-primary" /> {lang === "ar" ? "يوزر:" : "User:"} <code className="font-mono text-foreground bg-accent/30 px-1 rounded">{aUser.username}</code></span>
                        <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> •••••••</span>
                        <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> {aUser.permissions.length} {lang === "ar" ? "صلاحية" : "perms"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 flex-1">
                    {aUser.permissions.slice(0, 4).map((pId) => {
                      const p = allPermissions.find((ap) => ap.id === pId);
                      return p ? <span key={pId} className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">{lang === "ar" ? p.nameAr : p.nameEn}</span> : null;
                    })}
                    {aUser.permissions.length > 4 && <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-accent/30 text-muted-foreground">+{aUser.permissions.length - 4}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openViewUser(aUser.id)} className="p-2 rounded-lg hover:bg-accent transition-colors"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => openEditUser(aUser.id)} className="p-2 rounded-lg hover:bg-accent transition-colors"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => { setCurrentUserId(aUser.id); setDeleteUserOpen(true); }} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
          {assignedUsers.length === 0 && (
            <div className="glass rounded-2xl p-12 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">{lang === "ar" ? "لم يتم تعيين أي أستاذ بعد" : "No professors assigned yet"}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Roles */}
      {activeTab === "roles" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => (
            <div key={role.id} className="glass rounded-2xl p-5 hover-lift">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg mb-3`}><Shield className="h-6 w-6 text-white" /></div>
              <div className="font-bold mb-0.5">{lang === "ar" ? role.nameAr : role.nameEn}</div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {role.usersCount}</span>
                <span className="flex items-center gap-1"><Key className="h-3 w-3" /> {role.permissions.length}/{allPermissions.length}</span>
              </div>
              <div className="h-1.5 bg-accent/30 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${role.color} rounded-full`} style={{ width: `${(role.permissions.length / allPermissions.length) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Matrix */}
      {activeTab === "matrix" && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "الصلاحية" : "Permission"}</th>
                  {roles.map((r) => (<th key={r.id} className="p-4 text-center text-xs font-semibold"><span className={`inline-block px-2 py-1 rounded-lg text-white bg-gradient-to-r ${r.color}`}>{lang === "ar" ? r.nameAr : r.nameEn}</span></th>))}
                </tr>
              </thead>
              <tbody>
                {allPermissions.map((perm) => (
                  <tr key={perm.id} className="border-b border-border/10 hover:bg-accent/5">
                    <td className="p-4 text-sm">{lang === "ar" ? perm.nameAr : perm.nameEn}</td>
                    {roles.map((r) => (<td key={r.id} className="p-4 text-center">{r.permissions.includes(perm.id) ? <CheckCircle2 className="h-5 w-5 text-green-400 mx-auto" /> : <XCircle className="h-5 w-5 text-muted-foreground/30 mx-auto" />}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === MODALS === */}

      {/* Assign Instructor Modal */}
      <Modal open={assignOpen} onClose={() => setAssignOpen(false)} title={lang === "ar" ? "تعيين أستاذ جديد" : "Assign New Professor"} size="xl"
        footer={<><BtnSecondary onClick={() => setAssignOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><BtnPrimary onClick={handleAssign} disabled={!selectedInstructor || !formUsername || !formPassword}>{lang === "ar" ? "تعيين وإنشاء حساب" : "Assign & Create Account"}</BtnPrimary></>}>
        <div className="space-y-5">
          {/* Step 1: Select Instructor */}
          <div>
            <label className="text-xs font-bold text-primary mb-2 block flex items-center gap-1"><span className="w-5 h-5 rounded-full gradient-primary text-white text-[10px] flex items-center justify-center font-bold">1</span> {lang === "ar" ? "اختر الأستاذ" : "Select Professor"}</label>
            {availableInstructors.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-2 max-h-40 overflow-auto p-2 rounded-xl bg-accent/10 border border-border/30">
                {availableInstructors.map((inst) => (
                  <button key={inst.id} type="button" onClick={() => handleSelectInstructor(inst.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-start transition-all ${selectedInstructor === inst.id ? "bg-primary/10 ring-2 ring-primary" : "hover:bg-accent/30"}`}>
                    <img src={inst.avatar} alt="" className="h-9 w-9 rounded-full bg-card" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{lang === "ar" ? inst.name : inst.nameEn}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{lang === "ar" ? inst.specialization : inst.specializationEn}</div>
                    </div>
                    {selectedInstructor === inst.id && <CheckCircle2 className="h-4 w-4 text-primary ms-auto flex-shrink-0" />}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-accent/10 text-center text-xs text-muted-foreground">{lang === "ar" ? "جميع الأساتذة تم تعيينهم بالفعل" : "All professors are already assigned"}</div>
            )}
          </div>

          {/* Step 2: Credentials */}
          <div>
            <label className="text-xs font-bold text-primary mb-2 block flex items-center gap-1"><span className="w-5 h-5 rounded-full gradient-primary text-white text-[10px] flex items-center justify-center font-bold">2</span> {lang === "ar" ? "بيانات الدخول" : "Login Credentials"}</label>
            <div className="grid sm:grid-cols-3 gap-3">
              <ModalInput label={lang === "ar" ? "اسم المستخدم" : "Username"} value={formUsername} onChange={(e) => setFormUsername(e.target.value)} placeholder="username" />
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{lang === "ar" ? "كلمة المرور" : "Password"}</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="••••••••"
                    className="w-full px-4 py-2.5 pe-20 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"  />
                  <div className="absolute end-1 top-1/2 -translate-y-1/2 flex gap-0.5">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1.5 rounded-lg hover:bg-accent">{showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>
                    <button type="button" onClick={generatePassword} className="p-1.5 rounded-lg hover:bg-accent text-primary"><Key className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
              <ModalSelect label={lang === "ar" ? "الدور" : "Role"} value={formRole} onChange={(e) => setFormRole(e.target.value)}
                options={roles.map((r) => ({ value: r.id, label: lang === "ar" ? r.nameAr : r.nameEn }))} />
            </div>
          </div>

          {/* Step 3: Permissions */}
          <div>
            <label className="text-xs font-bold text-primary mb-2 block flex items-center gap-1"><span className="w-5 h-5 rounded-full gradient-primary text-white text-[10px] flex items-center justify-center font-bold">3</span> {lang === "ar" ? "تحديد الصلاحيات" : "Set Permissions"} <span className="text-[10px] text-muted-foreground font-normal ms-1">({formPerms.length}/{allPermissions.length})</span></label>
            <div className="space-y-3 max-h-56 overflow-auto p-3 rounded-xl bg-accent/10 border border-border/30">
              {categories.map((cat) => {
                const config = categoryConfig[cat];
                const Icon = config.icon;
                const perms = allPermissions.filter((p) => p.category === cat);
                const allChecked = perms.every((p) => formPerms.includes(p.id));
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                      <span className="text-xs font-bold">{lang === "ar" ? config.label : config.labelEn}</span>
                      <button type="button" onClick={() => toggleAllInCategory(cat)} className={`ms-auto text-[9px] px-2 py-0.5 rounded-full ${allChecked ? "bg-green-500/10 text-green-400" : "bg-accent/30 text-muted-foreground"}`}>
                        {allChecked ? (lang === "ar" ? "إلغاء الكل" : "Uncheck All") : (lang === "ar" ? "تحديد الكل" : "Check All")}
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-1">
                      {perms.map((p) => (
                        <label key={p.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-xs transition-colors ${formPerms.includes(p.id) ? "bg-green-500/10 border border-green-500/20" : "hover:bg-accent/20 border border-transparent"}`}>
                          <input type="checkbox" checked={formPerms.includes(p.id)} onChange={() => togglePerm(p.id)} className="rounded accent-primary" />
                          {lang === "ar" ? p.nameAr : p.nameEn}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>

      {/* View User Modal */}
      <Modal open={viewUserOpen} onClose={() => setViewUserOpen(false)} title={lang === "ar" ? "تفاصيل الحساب" : "Account Details"} size="md"
        footer={<><BtnSecondary onClick={() => setViewUserOpen(false)}>{lang === "ar" ? "إغلاق" : "Close"}</BtnSecondary><BtnPrimary onClick={() => { setViewUserOpen(false); if (currentUserId) openEditUser(currentUserId); }}>{lang === "ar" ? "تعديل" : "Edit"}</BtnPrimary></>}>
        {currentUser && (() => {
          const inst = instructors.find((i) => i.id === currentUser.instructorId);
          const role = roles.find((r) => r.id === currentUser.role);
          if (!inst) return null;
          return (
            <div>
              <div className="flex items-center gap-4 mb-5">
                <img src={inst.avatar} alt="" className="h-16 w-16 rounded-full neon-border bg-card" />
                <div>
                  <div className="font-bold text-lg">{lang === "ar" ? inst.name : inst.nameEn}</div>
                  <div className="text-xs text-muted-foreground">{inst.email}</div>
                  {role && <span className={`inline-block mt-1 px-2 py-0.5 rounded-lg text-[10px] font-bold text-white bg-gradient-to-r ${role.color}`}>{lang === "ar" ? role.nameAr : role.nameEn}</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 rounded-xl bg-accent/20">
                  <div className="text-[10px] text-muted-foreground mb-0.5">{lang === "ar" ? "اسم المستخدم" : "Username"}</div>
                  <div className="text-sm font-mono font-bold flex items-center gap-2">{currentUser.username} <button onClick={() => { navigator.clipboard.writeText(currentUser.username); showToast(lang === "ar" ? "تم نسخ اليوزر ✓" : "Username copied ✓"); }}><Copy className="h-3 w-3 text-primary" /></button></div>
                </div>
                <div className="p-3 rounded-xl bg-accent/20">
                  <div className="text-[10px] text-muted-foreground mb-0.5">{lang === "ar" ? "كلمة المرور" : "Password"}</div>
                  <div className="text-sm font-mono font-bold flex items-center gap-2">
                    {showPassInView ? currentUser.password : "••••••••"}
                    <button onClick={() => setShowPassInView(!showPassInView)}>{showPassInView ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}</button>
                    <button onClick={() => { navigator.clipboard.writeText(currentUser.password); showToast(lang === "ar" ? "تم نسخ الباسورد ✓" : "Password copied ✓"); }}><Copy className="h-3 w-3 text-primary" /></button>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold mb-2 flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-primary" /> {lang === "ar" ? "الصلاحيات المحددة" : "Assigned Permissions"} ({currentUser.permissions.length})</h4>
                <div className="grid sm:grid-cols-2 gap-1.5">
                  {allPermissions.map((p) => {
                    const has = currentUser.permissions.includes(p.id);
                    return (
                      <div key={p.id} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs ${has ? "bg-green-500/10 border border-green-500/20" : "bg-accent/5 border border-border/10 opacity-40"}`}>
                        <span>{lang === "ar" ? p.nameAr : p.nameEn}</span>
                        {has ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <XCircle className="h-3.5 w-3.5 text-muted-foreground" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Edit User Modal */}
      <Modal open={editUserOpen} onClose={() => setEditUserOpen(false)} title={lang === "ar" ? "تعديل الصلاحيات" : "Edit Permissions"} size="xl"
        footer={<><BtnSecondary onClick={() => setEditUserOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><BtnPrimary onClick={handleEditUser}>{lang === "ar" ? "حفظ التعديلات" : "Save Changes"}</BtnPrimary></>}>
        {currentUser && (() => {
          const inst = instructors.find((i) => i.id === currentUser.instructorId);
          if (!inst) return null;
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/20">
                <img src={inst.avatar} alt="" className="h-10 w-10 rounded-full bg-card" />
                <div><div className="text-sm font-bold">{lang === "ar" ? inst.name : inst.nameEn}</div><div className="text-[10px] text-muted-foreground">{inst.email}</div></div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <ModalInput label={lang === "ar" ? "اسم المستخدم" : "Username"} value={formUsername} onChange={(e) => setFormUsername(e.target.value)} />
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{lang === "ar" ? "كلمة المرور" : "Password"}</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={formPassword} onChange={(e) => setFormPassword(e.target.value)}
                      className="w-full px-4 py-2.5 pe-16 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none focus:border-primary" />
                    <div className="absolute end-1 top-1/2 -translate-y-1/2 flex gap-0.5">
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1.5 rounded-lg hover:bg-accent">{showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>
                      <button type="button" onClick={generatePassword} className="p-1.5 rounded-lg hover:bg-accent text-primary"><Key className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>
                <ModalSelect label={lang === "ar" ? "الدور" : "Role"} value={formRole} onChange={(e) => setFormRole(e.target.value)}
                  options={roles.map((r) => ({ value: r.id, label: lang === "ar" ? r.nameAr : r.nameEn }))} />
              </div>
              <div>
                <label className="text-xs font-bold mb-2 block">{lang === "ar" ? "الصلاحيات" : "Permissions"} ({formPerms.length}/{allPermissions.length})</label>
                <div className="space-y-3 max-h-52 overflow-auto p-3 rounded-xl bg-accent/10 border border-border/30">
                  {categories.map((cat) => {
                    const config = categoryConfig[cat];
                    const Icon = config.icon;
                    const perms = allPermissions.filter((p) => p.category === cat);
                    const allChecked = perms.every((p) => formPerms.includes(p.id));
                    return (
                      <div key={cat}>
                        <div className="flex items-center gap-2 mb-1"><Icon className={`h-3.5 w-3.5 ${config.color}`} /><span className="text-xs font-bold">{lang === "ar" ? config.label : config.labelEn}</span><button type="button" onClick={() => toggleAllInCategory(cat)} className={`ms-auto text-[9px] px-2 py-0.5 rounded-full ${allChecked ? "bg-green-500/10 text-green-400" : "bg-accent/30 text-muted-foreground"}`}>{allChecked ? "✓" : (lang === "ar" ? "الكل" : "All")}</button></div>
                        <div className="grid sm:grid-cols-2 gap-1">
                          {perms.map((p) => (
                            <label key={p.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-xs transition-colors ${formPerms.includes(p.id) ? "bg-green-500/10 border border-green-500/20" : "hover:bg-accent/20 border border-transparent"}`}>
                              <input type="checkbox" checked={formPerms.includes(p.id)} onChange={() => togglePerm(p.id)} className="rounded accent-primary" />
                              {lang === "ar" ? p.nameAr : p.nameEn}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={deleteUserOpen} onClose={() => setDeleteUserOpen(false)} title={lang === "ar" ? "سحب الصلاحيات" : "Revoke Access"} size="sm"
        footer={<><BtnSecondary onClick={() => setDeleteUserOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><button onClick={handleDeleteUser} className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">{lang === "ar" ? "سحب" : "Revoke"}</button></>}>
        {currentUser && (() => {
          const inst = instructors.find((i) => i.id === currentUser.instructorId);
          return (
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <p className="text-sm">{lang === "ar" ? "هل أنت متأكد من سحب صلاحيات:" : "Revoke access for:"}</p>
              <p className="font-bold text-lg mt-1">{inst ? (lang === "ar" ? inst.name : inst.nameEn) : ""}</p>
              <p className="text-xs text-muted-foreground mt-2">{lang === "ar" ? "سيتم حذف حساب المستخدم وجميع الصلاحيات" : "The user account and all permissions will be deleted"}</p>
            </div>
          );
        })()}
      </Modal>

      <SuccessToast message={toast} show={!!toast} />
    </div>
  );
}
