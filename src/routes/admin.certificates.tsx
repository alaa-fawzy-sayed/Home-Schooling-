import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/i18n";
import { Modal, ModalInput, ModalSelect, ModalTextarea, BtnPrimary, BtnSecondary, SuccessToast } from "@/components/modal";
import {
  Award, Search, Download, CheckCircle2, Clock, XCircle, Eye, Printer, TrendingUp, BadgeCheck, Plus, AlertTriangle
} from "lucide-react";

export const Route = createFileRoute("/admin/certificates")({
  component: AdminCertificatesPage,
});

const certificates = [
  { id: "CERT-2026-001", student: "محمد علي أحمد", studentEn: "Mohamed Ali Ahmed", course: "Full Stack Web Development", courseAr: "تطوير الويب الكامل", date: "2026-04-15", grade: "A+", status: "issued" as const, type: "completion" as const },
  { id: "CERT-2026-002", student: "نورا حسن إبراهيم", studentEn: "Nora Hassan Ibrahim", course: "Cybersecurity Fundamentals", courseAr: "أساسيات الأمن السيبراني", date: "2026-04-14", grade: "A", status: "issued" as const, type: "completion" as const },
  { id: "CERT-2026-003", student: "كريم سامي عبدالله", studentEn: "Karim Samy Abdullah", course: "Network Engineering", courseAr: "هندسة الشبكات", date: "2026-04-12", grade: "A", status: "issued" as const, type: "honors" as const },
  { id: "CERT-2026-004", student: "سلمى أحمد محمود", studentEn: "Salma Ahmed Mahmoud", course: "Python for AI", courseAr: "Python للذكاء الاصطناعي", date: "2026-04-10", grade: "B+", status: "pending" as const, type: "completion" as const },
  { id: "CERT-2026-005", student: "عمر خالد حسين", studentEn: "Omar Khaled Hussein", course: "Data Science", courseAr: "علوم البيانات", date: "2026-04-08", grade: "A-", status: "pending" as const, type: "completion" as const },
  { id: "CERT-2026-006", student: "ياسمين فوزي", studentEn: "Yasmin Fawzy", course: "UI/UX Design Pro", courseAr: "تصميم UI/UX احترافي", date: "2026-04-05", grade: "A+", status: "issued" as const, type: "excellence" as const },
  { id: "CERT-2026-007", student: "حسام الدين", studentEn: "Hossam Eldin", course: "React + TypeScript", courseAr: "React + TypeScript", date: "2026-04-03", grade: "A+", status: "revoked" as const, type: "completion" as const },
  { id: "CERT-2026-008", student: "دينا مصطفى", studentEn: "Dina Mostafa", course: "Machine Learning", courseAr: "تعلم الآلة", date: "2026-04-01", grade: "A", status: "issued" as const, type: "honors" as const },
];

type CertData = typeof certificates[0];

const typeConfig = {
  completion: { labelAr: "إتمام", labelEn: "Completion", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  honors: { labelAr: "تفوّق", labelEn: "Honors", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  excellence: { labelAr: "امتياز", labelEn: "Excellence", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

const statusConfig = {
  issued: { labelAr: "صادرة", labelEn: "Issued", icon: CheckCircle2, color: "bg-green-500/10 text-green-400 border-green-500/20" },
  pending: { labelAr: "قيد الإصدار", labelEn: "Pending", icon: Clock, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  revoked: { labelAr: "ملغاة", labelEn: "Revoked", icon: XCircle, color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

function AdminCertificatesPage() {
  const { lang } = useApp();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [issueOpen, setIssueOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [currentCert, setCurrentCert] = useState<CertData | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const filtered = certificates.filter((c) => {
    const matchSearch = c.student.includes(search) || c.studentEn.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search);
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchType = filterType === "all" || c.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const issuedCount = certificates.filter((c) => c.status === "issued").length;
  const pendingCount = certificates.filter((c) => c.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold"><span className="gradient-text">{lang === "ar" ? "إدارة الشهادات" : "Certificate Management"}</span></h1>
          <p className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "إصدار ومتابعة شهادات الطلاب" : "Issue and track student certificates"}</p>
        </div>
        <button onClick={() => setIssueOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold neon-glow hover:scale-105 transition-transform">
          <Award className="h-4 w-4" /> {lang === "ar" ? "إصدار شهادة" : "Issue Certificate"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Award, label: lang === "ar" ? "إجمالي الشهادات" : "Total Certificates", value: certificates.length, color: "text-purple-400" },
          { icon: CheckCircle2, label: lang === "ar" ? "صادرة" : "Issued", value: issuedCount, color: "text-green-400" },
          { icon: Clock, label: lang === "ar" ? "قيد الإصدار" : "Pending", value: pendingCount, color: "text-amber-400" },
          { icon: TrendingUp, label: lang === "ar" ? "هذا الشهر" : "This Month", value: "+15", color: "text-blue-400" },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 flex items-center gap-3"><s.icon className={`h-8 w-8 ${s.color}`} /><div><div className="text-lg font-bold">{s.value}</div><div className="text-[10px] text-muted-foreground">{s.label}</div></div></div>
        ))}
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "بحث بالاسم أو رقم الشهادة..." : "Search by name or cert ID..."}
              className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none focus:border-primary transition-colors" />
          </div>
          <div className="flex gap-2">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none appearance-none cursor-pointer">
              <option value="all">{lang === "ar" ? "كل الحالات" : "All Status"}</option>
              <option value="issued">{lang === "ar" ? "صادرة" : "Issued"}</option>
              <option value="pending">{lang === "ar" ? "قيد الإصدار" : "Pending"}</option>
              <option value="revoked">{lang === "ar" ? "ملغاة" : "Revoked"}</option>
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2.5 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none appearance-none cursor-pointer">
              <option value="all">{lang === "ar" ? "كل الأنواع" : "All Types"}</option>
              <option value="completion">{lang === "ar" ? "إتمام" : "Completion"}</option>
              <option value="honors">{lang === "ar" ? "تفوّق" : "Honors"}</option>
              <option value="excellence">{lang === "ar" ? "امتياز" : "Excellence"}</option>
            </select>
            <button onClick={() => showToast(lang === "ar" ? "تم تصدير الشهادات ✓" : "Certificates exported ✓")} className="p-2.5 rounded-xl bg-accent/30 border border-border/50 hover:bg-accent"><Download className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "رقم الشهادة" : "Cert ID"}</th>
              <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "الطالب" : "Student"}</th>
              <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">{lang === "ar" ? "الكورس" : "Course"}</th>
              <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">{lang === "ar" ? "التقدير" : "Grade"}</th>
              <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">{lang === "ar" ? "النوع" : "Type"}</th>
              <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "الحالة" : "Status"}</th>
              <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cert) => {
              const status = statusConfig[cert.status];
              const type = typeConfig[cert.type];
              const StatusIcon = status.icon;
              return (
                <tr key={cert.id} className="border-b border-border/20 hover:bg-accent/10 transition-colors">
                  <td className="p-4"><div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" /><span className="text-xs font-mono font-semibold">{cert.id}</span></div></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cert.studentEn}`} alt="" className="h-8 w-8 rounded-full bg-card" />
                      <div><div className="text-sm font-semibold">{lang === "ar" ? cert.student : cert.studentEn}</div><div className="text-[10px] text-muted-foreground">{cert.date}</div></div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-sm">{lang === "ar" ? cert.courseAr : cert.course}</td>
                  <td className="p-4 hidden lg:table-cell"><span className="text-sm font-bold text-primary">{cert.grade}</span></td>
                  <td className="p-4 hidden lg:table-cell"><span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${type.color}`}>{lang === "ar" ? type.labelAr : type.labelEn}</span></td>
                  <td className="p-4"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.color}`}><StatusIcon className="h-3 w-3" /> {lang === "ar" ? status.labelAr : status.labelEn}</span></td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setCurrentCert(cert); setViewOpen(true); }} className="p-2 rounded-lg hover:bg-accent"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => showToast(lang === "ar" ? "جاري الطباعة..." : "Printing...")} className="p-2 rounded-lg hover:bg-accent"><Printer className="h-4 w-4" /></button>
                      <button onClick={() => showToast(lang === "ar" ? "تم تحميل الشهادة ✓" : "Certificate downloaded ✓")} className="p-2 rounded-lg hover:bg-accent"><Download className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="p-4 border-t border-border/30 text-center text-xs text-muted-foreground">
          {lang === "ar" ? `عرض ${filtered.length} من ${certificates.length} شهادة` : `Showing ${filtered.length} of ${certificates.length} certificates`}
        </div>
      </div>

      {/* Issue Certificate Modal */}
      <Modal open={issueOpen} onClose={() => setIssueOpen(false)} title={lang === "ar" ? "إصدار شهادة جديدة" : "Issue New Certificate"} size="lg"
        footer={<><BtnSecondary onClick={() => setIssueOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><BtnPrimary onClick={() => { setIssueOpen(false); showToast(lang === "ar" ? "تم إصدار الشهادة بنجاح ✓" : "Certificate issued successfully ✓"); }}>{lang === "ar" ? "إصدار" : "Issue"}</BtnPrimary></>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <ModalInput label={lang === "ar" ? "اسم الطالب" : "Student Name"} placeholder={lang === "ar" ? "ابحث عن طالب..." : "Search student..."} />
          <ModalInput label={lang === "ar" ? "الكورس" : "Course"} placeholder={lang === "ar" ? "ابحث عن كورس..." : "Search course..."} />
          <ModalSelect label={lang === "ar" ? "نوع الشهادة" : "Certificate Type"}
            options={[{ value: "completion", label: lang === "ar" ? "شهادة إتمام" : "Completion" }, { value: "honors", label: lang === "ar" ? "شهادة تفوّق" : "Honors" }, { value: "excellence", label: lang === "ar" ? "شهادة امتياز" : "Excellence" }]} />
          <ModalInput label={lang === "ar" ? "التقدير" : "Grade"} placeholder="A+" />
          <div className="sm:col-span-2">
            <ModalTextarea label={lang === "ar" ? "ملاحظات إضافية" : "Additional Notes"} placeholder={lang === "ar" ? "أي ملاحظات خاصة بالشهادة..." : "Any special notes for the certificate..."} />
          </div>
        </div>
      </Modal>

      {/* View Certificate Modal */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title={lang === "ar" ? "تفاصيل الشهادة" : "Certificate Details"} size="md"
        footer={<><BtnSecondary onClick={() => setViewOpen(false)}>{lang === "ar" ? "إغلاق" : "Close"}</BtnSecondary><BtnPrimary onClick={() => { setViewOpen(false); showToast(lang === "ar" ? "تم تحميل الشهادة ✓" : "Certificate downloaded ✓"); }}>{lang === "ar" ? "تحميل PDF" : "Download PDF"}</BtnPrimary></>}>
        {currentCert && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
              <Award className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-1">{currentCert.id}</h3>
            <p className="text-sm text-muted-foreground mb-4">{lang === "ar" ? currentCert.courseAr : currentCert.course}</p>
            <div className="grid grid-cols-2 gap-3 text-start">
              {[
                { label: lang === "ar" ? "الطالب" : "Student", value: lang === "ar" ? currentCert.student : currentCert.studentEn },
                { label: lang === "ar" ? "التاريخ" : "Date", value: currentCert.date },
                { label: lang === "ar" ? "التقدير" : "Grade", value: currentCert.grade },
                { label: lang === "ar" ? "النوع" : "Type", value: lang === "ar" ? typeConfig[currentCert.type].labelAr : typeConfig[currentCert.type].labelEn },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-accent/20">
                  <div className="text-[10px] text-muted-foreground mb-0.5">{item.label}</div>
                  <div className="text-sm font-semibold">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <SuccessToast message={toast} show={!!toast} />
    </div>
  );
}
