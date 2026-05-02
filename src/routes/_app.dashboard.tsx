import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  Activity,
  Clock,
  TrendingUp,
  Stethoscope,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard-topbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — Clinical Workflow Assistant" }],
  }),
  component: Dashboard,
});

const volumeData = [
  { day: "Mon", reports: 24 }, { day: "Tue", reports: 32 },
  { day: "Wed", reports: 28 }, { day: "Thu", reports: 41 },
  { day: "Fri", reports: 38 }, { day: "Sat", reports: 19 },
  { day: "Sun", reports: 22 },
];

const categoryData = [
  { name: "Cardiology", value: 32 }, { name: "Neuro", value: 18 },
  { name: "Endocrine", value: 24 }, { name: "Resp", value: 14 },
  { name: "Onco", value: 9 },
];

const recent = [
  { id: "RPT-2391", patient: "M. Johansson", type: "Cardiology consult", time: "2 min ago", status: "complete" },
  { id: "RPT-2390", patient: "A. Patel", type: "Diabetes follow-up", time: "14 min ago", status: "complete" },
  { id: "RPT-2389", patient: "L. García", type: "ER triage note", time: "32 min ago", status: "review" },
  { id: "RPT-2388", patient: "T. Nakamura", type: "Annual physical", time: "1 hr ago", status: "complete" },
  { id: "RPT-2387", patient: "K. Olsen", type: "Neurology consult", time: "2 hr ago", status: "flagged" },
];

function Dashboard() {
  return (
    <>
      <DashboardTopbar title="Dashboard" />
      <main className="p-4 lg:p-6 space-y-6">
        {/* Hero strip */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-glow opacity-40 blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
                <Sparkles className="h-3 w-3 text-primary" /> Welcome back
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold">Good morning, Dr. Reyes.</h2>
              <p className="text-sm text-muted-foreground">You have 3 reports waiting for review.</p>
            </div>
            <Button asChild variant="hero" size="lg">
              <Link to="/analyzer">
                <Stethoscope className="h-4 w-4" /> New analysis
              </Link>
            </Button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Reports today", value: "38", change: "+12%", icon: FileText, color: "text-primary" },
            { label: "Avg. process time", value: "3.2s", change: "-0.4s", icon: Clock, color: "text-cyan" },
            { label: "Critical findings", value: "4", change: "+1", icon: Activity, color: "text-destructive" },
            { label: "Accuracy score", value: "97.4%", change: "+0.8%", icon: TrendingUp, color: "text-success" },
          ].map((s) => (
            <Card key={s.label} className="p-5 glass border-border/60 hover:shadow-elegant transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">{s.label}</div>
                  <div className="mt-2 font-display text-3xl font-bold">{s.value}</div>
                  <div className="mt-1 text-xs text-success flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> {s.change} vs last week
                  </div>
                </div>
                <div className={`h-9 w-9 rounded-lg bg-muted flex items-center justify-center ${s.color}`}>
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-5 glass border-border/60 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold">Report volume</h3>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <Badge variant="secondary">Weekly</Badge>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorRep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.18 235)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.55 0.18 235)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 230 / 0.5)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="reports" stroke="oklch(0.55 0.18 235)" strokeWidth={2} fill="url(#colorRep)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5 glass border-border/60">
            <h3 className="font-display font-semibold">By specialty</h3>
            <p className="text-xs text-muted-foreground mb-4">This week</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 230 / 0.5)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} />
                <YAxis axisLine={false} tickLine={false} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="oklch(0.78 0.14 200)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Activity + recent */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-5 glass border-border/60 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Recent analyses</h3>
              <Button asChild variant="ghost" size="sm">
                <Link to="/history">View all <ArrowUpRight className="h-3 w-3" /></Link>
              </Button>
            </div>
            <div className="overflow-hidden rounded-lg border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Report</th>
                    <th className="text-left px-4 py-2 font-medium">Patient</th>
                    <th className="text-left px-4 py-2 font-medium hidden md:table-cell">Type</th>
                    <th className="text-left px-4 py-2 font-medium">Status</th>
                    <th className="text-left px-4 py-2 font-medium hidden sm:table-cell">When</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r.id} className="border-t border-border/60 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                      <td className="px-4 py-3 font-medium">{r.patient}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{r.type}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">{r.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-5 glass border-border/60">
            <h3 className="font-display font-semibold">AI activity</h3>
            <p className="text-xs text-muted-foreground mb-4">Live agent load</p>
            <div className="space-y-4">
              {[
                { name: "Input Agent", load: 42 },
                { name: "Processing", load: 78 },
                { name: "Extraction", load: 61 },
                { name: "Reasoning", load: 88 },
                { name: "Generator", load: 35 },
              ].map((a) => (
                <div key={a.name}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium">{a.name}</span>
                    <span className="text-muted-foreground">{a.load}%</span>
                  </div>
                  <Progress value={a.load} className="h-1.5" />
                </div>
              ))}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/60">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-muted-foreground">All agents operational</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    complete: { label: "Complete", className: "bg-success/15 text-success border-success/30" },
    review: { label: "Needs review", className: "bg-warning/15 text-warning-foreground border-warning/30" },
    flagged: { label: "Flagged", className: "bg-destructive/15 text-destructive border-destructive/30" },
  };
  const v = map[status] ?? map.complete;
  return <Badge variant="outline" className={v.className}>{v.label}</Badge>;
}
