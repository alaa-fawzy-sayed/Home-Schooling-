import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/i18n";
import {
  Users, BookOpen, DollarSign, TrendingUp, Activity, Eye, UserPlus, Radio,
  ArrowUpRight, ArrowDownRight, BarChart3, Clock, Zap, Target, Award, Flame
} from "lucide-react";
import { platformStats, monthlyData, recentActivities, topCourses, deptDistribution } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function StatCard({ icon: Icon, label, value, change, changeType, color }: {
  icon: typeof Users; label: string; value: string; change: string; changeType: "up" | "down"; color: string;
}) {
  return (
    <div className="glass rounded-2xl p-5 hover-lift group relative overflow-hidden">
      <div className={`absolute -top-6 -end-6 w-20 h-20 rounded-full ${color} opacity-10 blur-2xl group-hover:opacity-25 transition-opacity`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shadow-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            changeType === "up" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          }`}>
            {changeType === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {change}
          </div>
        </div>
        <div className="text-2xl font-bold font-display mb-0.5">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function MiniBarChart({ data, maxVal }: { data: number[]; maxVal: number }) {
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm gradient-primary opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          style={{ height: `${(v / maxVal) * 100}%` }}
          title={`${v}`}
        />
      ))}
    </div>
  );
}

function AdminDashboard() {
  const { lang } = useApp();

  const stats = [
    { icon: Users, label: lang === "ar" ? "إجمالي الطلاب" : "Total Students", value: platformStats.totalStudents.toLocaleString(), change: "+12.5%", changeType: "up" as const, color: "bg-blue-500" },
    { icon: BookOpen, label: lang === "ar" ? "الكورسات" : "Courses", value: platformStats.totalCourses.toLocaleString(), change: "+8.2%", changeType: "up" as const, color: "bg-purple-500" },
    { icon: DollarSign, label: lang === "ar" ? "الإيرادات (ج.م)" : "Revenue (EGP)", value: `${(platformStats.totalRevenue / 1000).toFixed(0)}K`, change: "+22.4%", changeType: "up" as const, color: "bg-emerald-500" },
    { icon: Eye, label: lang === "ar" ? "المستخدمين النشطين" : "Active Users", value: platformStats.activeUsers.toLocaleString(), change: "+5.1%", changeType: "up" as const, color: "bg-cyan-500" },
    { icon: UserPlus, label: lang === "ar" ? "تسجيل جديد (أسبوع)" : "New Signups (Week)", value: platformStats.newSignups.toLocaleString(), change: "+18%", changeType: "up" as const, color: "bg-amber-500" },
    { icon: Target, label: lang === "ar" ? "نسبة الإكمال" : "Completion Rate", value: `${platformStats.completionRate}%`, change: "+3.2%", changeType: "up" as const, color: "bg-pink-500" },
    { icon: Radio, label: lang === "ar" ? "بث مباشر الآن" : "Live Now", value: platformStats.liveNow.toLocaleString(), change: "-2", changeType: "down" as const, color: "bg-red-500" },
    { icon: Award, label: lang === "ar" ? "أعضاء هيئة التدريس" : "Professors", value: platformStats.totalProfessors.toLocaleString(), change: "+6", changeType: "up" as const, color: "bg-indigo-500" },
  ];

  const maxStudents = Math.max(...monthlyData.map((d) => d.students));
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            <span className="gradient-text">{lang === "ar" ? "لوحة التحكم" : "Dashboard"}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "ar" ? "نظرة شاملة على أداء المنصة" : "Platform performance overview"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-xs">
            <Activity className="h-3.5 w-3.5 text-green-400 animate-pulse" />
            <span className="text-green-400 font-semibold">{lang === "ar" ? "النظام يعمل" : "System Online"}</span>
          </div>
          <div className="px-3 py-2 rounded-xl glass text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 inline me-1" />
            {new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Students Chart */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm">{lang === "ar" ? "نمو الطلاب" : "Student Growth"}</h3>
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "آخر 12 شهر" : "Last 12 months"}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-400 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" /> +275%
            </div>
          </div>
          <MiniBarChart data={monthlyData.map((d) => d.students)} maxVal={maxStudents} />
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            {monthlyData.map((d) => (
              <span key={d.monthEn}>{lang === "ar" ? d.month.slice(0, 3) : d.monthEn}</span>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm">{lang === "ar" ? "الإيرادات الشهرية" : "Monthly Revenue"}</h3>
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "بالجنيه المصري" : "In EGP"}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <DollarSign className="h-3.5 w-3.5" /> 1.85M
            </div>
          </div>
          <div className="flex items-end gap-1 h-16">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-emerald-500 to-cyan-400 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                  title={`${(d.revenue / 1000).toFixed(0)}K EGP`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            {monthlyData.map((d) => (
              <span key={d.monthEn}>{lang === "ar" ? d.month.slice(0, 3) : d.monthEn}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Department Distribution */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            {lang === "ar" ? "توزيع الطلاب" : "Student Distribution"}
          </h3>
          <div className="space-y-3">
            {deptDistribution.map((d, i) => {
              const colors = ["bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-cyan-500", "bg-emerald-500", "bg-pink-500", "bg-amber-500", "bg-violet-500"];
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{lang === "ar" ? d.dept : d.deptEn}</span>
                    <span className="font-semibold">{d.percentage}%</span>
                  </div>
                  <div className="h-2 bg-accent/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[i]} rounded-full transition-all duration-1000`}
                      style={{ width: `${d.percentage * 3.5}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Courses */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-400" />
            {lang === "ar" ? "أعلى الكورسات" : "Top Courses"}
          </h3>
          <div className="space-y-3">
            {topCourses.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/20 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate">{lang === "ar" ? c.nameAr : c.name}</div>
                  <div className="text-[10px] text-muted-foreground">{c.students.toLocaleString()} {lang === "ar" ? "طالب" : "students"}</div>
                </div>
                <div className="text-xs font-semibold text-green-400">{c.trend}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            {lang === "ar" ? "آخر النشاطات" : "Recent Activity"}
          </h3>
          <div className="space-y-3 max-h-[350px] overflow-y-auto scrollbar-hide">
            {recentActivities.map((a) => (
              <div key={a.id} className="flex items-start gap-3 group">
                <div className="relative mt-0.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${a.color}`} />
                  {a.id < recentActivities.length && (
                    <div className="absolute top-3 start-1/2 -translate-x-1/2 w-px h-6 bg-border" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{lang === "ar" ? a.typeAr : a.typeEn}</span>
                    <span className="text-[10px] text-muted-foreground">{a.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{lang === "ar" ? a.descAr : a.descEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold text-sm mb-4">{lang === "ar" ? "إجراءات سريعة" : "Quick Actions"}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: UserPlus, label: lang === "ar" ? "إضافة طالب" : "Add Student", color: "from-blue-500 to-cyan-500" },
            { icon: BookOpen, label: lang === "ar" ? "كورس جديد" : "New Course", color: "from-purple-500 to-pink-500" },
            { icon: Radio, label: lang === "ar" ? "بث مباشر" : "Go Live", color: "from-red-500 to-orange-500" },
            { icon: BarChart3, label: lang === "ar" ? "تقرير مفصّل" : "Full Report", color: "from-emerald-500 to-teal-500" },
          ].map((action, i) => (
            <button
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl bg-accent/20 hover:bg-accent/40 border border-border/30 hover:border-primary/30 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
