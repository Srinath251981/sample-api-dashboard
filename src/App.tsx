// App.tsx
import React, { useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardLayout from "./components/Layout/DashboardLayout";

// Import step pages
import Step1BasicInfo from "./pages/Step1BasicInfo";
import Step2APIConfig from "./pages/Step2APIConfig";
import Step3AuthSetup from "./pages/Step3AuthSetup";
import Step4EndpointMapping from "./pages/Step4EndpointMapping";
import Step5SecuritySettings from "./pages/Step5SecuritySettings";
import Step6ReviewDeploy from "./pages/Step6ReviewDeploy";

// Initialize onboarding steps in localStorage if not present
const initializeOnboardingSteps = () => {
  if (!localStorage.getItem("onboardingSteps")) {
    const defaultSteps = [
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
    localStorage.setItem("onboardingSteps", JSON.stringify(defaultSteps));
  }
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3b82f6",
    },
    success: {
      main: "#10b981",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

const App: React.FC = () => {
  // Initialize onboarding steps on app load
  useEffect(() => {
    initializeOnboardingSteps();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <DashboardLayout>
          <Routes>
            {/* Redirect root to first step */}
            <Route
              path="/"
              element={<Navigate to="/onboard/step1" replace />}
            />
            <Route path="/onboard/step1" element={<Step1BasicInfo />} />
            <Route path="/onboard/step2" element={<Step2APIConfig />} />
            <Route path="/onboard/step3" element={<Step3AuthSetup />} />
            <Route path="/onboard/step4" element={<Step4EndpointMapping />} />
            <Route path="/onboard/step5" element={<Step5SecuritySettings />} />
            <Route path="/onboard/step6" element={<Step6ReviewDeploy />} />
            {/* Catch-all route */}
            <Route
              path="*"
              element={<Navigate to="/onboard/step1" replace />}
            />
          </Routes>
        </DashboardLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
