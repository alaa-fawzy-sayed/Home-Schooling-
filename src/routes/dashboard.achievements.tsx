import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Star, Video, Award, Clock, Rocket, Lock } from "lucide-react";
import { useApp } from "@/lib/i18n";
import { studentAchievements } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/achievements")({
  component: AchievementsPage,
});

const iconMap = { Trophy, Star, Video, Award, Clock, Rocket };

function AchievementsPage() {
  const { t, lang } = useApp();
  const earned = studentAchievements.filter((a) => a.earned).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-1">{t("dash.achievements")}</h1>
        <p className="text-sm text-muted-foreground">{earned} من {studentAchievements.length} إنجاز محقق</p>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">التقدم الكلي</span>
          <span className="text-sm font-mono text-primary">{Math.round((earned / studentAchievements.length) * 100)}%</span>
        </div>
        <div className="h-3 rounded-full bg-accent overflow-hidden">
          <div className="h-full gradient-primary neon-glow" style={{ width: `${(earned / studentAchievements.length) * 100}%` }} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {studentAchievements.map((a) => {
          const Icon = iconMap[a.icon as keyof typeof iconMap];
          return (
            <div
              key={a.id}
              className={`glass rounded-2xl p-5 text-center transition-all ${a.earned ? "neon-border hover-lift" : "opacity-50"}`}
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3 ${
                a.earned ? "gradient-primary neon-glow" : "bg-accent"
              }`}>
                {a.earned ? <Icon className="h-8 w-8 text-white" /> : <Lock className="h-7 w-7 text-muted-foreground" />}
              </div>
              <div className="font-bold text-sm mb-1">{lang === "ar" ? a.titleAr : a.titleEn}</div>
              <div className="text-[10px] text-muted-foreground">{a.earned ? "✓ تم الإنجاز" : "مغلق"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
