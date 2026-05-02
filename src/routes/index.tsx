import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Brain,
  ShieldCheck,
  Sparkles,
  FileText,
  Activity,
  Zap,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { AgentPipeline } from "@/components/agent-pipeline";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clinical Workflow Assistant — Analyze Clinical Notes with AI" },
      { name: "description", content: "A multi-agent AI pipeline that turns raw clinical notes into structured medical reports, diagnoses and recommendations." },
      { property: "og:title", content: "Analyze Clinical Notes with AI" },
      { property: "og:description", content: "Multi-agent AI for modern healthcare teams." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      <SiteHeader />

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-6">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>Multi-agent clinical AI · HIPAA-aware</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">
            Analyze clinical notes
            <br />
            <span className="gradient-text">with AI agents</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Turn raw clinical notes into structured reports, diagnoses, vitals and follow-ups in seconds. Built for the modern care team.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="xl" variant="hero">
              <Link to="/analyzer">
                Try the analyzer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="glass">
              <Link to="/dashboard">View dashboard</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            {["SOC 2 ready", "HIPAA aware", "Audit logging", "EHR integrations"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-20"
        >
          <div className="glass rounded-2xl p-6 shadow-elegant">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Live pipeline</span>
              </div>
              <span className="text-xs text-muted-foreground">avg. 3.2s per note</span>
            </div>
            <AgentPipeline
              agents={[
                { id: "1", name: "Input Agent", description: "Parses raw notes", status: "done" },
                { id: "2", name: "Processing Agent", description: "NLP normalization", status: "done" },
                { id: "3", name: "Extraction Agent", description: "Symptoms & vitals", status: "running" },
                { id: "4", name: "Reasoning Agent", description: "Differential dx", status: "pending" },
                { id: "5", name: "Report Generator", description: "Structured output", status: "pending" },
              ]}
            />
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Built for clinical precision</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Every component is designed around the realities of clinical work — speed, safety and structure.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Brain, title: "Multi-agent reasoning", desc: "Specialised agents collaborate to extract, reason and verify clinical findings." },
            { icon: FileText, title: "Structured reports", desc: "Summary, symptoms, diagnoses, vitals, recommendations, follow-ups and safety notes." },
            { icon: ShieldCheck, title: "Safety first", desc: "Critical findings flagged. Full audit log of every model decision and prompt." },
            { icon: Zap, title: "Real-time pipeline", desc: "Stream agent progress with sub-second feedback while drafting reports." },
            { icon: Stethoscope, title: "Clinician native", desc: "UX designed with physicians for fast charting and easy verification." },
            { icon: Activity, title: "EHR ready", desc: "Export to PDF or JSON, integrate with FHIR-compatible systems." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 hover:shadow-elegant transition-all group">
              <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-display font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="glass rounded-3xl p-10 md:p-16 text-center shadow-elegant relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-glow opacity-50 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-glow opacity-50 blur-3xl" />
          <h2 className="relative font-display text-3xl md:text-5xl font-bold">Ready in <span className="gradient-text">3 seconds</span>.</h2>
          <p className="relative mt-4 text-muted-foreground max-w-xl mx-auto">Drop a clinical note, get a structured report. Try the workspace.</p>
          <div className="relative mt-8">
            <Button asChild size="xl" variant="hero">
              <Link to="/dashboard">Open workspace <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-border py-8 text-center text-xs text-muted-foreground">
        © 2026 Clinical Workflow Assistant · For demonstration only · Not a medical device.
      </footer>
    </div>
  );
}
