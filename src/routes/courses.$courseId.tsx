import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { courses, departments } from "@/lib/mock-data";
import PageShell from "@/components/PageShell";
import { Modal, ModalInput, ModalSelect, BtnPrimary, BtnSecondary } from "@/components/modal";
import {
  Play, Clock, Users, BookOpen, Star, Lock, CheckCircle2, ArrowRight, ArrowLeft,
  ChevronDown, ChevronUp, Award, CreditCard, Shield, Globe, FileText, Download,
  PlayCircle, Pause, Volume2, Maximize, SkipForward, SkipBack
} from "lucide-react";

export const Route = createFileRoute("/courses/$courseId")({
  component: CourseDetailPage,
});

// Course curriculum data with real video links
const courseCurriculum: Record<number, { sections: { title: string; titleEn: string; lessons: { id: number; title: string; titleEn: string; duration: string; type: "video" | "quiz" | "assignment"; isFree: boolean; videoUrl?: string }[] }[] }> = {
  1: { sections: [
    { title: "مقدمة في علم التشريح", titleEn: "Introduction to Anatomy", lessons: [
      { id: 1, title: "ما هو علم التشريح؟", titleEn: "What is Anatomy?", duration: "12:30", type: "video", isFree: true, videoUrl: "https://www.youtube.com/embed/uBGl2BujkPQ" },
      { id: 2, title: "المصطلحات الطبية", titleEn: "Medical Terminology", duration: "18:45", type: "video", isFree: true, videoUrl: "https://www.youtube.com/embed/8vM69f9o0Kk" },
      { id: 3, title: "مقدمة في الجهاز الهيكلي", titleEn: "Skeletal System Intro", duration: "15:20", type: "video", isFree: false, videoUrl: "https://www.youtube.com/embed/f-FF7Sbfh6M" },
      { id: 4, title: "اختبار: الأساسيات", titleEn: "Quiz: Basics", duration: "10:00", type: "quiz", isFree: false },
    ]},
  ]},
};

// Default curriculum for courses without specific data
const defaultCurriculum = { sections: [
  { title: "المقدمة والأساسيات", titleEn: "Introduction & Basics", lessons: [
    { id: 101, title: "مقدمة في المادة", titleEn: "Course Introduction", duration: "10:00", type: "video" as const, isFree: true, videoUrl: "https://www.youtube.com/embed/m7H-U7V7Bmc" },
    { id: 102, title: "نظرة عامة على المنهج", titleEn: "Curriculum Overview", duration: "08:30", type: "video" as const, isFree: true, videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk" },
    { id: 103, title: "الدرس الأول: البداية", titleEn: "Lesson 1: Getting Started", duration: "15:20", type: "video" as const, isFree: false, videoUrl: "https://www.youtube.com/embed/m7H-U7V7Bmc" },
    { id: 104, title: "اختبار تجريبي", titleEn: "Mock Quiz", duration: "20:45", type: "quiz" as const, isFree: false },
  ]},
]};

const coursesPricing: Record<number, number> = {
  1: 1240, 2: 890, 3: 2150, 4: 1780, 5: 3200, 6: 2890, 7: 1950, 8: 670,
  9: 2740, 10: 1620, 11: 2110, 12: 1880, 13: 1540, 14: 980, 15: 1320, 16: 870,
  17: 999, 18: 1200, 19: 1100, 20: 850, 21: 950, 22: 1050, 23: 1300, 24: 1250, 25: 1150, 26: 1400
};

function CourseDetailPage() {
  const { lang } = useApp();
  const { user, enrollCourse } = useAuth();
  const navigate = useNavigate();
  const { courseId } = Route.useParams();
  const id = parseInt(courseId);
  const course = courses.find((c) => c.id === id);

  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!course) {
    return <PageShell><div className="container mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">{lang === "ar" ? "الكورس غير موجود" : "Course Not Found"}</h1></div></PageShell>;
  }

  const dept = departments.find((d) => d.id === course.dept);
  const curriculum = courseCurriculum[course.id] || defaultCurriculum;
  const totalLessons = curriculum.sections.reduce((a, s) => a + s.lessons.length, 0);
  const isEnrolled = user?.enrolledCourses.includes(course.id) ?? false;
  const isPurchased = isEnrolled || paymentSuccess;
  const price = coursesPricing[course.id] || 999;

  // Check requirements
  // @ts-ignore
  const courseYear = course.academicYear || 1;
  // @ts-ignore
  const prereqs = course.prerequisites || [];
  
  let lockReason: string | null = null;
  if (user && courseYear > user.level) {
    lockReason = lang === "ar" ? `مغلق: مخصصة لطلاب السنة ${courseYear}` : `Locked: Requires Year ${courseYear}`;
  } else if (user && prereqs.length > 0) {
    const missing = prereqs.filter((pid: number) => !user.passedCourses?.includes(pid));
    if (missing.length > 0) {
      const missingNames = missing.map((pid: number) => {
        const c = courses.find((c) => c.id === pid);
        return lang === "ar" ? c?.titleAr : c?.titleEn;
      }).join(" + ");
      lockReason = lang === "ar" ? `مغلق: يتطلب ${missingNames}` : `Locked: Requires ${missingNames}`;
    }
  }

  const toggleSection = (i: number) => setExpandedSections((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);

  const canAccessLesson = (lesson: { isFree: boolean }) => lesson.isFree || isPurchased;

  const handlePurchase = () => {
    const success = enrollCourse(course.id);
    if (success) {
      setPaymentOpen(false);
      setPaymentSuccess(true);
      toast.success(lang === "ar" ? "تم الدفع والاشتراك بنجاح! 🎉" : "Payment successful! 🎉");
    } else {
      setPaymentOpen(false); // Close payment modal even if failed
    }
  };

  const playLesson = (lessonId: number) => {
    setActiveLesson(lessonId);
    setIsPlaying(true);
  };

  // Find active lesson details
  const activeLessonData = activeLesson ? curriculum.sections.flatMap((s) => s.lessons).find((l) => l.id === activeLesson) : null;

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <button onClick={() => navigate({ to: "/courses" })} className="hover:text-primary transition-colors">{lang === "ar" ? "الكورسات" : "Courses"}</button>
          <span>/</span>
          <span>{lang === "ar" ? course.titleAr : course.titleEn}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="relative rounded-2xl overflow-hidden glass aspect-video group shadow-2xl">
              {activeLesson && activeLessonData && activeLessonData.videoUrl ? (
                <iframe 
                  src={activeLessonData.videoUrl + "?autoplay=1"} 
                  title="Video lesson" 
                  className="w-full h-full border-none" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <>
                  <img src={course.thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    <button onClick={() => { const first = curriculum.sections[0]?.lessons[0]; if (first) playLesson(first.id); }}
                      className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center neon-glow hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-white ms-1" />
                    </button>
                    {!isPurchased && (
                      <div className="mt-4 px-4 py-2 rounded-full glass border border-white/20 text-white text-xs font-medium flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5" /> {lang === "ar" ? "اشترك لفتح كامل المحتوى" : "Enroll to unlock full content"}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-4 start-4">
                    {dept && <span className={`px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${dept.color} text-white`}>{lang === "ar" ? dept.nameAr : dept.nameEn}</span>}
                  </div>
                </>
              )}
            </div>

            {/* Course Info */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">{lang === "ar" ? course.titleAr : course.titleEn}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {course.students.toLocaleString()} {lang === "ar" ? "طالب جامعي" : "university students"}</span>
                <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {course.lessons} {lang === "ar" ? "درس" : "lessons"}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {course.hours} {lang === "ar" ? "ساعة" : "hours"}</span>
                <span className="flex items-center gap-1">{[1,2,3,4,5].map((i) => <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.floor(course.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />)} <span className="font-bold">{course.rating}</span></span>
              </div>
              <div className="flex items-center gap-3">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor}`} alt="" className="h-10 w-10 rounded-full bg-card" />
                <div><div className="text-sm font-semibold">{course.instructor}</div><div className="text-xs text-muted-foreground">{lang === "ar" ? "المدرّب" : "Instructor"}</div></div>
              </div>
            </div>

            {/* What you'll learn */}
            <div className="glass rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4">{lang === "ar" ? "ماذا ستتعلم؟" : "What you'll learn"}</h2>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {[
                  lang === "ar" ? "فهم المفاهيم الأساسية بعمق" : "Deep understanding of core concepts",
                  lang === "ar" ? "تطبيقات عملية حقيقية" : "Real-world practical applications",
                  lang === "ar" ? "مشاريع من الصفر للاحتراف" : "Projects from zero to professional",
                  lang === "ar" ? "شهادة إتمام معتمدة" : "Certified completion certificate",
                  lang === "ar" ? "دعم فني ومتابعة مستمرة" : "Technical support & followup",
                  lang === "ar" ? "وصول مدى الحياة للمحتوى" : "Lifetime access to content",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" /><span className="text-sm">{item}</span></div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border/30">
                <h2 className="font-bold text-lg">{lang === "ar" ? "محتوى الكورس" : "Course Curriculum"}</h2>
                <p className="text-xs text-muted-foreground">{curriculum.sections.length} {lang === "ar" ? "أقسام" : "sections"} · {totalLessons} {lang === "ar" ? "درس" : "lessons"}</p>
              </div>
              {curriculum.sections.map((section, si) => (
                <div key={si}>
                  <button onClick={() => toggleSection(si)} className="w-full flex items-center justify-between px-6 py-3 hover:bg-accent/10 transition-colors border-b border-border/20">
                    <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-lg gradient-primary text-white text-[10px] flex items-center justify-center font-bold">{si + 1}</span><span className="text-sm font-bold">{lang === "ar" ? section.title : section.titleEn}</span><span className="text-[10px] text-muted-foreground">{section.lessons.length} {lang === "ar" ? "دروس" : "lessons"}</span></div>
                    {expandedSections.includes(si) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {expandedSections.includes(si) && (
                    <div>
                      {section.lessons.map((lesson) => {
                        const accessible = canAccessLesson(lesson);
                        const isActive = activeLesson === lesson.id;
                        return (
                          <button key={lesson.id} onClick={() => accessible ? playLesson(lesson.id) : !isPurchased && setPaymentOpen(true)}
                            className={`w-full flex items-center gap-3 px-6 py-3 text-start transition-colors ${isActive ? "bg-primary/10 border-s-2 border-primary" : "hover:bg-accent/10 border-s-2 border-transparent"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${accessible ? (isActive ? "gradient-primary text-white" : "bg-accent/30") : "bg-accent/10"}`}>
                              {accessible ? <PlayCircle className="h-4 w-4" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{lang === "ar" ? lesson.title : lesson.titleEn}</div>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                <span>{lesson.duration}</span>
                                {lesson.isFree && <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">{lang === "ar" ? "مجاني" : "Free"}</span>}
                                {lesson.type === "quiz" && <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold">{lang === "ar" ? "اختبار" : "Quiz"}</span>}
                                {lesson.type === "assignment" && <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">{lang === "ar" ? "تطبيق" : "Lab"}</span>}
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
            {/* Price Card */}
            <div className="glass rounded-2xl p-6 neon-border">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold gradient-text mb-1">{price} <span className="text-lg">{lang === "ar" ? "ج.م" : "EGP"}</span></div>
                <div className="text-xs text-muted-foreground line-through">{Math.round(price * 1.5)} {lang === "ar" ? "ج.م" : "EGP"}</div>
                <div className="inline-block mt-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold">{lang === "ar" ? "خصم 33%" : "33% OFF"}</div>
              </div>

              {isPurchased ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-sm">
                    <CheckCircle2 className="h-5 w-5" /> {lang === "ar" ? "مشترك بالكورس ✓" : "Enrolled ✓"}
                  </div>
                  <button onClick={() => { const l = curriculum.sections[0]?.lessons[0]; if (l) playLesson(l.id); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl gradient-primary text-white font-bold text-sm neon-glow hover:scale-105 transition-transform">
                    <Play className="h-4 w-4" /> {lang === "ar" ? "ابدأ التعلم" : "Start Learning"}
                  </button>
                </div>
              ) : lockReason ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold text-center leading-tight">
                    <Lock className="h-5 w-5 shrink-0" /> 
                    <span>{lockReason}</span>
                  </div>
                  <button disabled className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent/50 text-muted-foreground font-bold text-sm cursor-not-allowed">
                    {lang === "ar" ? "غير متاح للتسجيل" : "Not Available for Enrollment"}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button onClick={() => setPaymentOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-primary text-white font-bold text-sm neon-glow hover:scale-105 transition-transform">
                    <CreditCard className="h-4 w-4" /> {lang === "ar" ? "اشترك الآن" : "Enroll Now"}
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent/30 border border-border/50 text-sm font-medium hover:bg-accent transition-colors">
                    {lang === "ar" ? "جرّب مجاناً" : "Try Free Lessons"}
                  </button>
                </div>
              )}

              <div className="mt-4 space-y-2.5 text-xs">
                {[
                  { icon: Clock, text: lang === "ar" ? `${course.hours} ساعة محتوى` : `${course.hours} hours of content` },
                  { icon: BookOpen, text: lang === "ar" ? `${course.lessons} درس` : `${course.lessons} lessons` },
                  { icon: Award, text: lang === "ar" ? "شهادة إتمام" : "Completion Certificate" },
                  { icon: Globe, text: lang === "ar" ? "وصول مدى الحياة" : "Lifetime Access" },
                  { icon: FileText, text: lang === "ar" ? "ملفات ومصادر إضافية" : "Extra files & resources" },
                  { icon: Shield, text: lang === "ar" ? "ضمان استرجاع 30 يوم" : "30-day money back" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted-foreground"><item.icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />{item.text}</div>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="glass rounded-2xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">{lang === "ar" ? "شارك هذا الكورس" : "Share this course"}</p>
              <div className="flex justify-center gap-2">
                {["Facebook", "Twitter", "WhatsApp", "LinkedIn"].map((s) => (
                  <button key={s} onClick={() => toast.success(lang === "ar" ? `تم النسخ لـ ${s} ✓` : `Copied for ${s} ✓`)}
                    className="px-3 py-1.5 rounded-lg bg-accent/30 hover:bg-accent text-[10px] font-medium transition-colors">{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal open={paymentOpen} onClose={() => setPaymentOpen(false)} title={lang === "ar" ? "إتمام عملية الدفع" : "Complete Payment"} size="lg"
        footer={<><BtnSecondary onClick={() => setPaymentOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</BtnSecondary><BtnPrimary onClick={handlePurchase}>{lang === "ar" ? `ادفع ${price} ج.م` : `Pay ${price} EGP`}</BtnPrimary></>}>
        <div className="space-y-5">
          {/* Course summary */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/20">
            <img src={course.thumb} alt="" className="h-14 w-20 rounded-lg object-cover" />
            <div className="flex-1"><div className="text-sm font-bold">{lang === "ar" ? course.titleAr : course.titleEn}</div><div className="text-[10px] text-muted-foreground">{course.instructor}</div></div>
            <div className="text-lg font-bold gradient-text">{price} <span className="text-xs">{lang === "ar" ? "ج.م" : "EGP"}</span></div>
          </div>

          {/* Payment method */}
          <div>
            <label className="text-xs font-bold mb-2 block">{lang === "ar" ? "طريقة الدفع" : "Payment Method"}</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "card", label: lang === "ar" ? "بطاقة ائتمان" : "Credit Card", icon: "💳" },
                { id: "wallet", label: lang === "ar" ? "المحفظة الإلكترونية" : "E-Wallet", icon: "📱" },
                { id: "fawry", label: "Fawry", icon: "🏪" },
              ].map((m) => (
                <button key={m.id} className="p-3 rounded-xl border border-border/30 hover:border-primary hover:bg-primary/5 transition-all text-center">
                  <div className="text-2xl mb-1">{m.icon}</div>
                  <div className="text-[10px] font-semibold">{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Card details */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><ModalInput label={lang === "ar" ? "اسم صاحب البطاقة" : "Cardholder Name"} placeholder="John Doe" /></div>
            <div className="sm:col-span-2"><ModalInput label={lang === "ar" ? "رقم البطاقة" : "Card Number"} placeholder="0000 0000 0000 0000" /></div>
            <ModalInput label={lang === "ar" ? "تاريخ الانتهاء" : "Expiry Date"} placeholder="MM/YY" />
            <ModalInput label={lang === "ar" ? "رمز الأمان CVV" : "CVV"} placeholder="000" />
          </div>

          {/* Coupon */}
          <div className="flex gap-2">
            <input placeholder={lang === "ar" ? "كود الخصم" : "Coupon code"} className="flex-1 px-4 py-2.5 rounded-xl bg-accent/30 border border-border/50 text-sm outline-none" />
            <button className="px-4 py-2.5 rounded-xl bg-accent/30 border border-border/50 text-sm font-medium hover:bg-accent">{lang === "ar" ? "تطبيق" : "Apply"}</button>
          </div>

          {/* Summary */}
          <div className="p-4 rounded-xl bg-accent/10 border border-border/30 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{lang === "ar" ? "سعر الكورس" : "Course Price"}</span><span>{Math.round(price * 1.5)} {lang === "ar" ? "ج.م" : "EGP"}</span></div>
            <div className="flex justify-between text-green-400"><span>{lang === "ar" ? "الخصم" : "Discount"}</span><span>-{Math.round(price * 0.5)} {lang === "ar" ? "ج.م" : "EGP"}</span></div>
            <div className="border-t border-border/30 pt-2 flex justify-between font-bold text-base"><span>{lang === "ar" ? "الإجمالي" : "Total"}</span><span className="gradient-text">{price} {lang === "ar" ? "ج.م" : "EGP"}</span></div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground"><Shield className="h-3.5 w-3.5 text-green-400" />{lang === "ar" ? "الدفع مؤمّن بالكامل ومشفر — ضمان استرجاع 30 يوم" : "Fully secured & encrypted payment — 30-day money back guarantee"}</div>
        </div>
      </Modal>
    </PageShell>
  );
}
