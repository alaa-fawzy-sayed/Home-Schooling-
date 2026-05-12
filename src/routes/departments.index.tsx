import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Stethoscope, SmilePlus, FlaskConical, PawPrint, Atom, HardHat, BrainCircuit, HeartPulse, ArrowRight, Users, BookOpen } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Card, NeonButton, SectionTitle } from "@/components/ui-kit";
import { useApp } from "@/lib/i18n";
import { departments } from "@/lib/mock-data";

export const Route = createFileRoute("/departments/")({ component: DepartmentsPage });

const iconMap = { Stethoscope, SmilePlus, FlaskConical, PawPrint, Atom, HardHat, BrainCircuit, HeartPulse };

function DepartmentsPage() {
  const { t, lang } = useApp();
  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <SectionTitle title={t("nav.departments")} subtitle={t("home.departments.sub")} center />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((d, i) => {
            const Icon = iconMap[d.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to="/departments/$deptId" params={{ deptId: d.id }} className="block h-full">
                  <Card className="text-center h-full group">
                    <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${d.color} flex items-center justify-center mb-4 neon-glow group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{lang === "ar" ? d.nameAr : d.nameEn}</h3>
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{lang === "ar" ? d.descAr : d.descEn}</p>
                    <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{d.students}</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{d.courses}</span>
                    </div>
                    <NeonButton variant="outline" asChild>
                      {t("dept.enter")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                    </NeonButton>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
