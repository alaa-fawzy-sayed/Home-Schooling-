import { createFileRoute, Link, useParams, redirect, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Trophy, RotateCcw, ArrowLeft, Lock } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Card, NeonButton, SectionTitle } from "@/components/ui-kit";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { quizzes, courses } from "@/lib/mock-data";
import { getRandomQuestions, Question } from "@/lib/question-bank";

export const Route = createFileRoute("/quizzes/$quizId")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("nova_student");
      if (!raw) throw redirect({ to: "/login" });
    }
  },
  component: QuizDetail,
});

function QuizDetail() {
  const { quizId } = useParams({ from: "/quizzes/$quizId" });
  const { t, lang } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);

  const quiz = quizzes.find((q) => q.id === Number(quizId));

  useEffect(() => {
    if (quiz && sessionQuestions.length === 0) {
      setSessionQuestions(getRandomQuestions(quiz.dept, 5));
    }
  }, [quiz, sessionQuestions.length]);
  
  if (!quiz) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1>{lang === "ar" ? "الكويز غير موجود" : "Quiz not found"}</h1>
          <Link to="/quizzes" className="text-primary underline">
            {lang === "ar" ? "العودة" : "Back"}
          </Link>
        </div>
      </PageShell>
    );
  }

  // Check if user is enrolled in a course from this department
  const enrolledCourses = courses.filter(c => user?.enrolledCourses.includes(c.id));
  const hasAccess = enrolledCourses.some(c => c.dept === quiz.dept);

  useEffect(() => {
    if (!hasAccess) {
      navigate({ to: "/quizzes" });
    }
  }, [hasAccess, navigate]);

  if (!user || !hasAccess) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-20 max-w-2xl">
          <div className="glass rounded-2xl p-8 text-center">
            <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-2xl font-bold mb-2">
              {lang === "ar" ? "غير مسموح بالوصول" : "Access Denied"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === "ar" 
                ? "يجب أن تكون مسجلاً في كورس من هذا القسم لكي تتمكن من الوصول إلى هذا الكويز"
                : "You must be enrolled in a course from this department to access this quiz"}
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/courses">
                <NeonButton>{lang === "ar" ? "تصفح الكويزات" : "Browse Quizzes"}</NeonButton>
              </Link>
              <Link to="/quizzes">
                <NeonButton variant="outline">{lang === "ar" ? "العودة" : "Back"}</NeonButton>
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  const score = answers.reduce((acc, a, i) => acc + (a === sessionQuestions[i]?.correct ? 1 : 0), 0);

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (current + 1 >= sessionQuestions.length) {
      setDone(true);
    } else {
      setCurrent(current + 1);
    }
  };

  const reset = () => {
    setCurrent(0);
    setAnswers([]);
    setDone(false);
    setSelected(null);
    setSessionQuestions(quiz ? getRandomQuestions(quiz.dept, 5) : []);
  };

  if (done) {
    const pct = Math.round((score / sessionQuestions.length) * 100);
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-20 max-w-2xl">
          <Card className="text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl font-bold mb-2 gradient-text">{t("quiz.result")}</h2>
            <div className="text-6xl font-display font-black my-6 neon-text">{pct}%</div>
            <p className="text-muted-foreground mb-6">{score} / {sessionQuestions.length}</p>
            <div className="flex gap-3 justify-center">
              <NeonButton onClick={reset}><RotateCcw className="h-4 w-4" />{t("quiz.retry")}</NeonButton>
              <Link to="/quizzes"><NeonButton variant="outline" asChild>{t("common.back")}</NeonButton></Link>
            </div>
          </Card>
        </div>
      </PageShell>
    );
  }

  const question = sessionQuestions[current];
  if (!question) return null;

  const progress = ((current) / sessionQuestions.length) * 100;
  const options = lang === "ar" ? question.optionsAr : question.optionsEn;

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/quizzes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t("common.back")}
        </Link>
        <SectionTitle title={lang === "ar" ? quiz.titleAr : quiz.titleEn} />

        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{current + 1} / {sessionQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div className="h-full gradient-primary" animate={{ width: `${progress}%` }} />
          </div>
        </div>

        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <h3 className="text-xl font-bold mb-6">{lang === "ar" ? question.qAr : question.qEn}</h3>
            <div className="space-y-3">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-start p-4 rounded-xl border-2 transition-all ${
                    selected === i ? "neon-border bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="font-medium">{opt}</span>
                </button>
              ))}
            </div>
            <NeonButton onClick={handleNext} className="w-full mt-6" disabled={selected === null}>
              {current + 1 >= sessionQuestions.length ? t("quiz.submit") : t("quiz.next")}
            </NeonButton>
          </Card>
        </motion.div>
      </div>
    </PageShell>
  );
}
