import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiShieldLine,
  RiDashboardLine,
  RiAlertLine,
  RiNodeTree,
  RiBugLine,
  RiBarChartLine,
  RiSettings4Line,
  RiLogoutBoxLine,
} from "react-icons/ri";
import { useAuth } from "../../hooks/useAuth";
import Badge from "../ui/Badge";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: RiDashboardLine },
  { to: "/alerts", label: "Alerts", icon: RiAlertLine },
  { to: "/architectures", label: "Architectures", icon: RiNodeTree },
  { to: "/attack-library", label: "Attack Library", icon: RiBugLine },
  { to: "/evaluations", label: "Evaluations", icon: RiBarChartLine },
  {
    to: "/settings",
    label: "Settings",
    icon: RiSettings4Line,
    adminOnly: true,
  },
];

const ROLE_COLORS = {
  admin: "purple",
  analyst: "primary",
  viewer: "muted",
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0 },
};

export default function Sidebar() {
  const { profile, logout } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || profile?.role === "admin",
  );

  return (
    <motion.aside
      initial={{ x: -240, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-y-0 left-0 flex w-60 flex-col border-r border-border bg-surface"
    >
      <div className="flex items-center gap-2 px-5 py-5">
        <RiShieldLine className="text-primary" size={24} />
        <span className="font-display text-base font-semibold text-text-primary">
          IDS Dashboard
        </span>
      </div>

      <motion.nav
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 space-y-1 px-3"
      >
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <motion.div key={to} variants={itemVariants}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-elevated text-text-primary"
                    : "text-text-muted hover:bg-elevated/60 hover:text-text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-bar"
                      className="absolute left-0 top-0 h-full w-0.5 rounded-full bg-primary"
                    />
                  )}
                  <Icon size={18} />
                  {label}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </motion.nav>

      <div className="border-t border-border px-4 py-4">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-elevated text-sm font-semibold text-text-primary">
            {profile?.full_name?.[0]?.toUpperCase() ?? "?"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">
              {profile?.full_name ?? "..."}
            </p>
            <Badge color={ROLE_COLORS[profile?.role] ?? "muted"} className="mt-0.5">
              {profile?.role ?? "viewer"}
            </Badge>
          </div>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-elevated hover:text-red"
        >
          <RiLogoutBoxLine size={16} />
          Logout
        </motion.button>
      </div>
    </motion.aside>
  );
}
