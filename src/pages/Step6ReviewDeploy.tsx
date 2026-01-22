// pages/Step6ReviewDeploy.tsx
import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  Warning,
  Info,
  CloudUpload,
  PlayArrow,
  Refresh,
  Timeline,
  Security,
  Settings,
  Api,
  Link,
  Storage,
} from "@mui/icons-material";
import OnboardingStepTemplate from "./OnboardingStepTemplate";

interface ValidationResult {
  step: number;
  title: string;
  status: "success" | "warning" | "error";
  message: string;
}

interface FormDataSummary {
  step1: any;
  step2: any;
  step3: any;
  step4: any;
  step5: any;
}

const Step6ReviewDeploy: React.FC = () => {
  const [validationResults, setValidationResults] = useState<
    ValidationResult[]
  >([]);
  const [formDataSummary, setFormDataSummary] =
    useState<FormDataSummary | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<
    "idle" | "validating" | "deploying" | "success" | "error"
  >("idle");
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);

  // Load all form data from previous steps
  useEffect(() => {
    const loadAllFormData = () => {
      const step1 = localStorage.getItem("formState_step1");
      const step2 = localStorage.getItem("formState_step2");
      const step3 = localStorage.getItem("formState_step3");
      const step4 = localStorage.getItem("formState_step4");
      const step5 = localStorage.getItem("formState_step5");

      setFormDataSummary({
        step1: step1 ? JSON.parse(step1) : null,
        step2: step2 ? JSON.parse(step2) : null,
        step3: step3 ? JSON.parse(step3) : null,
        step4: step4 ? JSON.parse(step4) : null,
        step5: step5 ? JSON.parse(step5) : null,
      });
    };

    loadAllFormData();
    validateConfiguration();
  }, []);

  const validateConfiguration = async () => {
    setDeploymentStatus("validating");

    // Simulate validation with actual form data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const results: ValidationResult[] = [];

    // Validate Step 1
    const step1Data = formDataSummary?.step1;
    if (step1Data) {
      results.push({
        step: 1,
        title: "Basic Information",
        status:
          step1Data.gatewayName && step1Data.environment && step1Data.region
            ? "success"
            : "warning",
        message: step1Data.gatewayName
          ? `Gateway: ${step1Data.gatewayName}`
          : "Missing gateway name",
      });
    }

    // Validate Step 2
    const step2Data = formDataSummary?.step2;
    if (step2Data) {
      const endpointCount = step2Data.endpoints?.length || 0;
      results.push({
        step: 2,
        title: "API Configuration",
        status: endpointCount > 0 ? "success" : "error",
        message:
          endpointCount > 0
            ? `${endpointCount} upstream APIs configured`
            : "No API endpoints configured",
      });
    }

    // Validate Step 3
    const step3Data = formDataSummary?.step3;
    if (step3Data) {
      const isValid =
        step3Data.authMethod &&
        (step3Data.authMethod !== "jwt" || step3Data.jwtConfig?.secretKey) &&
        (step3Data.authMethod !== "oauth" ||
          (step3Data.oauthConfig?.clientId &&
            step3Data.oauthConfig?.clientSecret));
      results.push({
        step: 3,
        title: "Authentication Setup",
        status: isValid ? "success" : "warning",
        message: isValid
          ? `${step3Data.authMethod.toUpperCase()} authentication configured`
          : "Authentication configuration incomplete",
      });
    }

    // Validate Step 4
    const step4Data = formDataSummary?.step4;
    if (step4Data) {
      const mappingCount = step4Data.mappings?.length || 0;
      results.push({
        step: 4,
        title: "Endpoint Mapping",
        status: mappingCount > 0 ? "success" : "error",
        message:
          mappingCount > 0
            ? `${mappingCount} endpoint mappings configured`
            : "No endpoint mappings configured",
      });
    }

    // Validate Step 5
    const step5Data = formDataSummary?.step5;
    if (step5Data) {
      results.push({
        step: 5,
        title: "Security Settings",
        status: "success",
        message: "Security policies configured",
      });
    }

    // Validate all steps completed
    const allValid = results.every((r) => r.status !== "error");
    results.push({
      step: 6,
      title: "Review",
      status: allValid ? "success" : "error",
      message: allValid
        ? "Ready for deployment"
        : "Fix errors before deploying",
    });

    setValidationResults(results);
    setDeploymentStatus("idle");
  };

  const handleDeploy = async () => {
    // Check if all steps are valid
    const hasErrors = validationResults.some((r) => r.status === "error");
    if (hasErrors) {
      alert("Please fix all validation errors before deploying");
      return;
    }

    setDeployDialogOpen(true);
    setDeploymentStatus("deploying");
    setDeploymentProgress(0);

    // Simulate deployment progress
    const interval = setInterval(() => {
      setDeploymentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDeploymentStatus("success");
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    // Simulate deployment completion
    setTimeout(() => {
      clearInterval(interval);
      setDeploymentStatus("success");
      // Mark step 6 as completed in localStorage
      const stepCompletedEvent = new CustomEvent("stepCompleted", {
        detail: { stepId: 6 },
      });
      window.dispatchEvent(stepCompletedEvent);
    }, 5500);
  };

  const getStatusIcon = (status: ValidationResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle color="success" />;
      case "warning":
        return <Warning color="warning" />;
      case "error":
        return <Error color="error" />;
      default:
        return <Info color="info" />;
    }
  };

  const handleSubmit = async (): Promise<boolean> => {
    // For review step, just return true if no errors
    const hasErrors = validationResults.some((r) => r.status === "error");
    if (hasErrors) {
      alert("Please fix all validation errors before proceeding");
      return false;
    }
    return true;
  };

  // Calculate summary statistics
  const getSummaryStats = () => {
    if (!formDataSummary) return null;

    const endpointCount = formDataSummary.step2?.endpoints?.length || 0;
    const mappingCount = formDataSummary.step4?.mappings?.length || 0;
    const securityEnabled =
      formDataSummary.step5?.securitySettings?.enableRateLimiting || false;
    const authMethod = formDataSummary.step3?.authMethod || "None";
    const gatewayName = formDataSummary.step1?.gatewayName || "Unnamed Gateway";

    return {
      endpointCount,
      mappingCount,
      securityEnabled,
      authMethod,
      gatewayName,
    };
  };

  const summaryStats = getSummaryStats();

  return (
    <OnboardingStepTemplate
      stepNumber={6}
      stepTitle="Review & Deploy"
      stepDescription="Review your gateway configuration and deploy to production."
      onNext={handleSubmit}
      nextButtonText="Deploy Gateway"
      formKey="step6"
    >
      <Grid container spacing={4}>
        {/* Deployment Status */}
        <Grid size={12}>
          <Card
            variant="outlined"
            sx={{
              borderColor:
                deploymentStatus === "success"
                  ? "success.main"
                  : deploymentStatus === "error"
                  ? "error.main"
                  : deploymentStatus === "deploying"
                  ? "primary.main"
                  : "divider",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <CloudUpload fontSize="small" />
                  Deployment Status
                </Typography>
                <Chip
                  label={
                    deploymentStatus === "idle"
                      ? "Ready"
                      : deploymentStatus === "validating"
                      ? "Validating..."
                      : deploymentStatus === "deploying"
                      ? "Deploying..."
                      : deploymentStatus === "success"
                      ? "Deployed"
                      : "Error"
                  }
                  color={
                    deploymentStatus === "success"
                      ? "success"
                      : deploymentStatus === "error"
                      ? "error"
                      : deploymentStatus === "deploying"
                      ? "primary"
                      : "default"
                  }
                  variant={
                    deploymentStatus === "deploying" ? "outlined" : "filled"
                  }
                />
              </Box>

              {deploymentStatus === "deploying" && (
                <Box sx={{ mb: 3 }}>
                  <LinearProgress
                    variant="determinate"
                    value={deploymentProgress}
                    sx={{ height: 10, borderRadius: 5, mb: 1 }}
                  />
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                  >
                    Deploying gateway... {deploymentProgress}%
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  startIcon={<Refresh />}
                  variant="outlined"
                  onClick={validateConfiguration}
                  disabled={
                    deploymentStatus === "validating" ||
                    deploymentStatus === "deploying"
                  }
                >
                  Re-validate
                </Button>
                <Button
                  startIcon={<PlayArrow />}
                  variant="contained"
                  color="success"
                  onClick={handleDeploy}
                  disabled={
                    deploymentStatus === "validating" ||
                    deploymentStatus === "deploying"
                  }
                  sx={{ minWidth: 200 }}
                >
                  Deploy Gateway
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Configuration Summary */}
        {summaryStats && (
          <>
            <Grid size={12}>
              <Typography variant="h6" gutterBottom>
                Configuration Summary
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Settings color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h4">
                        {summaryStats.mappingCount}
                      </Typography>
                      <Typography color="textSecondary">Endpoints</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2">
                    Configured in endpoint mapping
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Security color="success" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h4">
                        {summaryStats.securityEnabled ? "Yes" : "No"}
                      </Typography>
                      <Typography color="textSecondary">
                        Security Enabled
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2">
                    Rate limiting and IP filtering
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Api color="warning" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h4">
                        {summaryStats.endpointCount}
                      </Typography>
                      <Typography color="textSecondary">
                        Upstream APIs
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2">Connected services</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Timeline color="info" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h4">
                        {summaryStats.authMethod}
                      </Typography>
                      <Typography color="textSecondary">
                        Authentication
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2">Authentication method</Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Validation Results */}
        <Grid size={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CheckCircle fontSize="small" />
                Configuration Validation
              </Typography>

              {validationResults.length === 0 ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress size={40} />
                  <Typography sx={{ ml: 2 }}>
                    Validating configuration...
                  </Typography>
                </Box>
              ) : (
                <List>
                  {validationResults.map((result, index) => (
                    <React.Fragment key={result.step}>
                      <ListItem>
                        <ListItemIcon>
                          {getStatusIcon(result.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography fontWeight={600}>
                                Step {result.step}: {result.title}
                              </Typography>
                              <Chip
                                label={result.status}
                                size="small"
                                color={
                                  result.status === "success"
                                    ? "success"
                                    : result.status === "warning"
                                    ? "warning"
                                    : "error"
                                }
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={result.message}
                        />
                      </ListItem>
                      {index < validationResults.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gateway Details */}
        {formDataSummary?.step1 && (
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gateway Details
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="textSecondary">
                      Gateway Name
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formDataSummary.step1.gatewayName || "Not set"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="textSecondary">
                      Environment
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formDataSummary.step1.environment || "Not set"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="textSecondary">
                      Region
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formDataSummary.step1.region || "Not set"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="textSecondary">
                      Version
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formDataSummary.step1.version || "1.0.0"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Next Steps */}
        <Grid size={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>After Deployment:</strong>
              <ul style={{ marginTop: 8, marginBottom: 8 }}>
                <li>
                  Gateway will be available at:{" "}
                  <code>https://api.yourdomain.com</code>
                </li>
                <li>API documentation will be automatically generated</li>
                <li>Monitoring dashboard will be activated</li>
                <li>You can manage API keys and access in the admin panel</li>
                <li>Set up alerts for performance monitoring</li>
              </ul>
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* Deployment Dialog */}
      <Dialog
        open={deployDialogOpen}
        onClose={() => {}}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Deploying Gateway</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 4,
            }}
          >
            {deploymentStatus === "deploying" && (
              <>
                <CircularProgress size={60} sx={{ mb: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Deployment in Progress
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  Your gateway is being deployed to{" "}
                  {formDataSummary?.step1?.environment || "production"}{" "}
                  environment. This may take a few minutes.
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={deploymentProgress}
                  sx={{ width: "100%", mt: 3, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {deploymentProgress}% complete
                </Typography>
              </>
            )}

            {deploymentStatus === "success" && (
              <>
                <CheckCircle color="success" sx={{ fontSize: 60, mb: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Deployment Successful!
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  Your gateway has been successfully deployed and is now live.
                </Typography>
                <Alert severity="success" sx={{ mt: 3, width: "100%" }}>
                  <Typography variant="body2">
                    Gateway URL: <strong>https://api.yourdomain.com</strong>
                  </Typography>
                </Alert>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {deploymentStatus === "success" && (
            <Button
              variant="contained"
              onClick={() => {
                setDeployDialogOpen(false);
                // Redirect to dashboard
                window.location.href = "/";
              }}
              fullWidth
            >
              Go to Dashboard
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </OnboardingStepTemplate>
  );
};

export default Step6ReviewDeploy;
