// pages/Step2APIConfig.tsx
import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Tooltip,
  Box,
  Button,
} from "@mui/material";
import { Info, Add, Delete, ContentCopy } from "@mui/icons-material";
import OnboardingStepTemplate from "./OnboardingStepTemplate";

interface APIEndpoint {
  id: number;
  name: string;
  baseUrl: string;
  timeout: number;
  rateLimit: number;
}

interface FormData {
  upstreamProtocol: string;
  requestTimeout: number;
  maxRetries: number;
  enableCaching: boolean;
  cacheTTL: number;
  enableCircuitBreaker: boolean;
  circuitBreakerThreshold: number;
  endpoints: APIEndpoint[];
}

const Step2APIConfig: React.FC = () => {
  // Initialize form state with default values
  const [formData, setFormData] = useState<FormData>({
    upstreamProtocol: "https",
    requestTimeout: 30,
    maxRetries: 3,
    enableCaching: true,
    cacheTTL: 300,
    enableCircuitBreaker: true,
    circuitBreakerThreshold: 5,
    endpoints: [],
  });

  const [newEndpoint, setNewEndpoint] = useState<Omit<APIEndpoint, "id">>({
    name: "",
    baseUrl: "",
    timeout: 30,
    rateLimit: 100,
  });

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("formState_step2");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("formState_step2", JSON.stringify(formData));
  }, [formData]);

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as any).checked
          : name === "requestTimeout" ||
            name === "maxRetries" ||
            name === "cacheTTL" ||
            name === "circuitBreakerThreshold"
          ? parseInt(value) || 0
          : value,
    }));
  };

  // Handle switch changes
  const handleSwitchChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.checked,
      }));
    };

  // Add new endpoint
  const handleAddEndpoint = () => {
    if (!newEndpoint.name || !newEndpoint.baseUrl) {
      alert("Please fill in endpoint name and URL");
      return;
    }

    const newId =
      formData.endpoints.length > 0
        ? Math.max(...formData.endpoints.map((e) => e.id)) + 1
        : 1;

    const updatedEndpoints = [
      ...formData.endpoints,
      { ...newEndpoint, id: newId },
    ];

    setFormData((prev) => ({
      ...prev,
      endpoints: updatedEndpoints,
    }));

    setNewEndpoint({ name: "", baseUrl: "", timeout: 30, rateLimit: 100 });
  };

  // Remove endpoint
  const handleRemoveEndpoint = (id: number) => {
    const updatedEndpoints = formData.endpoints.filter(
      (endpoint) => endpoint.id !== id
    );
    setFormData((prev) => ({
      ...prev,
      endpoints: updatedEndpoints,
    }));
  };

  // Duplicate endpoint
  const handleDuplicateEndpoint = (endpoint: APIEndpoint) => {
    const newId =
      formData.endpoints.length > 0
        ? Math.max(...formData.endpoints.map((e) => e.id)) + 1
        : 1;

    const updatedEndpoints = [
      ...formData.endpoints,
      { ...endpoint, id: newId, name: `${endpoint.name} (Copy)` },
    ];

    setFormData((prev) => ({
      ...prev,
      endpoints: updatedEndpoints,
    }));
  };

  // Form validation and submission
  const handleSubmit = async (): Promise<boolean> => {
    if (formData.endpoints.length === 0) {
      alert("Please add at least one API endpoint");
      return false;
    }

    if (!formData.upstreamProtocol) {
      alert("Please select upstream protocol");
      return false;
    }

    // Save final state before proceeding
    localStorage.setItem("formState_step2", JSON.stringify(formData));

    console.log("Step 2 data validated and saved:", formData);
    return true;
  };

  return (
    <OnboardingStepTemplate
      stepNumber={2}
      stepTitle="API Configuration"
      stepDescription="Configure upstream APIs, timeouts, retries, and circuit breaker settings."
      onNext={handleSubmit}
      formKey="step2"
    >
      <Grid container spacing={4}>
        {/* Configuration Settings */}
        <Grid size={12}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            Gateway Configuration
            <Tooltip title="Configure how the gateway communicates with upstream APIs">
              <Info fontSize="small" color="action" />
            </Tooltip>
          </Typography>
        </Grid>

        {/* Upstream Protocol */}
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Upstream Protocol</InputLabel>
            <Select
              name="upstreamProtocol"
              value={formData.upstreamProtocol}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  upstreamProtocol: e.target.value,
                }))
              }
              label="Upstream Protocol"
            >
              <MenuItem value="https">HTTPS</MenuItem>
              <MenuItem value="http">HTTP</MenuItem>
              <MenuItem value="grpc">gRPC</MenuItem>
              <MenuItem value="websocket">WebSocket</MenuItem>
            </Select>
            <FormHelperText>
              Protocol for communicating with upstream APIs
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* Request Timeout */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Request Timeout (seconds)"
            name="requestTimeout"
            type="number"
            value={formData.requestTimeout}
            onChange={handleInputChange}
            helperText="Maximum time to wait for upstream response"
            InputProps={{ inputProps: { min: 1, max: 300 } }}
          />
        </Grid>

        {/* Max Retries */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Max Retry Attempts"
            name="maxRetries"
            type="number"
            value={formData.maxRetries}
            onChange={handleInputChange}
            helperText="Number of retries for failed requests"
            InputProps={{ inputProps: { min: 0, max: 10 } }}
          />
        </Grid>

        {/* Circuit Breaker Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.enableCircuitBreaker}
                onChange={handleSwitchChange("enableCircuitBreaker")}
                name="enableCircuitBreaker"
              />
            }
            label="Enable Circuit Breaker"
          />
          {formData.enableCircuitBreaker && (
            <TextField
              fullWidth
              label="Failure Threshold"
              name="circuitBreakerThreshold"
              type="number"
              value={formData.circuitBreakerThreshold}
              onChange={handleInputChange}
              helperText="Consecutive failures before opening circuit"
              sx={{ mt: 1 }}
              InputProps={{ inputProps: { min: 1, max: 20 } }}
            />
          )}
        </Grid>

        {/* Caching Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.enableCaching}
                onChange={handleSwitchChange("enableCaching")}
                name="enableCaching"
              />
            }
            label="Enable Response Caching"
          />
          {formData.enableCaching && (
            <TextField
              fullWidth
              label="Cache TTL (seconds)"
              name="cacheTTL"
              type="number"
              value={formData.cacheTTL}
              onChange={handleInputChange}
              helperText="Time-to-live for cached responses"
              sx={{ mt: 1 }}
              InputProps={{ inputProps: { min: 1, max: 86400 } }}
            />
          )}
        </Grid>

        {/* Divider */}
        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* API Endpoints Management */}
        <Grid size={12}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            Upstream API Endpoints
            <Tooltip title="Add and configure the APIs that this gateway will proxy to">
              <Info fontSize="small" color="action" />
            </Tooltip>
          </Typography>
        </Grid>

        {/* Add New Endpoint Form */}
        <Grid size={12}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Add New API Endpoint
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Service Name"
                    value={newEndpoint.name}
                    onChange={(e) =>
                      setNewEndpoint((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g., User Service"
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Base URL"
                    value={newEndpoint.baseUrl}
                    onChange={(e) =>
                      setNewEndpoint((prev) => ({
                        ...prev,
                        baseUrl: e.target.value,
                      }))
                    }
                    placeholder="https://api.example.com"
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    fullWidth
                    label="Timeout (s)"
                    type="number"
                    value={newEndpoint.timeout}
                    onChange={(e) =>
                      setNewEndpoint((prev) => ({
                        ...prev,
                        timeout: parseInt(e.target.value) || 30,
                      }))
                    }
                    size="small"
                    InputProps={{ inputProps: { min: 1, max: 300 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    fullWidth
                    label="Rate Limit"
                    type="number"
                    value={newEndpoint.rateLimit}
                    onChange={(e) =>
                      setNewEndpoint((prev) => ({
                        ...prev,
                        rateLimit: parseInt(e.target.value) || 100,
                      }))
                    }
                    size="small"
                    InputProps={{ inputProps: { min: 1, max: 10000 } }}
                  />
                </Grid>
                <Grid size={12}>
                  <Button
                    startIcon={<Add />}
                    variant="contained"
                    onClick={handleAddEndpoint}
                    sx={{ mt: 1 }}
                  >
                    Add Endpoint
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Existing Endpoints List */}
        <Grid size={12}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Configured Endpoints ({formData.endpoints.length})
          </Typography>

          {formData.endpoints.length === 0 ? (
            <Alert severity="info">
              No API endpoints configured. Add at least one endpoint to proceed.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {formData.endpoints.map((endpoint) => (
                <Grid size={{ xs: 12, md: 6 }} key={endpoint.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          {endpoint.name}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Duplicate">
                            <IconButton
                              size="small"
                              onClick={() => handleDuplicateEndpoint(endpoint)}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveEndpoint(endpoint.id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Grid container spacing={1}>
                        <Grid size={12}>
                          <Typography variant="body2" color="textSecondary">
                            Base URL:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "monospace",
                              wordBreak: "break-all",
                            }}
                          >
                            {endpoint.baseUrl}
                          </Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="body2" color="textSecondary">
                            Timeout:
                          </Typography>
                          <Typography variant="body2">
                            {endpoint.timeout}s
                          </Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="body2" color="textSecondary">
                            Rate Limit:
                          </Typography>
                          <Typography variant="body2">
                            {endpoint.rateLimit.toLocaleString()}/min
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {/* Additional Information */}
        <Grid size={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Best Practices:</strong>
              <ul style={{ marginTop: 8, marginBottom: 8 }}>
                <li>
                  Set appropriate timeouts based on upstream API response times
                </li>
                <li>
                  Enable circuit breaker for critical services to prevent
                  cascading failures
                </li>
                <li>Use caching for read-heavy APIs to improve performance</li>
                <li>
                  Configure rate limits to protect upstream services from
                  overload
                </li>
              </ul>
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </OnboardingStepTemplate>
  );
};

export default Step2APIConfig;
