import { motion } from "framer-motion";

export default function PageWrapper({ children, title }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-6 py-6 lg:px-8 lg:py-8"
    >
      {title && (
        <h1 className="mb-6 font-display text-2xl font-semibold text-text-primary">
          {title}
        </h1>
      )}
      {children}
    </motion.div>
  );
}
