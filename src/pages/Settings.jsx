import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

const ROLE_COLORS = { admin: "purple", analyst: "primary", viewer: "muted" };

const SWATCHES = [
  { name: "Primary", hex: "#3B82F6", className: "bg-primary" },
  { name: "Cyan (NIDS)", hex: "#06B6D4", className: "bg-cyan" },
  { name: "Green (HIDS)", hex: "#10B981", className: "bg-green" },
  { name: "Amber", hex: "#F59E0B", className: "bg-amber" },
  { name: "Red", hex: "#EF4444", className: "bg-red" },
  { name: "Purple (Hybrid)", hex: "#8B5CF6", className: "bg-purple" },
];

export default function Settings() {
  const navigate = useNavigate();
  const { adminListUsers, adminUpdateUserRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await adminListUsers();
      setUsers(data);
      setError("");
    } catch (err) {
      setError(err.message ?? "Unable to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleRoleChange(userId, role) {
    try {
      await adminUpdateUserRole(userId, role);
      await loadUsers();
    } catch (err) {
      setError(err.message ?? "Unable to update role");
    }
  }

  return (
    <PageWrapper title="Settings">
      <Card className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-text-primary">
            User Management
          </h3>
          <Button onClick={() => navigate("/register")}>Create User</Button>
        </div>

        {error && <p className="mb-3 text-sm text-red">{error}</p>}

        {loading ? (
          <p className="py-6 text-center text-sm text-text-muted">Loading users...</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Email</th>
                <th className="py-2 font-medium">Role</th>
                <th className="py-2 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="py-2.5 text-text-primary">{u.full_name}</td>
                  <td className="py-2.5 text-text-muted">{u.email}</td>
                  <td className="py-2.5">
                    {u.role === "admin" ? (
                      <Badge color={ROLE_COLORS.admin}>admin</Badge>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="rounded-lg border border-border bg-elevated px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="analyst">analyst</option>
                        <option value="viewer">viewer</option>
                      </select>
                    )}
                  </td>
                  <td className="py-2.5 font-mono text-xs text-text-muted">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card>
        <h3 className="mb-4 font-display text-base font-semibold text-text-primary">
          Appearance
        </h3>
        <p className="mb-4 text-sm text-text-muted">
          Dark cybersecurity theme — colors are fixed for this dashboard.
        </p>
        <div className="flex flex-wrap gap-4">
          {SWATCHES.map((swatch) => (
            <div key={swatch.name} className="flex items-center gap-2">
              <span className={`h-6 w-6 rounded-full ${swatch.className}`} />
              <div>
                <p className="text-xs font-medium text-text-primary">{swatch.name}</p>
                <p className="font-mono text-xs text-text-muted">{swatch.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageWrapper>
  );
}
