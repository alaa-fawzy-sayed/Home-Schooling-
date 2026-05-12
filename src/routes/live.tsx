import { createFileRoute } from "@tanstack/react-router";
import { Radio, Calendar } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Card, NeonButton, SectionTitle, Badge } from "@/components/ui-kit";
import { useApp } from "@/lib/i18n";
import { liveClasses } from "@/lib/mock-data";

export const Route = createFileRoute("/live")({
  component: LivePage,
});

function LivePage() {
  const { t, lang } = useApp();
  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <SectionTitle title={t("nav.live")} center />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveClasses.map((l) => (
            <Card key={l.id}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center neon-glow">
                  <Radio className="h-6 w-6 text-white" />
                </div>
                {l.isLive ? <Badge variant="live">● {t("live.live")}</Badge> : <Badge>{t("live.upcoming")}</Badge>}
              </div>
              <h3 className="font-bold text-lg mb-1">{lang === "ar" ? l.titleAr : l.titleEn}</h3>
              <p className="text-xs text-muted-foreground mb-2">{l.instructor}</p>
              <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(l.time).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
              </p>
              <NeonButton className="w-full">{t("live.join")}</NeonButton>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
