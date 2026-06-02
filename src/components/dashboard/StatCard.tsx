import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  description?: string;
  tone?: "default" | "success" | "warning" | "danger";
}

const toneClass = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
};

export function StatCard({ label, value, description, tone = "default" }: StatCardProps) {
  return (
    <Card className="glass-card glow-hover border-border/50 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <CardContent className="p-5 relative z-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary">
          {label}
        </p>
        <p className={cn("mt-2 text-2xl font-semibold tracking-tight truncate", toneClass[tone])}>
          {value}
        </p>
        {description && (
          <p className="mt-2 text-xs font-medium text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
