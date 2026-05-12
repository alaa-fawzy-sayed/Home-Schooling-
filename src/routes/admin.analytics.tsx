import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/i18n";
import { monthlyData, deptDistribution, platformStats, systemLogs } from "@/lib/admin-data";
import {
  TrendingUp, Users, DollarSign, BarChart3, PieChart, Activity, Download,
  Calendar, ArrowUpRight, FileText, Clock, Shield, AlertTriangle, CheckCircle2
} from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalyticsPage,
});

function AdminAnalyticsPage() {
  const { lang } = useApp();

  const maxStudents = Math.max(...monthlyData.map((d) => d.students));
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));
  const totalRevenue = monthlyData.reduce((a, d) => a + d.revenue, 0);
  const totalNewStudents = monthlyData.reduce((a, d) => a + d.students, 0);

  const barColors = [
    "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-cyan-500",
    "bg-emerald-500", "bg-pink-500", "bg-amber-500", "bg-violet-500"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            <span className="gradient-text">{lang === "ar" ? "التقارير والتحليلات" : "Reports & Analytics"}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "ar" ? "تحليل شامل لأداء المنصة" : "Comprehensive platform performance analysis"}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-border/50 text-sm font-medium hover:bg-accent transition-colors">
            <Calendar className="h-4 w-4" />
            {lang === "ar" ? "آخر 12 شهر" : "Last 12 months"}
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold neon-glow hover:scale-105 transition-transform">
            <Download className="h-4 w-4" />
            {lang === "ar" ? "تصدير PDF" : "Export PDF"}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: lang === "ar" ? "طلاب جدد (سنوي)" : "New Students (Year)", value: totalNewStudents.toLocaleString(), change: "+275%", color: "bg-blue-500" },
          { icon: DollarSign, label: lang === "ar" ? "إجمالي الإيرادات" : "Total Revenue", value: `${(totalRevenue / 1000000).toFixed(1)}M`, change: "+142%", color: "bg-emerald-500" },
          { icon: BarChart3, label: lang === "ar" ? "نسبة الإكمال" : "Completion Rate", value: `${platformStats.completionRate}%`, change: "+3.2%", color: "bg-purple-500" },
          { icon: Activity, label: lang === "ar" ? "معدل التفاعل" : "Engagement Rate", value: "89.2%", change: "+7.8%", color: "bg-amber-500" },
        ].map((kpi, i) => (
          <div key={i} className="glass rounded-2xl p-5 relative overflow-hidden group">
            <div className={`absolute -top-6 -end-6 w-20 h-20 rounded-full ${kpi.color} opacity-10 blur-2xl group-hover:opacity-25 transition-opacity`} />
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center mb-3`}>
                <kpi.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-bold mb-0.5">{kpi.value}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-green-400">
                  <ArrowUpRight className="h-3 w-3" /> {kpi.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Student Growth - Large Chart */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {lang === "ar" ? "نمو الطلاب الشهري" : "Monthly Student Growth"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{lang === "ar" ? "عدد التسجيلات الجديدة شهريًا" : "New enrollments per month"}</p>
            </div>
          </div>
          <div className="flex items-end gap-2 h-48">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[9px] text-muted-foreground font-mono">{(d.students / 1000).toFixed(1)}K</div>
                <div
                  className="w-full rounded-t-md gradient-primary hover:opacity-80 transition-opacity cursor-pointer relative group"
                  style={{ height: `${(d.students / maxStudents) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-card text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-border/30">
                    {d.students.toLocaleString()}
                  </div>
                </div>
                <div className="text-[9px] text-muted-foreground">{lang === "ar" ? d.month.slice(0, 3) : d.monthEn}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                {lang === "ar" ? "الإيرادات الشهرية (ج.م)" : "Monthly Revenue (EGP)"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{lang === "ar" ? "إجمالي الدخل شهريًا" : "Total monthly income"}</p>
            </div>
          </div>
          <div className="flex items-end gap-2 h-48">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[9px] text-muted-foreground font-mono">{(d.revenue / 1000).toFixed(0)}K</div>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-cyan-400 hover:opacity-80 transition-opacity cursor-pointer relative group"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-card text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-border/30">
                    {(d.revenue / 1000).toFixed(0)}K EGP
                  </div>
                </div>
                <div className="text-[9px] text-muted-foreground">{lang === "ar" ? d.month.slice(0, 3) : d.monthEn}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Distribution + System Logs */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <PieChart className="h-4 w-4 text-purple-400" />
            {lang === "ar" ? "توزيع الطلاب على الأقسام" : "Student Distribution by Department"}
          </h3>

          {/* Visual bars */}
          <div className="space-y-4">
            {deptDistribution.map((d, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${barColors[i]}`} />
                    <span className="font-medium">{lang === "ar" ? d.dept : d.deptEn}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">{d.count.toLocaleString()}</span>
                    <span className="font-bold text-primary w-12 text-end">{d.percentage}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-accent/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColors[i]} rounded-full transition-all duration-1000 relative`}
                    style={{ width: `${d.percentage * 3.5}%` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
            <span className="text-sm font-semibold">{lang === "ar" ? "الإجمالي" : "Total"}</span>
            <span className="text-lg font-bold gradient-text">{deptDistribution.reduce((a, d) => a + d.count, 0).toLocaleString()}</span>
          </div>
        </div>

        {/* System Logs */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <FileText className="h-4 w-4 text-cyan-400" />
            {lang === "ar" ? "سجل النظام" : "System Logs"}
          </h3>
          <div className="space-y-3">
            {systemLogs.map((log) => {
              const isSuccess = log.status === "success";
              const actionConfig: Record<string, { icon: typeof Shield; color: string; label: string }> = {
                LOGIN: { icon: Shield, color: "text-blue-400", label: lang === "ar" ? "دخول" : "Login" },
                COURSE_CREATE: { icon: FileText, color: "text-purple-400", label: lang === "ar" ? "إنشاء كورس" : "Course Create" },
                USER_BAN: { icon: AlertTriangle, color: "text-red-400", label: lang === "ar" ? "حظر مستخدم" : "User Ban" },
                BACKUP: { icon: Download, color: "text-emerald-400", label: lang === "ar" ? "نسخ احتياطي" : "Backup" },
                LOGIN_FAILED: { icon: AlertTriangle, color: "text-red-400", label: lang === "ar" ? "محاولة دخول فاشلة" : "Login Failed" },
                SETTINGS_UPDATE: { icon: Activity, color: "text-amber-400", label: lang === "ar" ? "تحديث إعدادات" : "Settings Update" },
              };
              const config = actionConfig[log.action] || actionConfig.LOGIN;
              const Icon = config.icon;

              return (
                <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/10 transition-colors">
                  <div className={`w-9 h-9 rounded-lg bg-accent/30 flex items-center justify-center flex-shrink-0 ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{config.label}</span>
                      {isSuccess ? (
                        <CheckCircle2 className="h-3 w-3 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 text-red-400" />
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                      <span>{log.user}</span>
                      <span>•</span>
                      <span className="font-mono">{log.ip}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {log.time.split(" ")[1]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
