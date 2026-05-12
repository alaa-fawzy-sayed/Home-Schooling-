import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock, PlayCircle, PlusCircle, Trash2, GraduationCap, Clock, Award, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { departments } from "@/lib/mock-data";
import { subjects } from "@/lib/subjects-data";

export const Route = createFileRoute("/dashboard/roadmap")({
  component: RoadmapPage,
});

function RoadmapPage() {
  const { lang } = useApp();
  const { user, registerSubject, unregisterSubject } = useAuth();
  const [expandedYears, setExpandedYears] = useState<number[]>([1, 2, 3, 4]);

  if (!user) return null;

  const dept = departments.find(d => d.id === user.dept);
  const deptSubjects = subjects.filter(s => s.dept === user.dept);

  // Group by academic year
  const years = [1, 2, 3, 4];
  const semesters = [1, 2];

  const toggleYear = (y: number) => {
    setExpandedYears(p => p.includes(y) ? p.filter(x => x !== y) : [...p, y]);
  };

  const getSubjectStatus = (subject: typeof subjects[0]) => {
    if (user.passedSubjects?.includes(subject.id)) return "passed";
    if (user.enrolledSubjects?.includes(subject.id)) return "enrolled";
    
    if (subject.academicYear > user.level) return "locked_level";
    
    const missingPrereqs = (subject.prerequisites || []).filter((pid: number) => !user.passedSubjects?.includes(pid));
    if (missingPrereqs.length > 0) return "locked_prereqs";

    return "available";
  };

  const totalCredits = user.passedSubjects?.reduce((acc, id) => {
    const s = subjects.find(sub => sub.id === id);
    return acc + (s?.credits || 0);
  }, 0) || 0;

  const enrolledCredits = user.enrolledSubjects?.reduce((acc, id) => {
    const s = subjects.find(sub => sub.id === id);
    return acc + (s?.credits || 0);
  }, 0) || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            {lang === "ar" ? "الخريطة الأكاديمية" : "Academic Roadmap"}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {lang === "ar" ? `تخصص ${dept?.nameAr}` : `${dept?.nameEn} Major`}
          </p>
        </div>

        <div className="flex gap-4">
          <div className="glass px-6 py-4 rounded-2xl neon-border border-primary/30 text-center">
            <div className="text-xs text-muted-foreground mb-1">{lang === "ar" ? "المستوى الحالي" : "Current Level"}</div>
            <div className="text-2xl font-black gradient-text">0{user.level}</div>
          </div>
          <div className="glass px-6 py-4 rounded-2xl neon-border border-blue-500/30 text-center">
            <div className="text-xs text-muted-foreground mb-1">{lang === "ar" ? "الساعات المكتسبة" : "Earned Credits"}</div>
            <div className="text-2xl font-black text-blue-400">{totalCredits}</div>
          </div>
          <div className="glass px-6 py-4 rounded-2xl neon-border border-purple-500/30 text-center">
            <div className="text-xs text-muted-foreground mb-1">{lang === "ar" ? "المعدل التراكمي" : "GPA"}</div>
            <div className="text-2xl font-black text-purple-400">{user.gpa.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Progress Bar overall */}
      <div className="glass p-4 rounded-2xl relative overflow-hidden">
        <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2 relative z-10">
          <span>{lang === "ar" ? "البداية" : "Start"}</span>
          <span>{lang === "ar" ? "التخرج (144 ساعة)" : "Graduation (144 Credits)"}</span>
        </div>
        <div className="h-3 bg-accent/50 rounded-full relative z-10 overflow-hidden">
          <div className="h-full gradient-primary rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (totalCredits / 144) * 100)}%` }} />
        </div>
        {/* Glow effect */}
        <div className="absolute top-1/2 left-0 right-0 h-10 bg-primary/20 blur-2xl -translate-y-1/2 rounded-full" style={{ width: `${Math.min(100, (totalCredits / 144) * 100)}%` }} />
      </div>

      {/* Timeline */}
      <div className="relative mt-12 space-y-8">
        {/* Vertical Line */}
        <div className="absolute top-0 bottom-0 start-[20px] md:start-1/2 w-1 bg-border/50 rounded-full -translate-x-1/2" />

        {years.map((year, yearIndex) => {
          const isCurrentYear = user.level === year;
          const isFutureYear = user.level < year;
          const isExpanded = expandedYears.includes(year);

          return (
            <div key={year} className={`relative flex flex-col md:flex-row items-start md:justify-center gap-8 ${isFutureYear ? "opacity-75" : ""}`}>
              {/* Year Marker */}
              <div className="absolute start-[20px] md:start-1/2 -translate-x-1/2 -translate-y-4 z-10">
                <button onClick={() => toggleYear(year)}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-background transition-transform hover:scale-110 shadow-xl ${
                    isCurrentYear ? "gradient-primary text-white neon-glow" : 
                    !isFutureYear ? "bg-green-500 text-white" : "bg-accent text-muted-foreground"
                  }`}>
                  <span className="font-bold">Y{year}</span>
                </button>
              </div>

              {isExpanded && (
                <div className="w-full grid md:grid-cols-2 gap-8 pt-10 px-10 md:px-0">
                  {semesters.map((semester, semIndex) => {
                    const semesterSubjects = deptSubjects.filter(s => s.academicYear === year && s.semester === semester);
                    // Determine side: odd years/semesters layout logically. Let's say semester 1 is left (md:col-start-1), semester 2 is right (md:col-start-2)
                    const isLeft = semester === 1;

                    return (
                      <div key={semester} className={`relative glass p-6 rounded-3xl border border-border/50 hover:border-primary/30 transition-all ${
                        isLeft ? "md:col-start-1 md:text-end" : "md:col-start-2"
                      }`}>
                        {/* Connecting branch */}
                        <div className={`hidden md:block absolute top-6 w-8 h-1 bg-border/50 ${
                          isLeft ? "-end-8" : "-start-8"
                        }`} />

                        <div className={`flex items-center gap-3 mb-6 ${isLeft ? "md:flex-row-reverse" : ""}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${
                            isCurrentYear ? "gradient-primary" : "bg-accent-foreground/20 text-muted-foreground"
                          }`}>
                            S{semester}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{lang === "ar" ? `الفصل الدراسي ${semester === 1 ? 'الأول' : 'الثاني'}` : `Semester ${semester}`}</h3>
                            <p className="text-xs text-muted-foreground">{semesterSubjects.length} {lang === "ar" ? "مقررات" : "Subjects"}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {semesterSubjects.map(subject => {
                            const status = getSubjectStatus(subject);
                            
                            let statusClasses = "";
                            let badgeClasses = "";
                            let typeBadgeColor = "";

                            // Type badge color
                            if (subject.type === "major") typeBadgeColor = "bg-green-500/20 text-green-400";
                            else if (subject.type === "faculty") typeBadgeColor = "bg-purple-500/20 text-purple-400";
                            else typeBadgeColor = "bg-blue-500/20 text-blue-400";

                            switch(status) {
                              case "passed":
                                statusClasses = "border-green-500/30 bg-green-500/5";
                                badgeClasses = "bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]";
                                break;
                              case "enrolled":
                                statusClasses = "border-primary bg-primary/10 neon-border scale-105 my-2 z-10 relative";
                                badgeClasses = "gradient-primary text-white neon-glow";
                                break;
                              case "available":
                                statusClasses = "border-border/50 hover:border-primary hover:bg-accent/30";
                                badgeClasses = "bg-accent text-foreground";
                                break;
                              case "locked_level":
                              case "locked_prereqs":
                                statusClasses = "border-transparent bg-background/30 opacity-60 grayscale-[0.5]";
                                badgeClasses = "bg-background/50 text-muted-foreground";
                                break;
                            }

                            return (
                              <div key={subject.id} className={`p-4 rounded-2xl border transition-all duration-300 group text-start ${statusClasses}`}>
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <div className="flex gap-2 items-center mb-1">
                                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${typeBadgeColor}`}>
                                        {subject.type.toUpperCase()}
                                      </span>
                                      <span className="text-[10px] font-mono text-muted-foreground bg-background/50 px-1.5 rounded">{subject.code}</span>
                                    </div>
                                    <div className="font-bold text-sm md:text-base leading-tight">
                                      {lang === "ar" ? subject.titleAr : subject.titleEn}
                                    </div>
                                  </div>
                                  <div className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 ${badgeClasses}`}>
                                    {status === "passed" && <CheckCircle2 className="h-3.5 w-3.5" />}
                                    {status === "enrolled" && <PlayCircle className="h-3.5 w-3.5" />}
                                    {status === "available" && <PlusCircle className="h-3.5 w-3.5" />}
                                    {(status === "locked_level" || status === "locked_prereqs") && <Lock className="h-3.5 w-3.5" />}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3">
                                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {subject.credits} {lang === "ar" ? "ساعات" : "CH"}</span>
                                  {status === "locked_prereqs" && subject.prerequisites && subject.prerequisites.length > 0 && (
                                    <span className="text-red-400 text-[10px] flex items-center gap-1">
                                      <Lock className="h-2.5 w-2.5" /> 
                                      {subject.prerequisites.map(pid => subjects.find(s => s.id === pid)?.code).join(", ")}
                                    </span>
                                  )}
                                </div>

                                {/* Actions for Enrolled / Available */}
                                <div className={`mt-4 pt-3 border-t border-border/50 flex justify-end gap-2 overflow-hidden transition-all ${
                                  status === "available" || status === "enrolled" ? "h-auto opacity-100" : "h-0 opacity-0 pt-0 mt-0 border-none"
                                }`}>
                                  {status === "available" && (
                                    <button onClick={() => {
                                      const success = registerSubject(subject.id);
                                      if (success) toast.success(lang === "ar" ? "تم تسجيل المادة بنجاح ✓" : "Subject registered successfully ✓");
                                    }} 
                                      className="text-xs font-bold px-4 py-2 rounded-xl gradient-primary text-white hover:scale-105 transition-transform flex items-center gap-1">
                                      <PlusCircle className="h-3.5 w-3.5" /> {lang === "ar" ? "تسجيل المادة" : "Register"}
                                    </button>
                                  )}
                                  {status === "enrolled" && (
                                    <>
                                      <Link to="/subjects/$subjectId" params={{ subjectId: subject.id.toString() }} className="text-xs font-bold px-4 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-white transition-colors flex items-center gap-1">
                                        <PlayCircle className="h-3.5 w-3.5" /> {lang === "ar" ? "دخول القاعة" : "Enter Class"}
                                      </Link>
                                      <button onClick={() => unregisterSubject(subject.id)} 
                                        className="text-xs font-bold px-3 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1">
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {semesterSubjects.length === 0 && (
                            <div className="text-center py-6 border border-dashed border-border/50 rounded-2xl text-muted-foreground text-sm">
                              {lang === "ar" ? "لا توجد مقررات مسجلة لهذا الفصل" : "No subjects registered for this semester"}
                           </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
