import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { registerSchema } from "../../lib/validations";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import PageWrapper from "../../components/layout/PageWrapper";

const ROLE_OPTIONS = [
  { value: "analyst", label: "Analyst" },
  { value: "viewer", label: "Viewer" },
];

export default function Register() {
  const { adminCreateUser } = useAuth();
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values) {
    setFormError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await adminCreateUser(values);
      setSuccess(`Account created for ${values.email}`);
      reset();
    } catch (err) {
      setFormError(err.message ?? "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageWrapper title="Create User">
      <div className="max-w-md rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-text-primary">
          Create New Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            error={errors.full_name?.message}
            {...register("full_name")}
          />
          <Input
            label="Email"
            type="email"
            placeholder="jane@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <Select
            label="Role"
            placeholder="Select a role"
            options={ROLE_OPTIONS}
            error={errors.role?.message}
            {...register("role")}
          />

          {formError && <p className="text-sm text-red">{formError}</p>}
          {success && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-green"
            >
              {success}
            </motion.p>
          )}

          <Button type="submit" loading={submitting} className="w-full">
            {submitting ? "Creating..." : "Create Account"}
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
}
