"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatXOF } from "@/lib/format";

interface OperatorChartProps {
  data: Array<Record<string, string | number>>;
  operators: Array<{ id: string; name: string; color?: string }>;
}

export function OperatorChart({ data, operators }: OperatorChartProps) {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis
          tick={{ fontSize: 11 }}
          tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}M`}
        />
        <Tooltip formatter={(value: number) => formatXOF(value)} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {operators.map((operator) => (
          <Bar
            key={operator.id}
            dataKey={operator.name}
            fill={operator.color ?? "hsl(var(--primary))"}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
