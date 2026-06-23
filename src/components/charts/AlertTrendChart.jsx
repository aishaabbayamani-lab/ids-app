import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const SEVERITY_COLORS = {
  low: "#10B981",
  medium: "#F59E0B",
  high: "#EF4444",
  critical: "#8B5CF6",
};

function buildTrendData(alerts) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    days.push(date);
  }

  return days.map((day) => {
    const next = new Date(day);
    next.setDate(next.getDate() + 1);

    const dayAlerts = alerts.filter((alert) => {
      const created = new Date(alert.created_at);
      return created >= day && created < next;
    });

    return {
      day: day.toLocaleDateString(undefined, { weekday: "short" }),
      low: dayAlerts.filter((a) => a.severity === "low").length,
      medium: dayAlerts.filter((a) => a.severity === "medium").length,
      high: dayAlerts.filter((a) => a.severity === "high").length,
      critical: dayAlerts.filter((a) => a.severity === "critical").length,
    };
  });
}

export default function AlertTrendChart({ alerts = [] }) {
  const data = buildTrendData(alerts);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
        <XAxis dataKey="day" stroke="#64748B" fontSize={12} />
        <YAxis stroke="#64748B" fontSize={12} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1A2236",
            border: "1px solid #1E293B",
            borderRadius: 8,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {Object.entries(SEVERITY_COLORS).map(([severity, color]) => (
          <Line
            key={severity}
            type="monotone"
            dataKey={severity}
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={600}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
