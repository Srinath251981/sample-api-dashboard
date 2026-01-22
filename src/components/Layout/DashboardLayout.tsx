// components/Layout/DashboardLayout.tsx
import React from "react";
import { Box, Container } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SideBar2 from "./SideBar2";
import Header2 from "./Header2";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <SideBar2 />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header2 />
        <Box
          component="main"
          sx={{ flex: 1, p: 3, backgroundColor: "#f5f5f5" }}
        >
          <Container maxWidth={false}>{children}</Container>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
