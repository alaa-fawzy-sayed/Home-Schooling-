import { createFileRoute } from "@tanstack/react-router";
import { Award, TrendingUp } from "lucide-react";
import { useApp } from "@/lib/i18n";
import { studentGrades } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/grades")({
  component: GradesPage,
});

function GradesPage() {
  const { t } = useApp();
  const totalCredits = studentGrades.reduce((s, g) => s + g.credits, 0);
  const weighted = studentGrades.reduce((s, g) => s + g.points * g.credits, 0);
  const gpa = (weighted / totalCredits).toFixed(2);

  const gradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-400 bg-green-500/20";
    if (grade.startsWith("B")) return "text-cyan-400 bg-cyan-500/20";
    if (grade.startsWith("C")) return "text-yellow-400 bg-yellow-500/20";
    return "text-red-400 bg-red-500/20";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-1">{t("dash.grades")}</h1>
        <p className="text-sm text-muted-foreground">سجلك الأكاديمي ومعدلك التراكمي</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 text-center neon-border">
          <Award className="h-8 w-8 mx-auto text-primary mb-2" />
          <div className="text-3xl font-display font-black gradient-text">{gpa}</div>
          <div className="text-xs text-muted-foreground">{t("dash.gpa")} / 4.0</div>
        </div>
        <div className="glass rounded-2xl p-5 text-center">
          <TrendingUp className="h-8 w-8 mx-auto text-primary mb-2" />
          <div className="text-3xl font-display font-black gradient-text">{totalCredits}</div>
          <div className="text-xs text-muted-foreground">{t("dash.credits")}</div>
        </div>
        <div className="glass rounded-2xl p-5 text-center">
          <Award className="h-8 w-8 mx-auto text-primary mb-2" />
          <div className="text-3xl font-display font-black gradient-text">{studentGrades.length}</div>
          <div className="text-xs text-muted-foreground">مقررات مكتملة</div>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-bold">سجل المقررات</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-accent/30 text-xs">
              <tr>
                <th className="text-start p-3 font-semibold">المقرر</th>
                <th className="text-start p-3 font-semibold">الكود</th>
                <th className="p-3 font-semibold">الساعات</th>
                <th className="p-3 font-semibold">{t("dash.score")}</th>
                <th className="p-3 font-semibold">النقاط</th>
              </tr>
            </thead>
            <tbody>
              {studentGrades.map((g, i) => (
                <tr key={i} className="border-t border-border hover:bg-accent/20">
                  <td className="p-3 font-medium">{g.course}</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{g.code}</td>
                  <td className="p-3 text-center">{g.credits}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${gradeColor(g.grade)}`}>
                      {g.grade}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono">{g.points.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
