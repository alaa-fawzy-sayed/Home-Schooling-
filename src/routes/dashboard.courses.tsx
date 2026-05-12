import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Clock, Users, PlayCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { courses } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/courses")({
  component: MyCoursesPage,
});

function MyCoursesPage() {
  const { t, lang } = useApp();
  const { user, unenrollCourse } = useAuth();
  if (!user) return null;

  const enrolled = courses.filter((c) => user.enrolledCourses.includes(c.id));

  const handleUnenroll = (id: number) => {
    unenrollCourse(id);
    toast.success("تم إلغاء التسجيل");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-1">{t("dash.myCourses")}</h1>
        <p className="text-sm text-muted-foreground">جميع الكورسات المسجل بها</p>
      </div>

      {enrolled.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-bold mb-2">{t("dash.noEnrolled")}</h3>
          <Link to="/courses" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold neon-glow mt-2">
            {t("dash.browseCourses")}
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrolled.map((c) => {
            const progress = 25 + ((c.id * 17) % 70);
            return (
              <div key={c.id} className="glass rounded-2xl overflow-hidden hover-lift group">
                <Link to="/courses/$courseId" params={{ courseId: c.id.toString() }} className="relative aspect-video block cursor-pointer">
                  <img src={c.thumb} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  <div className="absolute top-2 end-2 px-2 py-0.5 rounded-full bg-background/80 text-[10px] font-mono text-primary">
                    {progress}%
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-1 line-clamp-1">{lang === "ar" ? c.titleAr : c.titleEn}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{c.instructor}</p>
                  <div className="h-1.5 rounded-full bg-accent overflow-hidden mb-3">
                    <div className="h-full gradient-primary" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.hours}h</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{c.students}</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{c.lessons}</span>
                  </div>
                  <button
                    onClick={() => handleUnenroll(c.id)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" /> إلغاء التسجيل
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
