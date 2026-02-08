// components/Layout/Header.tsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { HelpOutline, Logout, Person, Settings } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // Get current step from path for display only
  const currentStep = location.pathname.split("/").pop();
  const stepNumber = currentStep?.replace("step", "");

  // Step titles for display
  const stepTitles: { [key: string]: string } = {
    step1: "Basic Information",
    step2: "API Configuration",
    step3: "Authentication Setup",
    step4: "Endpoint Mapping",
    step5: "Security Settings",
    step6: "Review & Deploy",
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    if (onLogout) {
      onLogout();
    }
  };

  const userInitial = user ? user.charAt(0).toUpperCase() : "U";

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left side: Page title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" sx={{ color: "#0f172a", fontWeight: 600 }}>
            Gateway Onboarding
          </Typography>

          {/* Display current step title */}
          {stepNumber && (
            <Typography variant="body1" sx={{ color: "#64748b" }}>
              {stepTitles[currentStep || "step1"]}
            </Typography>
          )}
        </Box>

        {/* Right side: User menu and help */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton>
            <HelpOutline sx={{ color: "#64748b" }} />
          </IconButton>

          {/* User Avatar with Dropdown */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              p: 0.5,
              border: "2px solid #e2e8f0",
              "&:hover": {
                borderColor: "#3b82f6",
              },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#3b82f6",
                fontSize: "0.875rem",
              }}
            >
              {userInitial}
            </Avatar>
          </IconButton>

          {/* User Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              },
            }}
          >
            {/* User Info */}
            <MenuItem disabled>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={user || "User"}
                secondary="Administrator"
                primaryTypographyProps={{ fontSize: "0.875rem" }}
                secondaryTypographyProps={{ fontSize: "0.75rem" }}
              />
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            {/* Settings */}
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>

            {/* Logout */}
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Need to add Divider import
import { Divider } from "@mui/material";

export default Header;
