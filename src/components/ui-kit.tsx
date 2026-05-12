import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl p-6 hover-lift ${className}`}>
      {children}
    </div>
  );
}

export function NeonButton({ children, onClick, type = "button", className = "", variant = "primary", asChild = false, disabled = false }: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  asChild?: boolean;
  disabled?: boolean;
}) {
  const base = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:animate-none";
  const variants = {
    primary: "gradient-primary text-white neon-glow hover:scale-105 hover:animate-pulse-glow",
    outline: "neon-border text-primary hover:bg-primary/10",
    ghost: "hover:bg-accent",
  };
  if (asChild) return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function SectionTitle({ title, subtitle, center }: { title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      <h2 className="text-3xl md:text-4xl font-bold mb-3">
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && <p className="text-muted-foreground text-base md:text-lg">{subtitle}</p>}
    </div>
  );
}

export function Badge({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "live" | "easy" | "medium" | "hard" }) {
  const colors = {
    default: "bg-primary/20 text-primary border-primary/30",
    live: "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse",
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[variant]}`}>{children}</span>;
}
