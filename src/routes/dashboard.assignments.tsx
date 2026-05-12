import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Calendar, CheckCircle2, Clock, Upload, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { subjects } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/assignments")({
  component: AssignmentsPage,
});

function AssignmentsPage() {
  const { t, lang } = useApp();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "pending" | "submitted">("all");

  if (!user) return null;

  const userSubjects = (user.enrolledSubjects || []).map(id => subjects.find(s => s.id === id)).filter(Boolean) as typeof subjects;
  
  // Generate assignments dynamically based on actual enrolled subjects
  const generatedAssignments = userSubjects.flatMap((subject, index) => {
    return [
      {
        id: `${subject.id}-1`,
        titleAr: `تكليف: ${subject.titleAr}`,
        titleEn: `Assignment: ${subject.titleEn}`,
        course: lang === "ar" ? subject.titleAr : subject.titleEn,
        due: new Date(Date.now() + (index + 2) * 86400000).toISOString(),
        status: "pending" as const,
        score: null
      },
      {
        id: `${subject.id}-2`,
        titleAr: `اختبار منتصف الفصل: ${subject.titleAr}`,
        titleEn: `Midterm: ${subject.titleEn}`,
        course: lang === "ar" ? subject.titleAr : subject.titleEn,
        due: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
        status: "submitted" as const,
        score: 85 + (index % 15)
      }
    ];
  });

  const filtered = generatedAssignments.filter((a) => filter === "all" || a.status === filter);
  const hasEnrolledSubjects = (user.enrolledSubjects || []).length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-1">{t("dash.assignments")}</h1>
        <p className="text-sm text-muted-foreground">{lang === "ar" ? "جميع واجباتك وتكليفات المقررات المسجلة" : "All your assignments for registered subjects"}</p>
      </div>

      {!hasEnrolledSubjects ? (
        <div className="glass rounded-2xl p-8 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-xl font-bold mb-2">
            {lang === "ar" ? "لا توجد واجبات حالياً" : "No Assignments"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {lang === "ar" 
              ? "يجب أن تسجل في المقررات لكي تظهر لك الواجبات والاختبارات"
              : "You need to register subjects to see your assignments"}
          </p>
          <Link to="/dashboard/roadmap">
            <button className="px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:scale-105 transition-transform">
              {lang === "ar" ? "اذهب للخطة الدراسية" : "Go to Study Plan"}
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            {(["all", "pending", "submitted"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === f ? "gradient-primary text-white neon-glow" : "glass hover:bg-accent"
                }`}
              >
                {f === "all" ? (lang === "ar" ? "الكل" : "All") : f === "pending" ? t("dash.pending") : t("dash.submitted")}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((a) => {
              const isPending = a.status === "pending";
              return (
                <div key={a.id} className="glass rounded-2xl p-4 hover-lift">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isPending ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"
                    }`}>
                      {isPending ? <FileText className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm mb-1">{lang === "ar" ? a.titleAr : a.titleEn}</h3>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 rounded-md bg-accent/50 font-bold">{a.course}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(a.due).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      {a.score !== null ? (
                        <div className="text-end">
                          <div className="text-2xl font-display font-black gradient-text">{a.score}</div>
                          <div className="text-[10px] text-muted-foreground">/100</div>
                        </div>
                      ) : (
                        <button
                          onClick={() => toast.success(lang === "ar" ? "تم فتح نموذج الرفع" : "Upload form opened")}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg gradient-primary text-white text-xs font-semibold neon-glow"
                        >
                          <Upload className="h-3 w-3" /> {lang === "ar" ? "رفع الواجب" : "Upload"}
                        </button>
                      )}
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isPending ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"
                      }`}>
                        <Clock className="h-2.5 w-2.5" />
                        {isPending ? t("dash.pending") : t("dash.submitted")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
