import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard-topbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/history")({
  head: () => ({
    meta: [{ title: "History — Clinical Workflow Assistant" }],
  }),
  component: History,
});

const ROWS = Array.from({ length: 38 }).map((_, i) => ({
  id: `RPT-${2391 - i}`,
  patient: ["M. Johansson", "A. Patel", "L. García", "T. Nakamura", "K. Olsen", "S. Diallo", "R. Khan"][i % 7],
  type: ["Cardiology", "Diabetes f/u", "ER triage", "Annual physical", "Neurology", "Onco f/u"][i % 6],
  date: `2026-05-${String(((i % 28) + 1)).padStart(2, "0")}`,
  status: (["complete", "review", "flagged", "complete", "complete"] as const)[i % 5],
}));

const PAGE_SIZE = 8;

function History() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return ROWS.filter((r) => {
      const matchesQ = q === "" || r.patient.toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q.toLowerCase());
      const matchesF = filter === "all" || r.status === filter;
      return matchesQ && matchesF;
    });
  }, [q, filter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <DashboardTopbar title="Report history" />
      <main className="p-4 lg:p-6 space-y-6">
        <Card className="p-5 glass border-border/60">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by patient or report ID…" className="pl-9 bg-muted/30" />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-0.5">
              {(["all", "complete", "review", "flagged"] as const).map((f) => (
                <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition ${filter === f ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {f}
                </button>
              ))}
            </div>
            <Button variant="glass">
              <Filter className="h-4 w-4" /> More filters
            </Button>
          </div>
        </Card>

        <Card className="glass border-border/60 overflow-hidden">
          {slice.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No reports found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Report ID</th>
                  <th className="text-left px-4 py-3 font-medium">Patient</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {slice.map((r) => (
                  <tr key={r.id} className="border-t border-border/60 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                    <td className="px-4 py-3 font-medium">{r.patient}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{r.type}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{r.date}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link to="/report"><Eye className="h-3.5 w-3.5" /> View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Showing {slice.length} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-xs font-medium">Page {page} / {pages}</span>
            <Button variant="ghost" size="icon" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
