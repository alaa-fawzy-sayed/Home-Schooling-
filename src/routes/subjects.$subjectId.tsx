import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { subjects, departments } from "@/lib/mock-data";
import PageShell from "@/components/PageShell";
import {
  Play, Clock, Users, BookOpen, Lock, CheckCircle2,
  ChevronDown, ChevronUp, FileText, PlayCircle, MonitorPlay
} from "lucide-react";

export const Route = createFileRoute("/subjects/$subjectId")({
  component: SubjectDetailPage,
});

type Lesson = {
  id: number;
  title: string;
  titleEn: string;
  duration: string;
  type: "video" | "quiz" | "assignment";
  videoUrl?: string;
};

type Curriculum = {
  sections: {
    title: string;
    titleEn: string;
    lessons: Lesson[];
  }[];
};

// Mock curriculum data for subjects
const subjectCurriculum: Curriculum = { sections: [
  { title: "الأسبوع الأول: المفاهيم الأساسية", titleEn: "Week 1: Core Concepts", lessons: [
    { id: 101, title: "المحاضرة الأولى", titleEn: "Lecture 1", duration: "1:20:00", type: "video", videoUrl: "https://www.youtube.com/embed/m7H-U7V7Bmc" },
    { id: 102, title: "السكشن الأول", titleEn: "Section 1", duration: "0:45:00", type: "video", videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk" },
    { id: 103, title: "ملف المحاضرة (PDF)", titleEn: "Lecture Slides (PDF)", duration: "-", type: "assignment" },
  ]},
  { title: "الأسبوع الثاني: التعمق في المادة", titleEn: "Week 2: Deep Dive", lessons: [
    { id: 201, title: "المحاضرة الثانية", titleEn: "Lecture 2", duration: "1:15:20", type: "video", videoUrl: "https://www.youtube.com/embed/m7H-U7V7Bmc" },
    { id: 202, title: "السكشن الثاني", titleEn: "Section 2", duration: "0:50:45", type: "video", videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk" },
    { id: 203, title: "تكليف الأسبوع", titleEn: "Weekly Assignment", duration: "15:00", type: "quiz" },
  ]},
]};

function SubjectDetailPage() {
  const { lang } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subjectId } = Route.useParams();
  const id = parseInt(subjectId);
  const subject = subjects.find((s) => s.id === id);

  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);

  if (!subject) {
    return <PageShell><div className="container mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">{lang === "ar" ? "المقرر غير موجود" : "Subject Not Found"}</h1></div></PageShell>;
  }

  const dept = departments.find((d) => d.id === subject.dept);
  const totalLessons = subjectCurriculum.sections.reduce((a, s) => a + s.lessons.length, 0);
  const isEnrolled = user?.enrolledSubjects?.includes(subject.id) ?? false;

  const toggleSection = (i: number) => setExpandedSections((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);

  const playLesson = (lessonId: number) => {
    setActiveLesson(lessonId);
  };

  const activeLessonData = activeLesson ? subjectCurriculum.sections.flatMap((s) => s.lessons).find((l) => l.id === activeLesson) : null;

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <button onClick={() => navigate({ to: "/dashboard/roadmap" })} className="hover:text-primary transition-colors">{lang === "ar" ? "الخطة الدراسية" : "Study Plan"}</button>
          <span>/</span>
          <span>{lang === "ar" ? subject.titleAr : subject.titleEn}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="relative rounded-2xl overflow-hidden glass aspect-video group shadow-2xl flex flex-col items-center justify-center bg-black/90">
              {activeLesson && activeLessonData && activeLessonData.type === "video" ? (
                <iframe 
                  src={activeLessonData.videoUrl + "?autoplay=1"} 
                  title="Video lesson" 
                  className="w-full h-full border-none" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : activeLessonData && activeLessonData.type !== "video" ? (
                <div className="text-center p-8">
                  <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{lang === "ar" ? activeLessonData.title : activeLessonData.titleEn}</h3>
                  <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">{lang === "ar" ? "تحميل / بدء" : "Download / Start"}</button>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <MonitorPlay className="h-16 w-16 text-white/50 mb-4" />
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{lang === "ar" ? subject.titleAr : subject.titleEn}</h2>
                    <p className="text-white/70 mb-6">{subject.code} - {subject.credits} {lang === "ar" ? "ساعات معتمدة" : "Credits"}</p>
                    
                    {!isEnrolled ? (
                      <div className="mt-4 px-4 py-3 rounded-xl glass border border-red-500/30 text-red-100 text-sm font-medium flex items-center gap-2 bg-red-500/20">
                        <Lock className="h-5 w-5" /> {lang === "ar" ? "يجب عليك تسجيل هذا المقرر من الخطة الدراسية لتتمكن من حضور المحاضرات" : "You must register for this subject from the Study Plan to attend lectures"}
                      </div>
                    ) : (
                      <button onClick={() => { const first = subjectCurriculum.sections[0]?.lessons[0]; if (first) playLesson(first.id); }}
                        className="flex items-center gap-2 px-6 py-3 rounded-full gradient-primary text-white font-bold neon-glow hover:scale-105 transition-transform">
                        <Play className="h-5 w-5" /> {lang === "ar" ? "بدء المحاضرة الأولى" : "Start First Lecture"}
                      </button>
                    )}
                  </div>
                  <div className="absolute bottom-4 start-4">
                    {dept && <span className={`px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${dept.color} text-white`}>{lang === "ar" ? dept.nameAr : dept.nameEn}</span>}
                  </div>
                </>
              )}
            </div>

            {/* Curriculum */}
            <div className="glass rounded-2xl overflow-hidden mt-8">
              <div className="px-6 py-4 border-b border-border/30">
                <h2 className="font-bold text-lg">{lang === "ar" ? "المحتوى الأكاديمي (الأسابيع)" : "Academic Content (Weeks)"}</h2>
                <p className="text-xs text-muted-foreground">{subjectCurriculum.sections.length} {lang === "ar" ? "أسابيع" : "weeks"}</p>
              </div>
              {subjectCurriculum.sections.map((section, si) => (
                <div key={si}>
                  <button onClick={() => toggleSection(si)} className="w-full flex items-center justify-between px-6 py-3 hover:bg-accent/10 transition-colors border-b border-border/20">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{lang === "ar" ? section.title : section.titleEn}</span>
                      <span className="text-[10px] text-muted-foreground ms-2">{section.lessons.length} {lang === "ar" ? "عناصر" : "items"}</span>
                    </div>
                    {expandedSections.includes(si) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {expandedSections.includes(si) && (
                    <div>
                      {section.lessons.map((lesson) => {
                        const isActive = activeLesson === lesson.id;
                        return (
                          <button key={lesson.id} onClick={() => isEnrolled ? playLesson(lesson.id) : null}
                            className={`w-full flex items-center gap-3 px-6 py-3 text-start transition-colors ${isActive ? "bg-primary/10 border-s-2 border-primary" : "hover:bg-accent/10 border-s-2 border-transparent"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isEnrolled ? (isActive ? "gradient-primary text-white" : "bg-accent/30") : "bg-accent/10"}`}>
                              {isEnrolled ? (lesson.type === "video" ? <PlayCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />) : <Lock className="h-4 w-4 text-muted-foreground" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{lang === "ar" ? lesson.title : lesson.titleEn}</div>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                <span>{lesson.duration}</span>
                                {lesson.type === "quiz" && <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold">{lang === "ar" ? "اختبار" : "Quiz"}</span>}
                                {lesson.type === "assignment" && <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">{lang === "ar" ? "ملف" : "File"}</span>}
                              </div>
                            </div>
                            {isActive && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-20 h-fit">
            <div className="glass rounded-2xl p-6 neon-border">
              <h2 className="text-xl font-bold mb-4 gradient-text">{lang === "ar" ? "بيانات المقرر" : "Subject Details"}</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border/30">
                  <span className="text-muted-foreground text-sm">{lang === "ar" ? "كود المقرر" : "Course Code"}</span>
                  <span className="font-mono font-bold bg-accent/30 px-2 py-1 rounded">{subject.code}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/30">
                  <span className="text-muted-foreground text-sm">{lang === "ar" ? "الساعات المعتمدة" : "Credit Hours"}</span>
                  <span className="font-bold">{subject.credits}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/30">
                  <span className="text-muted-foreground text-sm">{lang === "ar" ? "السنة الدراسية" : "Academic Year"}</span>
                  <span className="font-bold">{subject.academicYear}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/30">
                  <span className="text-muted-foreground text-sm">{lang === "ar" ? "الفصل الدراسي" : "Semester"}</span>
                  <span className="font-bold">{subject.semester}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/30">
                  <span className="text-muted-foreground text-sm">{lang === "ar" ? "النوع" : "Type"}</span>
                  <span className="font-bold text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    {subject.type === "major" ? (lang === "ar" ? "متطلب تخصص" : "Major Req") : 
                     subject.type === "faculty" ? (lang === "ar" ? "متطلب كلية" : "Faculty Req") : 
                     (lang === "ar" ? "متطلب جامعة" : "University Req")}
                  </span>
                </div>
              </div>

              {!isEnrolled ? (
                <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold text-center leading-tight">
                  <Lock className="h-5 w-5 shrink-0 mx-auto mb-2" /> 
                  <span>{lang === "ar" ? "يجب التسجيل في المقرر من خلال الخطة الدراسية أولاً" : "You must register via Study Plan first"}</span>
                </div>
              ) : (
                <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-sm text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> {lang === "ar" ? "مسجل في المقرر ✓" : "Registered ✓"}
                </div>
              )}
            </div>
            
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold mb-3">{lang === "ar" ? "دكتور المادة" : "Professor"}</h3>
              <div className="flex items-center gap-3">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${subject.code}`} alt="" className="h-12 w-12 rounded-full bg-card" />
                <div>
                  <div className="text-sm font-semibold">{lang === "ar" ? "أ.د. محمد أحمد" : "Prof. Mohamed Ahmed"}</div>
                  <div className="text-xs text-muted-foreground">{lang === "ar" ? "أستاذ دكتور" : "Professor"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
