import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Upload, Sparkles, Loader2, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { DashboardTopbar } from "@/components/dashboard-topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AgentPipeline, type Agent } from "@/components/agent-pipeline";
import { analyzeClinicalNote } from "@/lib/grok-functions";
import { saveReport, type GrokReport } from "@/lib/report-store";

export const Route = createFileRoute("/_app/analyzer")({
  head: () => ({
    meta: [{ title: "Analyzer — Clinical Workflow Assistant" }],
  }),
  component: Analyzer,
});

const SAMPLE = `54 y/o male, hx of HTN and T2DM, presents with substernal chest pain x 2h, radiating to left arm. SOB on exertion. BP 156/98, HR 102, SpO2 96% RA. ECG: ST depression V4-V6. Troponin pending. Started on ASA 325 mg, nitroglycerin SL.`;

const initialAgents: Agent[] = [
  { id: "1", name: "Input Agent", description: "Parses raw notes", status: "pending" },
  { id: "2", name: "Processing Agent", description: "NLP normalization", status: "pending" },
  { id: "3", name: "Extraction Agent", description: "Symptoms & vitals", status: "pending" },
  { id: "4", name: "Reasoning Agent", description: "Differential dx", status: "pending" },
  { id: "5", name: "Report Generator", description: "Structured output", status: "pending" },
];

function Analyzer() {
  const [note, setNote] = useState("");
  const [running, setRunning] = useState(false);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeClinicalNote);

  const setStep = (i: number, status: Agent["status"]) =>
    setAgents((prev) => prev.map((a, idx) => (idx === i ? { ...a, status } : a)));

  const runPipeline = async () => {
    if (!note.trim() || note.trim().length < 10) {
      toast.error("Please paste a clinical note (at least 10 characters).");
      return;
    }
    setRunning(true);
    setDone(false);
    setAgents(initialAgents);

    setStep(0, "running");
    await new Promise((r) => setTimeout(r, 350));
    setStep(0, "done");
    setStep(1, "running");
    await new Promise((r) => setTimeout(r, 350));
    setStep(1, "done");

    setStep(2, "running");
    setStep(3, "running");
    setStep(4, "running");

    try {
      const result = await analyze({ data: { note } });
      if (!result.ok) {
        setRunning(false);
        setAgents(initialAgents);
        toast.error("Analysis failed", { description: result.error });
        return;
      }
      setStep(2, "done");
      setStep(3, "done");
      setStep(4, "done");

      saveReport({
        id: `RPT-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        note,
        report: result.report as GrokReport,
        model: result.model,
        usage: result.usage,
      });

      setRunning(false);
      setDone(true);
      toast.success("Report generated", {
        description: "Structured medical report is ready to view.",
        action: { label: "Open", onClick: () => navigate({ to: "/report" }) },
      });
    } catch (e) {
      setRunning(false);
      setAgents(initialAgents);
      toast.error("Network error", { description: e instanceof Error ? e.message : "Unknown" });
    }
  };

  return (
    <>
      <DashboardTopbar title="Clinical Note Analyzer" />
      <main className="p-4 lg:p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-6 glass border-border/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-lg">Clinical note input</h3>
                <p className="text-xs text-muted-foreground">Paste or upload a doctor's note for analysis.</p>
              </div>
              <Badge variant="secondary" className="font-mono text-[10px]">{note.length} chars</Badge>
            </div>

            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Paste clinical notes here…"
              className="min-h-[260px] font-mono text-sm resize-y bg-muted/30"
            />

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button onClick={runPipeline} variant="hero" disabled={running}>
                {running ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</> : <><Sparkles className="h-4 w-4" /> Analyze with AI</>}
              </Button>
              <Button variant="glass">
                <Upload className="h-4 w-4" /> Upload file
              </Button>
              <Button variant="ghost" onClick={() => setNote(SAMPLE)} disabled={running}>
                Use sample note
              </Button>
              {note && !running && (
                <Button variant="ghost" size="icon" onClick={() => setNote("")}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>

          <Card className="p-6 glass border-border/60">
            <h3 className="font-display font-semibold text-lg">Quick stats</h3>
            <p className="text-xs text-muted-foreground mb-4">This session</p>
            <div className="space-y-3 text-sm">
              {[
                { k: "Tokens processed", v: "1,284" },
                { k: "Avg latency", v: "3.1s" },
                { k: "Model", v: "cwa-clinical-v3" },
                { k: "Confidence", v: "94.2%" },
              ].map((row) => (
                <div key={row.k} className="flex justify-between border-b border-border/60 pb-2 last:border-0">
                  <span className="text-muted-foreground">{row.k}</span>
                  <span className="font-medium">{row.v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6 glass border-border/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-lg">Agent pipeline</h3>
              <p className="text-xs text-muted-foreground">Real-time multi-agent reasoning</p>
            </div>
            {done && (
              <Button asChild variant="hero" size="sm">
                <Link to="/report"><FileText className="h-4 w-4" /> View report</Link>
              </Button>
            )}
          </div>
          <AgentPipeline agents={agents} />
        </Card>
      </main>
    </>
  );
}
