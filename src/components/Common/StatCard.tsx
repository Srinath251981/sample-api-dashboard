// components/Common/StatCard.tsx
import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  sx?: SxProps<Theme>;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  subtitle,
  sx,
}) => {
  return (
    <Card sx={{ height: "100%", ...sx }}>
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid>
            <Box
              sx={{
                backgroundColor: `${color}15`,
                borderRadius: "12px",
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ color, fontSize: "1.5rem" }}>{icon}</Box>
            </Box>
          </Grid>
          <Grid>
            <Typography color="textSecondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
              {value}
            </Typography>
            {trend && (
              <Typography
                variant="body2"
                sx={{
                  color: trend.isPositive ? "success.main" : "error.main",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StatCard;
