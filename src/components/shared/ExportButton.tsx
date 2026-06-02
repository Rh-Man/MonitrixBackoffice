import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportButton({ label = "Exporter" }: { label?: string }) {
  return (
    <Button variant="outline" size="sm">
      <Download className="h-4 w-4 mr-1.5" />
      {label}
    </Button>
  );
}
