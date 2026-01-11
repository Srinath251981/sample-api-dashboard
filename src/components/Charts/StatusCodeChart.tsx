// components/Charts/StatusCodeChart.tsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { StatusCodeDistribution } from "../../types";
import { Paper, Typography, Box, useTheme } from "@mui/material";

interface StatusCodeChartProps {
  data: StatusCodeDistribution;
}

const StatusCodeChart: React.FC<StatusCodeChartProps> = ({ data }) => {
  const theme = useTheme();

  const chartData = [
    {
      name: "2xx Success",
      value: data["2xx"],
      color: theme.palette.success.main,
    },
    {
      name: "3xx Redirect",
      value: data["3xx"],
      color: theme.palette.info.main,
    },
    {
      name: "4xx Client Error",
      value: data["4xx"],
      color: theme.palette.warning.main,
    },
    {
      name: "5xx Server Error",
      value: data["5xx"],
      color: theme.palette.error.main,
    },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = ((item.payload.value / total) * 100).toFixed(1);
      return (
        <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
          <Typography variant="body2">{item.name}</Typography>
          <Typography variant="body2" fontWeight="bold">
            {item.value.toLocaleString()} requests
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {percentage}% of total
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent ?? 0 * 100).toFixed(1)}%`
            }
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StatusCodeChart;
