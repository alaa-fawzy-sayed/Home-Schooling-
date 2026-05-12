import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Card, SectionTitle } from "@/components/ui-kit";
import { useApp } from "@/lib/i18n";
import { books, departments } from "@/lib/mock-data";
import type { DeptId } from "@/lib/mock-data";

export const Route = createFileRoute("/books")({
  component: BooksPage,
});

function BooksPage() {
  const { t, lang } = useApp();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<DeptId | "all">("all");

  const filtered = useMemo(() => books.filter((b) => {
    const matchesQ = q === "" || b.titleAr.includes(q) || b.titleEn.toLowerCase().includes(q.toLowerCase());
    const matchesF = filter === "all" || b.dept === filter;
    return matchesQ && matchesF;
  }), [q, filter]);

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <SectionTitle title={t("nav.books")} center />

        <div className="flex flex-col md:flex-row gap-3 mb-8 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("books.search")}
              className="w-full ps-10 pe-4 py-3 rounded-xl glass border border-border focus:neon-border outline-none text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${filter === "all" ? "gradient-primary text-white" : "glass"}`}>{t("courses.all")}</button>
            {departments.map((d) => (
              <button key={d.id} onClick={() => setFilter(d.id)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${filter === d.id ? "gradient-primary text-white" : "glass"}`}>
                {lang === "ar" ? d.nameAr : d.nameEn}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((b) => (
            <Card key={b.id} className="p-0 overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden">
                <img src={b.cover} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1 line-clamp-2">{lang === "ar" ? b.titleAr : b.titleEn}</h3>
                <p className="text-xs text-muted-foreground mb-3">{b.author} • {b.pages}p</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => b.pdfUrl && window.open(b.pdfUrl, "_blank")}
                    className="flex-1 px-2 py-1.5 text-xs rounded-lg neon-border text-primary hover:bg-primary/5 transition-colors"
                  >
                    {t("books.view")}
                  </button>
                  <button 
                    onClick={() => b.pdfUrl && window.open(b.pdfUrl, "_blank")}
                    className="flex-1 px-2 py-1.5 text-xs rounded-lg gradient-primary text-white hover:opacity-90 transition-opacity"
                  >
                    {t("books.download")}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
