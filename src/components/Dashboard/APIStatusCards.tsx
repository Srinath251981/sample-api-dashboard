// components/Dashboard/APIStatusCards.tsx
import React from "react";
import { Grid } from "@mui/material";
import {
  CheckCircle,
  Error,
  Timeline,
  AccessTime,
  Speed,
  CloudOff,
} from "@mui/icons-material";
import StatCard from "../Common/StatCard";
import { DashboardSummary } from "../../types";

interface APIStatusCardsProps {
  summary: DashboardSummary;
}

const APIStatusCards: React.FC<APIStatusCardsProps> = ({ summary }) => {
  const cards = [
    {
      title: "Success Rate",
      value: `${summary.overallSuccessRate.toFixed(1)}%`,
      icon: <CheckCircle />,
      color: "#4caf50",
      trend: { value: 1.2, isPositive: true },
    },
    {
      title: "Total Errors",
      value: summary.totalErrors.toLocaleString(),
      icon: <Error />,
      color: "#f44336",
      trend: { value: 0.8, isPositive: false },
    },
    {
      title: "Avg Response Time",
      value: `${summary.avgResponseTime}ms`,
      icon: <AccessTime />,
      color: "#2196f3",
      subtitle: "P95: 320ms",
    },
    {
      title: "Total Requests",
      value: summary.totalRequests.toLocaleString(),
      icon: <Timeline />,
      color: "#ff9800",
    },
    {
      title: "Active APIs",
      value: `${summary.activeAPIs}/${summary.totalAPIs}`,
      icon: <Speed />,
      color: "#9c27b0",
      subtitle: `${((summary.activeAPIs / summary.totalAPIs) * 100).toFixed(
        1
      )}% uptime`,
    },
    {
      title: "Error Rate",
      value: `${((summary.totalErrors / summary.totalRequests) * 100).toFixed(
        2
      )}%`,
      icon: <CloudOff />,
      color: "#ff5722",
      trend: { value: 0.3, isPositive: false },
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        // <Grid ></Grid>
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default APIStatusCards;
