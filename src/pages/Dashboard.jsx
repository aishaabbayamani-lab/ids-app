import { motion } from "framer-motion";
import {
  RiAlarmWarningLine,
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiFireLine,
  RiFolderOpenLine,
} from "react-icons/ri";
import { Link } from "react-router-dom";
import AlertTrendChart from "../components/charts/AlertTrendChart";
import DetectionRadarChart from "../components/charts/DetectionRadarChart";
import PageWrapper from "../components/layout/PageWrapper";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import { useAlerts } from "../hooks/useAlerts";
import { useCountUp } from "../hooks/useCountUp";

const SEVERITY_COLORS = {
  low: "green",
  medium: "amber",
  high: "red",
  critical: "red",
};
const STATUS_COLORS = {
  open: "red",
  investigating: "amber",
  resolved: "green",
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function isWithinLastWeek(dateString) {
  if (!dateString) return false;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(dateString) >= sevenDaysAgo;
}

function StatCard({ label, value, icon: Icon, color }) {
  const count = useCountUp(value);
  return (
    <Card className="flex items-center gap-4 whitespace-nowrap">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full ${color}`}
      >
        <Icon size={20} />
      </span>
      <div>
        <p className="text-2xl font-semibold font-display text-text-primary">
          {count}
        </p>
        <p className="text-sm text-text-muted">{label}</p>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { alerts, loading } = useAlerts();

  const stats = [
    {
      label: "Total Alerts",
      value: alerts.length,
      icon: RiAlarmWarningLine,
      color: "text-primary bg-primary/15",
    },
    {
      label: "Open Alerts",
      value: alerts.filter((a) => a.status === "open").length,
      icon: RiFolderOpenLine,
      color: "text-red bg-red/15",
    },
    {
      label: "Critical Alerts",
      value: alerts.filter((a) => a.severity === "critical").length,
      icon: RiFireLine,
      color: "text-purple bg-purple/15",
    },
    {
      label: "Resolved This Week",
      value: alerts.filter(
        (a) => a.status === "resolved" && isWithinLastWeek(a.resolved_at),
      ).length,
      icon: RiCheckboxCircleLine,
      color: "text-green bg-green/15",
    },
  ];

  const recentAlerts = alerts.slice(0, 5);

  return (
    <PageWrapper title="Dashboard">
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="w-8 h-8 text-primary" />
        </div>
      ) : (
        <>
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <StatCard {...stat} />
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <h3 className="mb-4 text-base font-semibold font-display text-text-primary">
                Alert Trend (Last 7 Days)
              </h3>
              <AlertTrendChart alerts={alerts} />
            </Card>
            <Card className="lg:col-span-2">
              <h3 className="mb-4 text-base font-semibold font-display text-text-primary">
                Detection Capability Comparison
              </h3>
              <DetectionRadarChart />
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold font-display text-text-primary">
                Recent Alerts
              </h3>
              <Link
                to="/alerts"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View All <RiArrowRightLine size={14} />
              </Link>
            </div>

            {recentAlerts.length === 0 ? (
              <EmptyState message="No alerts logged yet." />
            ) : (
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border text-text-muted">
                    <th className="py-2 font-medium">Title</th>
                    <th className="py-2 font-medium">Severity</th>
                    <th className="py-2 font-medium">IDS Type</th>
                    <th className="py-2 font-medium">Status</th>
                    <th className="py-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAlerts.map((alert, i) => (
                    <motion.tr
                      key={alert.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2.5 text-text-primary">
                        {alert.title}
                      </td>
                      <td className="py-2.5">
                        <Badge
                          color={SEVERITY_COLORS[alert.severity]}
                          pulse={alert.severity === "critical"}
                        >
                          {alert.severity}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-text-muted">
                        {alert.ids_type}
                      </td>
                      <td className="py-2.5">
                        <Badge color={STATUS_COLORS[alert.status]}>
                          {alert.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 font-mono text-xs text-text-muted">
                        {new Date(alert.created_at).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}
    </PageWrapper>
  );
}
