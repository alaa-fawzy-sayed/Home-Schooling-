import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Clock, Trophy, ArrowLeft } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Card, NeonButton, SectionTitle } from "@/components/ui-kit";
import { useApp } from "@/lib/i18n";
import { exams } from "@/lib/mock-data";
import { getRandomQuestions } from "@/lib/question-bank";

export const Route = createFileRoute("/exams/$examId")({
  component: ExamDetail,
});

function ExamDetail() {
  const { examId } = useParams({ from: "/exams/$examId" });
  const { t, lang } = useApp();
  const exam = exams.find((e) => e.id === Number(examId));
  // Request up to 20 questions for exams
  const [questions] = useState(() => exam ? getRandomQuestions(exam.dept, Math.min(exam.questions, 20)) : []);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState((exam?.duration ?? 60) * 60);

  useEffect(() => {
    if (!started || done) return;
    const id = setInterval(() => setTimeLeft((t) => {
      if (t <= 1) { setDone(true); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [started, done]);

  if (!exam) return <PageShell><div className="container py-20 text-center">Not found</div></PageShell>;

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");

  if (!started) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-20 max-w-2xl">
          <Link to="/exams" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t("common.back")}
          </Link>
          <Card className="text-center">
            <h2 className="text-2xl font-bold mb-3 gradient-text">{lang === "ar" ? exam.titleAr : exam.titleEn}</h2>
            <div className="flex justify-center gap-6 my-6 text-sm">
              <span><Clock className="inline h-4 w-4 me-1" />{exam.duration} {t("exam.minutes")}</span>
              <span>{questions.length} {t("quiz.questions")}</span>
            </div>
            <NeonButton onClick={() => setStarted(true)}>{t("exam.start")}</NeonButton>
          </Card>
        </div>
      </PageShell>
    );
  }

  if (done) {
    const score = Object.entries(answers).reduce((acc, [i, a]) => acc + (a === questions[Number(i)].correct ? 1 : 0), 0);
    const pct = Math.round((score / questions.length) * 100);
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-20 max-w-2xl">
          <Card className="text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl font-bold mb-2 gradient-text">{t("quiz.result")}</h2>
            <div className="text-6xl font-display font-black my-6 neon-text">{pct}%</div>
            <p className="text-muted-foreground mb-6">{score} / {questions.length}</p>
            <Link to="/exams"><NeonButton asChild>{t("common.back")}</NeonButton></Link>
          </Card>
        </div>
      </PageShell>
    );
  }

  const question = questions[current];
  if (!question) return null;
  const options = lang === "ar" ? question.optionsAr : question.optionsEn;

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Timer */}
        <div className="sticky top-20 z-20 mb-6 flex items-center justify-between glass-strong rounded-xl px-4 py-3">
          <span className="text-sm font-medium">{current + 1} / {questions.length}</span>
          <div className="flex items-center gap-2 font-display font-bold text-lg neon-text">
            <Clock className="h-5 w-5" />
            {mins}:{secs}
          </div>
        </div>

        <Card>
          <h3 className="text-xl font-bold mb-6">{lang === "ar" ? question.qAr : question.qEn}</h3>
          <div className="space-y-3">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setAnswers({ ...answers, [current]: i })}
                className={`w-full text-start p-4 rounded-xl border-2 transition-all ${
                  answers[current] === i ? "neon-border bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            {current > 0 && <NeonButton variant="outline" onClick={() => setCurrent(current - 1)}>{t("common.back")}</NeonButton>}
            {current + 1 < questions.length ? (
              <NeonButton onClick={() => setCurrent(current + 1)} className="flex-1">{t("quiz.next")}</NeonButton>
            ) : (
              <NeonButton onClick={() => setDone(true)} className="flex-1">{t("quiz.submit")}</NeonButton>
            )}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
