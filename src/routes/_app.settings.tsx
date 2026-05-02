import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Key, Bell, Palette } from "lucide-react";
import { toast } from "sonner";
import { DashboardTopbar } from "@/components/dashboard-topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [{ title: "Settings — Clinical Workflow Assistant" }],
  }),
  component: Settings,
});

function Settings() {
  const { theme, setTheme } = useTheme();
  const [provider, setProvider] = useState("openai");
  const [prompt, setPrompt] = useState("You are a careful clinical reasoning agent. Extract symptoms, vitals, diagnoses with calibrated confidence. Always flag critical findings.");

  return (
    <>
      <DashboardTopbar title="Settings" />
      <main className="p-4 lg:p-6 space-y-6 max-w-4xl">

        <Card className="p-6 glass border-border/60">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center"><Key className="h-4 w-4" /></div>
            <h3 className="font-display font-semibold">API & model</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="apikey">API key</Label>
              <Input id="apikey" type="password" placeholder="sk-•••••••••••••••" defaultValue="sk-cwa-demo-key" className="mt-1.5" />
            </div>
            <div>
              <Label>LLM provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI · gpt-4o</SelectItem>
                  <SelectItem value="anthropic">Anthropic · claude-3.5</SelectItem>
                  <SelectItem value="google">Google · gemini-1.5-pro</SelectItem>
                  <SelectItem value="local">Local · cwa-clinical-v3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass border-border/60">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-cyan/15 text-cyan flex items-center justify-center"><Save className="h-4 w-4" /></div>
            <h3 className="font-display font-semibold">System prompt</h3>
          </div>
          <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-[160px] font-mono text-sm bg-muted/30" />
          <p className="text-xs text-muted-foreground mt-2">Used by the reasoning agent. Variables: {"{{patient}}"}, {"{{vitals}}"}.</p>
        </Card>

        <Card className="p-6 glass border-border/60">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center"><Palette className="h-4 w-4" /></div>
            <h3 className="font-display font-semibold">Appearance</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["light", "dark"] as const).map((t) => (
              <button key={t} onClick={() => setTheme(t)} className={`p-4 rounded-xl border-2 text-left transition ${theme === t ? "border-primary shadow-glow" : "border-border hover:border-primary/50"}`}>
                <div className={`h-12 rounded-lg mb-3 ${t === "dark" ? "bg-slate-900" : "bg-white border border-border"}`} />
                <div className="font-medium capitalize text-sm">{t}</div>
                <div className="text-xs text-muted-foreground">{t === "dark" ? "Easier on the eyes" : "Bright and clean"}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6 glass border-border/60">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-warning/15 text-warning-foreground flex items-center justify-center"><Bell className="h-4 w-4" /></div>
            <h3 className="font-display font-semibold">Notifications</h3>
          </div>
          <div className="space-y-3">
            {[
              { k: "Critical findings", d: "Notify me when reports flag critical results." },
              { k: "Pipeline failures", d: "Alert me when an AI agent errors." },
              { k: "Weekly digest", d: "Email summary every Monday." },
            ].map((n, i) => (
              <div key={n.k} className="flex items-center justify-between py-2 border-b border-border/60 last:border-0">
                <div>
                  <div className="text-sm font-medium">{n.k}</div>
                  <div className="text-xs text-muted-foreground">{n.d}</div>
                </div>
                <Switch defaultChecked={i < 2} />
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button variant="hero" onClick={() => toast.success("Settings saved")}>
            <Save className="h-4 w-4" /> Save changes
          </Button>
        </div>
      </main>
    </>
  );
}
