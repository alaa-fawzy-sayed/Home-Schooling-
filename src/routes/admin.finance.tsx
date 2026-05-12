import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/i18n";
import { monthlyData } from "@/lib/admin-data";
import {
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard, Receipt,
  Users, Download, Calendar, Filter, Eye, CheckCircle2, Clock, XCircle, Wallet, PiggyBank
} from "lucide-react";

export const Route = createFileRoute("/admin/finance")({
  component: AdminFinancePage,
});

const transactions = [
  { id: "TXN-8841", student: "محمد علي", studentEn: "Mohamed Ali", type: "subscription", typeAr: "اشتراك Premium", amount: 500, date: "2026-04-20", status: "completed" as const },
  { id: "TXN-8840", student: "نورا حسن", studentEn: "Nora Hassan", type: "course", typeAr: "كورس الأمن السيبراني", amount: 350, date: "2026-04-20", status: "completed" as const },
  { id: "TXN-8839", student: "كريم سامي", studentEn: "Karim Samy", type: "subscription", typeAr: "اشتراك سنوي", amount: 2400, date: "2026-04-19", status: "completed" as const },
  { id: "TXN-8838", student: "سلمى أحمد", studentEn: "Salma Ahmed", type: "course", typeAr: "كورس Python", amount: 250, date: "2026-04-19", status: "pending" as const },
  { id: "TXN-8837", student: "عمر خالد", studentEn: "Omar Khaled", type: "refund", typeAr: "استرجاع", amount: -150, date: "2026-04-18", status: "completed" as const },
  { id: "TXN-8836", student: "ياسمين فوزي", studentEn: "Yasmin Fawzy", type: "course", typeAr: "كورس UI/UX", amount: 400, date: "2026-04-18", status: "completed" as const },
  { id: "TXN-8835", student: "أحمد طارق", studentEn: "Ahmed Tarek", type: "subscription", typeAr: "اشتراك شهري", amount: 200, date: "2026-04-17", status: "failed" as const },
  { id: "TXN-8834", student: "مريم سعيد", studentEn: "Mariam Said", type: "course", typeAr: "كورس React", amount: 300, date: "2026-04-17", status: "completed" as const },
  { id: "TXN-8833", student: "حسام الدين", studentEn: "Hossam Eldin", type: "subscription", typeAr: "اشتراك Premium", amount: 500, date: "2026-04-16", status: "completed" as const },
  { id: "TXN-8832", student: "دينا مصطفى", studentEn: "Dina Mostafa", type: "course", typeAr: "كورس ML", amount: 450, date: "2026-04-16", status: "completed" as const },
];

const txStatusConfig = {
  completed: { labelAr: "مكتملة", labelEn: "Completed", icon: CheckCircle2, color: "text-green-400 bg-green-500/10 border-green-500/20" },
  pending: { labelAr: "معلّقة", labelEn: "Pending", icon: Clock, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  failed: { labelAr: "فشلت", labelEn: "Failed", icon: XCircle, color: "text-red-400 bg-red-500/10 border-red-500/20" },
};

function AdminFinancePage() {
  const { lang } = useApp();
  const [filterType, setFilterType] = useState("all");

  const filtered = transactions.filter((t) => filterType === "all" || t.type === filterType);

  const totalRevenue = transactions.filter((t) => t.status === "completed" && t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const monthRevenue = 280000;
  const pendingAmount = transactions.filter((t) => t.status === "pending").reduce((a, t) => a + t.amount, 0);
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            <span className="gradient-text">{lang === "ar" ? "الشؤون المالية" : "Financial Management"}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "ar" ? "متابعة الإيرادات والمدفوعات والاشتراكات" : "Track revenue, payments, and subscriptions"}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-border/50 text-sm font-medium hover:bg-accent">
            <Calendar className="h-4 w-4" /> {lang === "ar" ? "أبريل 2026" : "April 2026"}
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold neon-glow hover:scale-105 transition-transform">
            <Download className="h-4 w-4" /> {lang === "ar" ? "تصدير" : "Export"}
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: lang === "ar" ? "إجمالي الإيرادات" : "Total Revenue", value: "1.85M", sub: lang === "ar" ? "ج.م" : "EGP", change: "+22.4%", up: true, color: "bg-emerald-500" },
          { icon: Wallet, label: lang === "ar" ? "إيراد هذا الشهر" : "This Month", value: `${(monthRevenue / 1000).toFixed(0)}K`, sub: lang === "ar" ? "ج.م" : "EGP", change: "+15.2%", up: true, color: "bg-blue-500" },
          { icon: CreditCard, label: lang === "ar" ? "المعاملات" : "Transactions", value: transactions.length.toString(), sub: lang === "ar" ? "هذا الأسبوع" : "This week", change: "+8", up: true, color: "bg-purple-500" },
          { icon: PiggyBank, label: lang === "ar" ? "معلّقة" : "Pending", value: `${pendingAmount}`, sub: lang === "ar" ? "ج.م" : "EGP", change: "2", up: false, color: "bg-amber-500" },
        ].map((kpi, i) => (
          <div key={i} className="glass rounded-2xl p-5 relative overflow-hidden group">
            <div className={`absolute -top-6 -end-6 w-20 h-20 rounded-full ${kpi.color} opacity-10 blur-2xl group-hover:opacity-25 transition-opacity`} />
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center mb-3`}>
                <kpi.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-bold mb-0.5">{kpi.value} <span className="text-xs text-muted-foreground font-normal">{kpi.sub}</span></div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
                <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${kpi.up ? "text-green-400" : "text-amber-400"}`}>
                  {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />} {kpi.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            {lang === "ar" ? "الإيرادات الشهرية (ج.م)" : "Monthly Revenue (EGP)"}
          </h3>
          <span className="text-xs text-muted-foreground">{lang === "ar" ? "آخر 12 شهر" : "Last 12 months"}</span>
        </div>
        <div className="flex items-end gap-2 h-44">
          {monthlyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-[9px] text-muted-foreground font-mono">{(d.revenue / 1000).toFixed(0)}K</div>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-cyan-400 hover:opacity-80 transition-opacity cursor-pointer relative group"
                style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-card text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-border/30">
                  {(d.revenue / 1000).toFixed(0)}K {lang === "ar" ? "ج.م" : "EGP"}
                </div>
              </div>
              <div className="text-[9px] text-muted-foreground">{lang === "ar" ? d.month.slice(0, 3) : d.monthEn}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            {lang === "ar" ? "آخر المعاملات" : "Recent Transactions"}
          </h3>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-accent/30 border border-border/50 text-xs outline-none appearance-none cursor-pointer">
            <option value="all">{lang === "ar" ? "الكل" : "All"}</option>
            <option value="course">{lang === "ar" ? "كورسات" : "Courses"}</option>
            <option value="subscription">{lang === "ar" ? "اشتراكات" : "Subscriptions"}</option>
            <option value="refund">{lang === "ar" ? "استرجاع" : "Refunds"}</option>
          </select>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "المعاملة" : "Transaction"}</th>
              <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">{lang === "ar" ? "الطالب" : "Student"}</th>
              <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">{lang === "ar" ? "التاريخ" : "Date"}</th>
              <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "المبلغ" : "Amount"}</th>
              <th className="p-4 text-start text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "الحالة" : "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => {
              const status = txStatusConfig[tx.status];
              const StatusIcon = status.icon;
              return (
                <tr key={tx.id} className="border-b border-border/20 hover:bg-accent/10 transition-colors">
                  <td className="p-4">
                    <div className="text-xs font-mono text-primary font-semibold">{tx.id}</div>
                    <div className="text-sm mt-0.5">{lang === "ar" ? tx.typeAr : tx.type}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tx.studentEn}`} alt="" className="h-7 w-7 rounded-full bg-card" />
                      <span className="text-sm">{lang === "ar" ? tx.student : tx.studentEn}</span>
                    </div>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">{tx.date}</td>
                  <td className="p-4">
                    <span className={`text-sm font-bold ${tx.amount >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {tx.amount >= 0 ? "+" : ""}{tx.amount} {lang === "ar" ? "ج.م" : "EGP"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.color}`}>
                      <StatusIcon className="h-3 w-3" /> {lang === "ar" ? status.labelAr : status.labelEn}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
