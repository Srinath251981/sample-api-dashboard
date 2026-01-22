// pages/Step4EndpointMapping.tsx
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  ContentCopy,
  ArrowForward,
} from "@mui/icons-material";
import OnboardingStepTemplate from "./OnboardingStepTemplate";

interface EndpointMapping {
  id: number;
  name: string;
  path: string;
  method: string;
  upstreamPath: string;
  timeout: number;
  rateLimit: number;
  authenticationRequired: boolean;
  cachingEnabled: boolean;
  cacheTTL: number;
}

interface FormData {
  mappings: EndpointMapping[];
}

const Step4EndpointMapping: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    mappings: [],
  });

  const [newMapping, setNewMapping] = useState<Omit<EndpointMapping, "id">>({
    name: "",
    path: "",
    method: "GET",
    upstreamPath: "",
    timeout: 30,
    rateLimit: 100,
    authenticationRequired: true,
    cachingEnabled: false,
    cacheTTL: 300,
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<EndpointMapping | null>(
    null
  );

  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"];

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("formState_step4");
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
    localStorage.setItem("formState_step4", JSON.stringify(formData));
  }, [formData]);

  const handleAddMapping = () => {
    if (!newMapping.name || !newMapping.path || !newMapping.upstreamPath) {
      alert("Please fill in required fields");
      return;
    }

    const newId =
      formData.mappings.length > 0
        ? Math.max(...formData.mappings.map((m) => m.id)) + 1
        : 1;

    const updatedMappings = [
      ...formData.mappings,
      { ...newMapping, id: newId },
    ];

    setFormData((prev) => ({
      ...prev,
      mappings: updatedMappings,
    }));

    setNewMapping({
      name: "",
      path: "",
      method: "GET",
      upstreamPath: "",
      timeout: 30,
      rateLimit: 100,
      authenticationRequired: true,
      cachingEnabled: false,
      cacheTTL: 300,
    });
  };

  const handleEditMapping = (mapping: EndpointMapping) => {
    setEditingMapping(mapping);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingMapping) {
      const updatedMappings = formData.mappings.map((m) =>
        m.id === editingMapping.id ? editingMapping : m
      );

      setFormData((prev) => ({
        ...prev,
        mappings: updatedMappings,
      }));

      setEditDialogOpen(false);
      setEditingMapping(null);
    }
  };

  const handleRemoveMapping = (id: number) => {
    const updatedMappings = formData.mappings.filter(
      (mapping) => mapping.id !== id
    );
    setFormData((prev) => ({
      ...prev,
      mappings: updatedMappings,
    }));
  };

  const handleDuplicateMapping = (mapping: EndpointMapping) => {
    const newId =
      formData.mappings.length > 0
        ? Math.max(...formData.mappings.map((m) => m.id)) + 1
        : 1;

    const updatedMappings = [
      ...formData.mappings,
      { ...mapping, id: newId, name: `${mapping.name} (Copy)` },
    ];

    setFormData((prev) => ({
      ...prev,
      mappings: updatedMappings,
    }));
  };

  const handleSubmit = async (): Promise<boolean> => {
    if (formData.mappings.length === 0) {
      alert("Please add at least one endpoint mapping");
      return false;
    }

    // Validate all mappings have unique paths per method
    const pathMethodCombos = formData.mappings.map(
      (m) => `${m.path}:${m.method}`
    );
    const uniqueCombos = new Set(pathMethodCombos);
    if (pathMethodCombos.length !== uniqueCombos.size) {
      alert("Duplicate endpoint path/method combinations found");
      return false;
    }

    // Save final state before proceeding
    localStorage.setItem("formState_step4", JSON.stringify(formData));

    console.log("Step 4 data validated and saved:", formData);
    return true;
  };

  return (
    <OnboardingStepTemplate
      stepNumber={4}
      stepTitle="Endpoint Mapping"
      stepDescription="Map gateway endpoints to upstream API paths and configure request/response transformations."
      onNext={handleSubmit}
      formKey="step4"
    >
      <Grid container spacing={4}>
        {/* Introduction */}
        <Grid size={12}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Define how incoming requests to the gateway are mapped to upstream
            services. You can configure path rewriting, method mapping, and
            request/response transformations.
          </Alert>
        </Grid>

        {/* Add New Mapping Form */}
        <Grid size={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add New Endpoint Mapping
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Endpoint Name"
                    value={newMapping.name}
                    onChange={(e) =>
                      setNewMapping((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    helperText="Descriptive name for this endpoint"
                    size="small"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Gateway Path"
                    value={newMapping.path}
                    onChange={(e) =>
                      setNewMapping((prev) => ({
                        ...prev,
                        path: e.target.value,
                      }))
                    }
                    helperText="Path exposed by gateway"
                    placeholder="/api/v1/resource"
                    size="small"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Method</InputLabel>
                    <Select
                      value={newMapping.method}
                      onChange={(e) =>
                        setNewMapping((prev) => ({
                          ...prev,
                          method: e.target.value,
                        }))
                      }
                      label="Method"
                    >
                      {methods.map((method) => (
                        <MenuItem key={method} value={method}>
                          {method}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Upstream Path"
                    value={newMapping.upstreamPath}
                    onChange={(e) =>
                      setNewMapping((prev) => ({
                        ...prev,
                        upstreamPath: e.target.value,
                      }))
                    }
                    helperText="Path on upstream service"
                    placeholder="/resource"
                    size="small"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    fullWidth
                    label="Timeout (s)"
                    type="number"
                    value={newMapping.timeout}
                    onChange={(e) =>
                      setNewMapping((prev) => ({
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
                    value={newMapping.rateLimit}
                    onChange={(e) =>
                      setNewMapping((prev) => ({
                        ...prev,
                        rateLimit: parseInt(e.target.value) || 100,
                      }))
                    }
                    helperText="reqs/min"
                    size="small"
                    InputProps={{ inputProps: { min: 1, max: 10000 } }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newMapping.authenticationRequired}
                          onChange={(e) =>
                            setNewMapping((prev) => ({
                              ...prev,
                              authenticationRequired: e.target.checked,
                            }))
                          }
                          size="small"
                        />
                      }
                      label="Auth Required"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newMapping.cachingEnabled}
                          onChange={(e) =>
                            setNewMapping((prev) => ({
                              ...prev,
                              cachingEnabled: e.target.checked,
                            }))
                          }
                          size="small"
                        />
                      }
                      label="Enable Caching"
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  {newMapping.cachingEnabled && (
                    <TextField
                      fullWidth
                      label="Cache TTL (s)"
                      type="number"
                      value={newMapping.cacheTTL}
                      onChange={(e) =>
                        setNewMapping((prev) => ({
                          ...prev,
                          cacheTTL: parseInt(e.target.value) || 300,
                        }))
                      }
                      size="small"
                      InputProps={{ inputProps: { min: 1, max: 86400 } }}
                    />
                  )}
                </Grid>

                <Grid size={12}>
                  <Button
                    startIcon={<Add />}
                    variant="contained"
                    onClick={handleAddMapping}
                    sx={{ mt: 1 }}
                  >
                    Add Mapping
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Mappings Table */}
        <Grid size={12}>
          <Typography variant="h6" gutterBottom>
            Configured Endpoint Mappings ({formData.mappings.length})
          </Typography>

          {formData.mappings.length === 0 ? (
            <Alert severity="info">
              No endpoint mappings configured. Add at least one mapping to
              proceed.
            </Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Gateway Endpoint</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Upstream Path</TableCell>
                    <TableCell>Timeout</TableCell>
                    <TableCell>Rate Limit</TableCell>
                    <TableCell>Features</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.mappings.map((mapping) => (
                    <TableRow key={mapping.id} hover>
                      <TableCell>
                        <Typography fontWeight={600}>{mapping.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={mapping.path}
                          size="small"
                          sx={{ fontFamily: "monospace" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={mapping.method}
                          color={
                            mapping.method === "GET"
                              ? "success"
                              : mapping.method === "POST"
                              ? "primary"
                              : mapping.method === "PUT"
                              ? "warning"
                              : mapping.method === "DELETE"
                              ? "error"
                              : "default"
                          }
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <ArrowForward fontSize="small" color="action" />
                          <Chip
                            label={mapping.upstreamPath}
                            size="small"
                            sx={{ fontFamily: "monospace" }}
                            variant="outlined"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{mapping.timeout}s</TableCell>
                      <TableCell>{mapping.rateLimit}/min</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          {mapping.authenticationRequired && (
                            <Tooltip title="Authentication Required">
                              <Chip label="Auth" size="small" color="primary" />
                            </Tooltip>
                          )}
                          {mapping.cachingEnabled && (
                            <Tooltip title="Caching Enabled">
                              <Chip
                                label="Cache"
                                size="small"
                                color="success"
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            justifyContent: "flex-end",
                          }}
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEditMapping(mapping)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Duplicate">
                            <IconButton
                              size="small"
                              onClick={() => handleDuplicateMapping(mapping)}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveMapping(mapping.id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Endpoint Mapping</DialogTitle>
        <DialogContent>
          {editingMapping && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Endpoint Name"
                  value={editingMapping.name}
                  onChange={(e) =>
                    setEditingMapping({
                      ...editingMapping,
                      name: e.target.value,
                    })
                  }
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Gateway Path"
                  value={editingMapping.path}
                  onChange={(e) =>
                    setEditingMapping({
                      ...editingMapping,
                      path: e.target.value,
                    })
                  }
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Method</InputLabel>
                  <Select
                    value={editingMapping.method}
                    onChange={(e) =>
                      setEditingMapping({
                        ...editingMapping,
                        method: e.target.value,
                      })
                    }
                    label="Method"
                  >
                    {methods.map((method) => (
                      <MenuItem key={method} value={method}>
                        {method}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Upstream Path"
                  value={editingMapping.upstreamPath}
                  onChange={(e) =>
                    setEditingMapping({
                      ...editingMapping,
                      upstreamPath: e.target.value,
                    })
                  }
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Timeout (seconds)"
                  type="number"
                  value={editingMapping.timeout}
                  onChange={(e) =>
                    setEditingMapping({
                      ...editingMapping,
                      timeout: parseInt(e.target.value) || 30,
                    })
                  }
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Rate Limit (reqs/min)"
                  type="number"
                  value={editingMapping.rateLimit}
                  onChange={(e) =>
                    setEditingMapping({
                      ...editingMapping,
                      rateLimit: parseInt(e.target.value) || 100,
                    })
                  }
                  size="small"
                />
              </Grid>
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editingMapping.authenticationRequired}
                      onChange={(e) =>
                        setEditingMapping({
                          ...editingMapping,
                          authenticationRequired: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Authentication Required"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={editingMapping.cachingEnabled}
                      onChange={(e) =>
                        setEditingMapping({
                          ...editingMapping,
                          cachingEnabled: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Enable Caching"
                  sx={{ ml: 2 }}
                />
              </Grid>
              {editingMapping.cachingEnabled && (
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Cache TTL (seconds)"
                    type="number"
                    value={editingMapping.cacheTTL}
                    onChange={(e) =>
                      setEditingMapping({
                        ...editingMapping,
                        cacheTTL: parseInt(e.target.value) || 300,
                      })
                    }
                    size="small"
                  />
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </OnboardingStepTemplate>
  );
};

export default Step4EndpointMapping;
