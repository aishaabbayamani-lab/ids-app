import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { RiNotification3Line } from "react-icons/ri";
import { useAuth } from "../../hooks/useAuth";
import Badge from "../ui/Badge";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/alerts": "Alerts",
  "/architectures": "Architectures",
  "/attack-library": "Attack Library",
  "/evaluations": "Evaluations",
  "/settings": "Settings",
};

const ROLE_COLORS = {
  admin: "purple",
  analyst: "primary",
  viewer: "muted",
};

export default function Topbar() {
  const { pathname } = useLocation();
  const { profile } = useAuth();
  const title = PAGE_TITLES[pathname] ?? "IDS Dashboard";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-base px-6 lg:px-8">
      <h2 className="font-display text-lg font-semibold text-text-primary">
        {title}
      </h2>
      <div className="flex items-center gap-4">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          aria-label="Notifications"
          className="rounded-full p-2 text-text-muted transition-colors hover:bg-elevated hover:text-text-primary"
        >
          <RiNotification3Line size={18} />
        </motion.button>
        <Badge color={ROLE_COLORS[profile?.role] ?? "muted"}>
          {profile?.role ?? "viewer"}
        </Badge>
      </div>
    </header>
  );
}
