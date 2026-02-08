// pages/LoginPage.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Container,
  Alert,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Lock,
  Visibility,
  VisibilityOff,
  Person,
  Cloud,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!credentials.email || !credentials.password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, accept any non-empty credentials
      if (credentials.email && credentials.password) {
        // Store authentication token (in real app, this would come from backend)
        localStorage.setItem("authToken", "demo-token-12345");
        localStorage.setItem("userEmail", credentials.email);

        // Redirect to onboarding
        navigate("/onboard/step1");
      } else {
        setError(
          "Invalid credentials. Use any non-empty email/password for demo.",
        );
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setCredentials({
      email: "admin@apigateway.com",
      password: "demo123",
    });
  };

  const handleForgotPassword = () => {
    alert("Password reset functionality would be implemented here");
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 2,
      }}
    >
      <Card
        elevation={8}
        sx={{
          maxWidth: 450,
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            p: 3,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Cloud sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" fontWeight={700}>
              API Gateway
            </Typography>
          </Box>
          <Typography variant="body1">
            Enterprise Gateway Management Platform
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center" fontWeight={600}>
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Sign in to your account to continue
          </Typography>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleInputChange}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              onChange={handleInputChange}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 3,
              }}
            >
              <Button
                size="small"
                onClick={handleForgotPassword}
                disabled={loading}
                sx={{ textTransform: "none" }}
              >
                Forgot Password?
              </Button>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                mb: 2,
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleDemoLogin}
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                mb: 3,
              }}
            >
              Use Demo Account
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="textSecondary">
              OR
            </Typography>
          </Divider>

          {/* Additional Info */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Don't have an account?
            </Typography>
            <Button
              variant="text"
              size="small"
              disabled={loading}
              sx={{ textTransform: "none" }}
              onClick={() =>
                alert("Contact administrator for account creation")
              }
            >
              Request Access
            </Button>
          </Box>
        </CardContent>

        {/* Footer */}
        <Box
          sx={{
            bgcolor: "grey.50",
            p: 2,
            textAlign: "center",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" color="textSecondary">
            © {new Date().getFullYear()} API Gateway. All rights reserved.
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default LoginPage;
