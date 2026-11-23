import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

const DashboardLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <main style={{ padding: 30, flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;