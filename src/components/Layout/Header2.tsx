// components/Layout/Header.tsx
import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

const Header2: React.FC = () => {
  const location = useLocation();

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

        {/* Right side: Help button only */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton>
            <HelpOutline sx={{ color: "#64748b" }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header2;
