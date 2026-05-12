import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { FileText, Lock } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Card, NeonButton, SectionTitle } from "@/components/ui-kit";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { exams, courses } from "@/lib/mock-data";

export const Route = createFileRoute("/exams/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("nova_student");
      if (!raw) throw redirect({ to: "/login" });
    }
  },
  component: ExamsPage,
});

function ExamsPage() {
  const { t, lang } = useApp();
  const { user } = useAuth();
  
  if (!user) return null;

  // Get enrolled courses for the user
  const enrolledCourses = courses.filter(c => user.enrolledCourses.includes(c.id));
  
  // Filter exams to only show those for enrolled courses
  const availableExams = exams.filter(e => {
    const course = enrolledCourses.find(c => c.dept === e.dept);
    return course !== undefined;
  });

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <SectionTitle title={t("nav.exams")} center />
        
        {availableExams.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="glass rounded-2xl p-8">
              <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-bold mb-2">
                {lang === "ar" ? "لا توجد امتحانات متاحة" : "No Exams Available"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {lang === "ar" 
                  ? "يجب أن تكون مسجلاً في كورس لكي تتمكن من الوصول إلى الامتحانات الخاصة به"
                  : "You must be enrolled in a course to access its exams"}
              </p>
              <Link to="/courses">
                <NeonButton>{lang === "ar" ? "تصفح الكورسات" : "Browse Courses"}</NeonButton>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableExams.map((e) => {
              const course = enrolledCourses.find(c => c.dept === e.dept);
              return (
                <Card key={e.id}>
                  <FileText className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-2">{lang === "ar" ? e.titleAr : e.titleEn}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {lang === "ar" ? course?.titleAr : course?.titleEn}
                  </p>
                  <div className="text-sm text-muted-foreground mb-4">
                    {t("exam.duration")}: {e.duration} {t("exam.minutes")} • {e.questions} {t("quiz.questions")}
                  </div>
                  <Link to="/exams/$examId" params={{ examId: String(e.id) }}>
                    <NeonButton asChild className="w-full">{t("exam.start")}</NeonButton>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
