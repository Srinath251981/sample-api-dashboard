// components/Layout/Sidebar.tsx
import React from "react";
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  ListItemButton,
} from "@mui/material";
import {
  Dashboard,
  Timeline,
  Error,
  Notifications,
  Settings,
  BarChart,
  Cloud,
  Security,
} from "@mui/icons-material";

const drawerWidth = 240;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC = () => {
  const menuItems: MenuItem[] = [
    { text: "Dashboard", icon: <Dashboard /> },
    { text: "API Monitoring", icon: <Timeline /> },
    { text: "Error Tracking", icon: <Error /> },
    { text: "Performance", icon: <BarChart /> },
    { text: "Security", icon: <Security /> },
    { text: "Notifications", icon: <Notifications /> },
    { text: "Cloud Services", icon: <Cloud /> },
    { text: "Settings", icon: <Settings /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          API Tracker
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Real-time Monitoring Dashboard
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
