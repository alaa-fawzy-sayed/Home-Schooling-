import { Link } from "@tanstack/react-router";
import { Clock, Users, BookOpen, Star, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { Card, Badge } from "./ui-kit";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import type { courses } from "@/lib/mock-data";

export default function CourseCard({ course }: { course: typeof courses[number] }) {
  const { lang, t } = useApp();
  const { user, enrollCourse } = useAuth();
  const isEnrolled = user?.enrolledCourses.includes(course.id) ?? false;

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error("سجّل حسابك أولاً"); return; }
    if (isEnrolled) { toast.info("أنت مسجل بالفعل"); return; }
    const success = enrollCourse(course.id);
    if (success) {
      toast.success(`تم الاشتراك في ${lang === "ar" ? course.titleAr : course.titleEn}`);
    }
  };

  return (
    <Link to="/courses/$courseId" params={{ courseId: String(course.id) }} className="group block h-full">
      <Card className="overflow-hidden p-0 h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden">
          <img src={course.thumb} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute top-3 start-3">
            <Badge>{course.level}</Badge>
          </div>
          {isEnrolled && (
            <div className="absolute top-3 end-3 px-2 py-0.5 rounded-full bg-green-500/80 text-white text-[10px] font-bold flex items-center gap-1">
              <Check className="h-3 w-3" /> مسجل
            </div>
          )}
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {lang === "ar" ? course.titleAr : course.titleEn}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">{course.instructor}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{course.lessons} {t("courses.lessons")}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.hours}h</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.students}</span>
          </div>
          <div className="flex items-center gap-1 mt-3">
            {[1,2,3,4,5].map(i => <Star key={i} className={`h-3 w-3 ${i <= Math.floor(course.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />)}
            <span className="text-xs text-muted-foreground ms-1">{course.rating}</span>
          </div>
          <button
            onClick={handleEnroll}
            disabled={isEnrolled}
            className={`mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isEnrolled ? "bg-green-500/20 text-green-400 cursor-default" : "gradient-primary text-white neon-glow hover:scale-[1.02]"
            }`}
          >
            {isEnrolled ? <><Check className="h-3 w-3" /> مسجل</> : <><Plus className="h-3 w-3" /> {t("courses.enroll")}</>}
          </button>
        </div>
      </Card>
    </Link>
  );
}
