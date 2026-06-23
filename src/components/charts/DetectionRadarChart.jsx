import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";
import { RADAR_COMPARISON_DATA } from "../../lib/constants";

export default function DetectionRadarChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart
        data={RADAR_COMPARISON_DATA}
        outerRadius="55%"
        margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
      >
        <PolarGrid stroke="#1E293B" />
        <PolarAngleAxis dataKey="metric" stroke="#64748B" fontSize={10} />
        <PolarRadiusAxis stroke="#1E293B" tick={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1A2236",
            border: "1px solid #1E293B",
            borderRadius: 8,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Radar
          name="NIDS"
          dataKey="NIDS"
          stroke="#06B6D4"
          fill="#06B6D4"
          fillOpacity={0.15}
          animationDuration={600}
        />
        <Radar
          name="HIDS"
          dataKey="HIDS"
          stroke="#10B981"
          fill="#10B981"
          fillOpacity={0.15}
          animationDuration={600}
        />
        <Radar
          name="Hybrid"
          dataKey="Hybrid"
          stroke="#8B5CF6"
          fill="#8B5CF6"
          fillOpacity={0.15}
          animationDuration={600}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
