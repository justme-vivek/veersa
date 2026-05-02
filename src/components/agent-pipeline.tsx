import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export type AgentStatus = "pending" | "running" | "done";
export type Agent = { id: string; name: string; description: string; status: AgentStatus };

export function AgentPipeline({ agents }: { agents: Agent[] }) {
  return (
    <div className="relative">
      <div className="grid gap-3 md:grid-cols-5">
        {agents.map((a, i) => (
          <div key={a.id} className="relative">
            <div
              className={cn(
                "glass rounded-xl p-4 transition-all relative overflow-hidden",
                a.status === "running" && "ring-2 ring-primary shadow-glow",
                a.status === "done" && "ring-1 ring-success/40",
              )}
            >
              {a.status === "running" && <div className="absolute inset-0 animate-shimmer pointer-events-none" />}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={cn(
                    "h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold",
                    a.status === "done" && "bg-success/15 text-success",
                    a.status === "running" && "bg-primary/15 text-primary animate-pulse-glow",
                    a.status === "pending" && "bg-muted text-muted-foreground",
                  )}
                >
                  {a.status === "done" ? <CheckCircle2 className="h-4 w-4" /> :
                    a.status === "running" ? <Loader2 className="h-4 w-4 animate-spin" /> :
                    <Circle className="h-4 w-4" />}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Step {i + 1}</span>
              </div>
              <div className="font-display font-semibold text-sm">{a.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{a.description}</div>
            </div>
            {i < agents.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                <svg width="16" height="8" viewBox="0 0 16 8" className="text-border">
                  <path d="M0 4 L14 4 M10 1 L14 4 L10 7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
