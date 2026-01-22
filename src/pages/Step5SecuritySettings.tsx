// pages/Step5SecuritySettings.tsx
import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from "@mui/material";
import {
  Security,
  Lock,
  Shield,
  Add,
  Delete,
  Block,
  CheckCircle,
} from "@mui/icons-material";
import OnboardingStepTemplate from "./OnboardingStepTemplate";

interface IPRule {
  id: number;
  ipAddress: string;
  type: "allow" | "block";
  description: string;
}

interface RateLimitRule {
  id: number;
  name: string;
  requests: number;
  window: number;
  scope: "global" | "ip" | "user";
}

interface FormData {
  securitySettings: {
    enableRateLimiting: boolean;
    enableIPWhitelist: boolean;
    enableIPBlacklist: boolean;
    enableRequestValidation: boolean;
    enableResponseValidation: boolean;
    maxRequestBodySize: number;
    maxRequestHeaderSize: number;
    enableSQLInjectionProtection: boolean;
    enableXSSProtection: boolean;
  };
  rateLimits: RateLimitRule[];
  ipRules: IPRule[];
}

const Step5SecuritySettings: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    securitySettings: {
      enableRateLimiting: true,
      enableIPWhitelist: false,
      enableIPBlacklist: true,
      enableRequestValidation: true,
      enableResponseValidation: false,
      maxRequestBodySize: 1048576, // 1MB
      maxRequestHeaderSize: 8192, // 8KB
      enableSQLInjectionProtection: true,
      enableXSSProtection: true,
    },
    rateLimits: [
      {
        id: 1,
        name: "Global Limit",
        requests: 1000,
        window: 60,
        scope: "global",
      },
      { id: 2, name: "IP Limit", requests: 100, window: 60, scope: "ip" },
      { id: 3, name: "Auth Limit", requests: 30, window: 60, scope: "user" },
    ],
    ipRules: [
      {
        id: 1,
        ipAddress: "192.168.1.1",
        type: "allow",
        description: "Internal Admin",
      },
      {
        id: 2,
        ipAddress: "10.0.0.0/8",
        type: "allow",
        description: "Corporate Network",
      },
      {
        id: 3,
        ipAddress: "203.0.113.0/24",
        type: "block",
        description: "Malicious IP Range",
      },
    ],
  });

  const [newIPRule, setNewIPRule] = useState<Omit<IPRule, "id">>({
    ipAddress: "",
    type: "allow",
    description: "",
  });

  const [newRateLimit, setNewRateLimit] = useState<Omit<RateLimitRule, "id">>({
    name: "",
    requests: 100,
    window: 60,
    scope: "ip",
  });

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("formState_step5");
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
    localStorage.setItem("formState_step5", JSON.stringify(formData));
  }, [formData]);

  const handleSecurityToggle =
    (setting: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        securitySettings: {
          ...prev.securitySettings,
          [setting]: e.target.checked,
        },
      }));
    };

  const handleSliderChange =
    (setting: string) => (e: Event, value: number | number[]) => {
      setFormData((prev) => ({
        ...prev,
        securitySettings: {
          ...prev.securitySettings,
          [setting]: Array.isArray(value) ? value[0] : value,
        },
      }));
    };

  const handleAddIPRule = () => {
    if (!newIPRule.ipAddress) {
      alert("Please enter an IP address");
      return;
    }

    const newId =
      formData.ipRules.length > 0
        ? Math.max(...formData.ipRules.map((r) => r.id)) + 1
        : 1;

    const updatedIpRules = [...formData.ipRules, { ...newIPRule, id: newId }];

    setFormData((prev) => ({
      ...prev,
      ipRules: updatedIpRules,
    }));

    setNewIPRule({ ipAddress: "", type: "allow", description: "" });
  };

  const handleAddRateLimit = () => {
    if (!newRateLimit.name) {
      alert("Please enter a name for the rate limit rule");
      return;
    }

    const newId =
      formData.rateLimits.length > 0
        ? Math.max(...formData.rateLimits.map((r) => r.id)) + 1
        : 1;

    const updatedRateLimits = [
      ...formData.rateLimits,
      { ...newRateLimit, id: newId },
    ];

    setFormData((prev) => ({
      ...prev,
      rateLimits: updatedRateLimits,
    }));

    setNewRateLimit({ name: "", requests: 100, window: 60, scope: "ip" });
  };

  const handleRemoveIPRule = (id: number) => {
    const updatedIpRules = formData.ipRules.filter((rule) => rule.id !== id);
    setFormData((prev) => ({
      ...prev,
      ipRules: updatedIpRules,
    }));
  };

  const handleRemoveRateLimit = (id: number) => {
    const updatedRateLimits = formData.rateLimits.filter(
      (rule) => rule.id !== id
    );
    setFormData((prev) => ({
      ...prev,
      rateLimits: updatedRateLimits,
    }));
  };

  const handleSubmit = async (): Promise<boolean> => {
    if (
      formData.securitySettings.enableIPWhitelist &&
      !formData.ipRules.some((r) => r.type === "allow")
    ) {
      alert("IP whitelist is enabled but no allowed IPs are configured");
      return false;
    }

    // Save final state before proceeding
    localStorage.setItem("formState_step5", JSON.stringify(formData));

    console.log("Step 5 data validated and saved:", formData);
    return true;
  };

  return (
    <OnboardingStepTemplate
      stepNumber={5}
      stepTitle="Security Settings"
      stepDescription="Configure security policies including rate limiting, IP filtering, and request validation."
      onNext={handleSubmit}
      formKey="step5"
    >
      <Grid container spacing={4}>
        {/* Security Overview */}
        <Grid size={12}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Important:</strong> These security settings help protect
              your API from common attacks. Review and configure them carefully.
            </Typography>
          </Alert>
        </Grid>

        {/* Core Security Settings */}
        <Grid size={12}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Shield fontSize="small" />
            Core Security Settings
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Request Validation
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.securitySettings.enableRequestValidation}
                    onChange={handleSecurityToggle("enableRequestValidation")}
                  />
                }
                label="Validate Incoming Requests"
                sx={{ display: "block", mb: 1 }}
              />
              <Typography
                variant="caption"
                color="textSecondary"
                display="block"
                sx={{ mb: 2 }}
              >
                Validate request headers, body, and parameters
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.securitySettings.enableResponseValidation}
                    onChange={handleSecurityToggle("enableResponseValidation")}
                  />
                }
                label="Validate Outgoing Responses"
                sx={{ display: "block", mb: 1 }}
              />
              <Typography
                variant="caption"
                color="textSecondary"
                display="block"
                sx={{ mb: 2 }}
              >
                Validate upstream API responses before forwarding
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={
                      formData.securitySettings.enableSQLInjectionProtection
                    }
                    onChange={handleSecurityToggle(
                      "enableSQLInjectionProtection"
                    )}
                  />
                }
                label="SQL Injection Protection"
                sx={{ display: "block", mb: 1 }}
              />
              <Typography
                variant="caption"
                color="textSecondary"
                display="block"
              >
                Detect and block SQL injection attempts
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Request Size Limits
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  Max Request Body Size:{" "}
                  {Math.round(
                    formData.securitySettings.maxRequestBodySize / 1024
                  )}{" "}
                  KB
                </Typography>
                <Slider
                  value={formData.securitySettings.maxRequestBodySize}
                  onChange={handleSliderChange("maxRequestBodySize")}
                  min={1024} // 1KB
                  max={10485760} // 10MB
                  step={1024}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${Math.round(value / 1024)} KB`}
                />
                <Typography variant="caption" color="textSecondary">
                  Maximum allowed request body size
                </Typography>
              </Box>

              <Box>
                <Typography gutterBottom>
                  Max Request Header Size:{" "}
                  {Math.round(
                    formData.securitySettings.maxRequestHeaderSize / 1024
                  )}{" "}
                  KB
                </Typography>
                <Slider
                  value={formData.securitySettings.maxRequestHeaderSize}
                  onChange={handleSliderChange("maxRequestHeaderSize")}
                  min={1024} // 1KB
                  max={32768} // 32KB
                  step={1024}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${Math.round(value / 1024)} KB`}
                />
                <Typography variant="caption" color="textSecondary">
                  Maximum allowed request header size
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Rate Limiting */}
        <Grid size={12}>
          <Card variant="outlined">
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
                  <Lock fontSize="small" />
                  Rate Limiting
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.securitySettings.enableRateLimiting}
                      onChange={handleSecurityToggle("enableRateLimiting")}
                    />
                  }
                  label="Enable Rate Limiting"
                />
              </Box>

              {formData.securitySettings.enableRateLimiting && (
                <>
                  {/* Add New Rate Limit */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Add Rate Limit Rule
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                          fullWidth
                          label="Rule Name"
                          value={newRateLimit.name}
                          onChange={(e) =>
                            setNewRateLimit((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <TextField
                          fullWidth
                          label="Requests"
                          type="number"
                          value={newRateLimit.requests}
                          onChange={(e) =>
                            setNewRateLimit((prev) => ({
                              ...prev,
                              requests: parseInt(e.target.value) || 100,
                            }))
                          }
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <TextField
                          fullWidth
                          label="Window (s)"
                          type="number"
                          value={newRateLimit.window}
                          onChange={(e) =>
                            setNewRateLimit((prev) => ({
                              ...prev,
                              window: parseInt(e.target.value) || 60,
                            }))
                          }
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Scope</InputLabel>
                          <Select
                            value={newRateLimit.scope}
                            onChange={(e) =>
                              setNewRateLimit((prev) => ({
                                ...prev,
                                scope: e.target.value as any,
                              }))
                            }
                            label="Scope"
                          >
                            <MenuItem value="global">Global</MenuItem>
                            <MenuItem value="ip">Per IP</MenuItem>
                            <MenuItem value="user">Per User</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <Button
                          startIcon={<Add />}
                          variant="contained"
                          onClick={handleAddRateLimit}
                          fullWidth
                        >
                          Add Rule
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Rate Limits Table */}
                  <Typography variant="subtitle2" gutterBottom>
                    Configured Rate Limits ({formData.rateLimits.length})
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Requests</TableCell>
                          <TableCell align="right">Window</TableCell>
                          <TableCell>Scope</TableCell>
                          <TableCell align="right">Rate</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.rateLimits.map((rule) => (
                          <TableRow key={rule.id} hover>
                            <TableCell>{rule.name}</TableCell>
                            <TableCell align="right">{rule.requests}</TableCell>
                            <TableCell align="right">{rule.window}s</TableCell>
                            <TableCell>
                              <Chip
                                label={rule.scope}
                                size="small"
                                color={
                                  rule.scope === "global"
                                    ? "primary"
                                    : rule.scope === "ip"
                                    ? "secondary"
                                    : "success"
                                }
                              />
                            </TableCell>
                            <TableCell align="right">
                              {Math.round((rule.requests / rule.window) * 60)}
                              /min
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveRateLimit(rule.id)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* IP Filtering */}
        <Grid size={12}>
          <Card variant="outlined">
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
                  <Security fontSize="small" />
                  IP Address Filtering
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.securitySettings.enableIPWhitelist}
                        onChange={handleSecurityToggle("enableIPWhitelist")}
                      />
                    }
                    label="Enable Whitelist"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.securitySettings.enableIPBlacklist}
                        onChange={handleSecurityToggle("enableIPBlacklist")}
                      />
                    }
                    label="Enable Blacklist"
                  />
                </Box>
              </Box>

              {(formData.securitySettings.enableIPWhitelist ||
                formData.securitySettings.enableIPBlacklist) && (
                <>
                  {/* Add New IP Rule */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Add IP Rule
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          label="IP Address/CIDR"
                          value={newIPRule.ipAddress}
                          onChange={(e) =>
                            setNewIPRule((prev) => ({
                              ...prev,
                              ipAddress: e.target.value,
                            }))
                          }
                          placeholder="192.168.1.1 or 10.0.0.0/8"
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Type</InputLabel>
                          <Select
                            value={newIPRule.type}
                            onChange={(e) =>
                              setNewIPRule((prev) => ({
                                ...prev,
                                type: e.target.value as "allow" | "block",
                              }))
                            }
                            label="Type"
                          >
                            <MenuItem value="allow">Allow</MenuItem>
                            <MenuItem value="block">Block</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                          fullWidth
                          label="Description"
                          value={newIPRule.description}
                          onChange={(e) =>
                            setNewIPRule((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <Button
                          startIcon={<Add />}
                          variant="contained"
                          onClick={handleAddIPRule}
                          fullWidth
                        >
                          Add Rule
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* IP Rules Table */}
                  <Typography variant="subtitle2" gutterBottom>
                    Configured IP Rules ({formData.ipRules.length})
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>IP Address/CIDR</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.ipRules.map((rule) => (
                          <TableRow key={rule.id} hover>
                            <TableCell sx={{ fontFamily: "monospace" }}>
                              {rule.ipAddress}
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={
                                  rule.type === "allow" ? (
                                    <CheckCircle />
                                  ) : (
                                    <Block />
                                  )
                                }
                                label={
                                  rule.type === "allow" ? "Allowed" : "Blocked"
                                }
                                color={
                                  rule.type === "allow" ? "success" : "error"
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{rule.description}</TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveIPRule(rule.id)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Security Recommendations */}
        <Grid size={12}>
          <Alert severity="success">
            <Typography variant="body2">
              <strong>Security Recommendations:</strong>
              <ul style={{ marginTop: 8, marginBottom: 8 }}>
                <li>Enable rate limiting to prevent DDoS attacks</li>
                <li>Use IP whitelisting for internal APIs</li>
                <li>
                  Set reasonable request size limits to prevent resource
                  exhaustion
                </li>
                <li>Enable SQL injection and XSS protection for web APIs</li>
                <li>Regularly review and update security rules</li>
              </ul>
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </OnboardingStepTemplate>
  );
};

export default Step5SecuritySettings;
