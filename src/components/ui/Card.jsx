import { motion } from "framer-motion";

export default function Card({ children, className = "", ...props }) {
  return (
    <motion.div
      className={`rounded-xl border border-border bg-surface p-5 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
