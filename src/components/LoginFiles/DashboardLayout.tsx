// components/Layout/DashboardLayout.tsx
import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout: React.FC = () => {
  const { logout } = useAuth();

  // You can add logout functionality to Header if needed
  const handleLogout = () => {
    logout();
    // Navigation will be handled by ProtectedRoute
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header onLogout={handleLogout} />
        <Box
          component="main"
          sx={{
            flex: 1,
            p: 3,
            backgroundColor: "#f5f5f5",
            overflow: "auto",
          }}
        >
          {/* This will render the nested routes (onboarding steps) */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
