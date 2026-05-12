import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TrendingUp, BookOpen, Award, Clock, Zap, Calendar, ArrowRight, PlayCircle, Target, Flame } from "lucide-react";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { courses, studentSchedule, studentAssignments } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/")({
  component: DashOverview,
});

function DashOverview() {
  const { t, lang } = useApp();
  const { user } = useAuth();
  if (!user) return null;

  const enrolled = courses.filter((c) => user.enrolledCourses.includes(c.id));
  const todayDay = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date().getDay()];
  const today = studentSchedule.find((s) => s.day === todayDay);
  const pendingAssignments = studentAssignments.filter((a) => a.status === "pending").slice(0, 3);

  // Calculate actual streak based on account age
  const accountCreated = new Date(user.joinedAt);
  const now = new Date();
  const daysSinceJoined = Math.floor((now.getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24));
  const actualStreak = Math.max(1, daysSinceJoined + 1); // At least 1 day (today)

  const stats = [
    { label: t("dash.gpa"), value: user.gpa.toFixed(2), icon: Award, color: "from-yellow-400 to-orange-500" },
    { label: t("dash.credits"), value: user.credits, icon: BookOpen, color: "from-cyan-400 to-blue-600" },
    { label: t("dash.activeCourses"), value: enrolled.length, icon: PlayCircle, color: "from-purple-500 to-fuchsia-600" },
    { label: t("dash.streak"), value: actualStreak, icon: Flame, color: "from-red-400 to-pink-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl glass-strong p-6 md:p-8">
        <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full gradient-primary opacity-20 blur-3xl" />
        <div className="relative">
          <div className="text-xs text-muted-foreground mb-1">{t("dash.welcome")} 👋</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="gradient-text">{user.name}</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            استمر في رحلتك التعليمية. أنت في المسار الصحيح نحو إنجازات رائعة!
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Link to="/dashboard/courses" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white text-sm font-semibold neon-glow">
              <Zap className="h-4 w-4" /> {t("dash.continueLearning")}
            </Link>
            <Link to="/dashboard/schedule" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-medium hover:bg-accent">
              <Calendar className="h-4 w-4" /> {t("dash.schedule")}
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 hover-lift"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 neon-glow`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-display font-black gradient-text">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active courses */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> {t("dash.continueLearning")}
            </h2>
            <Link to="/dashboard/courses" className="text-xs text-primary hover:underline flex items-center gap-1">
              {t("dash.viewAll")} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            </Link>
          </div>

          {enrolled.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">{t("dash.noEnrolled")}</p>
              <Link to="/courses" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white text-sm font-semibold">
                {t("dash.browseCourses")}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrolled.slice(0, 4).map((c, i) => {
                const progress = 25 + ((c.id * 17) % 70);
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors"
                  >
                    <img src={c.thumb} alt="" className="w-20 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{lang === "ar" ? c.titleAr : c.titleEn}</div>
                      <div className="text-xs text-muted-foreground mb-1.5">{c.instructor}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-background overflow-hidden">
                          <div className="h-full gradient-primary rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-primary">{progress}%</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Today's classes */}
        <div className="glass rounded-2xl p-5">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" /> اليوم
          </h2>
          {today && today.classes.length > 0 ? (
            <div className="space-y-3">
              {today.classes.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-accent/30 border-s-2 border-primary">
                  <div className="flex items-center gap-2 text-xs text-primary font-mono mb-1">
                    <Clock className="h-3 w-3" /> {c.time}
                  </div>
                  <div className="font-semibold text-sm mb-0.5">{lang === "ar" ? c.titleAr : c.titleEn}</div>
                  <div className="text-xs text-muted-foreground">{c.room} • {c.instructor}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-muted-foreground">لا محاضرات اليوم 🌴</div>
          )}
        </div>
      </div>

      {/* Pending assignments */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" /> {t("dash.assignments")}
          </h2>
          <Link to="/dashboard/assignments" className="text-xs text-primary hover:underline flex items-center gap-1">
            {t("dash.viewAll")} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
          </Link>
        </div>
        <div className="space-y-2">
          {pendingAssignments.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm truncate">{lang === "ar" ? a.titleAr : a.titleEn}</div>
                <div className="text-xs text-muted-foreground">{a.course}</div>
              </div>
              <div className="text-xs font-mono text-yellow-400 whitespace-nowrap ms-2">
                {new Date(a.due).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { month: "short", day: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
