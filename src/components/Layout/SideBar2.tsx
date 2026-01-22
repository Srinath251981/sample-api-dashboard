// components/Layout/Sidebar.tsx
import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItemText,
  Box,
  Typography,
  ListItemButton,
  Collapse,
  ListItemIcon,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  CheckCircle,
  RadioButtonUnchecked,
  CloudUpload,
  Dashboard,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 280;

interface OnboardingStep {
  id: number;
  title: string;
  path: string;
  completed: boolean;
}

const Sidebar2: React.FC = () => {
  const location = useLocation();
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(true);

  // Initialize steps from localStorage or default
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>(
    () => {
      const savedSteps = localStorage.getItem("onboardingSteps");
      if (savedSteps) {
        return JSON.parse(savedSteps);
      }
      // Default steps
      return [
        {
          id: 1,
          title: "Basic Information",
          path: "/onboard/step1",
          completed: false,
        },
        {
          id: 2,
          title: "API Configuration",
          path: "/onboard/step2",
          completed: false,
        },
        {
          id: 3,
          title: "Authentication Setup",
          path: "/onboard/step3",
          completed: false,
        },
        {
          id: 4,
          title: "Endpoint Mapping",
          path: "/onboard/step4",
          completed: false,
        },
        {
          id: 5,
          title: "Security Settings",
          path: "/onboard/step5",
          completed: false,
        },
        {
          id: 6,
          title: "Review & Deploy",
          path: "/onboard/step6",
          completed: false,
        },
      ];
    }
  );

  // Function to update step completion status
  const updateStepCompletion = (stepId: number, completed: boolean) => {
    setOnboardingSteps((prevSteps) => {
      const updatedSteps = prevSteps.map((step) =>
        step.id === stepId ? { ...step, completed } : step
      );
      // Save to localStorage
      localStorage.setItem("onboardingSteps", JSON.stringify(updatedSteps));
      return updatedSteps;
    });
  };

  // Function to mark a step as completed
  const markStepAsCompleted = (stepId: number) => {
    updateStepCompletion(stepId, true);
  };

  // Function to get current step from URL
  const getCurrentStep = () => {
    const path = location.pathname;
    const stepMatch = path.match(/\/onboard\/step(\d+)/);
    return stepMatch ? parseInt(stepMatch[1]) : 1;
  };

  // Listen for step completion events
  useEffect(() => {
    const handleStepCompleted = (event: CustomEvent) => {
      const { stepId } = event.detail;
      markStepAsCompleted(stepId);
    };

    window.addEventListener("stepCompleted" as any, handleStepCompleted);
    return () => {
      window.removeEventListener("stepCompleted" as any, handleStepCompleted);
    };
  }, []);

  // Calculate progress
  const completedCount = onboardingSteps.filter(
    (step) => step.completed
  ).length;
  const progressPercentage = (completedCount / onboardingSteps.length) * 100;
  const currentStep = getCurrentStep();

  const handleOnboardingToggle = () => {
    setOnboardingOpen(!onboardingOpen);
  };

  // Check if current path matches any onboarding step
  const isActiveStep = (path: string) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#0f172a",
          color: "#e2e8f0",
          borderRight: "1px solid #1e293b",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{ p: 3, textAlign: "center", borderBottom: "1px solid #1e293b" }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#60a5fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Dashboard fontSize="medium" />
          API Gateway
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "#94a3b8", mt: 1, display: "block" }}
        >
          Enterprise Gateway Management
        </Typography>
      </Box>

      {/* Gateway Onboard Section */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleOnboardingToggle}
          sx={{
            borderRadius: 2,
            backgroundColor: onboardingOpen ? "#1e293b" : "transparent",
            mb: 1,
            "&:hover": {
              backgroundColor: "#1e293b",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "#60a5fa" }}>
            <CloudUpload />
          </ListItemIcon>
          <ListItemText
            primary="Gateway Onboard"
            primaryTypographyProps={{
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          />
          {onboardingOpen ? (
            <ExpandLess sx={{ color: "#94a3b8" }} />
          ) : (
            <ExpandMore sx={{ color: "#94a3b8" }} />
          )}
        </ListItemButton>

        {/* Onboarding Steps Tree */}
        <Collapse in={onboardingOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {onboardingSteps.map((step, index) => {
              const isCurrentStep = step.id === currentStep;
              const isCompleted = step.completed;

              return (
                <Box key={step.id} sx={{ pl: 4.5, position: "relative" }}>
                  {/* Vertical connector line - only show between steps */}
                  {index < onboardingSteps.length - 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: 56,
                        top: 40,
                        bottom: -40,
                        width: "2px",
                        backgroundColor: step.completed ? "#10b981" : "#334155",
                      }}
                    />
                  )}

                  <ListItemButton
                    component={Link}
                    to={step.path}
                    selected={isCurrentStep}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      position: "relative",
                      backgroundColor: isCurrentStep
                        ? "#1e40af"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: isCurrentStep ? "#1e40af" : "#1e293b",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e40af",
                        "&:hover": {
                          backgroundColor: "#1e40af",
                        },
                      },
                    }}
                  >
                    {/* Step number circle - dynamic colors based on status */}
                    <Box
                      sx={{
                        position: "absolute",
                        left: -20,
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: step.completed
                          ? "#10b981"
                          : isCurrentStep
                          ? "#3b82f6"
                          : "#475569",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        border: "2px solid #0f172a",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      {step.id}
                    </Box>

                    <ListItemText
                      primary={step.title}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: isCurrentStep ? 600 : 400,
                        color: isCurrentStep ? "white" : "#cbd5e1",
                      }}
                      sx={{ pl: 2 }}
                    />

                    {/* Completion status icon */}
                    {step.completed ? (
                      <CheckCircle
                        sx={{
                          fontSize: 18,
                          color: "#10b981",
                          ml: 1,
                          transition: "color 0.3s ease",
                        }}
                      />
                    ) : (
                      <RadioButtonUnchecked
                        sx={{
                          fontSize: 18,
                          color: "#64748b",
                          ml: 1,
                        }}
                      />
                    )}
                  </ListItemButton>
                </Box>
              );
            })}
          </List>
        </Collapse>
      </Box>

      {/* Progress Summary */}
      <Box sx={{ mt: "auto", p: 3, borderTop: "1px solid #1e293b" }}>
        <Typography variant="body2" sx={{ color: "#94a3b8", mb: 1 }}>
          Onboarding Progress
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <Box
              sx={{
                height: 6,
                backgroundColor: "#334155",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${progressPercentage}%`,
                  backgroundColor: "#10b981",
                  borderRadius: 3,
                  transition: "width 0.5s ease",
                }}
              />
            </Box>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: "#cbd5e1", fontWeight: 600 }}
          >
            {completedCount}/{onboardingSteps.length}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: "#64748b" }}>
          Complete all steps to deploy gateway
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar2;
