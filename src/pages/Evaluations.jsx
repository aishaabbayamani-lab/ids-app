import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { RiAddLine, RiServerLine, RiCursorLine, RiLineChartLine } from "react-icons/ri";
import PageWrapper from "../components/layout/PageWrapper";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import EmptyState from "../components/ui/EmptyState";
import MetricsBarChart from "../components/charts/MetricsBarChart";
import { useConfigs, useMetrics } from "../hooks/useMetrics";
import { useAuth } from "../hooks/useAuth";
import { idsConfigSchema, metricSchema } from "../lib/validations";
import { IDS_TYPES, METRIC_NAMES } from "../lib/constants";

const IDS_TYPE_COLORS = { NIDS: "cyan", HIDS: "green", Hybrid: "purple" };

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function AddConfigForm({ onSubmit, onCancel }) {
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(idsConfigSchema) });

  async function handleFormSubmit(values) {
    setFormError("");
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setFormError(err.message ?? "Unable to save configuration");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input label="Name" placeholder="e.g. Edge NIDS Pilot" error={errors.name?.message} {...register("name")} />
      <Select
        label="IDS Type"
        placeholder="Select IDS type"
        options={IDS_TYPES.map((t) => ({ value: t, label: t }))}
        error={errors.ids_type?.message}
        {...register("ids_type")}
      />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-text-primary">Description</span>
        <textarea
          rows={3}
          className="w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
          {...register("description")}
        />
      </label>

      {formError && <p className="text-sm text-red">{formError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {submitting ? "Saving..." : "Save Config"}
        </Button>
      </div>
    </form>
  );
}

function LogMetricForm({ onSubmit, onCancel }) {
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(metricSchema.omit({ ids_config_id: true })),
    defaultValues: { value: 50 },
  });

  const value = watch("value");

  async function handleFormSubmit(values) {
    setFormError("");
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setFormError(err.message ?? "Unable to log metric");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Select
        label="Metric"
        placeholder="Select metric"
        options={METRIC_NAMES}
        error={errors.metric_name?.message}
        {...register("metric_name")}
      />

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-text-primary">
          Value: {value}
        </span>
        <input
          type="range"
          min="0"
          max="100"
          className="w-full accent-primary"
          {...register("value", { valueAsNumber: true })}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-text-primary">Notes</span>
        <textarea
          rows={2}
          className="w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
          {...register("notes")}
        />
      </label>

      {formError && <p className="text-sm text-red">{formError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {submitting ? "Saving..." : "Log Metric"}
        </Button>
      </div>
    </form>
  );
}

export default function Evaluations() {
  const { configs, loading: configsLoading, createConfig } = useConfigs();
  const { profile } = useAuth();
  const [selectedConfigId, setSelectedConfigId] = useState(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [metricModalOpen, setMetricModalOpen] = useState(false);

  const { metrics, loading: metricsLoading, createMetric } = useMetrics(selectedConfigId);
  const canWrite = profile?.role === "admin" || profile?.role === "analyst";
  const metricLabel = (value) => METRIC_NAMES.find((m) => m.value === value)?.label ?? value;

  async function handleCreateConfig(values) {
    await createConfig(values);
    setConfigModalOpen(false);
  }

  async function handleLogMetric(values) {
    await createMetric(values);
    setMetricModalOpen(false);
  }

  return (
    <PageWrapper title="Evaluations">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-text-primary">
              IDS Configurations
            </h3>
            {canWrite && (
              <Button onClick={() => setConfigModalOpen(true)} className="px-2 py-1">
                <RiAddLine size={16} />
              </Button>
            )}
          </div>

          {configsLoading ? (
            <p className="py-6 text-center text-sm text-text-muted">Loading...</p>
          ) : configs.length === 0 ? (
            <EmptyState icon={RiServerLine} message="No configurations yet." />
          ) : (
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {configs.map((config) => (
                <motion.button
                  key={config.id}
                  type="button"
                  variants={itemVariants}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedConfigId(config.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    selectedConfigId === config.id
                      ? "border-primary bg-elevated"
                      : "border-border hover:bg-elevated/50"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-text-primary">{config.name}</span>
                    <Badge color={IDS_TYPE_COLORS[config.ids_type]}>{config.ids_type}</Badge>
                  </div>
                  {config.description && (
                    <p className="line-clamp-2 text-xs text-text-muted">{config.description}</p>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </Card>

        <Card className="lg:col-span-2">
          {!selectedConfigId ? (
            <EmptyState icon={RiCursorLine} message="Select a configuration to view its metrics." />
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-text-primary">
                  Metrics
                </h3>
                {canWrite && (
                  <Button onClick={() => setMetricModalOpen(true)}>
                    <RiAddLine size={16} />
                    Log Metric
                  </Button>
                )}
              </div>

              {metricsLoading ? (
                <p className="py-6 text-center text-sm text-text-muted">Loading...</p>
              ) : (
                <>
                  <MetricsBarChart metrics={metrics} />

                  <table className="mt-6 w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-text-muted">
                        <th className="py-2 font-medium">Metric</th>
                        <th className="py-2 font-medium">Value</th>
                        <th className="py-2 font-medium">Notes</th>
                        <th className="py-2 font-medium">Recorded By</th>
                        <th className="py-2 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.length === 0 ? (
                        <tr>
                          <td colSpan={5}>
                            <EmptyState icon={RiLineChartLine} message="No metrics logged yet." />
                          </td>
                        </tr>
                      ) : (
                        metrics.map((metric) => (
                          <tr key={metric.id} className="border-b border-border last:border-0">
                            <td className="py-2.5 text-text-primary">
                              {metricLabel(metric.metric_name)}
                            </td>
                            <td className="py-2.5 font-mono text-text-primary">{metric.value}</td>
                            <td className="py-2.5 text-text-muted">{metric.notes || "—"}</td>
                            <td className="py-2.5 text-text-muted">
                              {metric.recorded_by_profile?.full_name ?? "—"}
                            </td>
                            <td className="py-2.5 font-mono text-xs text-text-muted">
                              {new Date(metric.recorded_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}
        </Card>
      </div>

      <Modal
        open={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        title="Add IDS Configuration"
      >
        <AddConfigForm onSubmit={handleCreateConfig} onCancel={() => setConfigModalOpen(false)} />
      </Modal>

      <Modal open={metricModalOpen} onClose={() => setMetricModalOpen(false)} title="Log Metric">
        <LogMetricForm onSubmit={handleLogMetric} onCancel={() => setMetricModalOpen(false)} />
      </Modal>
    </PageWrapper>
  );
}
