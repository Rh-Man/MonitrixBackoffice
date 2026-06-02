import { formatDateTime } from "@/lib/format";

interface AuditTimelineItem {
  date: Date | string;
  event: string;
  agent: string;
}

export function AuditTimeline({ items }: { items: AuditTimelineItem[] }) {
  return (
    <ol className="relative border-l border-border ml-2 space-y-4">
      {items.map((item, index) => (
        <li key={`${item.event}-${index}`} className="ml-4">
          <div className="absolute -left-1.5 h-3 w-3 rounded-full bg-primary" />
          <p className="text-sm font-medium">{item.event}</p>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(item.date)} · {item.agent}
          </p>
        </li>
      ))}
    </ol>
  );
}
