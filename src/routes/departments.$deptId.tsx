import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Brain, FileText, Radio, Video, GraduationCap, Stethoscope, SmilePlus, FlaskConical, PawPrint, Atom, HardHat, BrainCircuit, HeartPulse, ListChecks } from "lucide-react";
import PageShell from "@/components/PageShell";
import CourseCard from "@/components/CourseCard";
import { Card, NeonButton, Badge } from "@/components/ui-kit";
import { useApp } from "@/lib/i18n";
import { departments, courses, books, quizzes, exams, liveClasses, lectures } from "@/lib/mock-data";
import type { DeptId } from "@/lib/mock-data";

const deptIconMap: Record<string, typeof Stethoscope> = { Stethoscope, SmilePlus, FlaskConical, PawPrint, Atom, HardHat, BrainCircuit, HeartPulse };
void deptIconMap; void GraduationCap;

export const Route = createFileRoute("/departments/$deptId")({
  component: DepartmentDetail,
});

type Tab = "courses" | "books" | "quizzes" | "exams" | "live" | "lectures";

function DepartmentDetail() {
  const { deptId } = useParams({ from: "/departments/$deptId" }) as { deptId: DeptId };
  const { t, lang } = useApp();
  const [tab, setTab] = useState<Tab>("courses");

  const dept = departments.find((d) => d.id === deptId);
  if (!dept) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl">Department not found</h1>
          <Link to="/departments" className="text-primary underline mt-4 inline-block">Back</Link>
        </div>
      </PageShell>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: "courses", label: t("tabs.courses"), icon: GraduationCap },
    { id: "books", label: t("tabs.books"), icon: BookOpen },
    { id: "quizzes", label: t("tabs.quizzes"), icon: Brain },
    { id: "exams", label: t("tabs.exams"), icon: FileText },
    { id: "live", label: t("tabs.live"), icon: Radio },
    { id: "lectures", label: t("tabs.lectures"), icon: Video },
  ];

  const deptCourses = courses.filter((c) => c.dept === deptId);
  const deptBooks = books.filter((b) => b.dept === deptId);
  const deptQuizzes = quizzes.filter((q) => q.dept === deptId);
  const deptExams = exams.filter((e) => e.dept === deptId);
  const deptLive = liveClasses.filter((l) => l.dept === deptId);
  const deptLectures = lectures.filter((l) => l.dept === deptId);

  return (
    <PageShell>
      {/* Hero */}
      <section className={`relative py-16 md:py-24 overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${dept.color} opacity-10`} />
        <div className="container mx-auto px-4 relative">
          <Link to="/departments" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t("common.back")}
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-3 gradient-text">
            {lang === "ar" ? dept.nameAr : dept.nameEn}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">{lang === "ar" ? dept.descAr : dept.descEn}</p>
          {dept.specializations && dept.specializations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-primary">
                <ListChecks className="h-4 w-4" />
                <span>{lang === "ar" ? "التخصصات المتاحة" : "Available Specializations"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {dept.specializations.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium neon-border text-primary bg-primary/5">
                    {lang === "ar" ? s.nameAr : s.nameEn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 lg:top-20 z-40 glass-strong border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
            {tabs.map((tb) => (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  tab === tb.id ? "gradient-primary text-white neon-glow" : "hover:bg-accent"
                }`}
              >
                <tb.icon className="h-4 w-4" />
                {tb.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {tab === "courses" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deptCourses.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          )}

          {tab === "books" && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {deptBooks.map((b) => (
                <Card key={b.id} className="p-0 overflow-hidden">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={b.cover} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1 line-clamp-2">{lang === "ar" ? b.titleAr : b.titleEn}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{b.author} • {b.pages}p</p>
                    <div className="flex gap-2">
                      <button className="flex-1 px-2 py-1.5 text-xs rounded-lg neon-border text-primary">{t("books.view")}</button>
                      <button className="flex-1 px-2 py-1.5 text-xs rounded-lg gradient-primary text-white">{t("books.download")}</button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {tab === "quizzes" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deptQuizzes.map((q) => (
                <Card key={q.id}>
                  <div className="flex items-start justify-between mb-3">
                    <Brain className="h-8 w-8 text-primary" />
                    <Badge variant={q.difficulty}>{t(`difficulty.${q.difficulty}` as never)}</Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{lang === "ar" ? q.titleAr : q.titleEn}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{q.questions.length} {t("quiz.questions")}</p>
                  <Link to="/quizzes/$quizId" params={{ quizId: String(q.id) }}>
                    <NeonButton asChild className="w-full">{t("quiz.start")}</NeonButton>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          {tab === "exams" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deptExams.map((e) => (
                <Card key={e.id}>
                  <FileText className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-2">{lang === "ar" ? e.titleAr : e.titleEn}</h3>
                  <div className="text-sm text-muted-foreground mb-4">
                    {t("exam.duration")}: {e.duration} {t("exam.minutes")} • {e.questions} {t("quiz.questions")}
                  </div>
                  <Link to="/exams/$examId" params={{ examId: String(e.id) }}>
                    <NeonButton asChild className="w-full">{t("exam.start")}</NeonButton>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          {tab === "live" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deptLive.map((l) => (
                <Card key={l.id}>
                  <div className="flex items-center justify-between mb-3">
                    <Radio className="h-8 w-8 text-primary" />
                    {l.isLive ? <Badge variant="live">{t("live.live")}</Badge> : <Badge>{t("live.upcoming")}</Badge>}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{lang === "ar" ? l.titleAr : l.titleEn}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{l.instructor}</p>
                  <p className="text-xs text-muted-foreground mb-4">{new Date(l.time).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}</p>
                  <NeonButton className="w-full">{t("live.join")}</NeonButton>
                </Card>
              ))}
            </div>
          )}

          {tab === "lectures" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deptLectures.map((l) => (
                <Card key={l.id} className="p-0 overflow-hidden">
                  <div className="relative aspect-video overflow-hidden group cursor-pointer">
                    <img src={l.thumb} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center neon-glow">
                        <Video className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 rtl:right-auto rtl:left-2 px-2 py-1 rounded bg-black/70 text-xs text-white">{l.duration}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm">{lang === "ar" ? l.titleAr : l.titleEn}</h3>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </PageShell>
  );
}
