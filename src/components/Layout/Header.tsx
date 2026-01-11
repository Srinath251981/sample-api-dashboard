// components/Layout/Header.tsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Avatar,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Refresh,
  Brightness4,
  Person,
} from "@mui/icons-material";

const Header: React.FC = () => {
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: "white" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: "text.primary" }}>
          API Monitoring Dashboard
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton>
            <Refresh />
          </IconButton>

          <IconButton>
            <Brightness4 />
          </IconButton>

          <IconButton>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
            <Person />
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
