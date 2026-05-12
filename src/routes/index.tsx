import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Rocket, Stethoscope, SmilePlus, FlaskConical, PawPrint, Atom, HardHat, BrainCircuit, HeartPulse, Star, Zap, Trophy, GraduationCap, Award, Users, BookOpen, Globe2, Building2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Card, NeonButton, SectionTitle } from "@/components/ui-kit";
import CourseCard from "@/components/CourseCard";
import { useApp } from "@/lib/i18n";
import { departments, courses, testimonials, stats, faculties, newsItems } from "@/lib/mock-data";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const iconMap = { Stethoscope, SmilePlus, FlaskConical, PawPrint, Atom, HardHat, BrainCircuit, HeartPulse, Building2 };

function HomePage() {
  const { t, lang } = useApp();
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-primary/10" />
          {[
            [21,54],[64,31],[40,44],[48,56],[22,23],[68,77],[85,12],[13,68],[55,90],[37,15],
            [91,42],[76,63],[8,85],[43,7],[62,48],[29,73],[82,35],[17,92],[50,20],[95,58],
            [33,81],[71,4],[6,37],[88,66],[46,50],[59,88],[25,14],[78,71],[14,46],[53,27],
          ].map(([x, y], i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary"
              style={{ left: `${x}%`, top: `${y}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: (i % 7) * 0.3 }}
            />
          ))}

          {/* orbital rings */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/5"
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="flex justify-center mb-8"
          >
            <img
              src={logo}
              alt="E-Learning Nova"
              className="h-28 w-28 md:h-36 md:w-36 lg:h-44 lg:w-44 rounded-3xl neon-glow object-contain drop-shadow-[0_0_30px_rgba(var(--primary-rgb,59,130,246),0.5)]"
              style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-6">
              <Award className="h-4 w-4 text-primary" />
              <span className="gradient-text font-semibold">{t("uni.accreditation")}</span>
              <span className="text-muted-foreground">•</span>
              <span>EST. 2020</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
          >
            {t("hero.title")} <br />
            <span className="gradient-text neon-text">{t("uni.name")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            {t("uni.tagline")} — {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/signup">
              <NeonButton asChild>
                <Rocket className="h-4 w-4" /> {t("uni.apply")}
              </NeonButton>
            </Link>
            <Link to="/courses">
              <NeonButton variant="outline" asChild>
                {t("hero.cta2")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </NeonButton>
            </Link>
          </motion.div>

          {/* Quick stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto"
          >
            {[
              { icon: Users, value: "25K+", label: t("uni.alumni") },
              { icon: GraduationCap, value: "8", label: t("home.departments") },
              { icon: Award, value: "350+", label: t("uni.programs") },
              { icon: Globe2, value: "120+", label: t("uni.scholarships") },
            ].map((s, i) => (
              <div key={i} className="glass rounded-xl p-3">
                <s.icon className="h-5 w-5 mx-auto text-primary mb-1" />
                <div className="text-xl font-display font-black gradient-text">{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FACULTIES */}
      <section className="container mx-auto px-4 py-20">
        <SectionTitle title={t("uni.faculties")} subtitle={t("uni.facultiesSub")} center />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {faculties.map((f, i) => {
            const Icon = iconMap[f.icon as keyof typeof iconMap] ?? Building2;
            const fDepts = departments.filter((d) => f.depts.includes(d.id));
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-5 hover-lift relative overflow-hidden group"
              >
                <div className="absolute -top-10 -end-10 w-32 h-32 rounded-full gradient-primary opacity-10 blur-3xl group-hover:opacity-30 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-3 neon-glow">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-base mb-3">{lang === "ar" ? f.nameAr : f.nameEn}</h3>
                  <div className="space-y-1.5 mb-3">
                    {fDepts.map((d) => (
                      <Link
                        key={d.id}
                        to="/departments/$deptId"
                        params={{ deptId: d.id }}
                        className="flex items-center justify-between text-xs text-muted-foreground hover:text-primary py-1"
                      >
                        <span>{lang === "ar" ? d.nameAr : d.nameEn}</span>
                        <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className="container mx-auto px-4 py-20">
        <SectionTitle title={t("home.departments")} subtitle={t("home.departments.sub")} center />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <Card className="text-center h-full">
                    <div className={`mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br ${d.color} flex items-center justify-center mb-3 neon-glow`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-base font-bold mb-1">{lang === "ar" ? d.nameAr : d.nameEn}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{lang === "ar" ? d.descAr : d.descEn}</p>
                    <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{d.students}</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{d.courses}</span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="container mx-auto px-4 py-20">
        <SectionTitle title={t("home.featured")} subtitle={t("home.featured.sub")} center />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 4).map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
        <div className="text-center mt-8">
          <Link to="/courses">
            <NeonButton variant="outline" asChild>
              {t("common.viewAll")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </NeonButton>
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto px-4 py-20">
        <div className="glass-strong rounded-3xl p-8 md:p-12">
          <SectionTitle title={t("home.stats")} center />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-display font-black gradient-text mb-2">{s.value}</div>
                <div className="text-sm text-muted-foreground">{t(s.labelKey as never)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="container mx-auto px-4 py-20">
        <SectionTitle title={t("uni.news")} subtitle={t("uni.newsSub")} center />
        <div className="grid md:grid-cols-3 gap-6">
          {newsItems.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5 hover-lift"
            >
              <div className="text-xs font-mono text-primary mb-2">{lang === "ar" ? n.dateAr : n.dateEn}</div>
              <h3 className="font-bold mb-2">{lang === "ar" ? n.titleAr : n.titleEn}</h3>
              <Link to="/about" className="text-xs text-primary hover:underline flex items-center gap-1">
                اقرأ المزيد <ArrowRight className="h-3 w-3 rtl:rotate-180" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container mx-auto px-4 py-20">
        <SectionTitle title={t("home.testimonials")} center />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((tm, i) => (
            <motion.div
              key={tm.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: tm.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm mb-4 leading-relaxed line-clamp-4">"{lang === "ar" ? tm.textAr : tm.textEn}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold neon-glow">
                    {(lang === "ar" ? tm.nameAr : tm.nameEn).charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">{lang === "ar" ? tm.nameAr : tm.nameEn}</div>
                    <div className="text-xs text-muted-foreground truncate">{tm.role}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="glass-strong rounded-3xl p-12 text-center neon-border relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 gradient-primary opacity-10 blur-3xl" />
          <Trophy className="h-12 w-12 mx-auto mb-4 text-primary relative" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3 relative">
            <span className="gradient-text">{t("home.cta.title")}</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto relative">{t("home.cta.sub")}</p>
          <Link to="/signup" className="relative inline-block">
            <NeonButton asChild>
              <Zap className="h-4 w-4" /> {t("home.cta.btn")}
            </NeonButton>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
