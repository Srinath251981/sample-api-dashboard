// components/Charts/ResponseTimeChart.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TimeRangeData, TimeRange } from "../../types";
import { Paper, Typography, Box, useTheme } from "@mui/material";

interface ResponseTimeChartProps {
  data: TimeRangeData[];
  timeRange: TimeRange;
}

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({
  data,
  timeRange,
}) => {
  const theme = useTheme();

  const formatXAxis = (tickItem: string) => {
    if (timeRange === "live" || timeRange === "daily") {
      return new Date(tickItem).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return tickItem;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, bgcolor: "background.paper", boxShadow: 3 }}>
          <Typography variant="body2" color="textSecondary">
            {timeRange === "live" || timeRange === "daily"
              ? new Date(label).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : label}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.primary.main }}
          >
            Avg: {payload[0].value}ms
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.success.main }}
          >
            P95: {payload[1].value}ms
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Success: {payload[2]?.value?.toFixed(1)}%
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXAxis}
            stroke={theme.palette.text.secondary}
          />
          <YAxis
            label={{
              value: "Response Time (ms)",
              angle: -90,
              position: "insideLeft",
            }}
            stroke={theme.palette.text.secondary}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="avgResponseTime"
            stroke={theme.palette.primary.main}
            fill={theme.palette.primary.main}
            fillOpacity={0.1}
            strokeWidth={2}
            name="Average"
          />
          <Area
            type="monotone"
            dataKey="p95"
            stroke={theme.palette.success.main}
            fill={theme.palette.success.main}
            fillOpacity={0.1}
            strokeWidth={2}
            name="P95"
          />
          <Line
            type="monotone"
            dataKey="successRate"
            stroke={theme.palette.warning.main}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Success Rate"
            yAxisId={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ResponseTimeChart;
