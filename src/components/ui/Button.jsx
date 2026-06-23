import { motion } from "framer-motion";
import Spinner from "./Spinner";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-elevated text-text-primary border border-border hover:bg-elevated/70",
  danger: "bg-red text-white hover:bg-red/90",
  ghost: "bg-transparent text-text-muted hover:text-text-primary hover:bg-elevated",
};

export default function Button({
  children,
  variant = "primary",
  type = "button",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.97 }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </motion.button>
  );
}
