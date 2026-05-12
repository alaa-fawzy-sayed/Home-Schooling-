import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Brain, Lock } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Card, NeonButton, SectionTitle, Badge } from "@/components/ui-kit";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { quizzes, courses } from "@/lib/mock-data";

export const Route = createFileRoute("/quizzes/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("nova_student");
      if (!raw) throw redirect({ to: "/login" });
    }
  },
  component: QuizzesPage,
});

function QuizzesPage() {
  const { t, lang } = useApp();
  const { user } = useAuth();
  
  if (!user) return null;

  // Get enrolled courses for the user
  const enrolledCourses = courses.filter(c => user.enrolledCourses.includes(c.id));
  
  // Filter quizzes to only show those for enrolled courses
  const availableQuizzes = quizzes.filter(q => {
    const course = enrolledCourses.find(c => c.dept === q.dept);
    return course !== undefined;
  });

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <SectionTitle title={t("nav.quizzes")} center />
        
        {availableQuizzes.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="glass rounded-2xl p-8">
              <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-bold mb-2">
                {lang === "ar" ? "لا توجد كويزات متاحة" : "No Quizzes Available"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {lang === "ar" 
                  ? "يجب أن تكون مسجلاً في كورس لكي تتمكن من الوصول إلى الكويزات الخاصة به"
                  : "You must be enrolled in a course to access its quizzes"}
              </p>
              <Link to="/courses">
                <NeonButton>{lang === "ar" ? "تصفح الكويزات" : "Browse Quizzes"}</NeonButton>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableQuizzes.map((q) => {
              const course = enrolledCourses.find(c => c.dept === q.dept);
              return (
                <Card key={q.id}>
                  <div className="flex items-start justify-between mb-3">
                    <Brain className="h-8 w-8 text-primary" />
                    <Badge variant={q.difficulty}>{t(`difficulty.${q.difficulty}` as never)}</Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{lang === "ar" ? q.titleAr : q.titleEn}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {lang === "ar" ? course?.titleAr : course?.titleEn}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">{q.questions.length} {t("quiz.questions")}</p>
                  <Link to="/quizzes/$quizId" params={{ quizId: String(q.id) }}>
                    <NeonButton asChild className="w-full">{t("quiz.start")}</NeonButton>
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
