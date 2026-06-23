import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { RiAddLine } from "react-icons/ri";
import AlertFilters from "../components/alerts/AlertFilters";
import AlertForm from "../components/alerts/AlertForm";
import PageWrapper from "../components/layout/PageWrapper";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import Table from "../components/ui/Table";
import { useAlerts } from "../hooks/useAlerts";
import { useAuth } from "../hooks/useAuth";

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

export default function Alerts() {
  const { alerts, loading, createAlert, updateAlertStatus, deleteAlert } =
    useAlerts();
  const { profile } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    severity: "all",
    idsType: "all",
    status: "all",
  });

  const canWrite = profile?.role === "admin" || profile?.role === "analyst";
  const isAdmin = profile?.role === "admin";

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (
        filters.search &&
        !alert.title.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (filters.severity !== "all" && alert.severity !== filters.severity)
        return false;
      if (filters.idsType !== "all" && alert.ids_type !== filters.idsType)
        return false;
      if (filters.status !== "all" && alert.status !== filters.status)
        return false;
      return true;
    });
  }, [alerts, filters]);

  async function handleCreate(values) {
    await createAlert(values);
    setModalOpen(false);
  }

  const columns = useMemo(
    () => [
      { header: "Title", accessorKey: "title" },
      {
        header: "Severity",
        accessorKey: "severity",
        cell: ({ row }) => (
          <Badge
            color={SEVERITY_COLORS[row.original.severity]}
            pulse={row.original.severity === "critical"}
          >
            {row.original.severity}
          </Badge>
        ),
      },
      { header: "IDS Type", accessorKey: "ids_type" },
      { header: "Attack Category", accessorKey: "attack_category" },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <Badge color={STATUS_COLORS[row.original.status]}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        header: "Created By",
        accessorKey: "created_by_profile.full_name",
        cell: ({ row }) => row.original.created_by_profile?.full_name ?? "—",
      },
      {
        header: "Date",
        accessorKey: "created_at",
        cell: ({ row }) => (
          <span className="font-mono text-xs">
            {new Date(row.original.created_at).toLocaleDateString()}
          </span>
        ),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
          const alert = row.original;
          if (!canWrite) return null;
          return (
            <div className="flex gap-2">
              {alert.status !== "investigating" &&
                alert.status !== "resolved" && (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => updateAlertStatus(alert.id, "investigating")}
                    className="text-xs text-amber hover:underline"
                  >
                    Mark Investigating
                  </motion.button>
                )}
              {alert.status !== "resolved" && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => updateAlertStatus(alert.id, "resolved")}
                  className="text-xs text-green hover:underline"
                >
                  Resolve
                </motion.button>
              )}
              {isAdmin && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => deleteAlert(alert.id)}
                  className="text-xs text-red hover:underline"
                >
                  Delete
                </motion.button>
              )}
            </div>
          );
        },
      },
    ],
    [canWrite, isAdmin, updateAlertStatus, deleteAlert],
  );

  return (
    <PageWrapper title="Alerts">
      <Card>
        <div className="flex items-center justify-between mb-5">
          <AlertFilters filters={filters} onChange={setFilters} />
          {canWrite && (
            <Button
              onClick={() => setModalOpen(true)}
              className="ml-4 shrink-0"
            >
              <RiAddLine size={16} />
              Add Alert
            </Button>
          )}
        </div>

        {loading ? (
          <p className="py-8 text-sm text-center text-text-muted">
            Loading alerts...
          </p>
        ) : (
          <Table
            columns={columns}
            data={filteredAlerts}
            emptyMessage="No alerts match your filters."
          />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log New Alert"
      >
        <AlertForm
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </PageWrapper>
  );
}
