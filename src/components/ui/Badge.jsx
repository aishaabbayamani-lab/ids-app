import { motion } from "framer-motion";

const COLORS = {
  cyan: "bg-cyan/15 text-cyan",
  green: "bg-green/15 text-green",
  amber: "bg-amber/15 text-amber",
  red: "bg-red/15 text-red",
  purple: "bg-purple/15 text-purple",
  primary: "bg-primary/15 text-primary",
  muted: "bg-elevated text-text-muted",
};

export default function Badge({ children, color = "muted", pulse = false, className = "" }) {
  return (
    <motion.span
      animate={pulse ? { opacity: [1, 0.5, 1] } : undefined}
      transition={pulse ? { duration: 1.4, repeat: Infinity } : undefined}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${COLORS[color]} ${className}`}
    >
      {children}
    </motion.span>
  );
}
