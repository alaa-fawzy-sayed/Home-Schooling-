import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Target, Award, Users, Zap, Globe } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Card, SectionTitle } from "@/components/ui-kit";
import { useApp } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — E-Learning Nova" }, { name: "description", content: "About E-Learning Nova" }] }),
  component: AboutPage,
});

function AboutPage() {
  const { t, lang } = useApp();
  const features = [
    { icon: Sparkles, ar: "محتوى متجدد", en: "Fresh Content" },
    { icon: Award, ar: "شهادات معتمدة", en: "Certified" },
    { icon: Users, ar: "نخبة من الأساتذة والخبراء", en: "Elite Faculty & Experts" },
    { icon: Zap, ar: "تعلم تفاعلي", en: "Interactive" },
    { icon: Globe, ar: "مجتمع عالمي", en: "Global Community" },
    { icon: Target, ar: "مسار محدد", en: "Clear Path" },
  ];

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        <SectionTitle title={t("about.title")} center />
        <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">{t("about.intro")}</p>

        <Card className="mb-12 text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-2 gradient-text">{t("about.vision")}</h3>
          <p className="text-muted-foreground">{t("about.vision.text")}</p>
        </Card>

        <h3 className="text-2xl font-bold mb-6 text-center"><span className="gradient-text">{t("about.features")}</span></h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="text-center">
                <f.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="font-semibold">{lang === "ar" ? f.ar : f.en}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
