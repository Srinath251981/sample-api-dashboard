// pages/OnboardingStepTemplate.tsx
import React, { useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface OnboardingStepTemplateProps {
  children: React.ReactNode;
  stepNumber: number;
  stepTitle: string;
  stepDescription: string;
  onNext?: () => Promise<boolean> | boolean;
  onPrev?: () => void;
  nextButtonText?: string;
  prevButtonText?: string;
  formKey: string; // Unique key for form state storage
}

const OnboardingStepTemplate: React.FC<OnboardingStepTemplateProps> = ({
  children,
  stepNumber,
  stepTitle,
  stepDescription,
  onNext,
  onPrev,
  nextButtonText = "Next",
  prevButtonText = "Previous",
  formKey,
}) => {
  const navigate = useNavigate();

  const steps = [
    "Basic Information",
    "API Configuration",
    "Authentication Setup",
    "Endpoint Mapping",
    "Security Settings",
    "Review & Deploy",
  ];

  // Function to save form state to localStorage
  const saveFormState = (state: any) => {
    localStorage.setItem(`formState_${formKey}`, JSON.stringify(state));
  };

  // Function to load form state from localStorage
  const loadFormState = () => {
    const saved = localStorage.getItem(`formState_${formKey}`);
    return saved ? JSON.parse(saved) : null;
  };

  const handleNext = async () => {
    if (onNext) {
      const canProceed = await onNext();
      if (canProceed) {
        // Dispatch custom event to update sidebar step completion
        const stepCompletedEvent = new CustomEvent("stepCompleted", {
          detail: { stepId: stepNumber },
        });
        window.dispatchEvent(stepCompletedEvent);

        // Navigate to next step if available
        if (stepNumber < 6) {
          navigate(`/onboard/step${stepNumber + 1}`);
        }
      }
    } else {
      // If no validation function, just navigate
      if (stepNumber < 6) {
        navigate(`/onboard/step${stepNumber + 1}`);
      }
    }
  };

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    }
    // Navigate to previous step if available
    if (stepNumber > 1) {
      navigate(`/onboard/step${stepNumber - 1}`);
    }
  };

  // Load form state when component mounts
  useEffect(() => {
    const savedState = loadFormState();
    if (savedState && window.location.pathname.includes(`step${stepNumber}`)) {
      // You can use this to restore form state in child components
      console.log(`Restored form state for step ${stepNumber}:`, savedState);
    }
  }, [stepNumber, formKey]);

  return (
    <Container maxWidth="lg">
      {/* Progress Stepper - shows all steps */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={stepNumber - 1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Step Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Step {stepNumber}: {stepTitle}
        </Typography>
        <Typography color="textSecondary" paragraph>
          {stepDescription}
        </Typography>
      </Box>

      {/* Form Content */}
      <Paper sx={{ p: 4, mb: 4 }}>
        {/* Pass saveFormState and loadFormState to children via context or props */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              saveFormState,
              loadFormState,
            });
          }
          return child;
        })}
      </Paper>

      {/* Navigation Buttons - Only Previous and Next */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: 2,
          borderTop: "1px solid #e2e8f0",
        }}
      >
        {/* Left side: Previous button if not on first step */}
        <Box>
          {stepNumber > 1 && (
            <Button
              onClick={handlePrev}
              variant="outlined"
              sx={{ minWidth: 120 }}
            >
              {prevButtonText}
            </Button>
          )}
        </Box>

        {/* Right side: Next button or Deploy button on last step */}
        <Box>
          {stepNumber < 6 ? (
            <Button
              onClick={handleNext}
              variant="contained"
              sx={{ minWidth: 120 }}
            >
              {nextButtonText}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              size="large"
              sx={{ minWidth: 200 }}
            >
              Deploy Gateway
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default OnboardingStepTemplate;
