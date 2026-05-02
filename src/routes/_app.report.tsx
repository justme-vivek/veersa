import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  FileText, Download, Code, AlertTriangle, Activity, Stethoscope,
  ClipboardList, HeartPulse, ShieldAlert, Sparkles,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { DashboardTopbar } from "@/components/dashboard-topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { loadReport, type StoredReport } from "@/lib/report-store";

export const Route = createFileRoute("/_app/report")({
  head: () => ({
    meta: [{ title: "Report viewer — Clinical Workflow Assistant" }],
  }),
  component: ReportViewer,
});

function severityFromFlag(flag?: string) {
  if (flag === "critical") return "critical";
  if (flag === "abnormal") return "moderate";
  return "chronic";
}

function ReportViewer() {
  const [view, setView] = useState<"structured" | "json">("structured");
  const [stored, setStored] = useState<StoredReport | null>(null);

  useEffect(() => {
    setStored(loadReport());
  }, []);

  if (!stored) {
    return (
      <>
        <DashboardTopbar title="Report viewer" />
        <main className="p-4 lg:p-6">
          <Card className="p-12 glass border-border/60 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="font-display font-semibold text-lg">No report yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Run the analyzer with a clinical note to generate a structured report using Grok.
            </p>
            <Button asChild variant="hero" className="mt-5">
              <Link to="/analyzer"><Sparkles className="h-4 w-4" /> Open analyzer</Link>
            </Button>
          </Card>
        </main>
      </>
    );
  }

  const r = stored.report;
  const patientLabel = [r.patient?.age, r.patient?.sex].filter(Boolean).join(" · ") || "Patient";

  return (
    <>
      <DashboardTopbar title="Report viewer" />
      <main className="p-4 lg:p-6 space-y-6">
        <Card className="p-6 glass border-border/60 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-glow opacity-30 blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{stored.id}</span>
                <span>·</span>
                <span>{new Date(stored.createdAt).toLocaleString()}</span>
                {stored.model && <><span>·</span><span className="font-mono">{stored.model}</span></>}
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold">{r.chief_complaint || "Clinical report"}</h2>
              <p className="text-sm text-muted-foreground">{patientLabel}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
                <button onClick={() => setView("structured")} className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${view === "structured" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                  <FileText className="h-3 w-3" /> Structured
                </button>
                <button onClick={() => setView("json")} className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${view === "json" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                  <Code className="h-3 w-3" /> JSON
                </button>
              </div>
              <Button variant="hero" onClick={() => exportReportPdf(stored)}>
                <Download className="h-4 w-4" /> Export PDF
              </Button>
            </div>
          </div>
        </Card>

        {view === "json" ? (
          <Card className="p-6 glass border-border/60">
            <pre className="font-mono text-xs overflow-auto bg-muted/30 p-4 rounded-lg max-h-[600px]">
              {JSON.stringify(r, null, 2)}
            </pre>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {r.summary && (
              <Card className="p-6 glass border-border/60 lg:col-span-2">
                <SectionTitle icon={ClipboardList} title="Summary" />
                <p className="mt-3 text-sm leading-relaxed">{r.summary}</p>
              </Card>
            )}

            {r.vitals && r.vitals.length > 0 && (
              <Card className="p-6 glass border-border/60">
                <SectionTitle icon={HeartPulse} title="Vital signs" />
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  {r.vitals.map((v) => (
                    <div key={v.name} className={`rounded-lg p-3 ${v.flag === "critical" ? "bg-destructive/10 border border-destructive/30" : v.flag === "abnormal" ? "bg-warning/10" : "bg-muted/40"}`}>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{v.name}</div>
                      <div className="font-display font-bold text-lg mt-0.5">{v.value}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {r.symptoms && r.symptoms.length > 0 && (
              <Card className="p-6 glass border-border/60">
                <SectionTitle icon={Activity} title="Symptoms" />
                <ul className="mt-3 space-y-2 text-sm">
                  {r.symptoms.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan shrink-0" />
                      <span>
                        <span className="font-medium">{s.name}</span>
                        {(s.severity || s.duration) && (
                          <span className="text-muted-foreground"> — {[s.severity, s.duration].filter(Boolean).join(", ")}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {r.diagnoses && r.diagnoses.length > 0 && (
              <Card className="p-6 glass border-border/60 lg:col-span-2">
                <SectionTitle icon={Stethoscope} title="Diagnoses" />
                <div className="mt-3 space-y-2">
                  {r.diagnoses.map((d, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/60">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <SeverityBadge severity={severityFromFlag((d.confidence ?? 0) > 0.8 ? "critical" : "abnormal")} />
                          <span className="font-medium">{d.name}</span>
                          {d.icd10 && <Badge variant="outline" className="font-mono text-[10px]">{d.icd10}</Badge>}
                        </div>
                        {typeof d.confidence === "number" && (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                              <div className="h-full bg-gradient-primary" style={{ width: `${d.confidence * 100}%` }} />
                            </div>
                            <span className="text-xs font-mono text-muted-foreground w-10">{(d.confidence * 100).toFixed(0)}%</span>
                          </div>
                        )}
                      </div>
                      {d.rationale && <p className="text-xs text-muted-foreground mt-2">{d.rationale}</p>}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {r.recommendations && r.recommendations.length > 0 && (
              <Card className="p-6 glass border-border/60 lg:col-span-3">
                <SectionTitle icon={ClipboardList} title="Recommendations" />
                <ul className="mt-3 space-y-2 text-sm">
                  {r.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-5 w-5 rounded-md bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {r.critical_flags && r.critical_flags.length > 0 && (
              <Card className="p-6 glass border-destructive/30 lg:col-span-3 bg-destructive/5">
                <SectionTitle icon={ShieldAlert} title="Critical flags" tone="destructive" />
                <ul className="mt-3 space-y-2 text-sm">
                  {r.critical_flags.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}
      </main>
    </>
  );
}

function SectionTitle({ icon: Icon, title, tone }: { icon: any; title: string; tone?: "destructive" }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${tone === "destructive" ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="font-display font-semibold">{title}</h3>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: "bg-destructive/15 text-destructive border-destructive/30",
    moderate: "bg-warning/15 text-warning-foreground border-warning/30",
    chronic: "bg-muted text-muted-foreground border-border",
  };
  return <Badge variant="outline" className={map[severity] ?? map.chronic}>{severity}</Badge>;
}

function exportReportPdf(stored: StoredReport) {
  const latest = loadReport() ?? stored;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const lineHeight = 16;
  let y = margin;

  const ensureSpace = (height = lineHeight) => {
    if (y + height > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const write = (text: string, options: { size?: number; bold?: boolean; gap?: number } = {}) => {
    const size = options.size ?? 10;
    doc.setFont("helvetica", options.bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    lines.forEach((line: string) => {
      ensureSpace(lineHeight);
      doc.text(line, margin, y);
      y += lineHeight;
    });
    y += options.gap ?? 2;
  };

  const section = (title: string, values?: string[]) => {
    if (!values || values.length === 0) return;
    y += 8;
    write(title, { size: 13, bold: true, gap: 4 });
    values.forEach((value, index) => write(`${index + 1}. ${value}`));
  };

  const r = latest.report;
  const patient = [r.patient?.age, r.patient?.sex].filter(Boolean).join(" / ") || "Patient";

  write("Clinical Report", { size: 20, bold: true, gap: 8 });
  write(`Report ID: ${latest.id}`);
  write(`Created: ${new Date(latest.createdAt).toLocaleString()}`);
  if (latest.model) write(`Model: ${latest.model}`);
  write(`Patient: ${patient}`);
  if (r.chief_complaint) write(`Chief complaint: ${r.chief_complaint}`, { bold: true, gap: 8 });

  section("Summary", r.summary ? [r.summary] : []);
  section("History", r.patient?.history);
  section("Vital signs", r.vitals?.map((v) => `${v.name}: ${v.value}${v.flag ? ` (${v.flag})` : ""}`));
  section("Symptoms", r.symptoms?.map((s) => `${s.name}${s.severity ? `, ${s.severity}` : ""}${s.duration ? `, ${s.duration}` : ""}`));
  section("Diagnoses", r.diagnoses?.map((d) => {
    const confidence = typeof d.confidence === "number" ? `, confidence ${(d.confidence * 100).toFixed(0)}%` : "";
    return `${d.name}${d.icd10 ? ` (${d.icd10})` : ""}${confidence}${d.rationale ? ` - ${d.rationale}` : ""}`;
  }));
  section("Recommendations", r.recommendations);
  section("Critical flags", r.critical_flags);

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${latest.id || "clinical-report"}-${stamp}.pdf`;
  doc.save(filename);
  toast.success("PDF downloaded", { description: filename });
}
