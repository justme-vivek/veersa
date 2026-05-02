import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 backdrop-blur-xl bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary blur-md opacity-60 group-hover:opacity-100 transition" />
            <div className="relative h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-semibold text-sm tracking-tight">Clinical Workflow</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Assistant</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/dashboard" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          <Link to="/analyzer" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Analyzer</Link>
          <Link to="/history" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">History</Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="hero" size="sm" className="hidden sm:inline-flex">
            <Link to="/dashboard">Launch app</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
