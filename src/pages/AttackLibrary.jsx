import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { RiAddLine, RiSearchLine } from "react-icons/ri";
import PageWrapper from "../components/layout/PageWrapper";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Select from "../components/ui/Select";
import { useAttackTypes } from "../hooks/useAttackTypes";
import { useAuth } from "../hooks/useAuth";
import { attackTypeSchema } from "../lib/validations";

const RATING_COLORS = {
  Low: "red",
  Medium: "amber",
  High: "green",
  "Very High": "cyan",
};
const RATING_OPTIONS = ["Low", "Medium", "High", "Very High"].map((r) => ({
  value: r,
  label: r,
}));

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function AttackTypeForm({ onSubmit, onCancel }) {
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(attackTypeSchema) });

  async function handleFormSubmit(values) {
    setFormError("");
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setFormError(err.message ?? "Unable to save attack type");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Name"
        placeholder="e.g. SQL Injection"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Category"
        placeholder="e.g. Web Attack"
        error={errors.category?.message}
        {...register("category")}
      />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-text-primary">
          Description
        </span>
        <textarea
          rows={3}
          className="w-full px-3 py-2 text-sm border rounded-lg border-border bg-elevated text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
          {...register("description")}
        />
        {errors.description && (
          <span className="block mt-1 text-xs text-red">
            {errors.description.message}
          </span>
        )}
      </label>
      <Select
        label="NIDS Rating"
        placeholder="Select rating"
        options={RATING_OPTIONS}
        error={errors.nids_rating?.message}
        {...register("nids_rating")}
      />
      <Select
        label="HIDS Rating"
        placeholder="Select rating"
        options={RATING_OPTIONS}
        error={errors.hids_rating?.message}
        {...register("hids_rating")}
      />
      <Select
        label="Hybrid Rating"
        placeholder="Select rating"
        options={RATING_OPTIONS}
        error={errors.hybrid_rating?.message}
        {...register("hybrid_rating")}
      />

      {formError && <p className="text-sm text-red">{formError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}

export default function AttackLibrary() {
  const { attackTypes, loading, createAttackType } = useAttackTypes();
  const { profile } = useAuth();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return attackTypes.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
    );
  }, [attackTypes, search]);

  async function handleCreate(values) {
    await createAttackType(values);
    setModalOpen(false);
  }

  return (
    <PageWrapper title="Attack Library">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <RiSearchLine
            size={16}
            className="absolute -translate-y-1/2 left-3 top-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pr-3 text-sm border rounded-lg border-border bg-elevated pl-9 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        {profile?.role === "admin" && (
          <Button onClick={() => setModalOpen(true)} className="shrink-0">
            <RiAddLine size={16} />
            Add Attack Type
          </Button>
        )}
      </div>

      {loading ? (
        <p className="py-8 text-sm text-center text-text-muted">
          Loading attack library...
        </p>
      ) : filtered.length === 0 ? (
        <EmptyState message="No attack types match your search." />
      ) : (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((attack) => (
            <motion.div key={attack.id} variants={itemVariants}>
              <Card className="h-full">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-base font-semibold font-display text-text-primary">
                    {attack.name}
                  </h4>
                  <Badge color="primary">{attack.category}</Badge>
                </div>
                <p className="mb-4 text-sm text-text-muted">
                  {attack.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="flex items-center gap-1">
                    NIDS:
                    <Badge color={RATING_COLORS[attack.nids_rating]}>
                      {attack.nids_rating}
                    </Badge>
                  </span>
                  <span className="flex items-center gap-1">
                    HIDS:
                    <Badge color={RATING_COLORS[attack.hids_rating]}>
                      {attack.hids_rating}
                    </Badge>
                  </span>
                  <span className="flex items-center gap-1">
                    Hybrid:
                    <Badge color={RATING_COLORS[attack.hybrid_rating]}>
                      {attack.hybrid_rating}
                    </Badge>
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Attack Type"
      >
        <AttackTypeForm
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </PageWrapper>
  );
}
