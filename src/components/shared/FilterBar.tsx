import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4 flex flex-wrap gap-3">{children}</CardContent>
    </Card>
  );
}
