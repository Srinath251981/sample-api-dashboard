// pages/Dashboard.tsx
import React, { useState, useEffect } from "react";

import {
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { generateDashboardData } from "../utils/dummyData";
import { DashboardData, TimeRange, APIStats } from "../types";
import APIStatusCards from "../components/Dashboard/APIStatusCards";
import TimeRangeSelector from "../components/Dashboard/TimeRangeSelector";
import PortfolioSelector from "../components/Dashboard/PortfolioSelector";
import ResponseTimeChart from "../components/Charts/ResponseTimeChart";
import StatusCodeChart from "../components/Charts/StatusCodeChart";
// import ThroughputChart from "../components/Charts/ThroughputChart";
// import HeatMapChart from "../components/Charts/HeatMapChart";

const Dashboard: React.FC = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      try {
        // Simulate API call delay
        setTimeout(() => {
          const dashboardData = generateDashboardData(
            timeRange,
            selectedPortfolio
          );
          setData(dashboardData);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchData();

    // Simulate real-time updates for live mode
    if (timeRange === "live") {
      const interval = setInterval(() => {
        const updatedData = generateDashboardData("live", selectedPortfolio);
        setData(updatedData);
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [timeRange, selectedPortfolio]);

  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error || "Failed to load data"}
      </Alert>
    );
  }

  const getStatusColor = (successRate: number) => {
    if (successRate >= 99) return "success";
    if (successRate >= 95) return "warning";
    return "error";
  };

  return (
    <Box>
      {/* Header Controls */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <PortfolioSelector
              value={selectedPortfolio}
              onChange={setSelectedPortfolio}
              portfolios={data.portfolios}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ mb: 4 }}>
        <APIStatusCards summary={data.summary} />
      </Box>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Response Time Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Response Time & Success Rate
            </Typography>
            <ResponseTimeChart
              data={data.responseTimes}
              timeRange={timeRange}
            />
          </Paper>
        </Grid>

        {/* Status Codes Chart */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Status Code Distribution
            </Typography>
            <StatusCodeChart data={data.statusCodes} />
          </Paper>
        </Grid>

        {/* Throughput Chart */}
        {/* <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Requests Throughput
            </Typography>
            <ThroughputChart data={data.throughput} timeRange={timeRange} />
          </Paper>
        </Grid> */}

        {/* Heat Map */}
        {/* <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              API Usage Heat Map
            </Typography>
            <HeatMapChart data={data.heatmapData} />
          </Paper>
        </Grid> */}

        {/* API List Table */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              API Endpoints Status
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>API Name</TableCell>
                    <TableCell>Endpoint</TableCell>
                    <TableCell>Portfolio</TableCell>
                    <TableCell align="right">Success Rate</TableCell>
                    <TableCell align="right">Avg Response</TableCell>
                    <TableCell align="right">Total Requests</TableCell>
                    <TableCell align="right">Errors</TableCell>
                    <TableCell align="right">Uptime</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.apiList.map((api: APIStats) => (
                    <TableRow key={api.id} hover>
                      <TableCell>
                        <Typography fontWeight="medium">{api.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {api.endpoint}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={api.portfolio}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium">
                          {api.successRate.toFixed(1)}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {api.avgResponseTime}ms
                      </TableCell>
                      <TableCell align="right">
                        {api.totalRequests.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="error">
                          {api.totalErrors.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {api.uptime.toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            api.successRate >= 99
                              ? "Healthy"
                              : api.successRate >= 95
                              ? "Warning"
                              : "Critical"
                          }
                          color={getStatusColor(api.successRate)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
