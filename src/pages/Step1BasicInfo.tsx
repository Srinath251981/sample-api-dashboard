// pages/Step1BasicInfo.tsx
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
} from "@mui/material";
import OnboardingStepTemplate from "./OnboardingStepTemplate";

interface FormData {
  gatewayName: string;
  description: string;
  environment: string;
  region: string;
  version: string;
}

const Step1BasicInfo: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    gatewayName: "",
    description: "",
    environment: "",
    region: "",
    version: "1.0.0",
  });

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("formState_step1");
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
    localStorage.setItem("formState_step1", JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (): Promise<boolean> => {
    // Validate form data
    if (!formData.gatewayName.trim()) {
      alert("Gateway name is required");
      return false;
    }
    if (!formData.environment) {
      alert("Please select an environment");
      return false;
    }
    if (!formData.region) {
      alert("Please select a region");
      return false;
    }

    // Save final state before proceeding
    localStorage.setItem("formState_step1", JSON.stringify(formData));

    console.log("Step 1 data validated and saved:", formData);
    return true;
  };

  return (
    <OnboardingStepTemplate
      stepNumber={1}
      stepTitle="Basic Information"
      stepDescription="Configure basic gateway settings including name, environment, and region."
      onNext={handleSubmit}
      formKey="step1"
    >
      <Grid container spacing={3}>
        {/* Gateway Name */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            required
            fullWidth
            label="Gateway Name"
            name="gatewayName"
            value={formData.gatewayName}
            onChange={handleInputChange}
            helperText="Unique identifier for your gateway"
            variant="outlined"
          />
        </Grid>

        {/* Version */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Version"
            name="version"
            value={formData.version}
            onChange={handleInputChange}
            helperText="Initial version number"
            variant="outlined"
          />
        </Grid>

        {/* Description */}
        <Grid size={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            helperText="Brief description of the gateway's purpose"
            multiline
            rows={3}
            variant="outlined"
          />
        </Grid>

        {/* Environment Selection */}
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth required>
            <InputLabel>Environment</InputLabel>
            <Select
              name="environment"
              value={formData.environment}
              onChange={handleSelectChange}
              label="Environment"
            >
              <MenuItem value="development">Development</MenuItem>
              <MenuItem value="staging">Staging</MenuItem>
              <MenuItem value="production">Production</MenuItem>
              <MenuItem value="testing">Testing</MenuItem>
            </Select>
            <FormHelperText>Select deployment environment</FormHelperText>
          </FormControl>
        </Grid>

        {/* Region Selection */}
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth required>
            <InputLabel>Region</InputLabel>
            <Select
              name="region"
              value={formData.region}
              onChange={handleSelectChange}
              label="Region"
            >
              <MenuItem value="us-east-1">US East (N. Virginia)</MenuItem>
              <MenuItem value="us-west-2">US West (Oregon)</MenuItem>
              <MenuItem value="eu-west-1">EU (Ireland)</MenuItem>
              <MenuItem value="ap-southeast-1">
                Asia Pacific (Singapore)
              </MenuItem>
            </Select>
            <FormHelperText>Select primary deployment region</FormHelperText>
          </FormControl>
        </Grid>

        {/* Information Alert */}
        <Grid size={12}>
          <Alert severity="info">
            Gateway name must be unique across your organization. Once set, it
            cannot be changed.
          </Alert>
        </Grid>
      </Grid>
    </OnboardingStepTemplate>
  );
};

export default Step1BasicInfo;
