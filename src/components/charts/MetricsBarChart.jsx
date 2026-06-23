import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { METRIC_NAMES } from "../../lib/constants";

export default function MetricsBarChart({ metrics = [] }) {
  const data = METRIC_NAMES.map(({ value, label }) => {
    const entry = metrics.find((m) => m.metric_name === value);
    return { label, value: entry ? Number(entry.value) : 0 };
  });

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
        <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={12} />
        <YAxis type="category" dataKey="label" stroke="#64748B" fontSize={12} width={140} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1A2236",
            border: "1px solid #1E293B",
            borderRadius: 8,
          }}
        />
        <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} animationDuration={600} />
      </BarChart>
    </ResponsiveContainer>
  );
}
