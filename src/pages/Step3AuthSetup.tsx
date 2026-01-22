// pages/Step3AuthSetup.tsx
import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Alert,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Key,
  VpnKey,
  Lock,
  Security,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import OnboardingStepTemplate from "./OnboardingStepTemplate";

interface JWTConfig {
  issuer: string;
  audience: string;
  secretKey: string;
  expiration: number;
}

interface ApiKeyConfig {
  headerName: string;
  queryParam: string;
}

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  scopes: string;
}

interface SecurityHeaders {
  enableCORS: boolean;
  enableCSP: boolean;
  enableHSTS: boolean;
  enableXSS: boolean;
}

interface FormData {
  authMethod: string;
  jwtConfig: JWTConfig;
  apiKeyConfig: ApiKeyConfig;
  oauthConfig: OAuthConfig;
  securityHeaders: SecurityHeaders;
}

const Step3AuthSetup: React.FC = () => {
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    authMethod: "jwt",
    jwtConfig: {
      issuer: "api-gateway",
      audience: "api-consumers",
      secretKey: "",
      expiration: 3600,
    },
    apiKeyConfig: {
      headerName: "X-API-Key",
      queryParam: "api_key",
    },
    oauthConfig: {
      clientId: "",
      clientSecret: "",
      authorizationUrl: "https://auth.example.com/oauth/authorize",
      tokenUrl: "https://auth.example.com/oauth/token",
      scopes: "read write",
    },
    securityHeaders: {
      enableCORS: true,
      enableCSP: true,
      enableHSTS: true,
      enableXSS: true,
    },
  });

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("formState_step3");
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
    localStorage.setItem("formState_step3", JSON.stringify(formData));
  }, [formData]);

  const handleJwtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      jwtConfig: {
        ...prev.jwtConfig,
        [name]: name === "expiration" ? parseInt(value) || 3600 : value,
      },
    }));
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      apiKeyConfig: {
        ...prev.apiKeyConfig,
        [name]: value,
      },
    }));
  };

  const handleOauthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      oauthConfig: {
        ...prev.oauthConfig,
        [name]: value,
      },
    }));
  };

  const handleSecurityHeaderToggle =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        securityHeaders: {
          ...prev.securityHeaders,
          [name]: e.target.checked,
        },
      }));
    };

  const generateSecretKey = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let secret = "";
    for (let i = 0; i < 64; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({
      ...prev,
      jwtConfig: { ...prev.jwtConfig, secretKey: secret },
    }));
  };

  const handleAuthMethodChange = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      authMethod: method,
    }));
  };

  const handleSubmit = async (): Promise<boolean> => {
    if (formData.authMethod === "jwt" && !formData.jwtConfig.secretKey) {
      alert("JWT secret key is required");
      return false;
    }

    if (
      formData.authMethod === "oauth" &&
      (!formData.oauthConfig.clientId || !formData.oauthConfig.clientSecret)
    ) {
      alert("OAuth client ID and secret are required");
      return false;
    }

    // Save final state before proceeding
    localStorage.setItem("formState_step3", JSON.stringify(formData));

    console.log("Step 3 data validated and saved:", formData);
    return true;
  };

  return (
    <OnboardingStepTemplate
      stepNumber={3}
      stepTitle="Authentication Setup"
      stepDescription="Configure authentication methods and security headers for your API gateway."
      onNext={handleSubmit}
      formKey="step3"
    >
      <Grid container spacing={4}>
        {/* Authentication Method Selection */}
        <Grid size={12}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Key fontSize="small" />
            Authentication Method
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Select the primary authentication method for your API gateway. You
            can add multiple methods later.
          </Alert>
        </Grid>

        <Grid size={12}>
          <Card variant="outlined">
            <CardContent>
              <RadioGroup
                value={formData.authMethod}
                onChange={(e) => handleAuthMethodChange(e.target.value)}
              >
                <Grid container spacing={3}>
                  {/* JWT Option */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        borderColor:
                          formData.authMethod === "jwt"
                            ? "primary.main"
                            : "divider",
                        backgroundColor:
                          formData.authMethod === "jwt"
                            ? "primary.50"
                            : "transparent",
                      }}
                      onClick={() => handleAuthMethodChange("jwt")}
                    >
                      <FormControlLabel
                        value="jwt"
                        control={<Radio />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              JWT Tokens
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              JSON Web Tokens for stateless authentication
                            </Typography>
                          </Box>
                        }
                        sx={{ width: "100%", m: 0 }}
                      />
                      <Chip
                        label="Recommended"
                        size="small"
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    </Card>
                  </Grid>

                  {/* API Key Option */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        borderColor:
                          formData.authMethod === "api-key"
                            ? "primary.main"
                            : "divider",
                        backgroundColor:
                          formData.authMethod === "api-key"
                            ? "primary.50"
                            : "transparent",
                      }}
                      onClick={() => handleAuthMethodChange("api-key")}
                    >
                      <FormControlLabel
                        value="api-key"
                        control={<Radio />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              API Keys
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Simple API key-based authentication
                            </Typography>
                          </Box>
                        }
                        sx={{ width: "100%", m: 0 }}
                      />
                    </Card>
                  </Grid>

                  {/* OAuth Option */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        borderColor:
                          formData.authMethod === "oauth"
                            ? "primary.main"
                            : "divider",
                        backgroundColor:
                          formData.authMethod === "oauth"
                            ? "primary.50"
                            : "transparent",
                      }}
                      onClick={() => handleAuthMethodChange("oauth")}
                    >
                      <FormControlLabel
                        value="oauth"
                        control={<Radio />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              OAuth 2.0
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Standard authorization framework
                            </Typography>
                          </Box>
                        }
                        sx={{ width: "100%", m: 0 }}
                      />
                    </Card>
                  </Grid>
                </Grid>
              </RadioGroup>
            </CardContent>
          </Card>
        </Grid>

        {/* JWT Configuration (shown only when JWT is selected) */}
        {formData.authMethod === "jwt" && (
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <VpnKey fontSize="small" />
                  JWT Configuration
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Issuer"
                      name="issuer"
                      value={formData.jwtConfig.issuer}
                      onChange={handleJwtChange}
                      helperText="Token issuer identifier"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Audience"
                      name="audience"
                      value={formData.jwtConfig.audience}
                      onChange={handleJwtChange}
                      helperText="Intended token audience"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                      fullWidth
                      label="Secret Key"
                      name="secretKey"
                      type={showSecret ? "text" : "password"}
                      value={formData.jwtConfig.secretKey}
                      onChange={handleJwtChange}
                      helperText="JWT signing secret (keep secure)"
                      InputProps={{
                        endAdornment: (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => setShowSecret(!showSecret)}
                            >
                              {showSecret ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            <Tooltip title="Generate secure key">
                              <IconButton
                                size="small"
                                onClick={generateSecretKey}
                              >
                                <Lock fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Expiration (seconds)"
                      name="expiration"
                      type="number"
                      value={formData.jwtConfig.expiration}
                      onChange={handleJwtChange}
                      helperText="Token validity duration"
                      InputProps={{ inputProps: { min: 60, max: 86400 } }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Alert severity="warning">
                      <Typography variant="body2">
                        <strong>Important:</strong> Store the JWT secret key
                        securely. In production, use environment variables or a
                        secret management service.
                      </Typography>
                    </Alert>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* API Key Configuration (shown only when API Key is selected) */}
        {formData.authMethod === "api-key" && (
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  API Key Configuration
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Header Name"
                      name="headerName"
                      value={formData.apiKeyConfig.headerName}
                      onChange={handleApiKeyChange}
                      helperText="HTTP header for API key"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Query Parameter"
                      name="queryParam"
                      value={formData.apiKeyConfig.queryParam}
                      onChange={handleApiKeyChange}
                      helperText="URL query parameter for API key"
                    />
                  </Grid>
                  <Grid size={12}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        API keys can be validated against a database or external
                        service. You'll be able to manage API keys in the
                        gateway dashboard.
                      </Typography>
                    </Alert>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* OAuth Configuration (shown only when OAuth is selected) */}
        {formData.authMethod === "oauth" && (
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  OAuth 2.0 Configuration
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Client ID"
                      name="clientId"
                      value={formData.oauthConfig.clientId}
                      onChange={handleOauthChange}
                      helperText="OAuth client identifier"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Client Secret"
                      name="clientSecret"
                      type="password"
                      value={formData.oauthConfig.clientSecret}
                      onChange={handleOauthChange}
                      helperText="OAuth client secret"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Authorization URL"
                      name="authorizationUrl"
                      value={formData.oauthConfig.authorizationUrl}
                      onChange={handleOauthChange}
                      helperText="OAuth authorization endpoint"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Token URL"
                      name="tokenUrl"
                      value={formData.oauthConfig.tokenUrl}
                      onChange={handleOauthChange}
                      helperText="OAuth token endpoint"
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Scopes"
                      name="scopes"
                      value={formData.oauthConfig.scopes}
                      onChange={handleOauthChange}
                      helperText="Space-separated list of OAuth scopes"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Security Headers (always shown) */}
        <Grid size={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Security fontSize="small" />
                Security Headers
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.securityHeaders.enableCORS}
                        onChange={handleSecurityHeaderToggle("enableCORS")}
                      />
                    }
                    label="Enable CORS"
                  />
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    display="block"
                  >
                    Cross-Origin Resource Sharing headers
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.securityHeaders.enableCSP}
                        onChange={handleSecurityHeaderToggle("enableCSP")}
                      />
                    }
                    label="Enable Content Security Policy"
                  />
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    display="block"
                  >
                    Prevent XSS and injection attacks
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.securityHeaders.enableHSTS}
                        onChange={handleSecurityHeaderToggle("enableHSTS")}
                      />
                    }
                    label="Enable HSTS"
                  />
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    display="block"
                  >
                    Force HTTPS connections
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.securityHeaders.enableXSS}
                        onChange={handleSecurityHeaderToggle("enableXSS")}
                      />
                    }
                    label="Enable XSS Protection"
                  />
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    display="block"
                  >
                    Browser XSS protection
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Best Practices */}
        <Grid size={12}>
          <Alert severity="success">
            <Typography variant="body2">
              <strong>Security Best Practices:</strong>
              <ul style={{ marginTop: 8, marginBottom: 8 }}>
                <li>Always use HTTPS for production deployments</li>
                <li>Rotate secrets and keys regularly</li>
                <li>Implement rate limiting on authentication endpoints</li>
                <li>
                  Use short-lived tokens and implement refresh token mechanism
                </li>
                <li>Log all authentication attempts for security auditing</li>
              </ul>
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </OnboardingStepTemplate>
  );
};

export default Step3AuthSetup;
