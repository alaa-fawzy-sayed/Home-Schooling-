import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import PageShell from "@/components/PageShell";
import CourseCard from "@/components/CourseCard";
import { SectionTitle } from "@/components/ui-kit";
import { useApp } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { courses, departments } from "@/lib/mock-data";
import type { DeptId } from "@/lib/mock-data";

export const Route = createFileRoute("/courses/")({
  component: CoursesIndexPage,
});

function CoursesIndexPage() {
  const { t, lang } = useApp();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<DeptId | "all">("all");

  const availableCourses = user ? courses.filter(c => c.dept === user.dept) : courses;
  const availableDepts = user ? departments.filter(d => d.id === user.dept) : departments;

  const filtered = useMemo(() => availableCourses.filter((c) => {
    const matchesQ = q === "" || c.titleAr.includes(q) || c.titleEn.toLowerCase().includes(q.toLowerCase()) || c.instructor.toLowerCase().includes(q.toLowerCase());
    const matchesF = filter === "all" || c.dept === filter;
    return matchesQ && matchesF;
  }), [q, filter, availableCourses]);

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <SectionTitle title={t("nav.courses")} subtitle={t("home.featured.sub")} center />

        <div className="flex flex-col md:flex-row gap-3 mb-8 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("courses.search")}
              className="w-full ps-10 pe-4 py-3 rounded-xl glass border border-border focus:neon-border outline-none text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${filter === "all" ? "gradient-primary text-white" : "glass"}`}>{t("courses.all")}</button>
            {availableDepts.map((d) => (
              <button key={d.id} onClick={() => setFilter(d.id)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${filter === d.id ? "gradient-primary text-white" : "glass"}`}>
                {lang === "ar" ? d.nameAr : d.nameEn}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No results</p>}
      </div>
    </PageShell>
  );
}
