import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useAuth } from "../hooks/useAuth";
import AppLayout from "../components/layout/AppLayout";
import Spinner from "../components/ui/Spinner";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard";
import Alerts from "../pages/Alerts";
import Architectures from "../pages/Architectures";
import AttackLibrary from "../pages/AttackLibrary";
import Evaluations from "../pages/Evaluations";
import Settings from "../pages/Settings";

export function ProtectedRoute({ children }) {
  useAuth();
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function RoleGuard({ role, children }) {
  const { profile } = useAuthStore();
  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!allowedRoles.includes(profile?.role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-base text-center">
        <h1 className="font-display text-2xl font-semibold text-text-primary">403</h1>
        <p className="text-sm text-text-muted">
          You don&apos;t have permission to view this page.
        </p>
      </div>
    );
  }

  return children;
}

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "alerts", element: <Alerts /> },
      { path: "architectures", element: <Architectures /> },
      { path: "attack-library", element: <AttackLibrary /> },
      { path: "evaluations", element: <Evaluations /> },
      {
        path: "settings",
        element: (
          <RoleGuard role="admin">
            <Settings />
          </RoleGuard>
        ),
      },
      {
        path: "register",
        element: (
          <RoleGuard role="admin">
            <Register />
          </RoleGuard>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
