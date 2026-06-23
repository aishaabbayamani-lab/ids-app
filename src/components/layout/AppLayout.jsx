import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-base">
      <Sidebar />
      <div className="ml-60 flex min-h-screen flex-col">
        <Topbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
