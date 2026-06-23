import { AnimatePresence, motion } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";

export default function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-border bg-surface p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-text-primary">
                {title}
              </h3>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1 text-text-muted hover:bg-elevated hover:text-text-primary"
              >
                <RiCloseLine size={18} />
              </motion.button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
