import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { RiShieldLine } from "react-icons/ri";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema } from "../../lib/validations";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values) {
    setFormError("");
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.message ?? "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm rounded-2xl border border-cyan/30 bg-surface p-8 shadow-[0_0_40px_-10px_rgba(6,182,212,0.25)]"
      >
        <div className="mb-6 flex flex-col items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-elevated text-cyan">
            <RiShieldLine size={24} />
          </span>
          <h1 className="font-display text-xl font-semibold text-text-primary">
            IDS Dashboard
          </h1>
          <p className="text-sm text-text-muted">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
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

          {formError && <p className="text-sm text-red">{formError}</p>}

          <Button type="submit" loading={submitting} className="w-full">
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
