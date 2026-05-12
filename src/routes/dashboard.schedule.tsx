import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, User as UserIcon, BookOpen } from "lucide-react";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { subjects } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/schedule")({
  component: SchedulePage,
});

function SchedulePage() {
  const { t, lang } = useApp();
  const { user } = useAuth();
  const todayDay = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date().getDay()];

  if (!user) return null;

  // Distribute enrolled subjects into a schedule dynamically
  const userSubjects = (user.enrolledSubjects || []).map(id => subjects.find(s => s.id === id)).filter(Boolean) as typeof subjects;
  
  const days = [
    { id: "sun", ar: "الأحد", en: "Sunday" },
    { id: "mon", ar: "الإثنين", en: "Monday" },
    { id: "tue", ar: "الثلاثاء", en: "Tuesday" },
    { id: "wed", ar: "الأربعاء", en: "Wednesday" },
    { id: "thu", ar: "الخميس", en: "Thursday" },
  ];

  const filteredSchedule = days.map((day, index) => {
    const daySubjects = userSubjects.filter(s => (s.id % 5) === index);
    return {
      day: day.id,
      dayAr: day.ar,
      dayEn: day.en,
      classes: daySubjects.map((s, i) => ({
        time: `${9 + (i * 2)}:00`,
        titleAr: s.titleAr,
        titleEn: s.titleEn,
        room: `Lab ${100 + s.id}`,
        instructor: `Prof. ${s.code}`,
        subjectId: s.id
      }))
    };
  });

  // Check if user has any enrolled subjects
  const hasEnrolledSubjects = (user.enrolledSubjects || []).length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-1">{t("dash.schedule")}</h1>
        <p className="text-sm text-muted-foreground">
          {lang === "ar" ? "جدولك الجامعي للمقررات المسجلة" : "Your university schedule for registered subjects"}
        </p>
      </div>

      {!hasEnrolledSubjects ? (
        <div className="glass rounded-2xl p-8 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-xl font-bold mb-2">
            {lang === "ar" ? "لا توجد مقررات مسجلة" : "No Registered Subjects"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {lang === "ar" 
              ? "يجب أن تسجل في المقررات من الخطة الدراسية لكي يظهر جدولك"
              : "You need to register subjects from the Study Plan to see your schedule"}
          </p>
          <Link to="/dashboard/roadmap">
            <button className="px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:scale-105 transition-transform">
              {lang === "ar" ? "اذهب للخطة الدراسية" : "Go to Study Plan"}
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedule.map((day) => {
            const isToday = day.day === todayDay;
            return (
              <div key={day.day} className={`glass rounded-2xl p-4 ${isToday ? "neon-border" : ""}`}>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
                  <h3 className="font-bold gradient-text">{lang === "ar" ? day.dayAr : day.dayEn}</h3>
                  {isToday && <span className="text-[10px] px-2 py-0.5 rounded-full gradient-primary text-white font-semibold">
                    {lang === "ar" ? "اليوم" : "Today"}
                  </span>}
                </div>
                {day.classes.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    {lang === "ar" ? "لا توجد محاضرات" : "No classes"}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {day.classes.map((c, i) => (
                      <div key={i} className="p-3 rounded-xl bg-accent/30 border-s-2 border-primary">
                        <div className="flex items-center gap-1.5 text-xs text-primary font-mono mb-1">
                          <Clock className="h-3 w-3" /> {c.time}
                        </div>
                        <div className="font-semibold text-sm mb-1">{lang === "ar" ? c.titleAr : c.titleEn}</div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{c.room}</span>
                          <span className="flex items-center gap-1"><UserIcon className="h-2.5 w-2.5" />{c.instructor}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
