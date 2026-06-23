import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { alertSchema } from "../../lib/validations";
import { IDS_TYPES, SEVERITY_LEVELS } from "../../lib/constants";
import { useAttackTypes } from "../../hooks/useAttackTypes";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

export default function AlertForm({ onSubmit, onCancel }) {
  const { attackTypes } = useAttackTypes();
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(alertSchema) });

  async function handleFormSubmit(values) {
    setFormError("");
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setFormError(err.message ?? "Unable to save alert");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="Suspicious login activity"
        error={errors.title?.message}
        {...register("title")}
      />

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-text-primary">
          Description
        </span>
        <textarea
          rows={3}
          placeholder="Optional details"
          className="w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
          {...register("description")}
        />
      </label>

      <Select
        label="Severity"
        placeholder="Select severity"
        options={SEVERITY_LEVELS.map((s) => ({ value: s, label: s }))}
        error={errors.severity?.message}
        {...register("severity")}
      />

      <Select
        label="IDS Type"
        placeholder="Select IDS type"
        options={IDS_TYPES.map((t) => ({ value: t, label: t }))}
        error={errors.ids_type?.message}
        {...register("ids_type")}
      />

      <Select
        label="Attack Category"
        placeholder="Select attack category"
        options={attackTypes.map((a) => ({ value: a.name, label: a.name }))}
        error={errors.attack_category?.message}
        {...register("attack_category")}
      />

      {formError && <p className="text-sm text-red">{formError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {submitting ? "Saving..." : "Save Alert"}
        </Button>
      </div>
    </form>
  );
}
