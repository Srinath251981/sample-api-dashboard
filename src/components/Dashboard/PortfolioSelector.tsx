// components/Dashboard/PortfolioSelector.tsx
import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import { Portfolio } from "../../types";

interface PortfolioSelectorProps {
  value: string;
  onChange: (value: string) => void;
  portfolios: Portfolio[];
}

const PortfolioSelector: React.FC<PortfolioSelectorProps> = ({
  value,
  onChange,
  portfolios,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="portfolio-select-label">Portfolio</InputLabel>
      <Select
        labelId="portfolio-select-label"
        value={value}
        label="Portfolio"
        onChange={handleChange}
        renderValue={(selected) => {
          const portfolio = portfolios.find((p) => p.id === selected);
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={portfolio?.apiCount}
                size="small"
                color="primary"
                sx={{ height: 20 }}
              />
              <span>{portfolio?.name}</span>
            </Box>
          );
        }}
      >
        {portfolios.map((portfolio) => (
          <MenuItem key={portfolio.id} value={portfolio.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
              }}
            >
              <Chip
                label={portfolio.apiCount}
                size="small"
                color="primary"
                sx={{ height: 20 }}
              />
              <Box sx={{ flex: 1 }}>
                <div>{portfolio.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#666" }}>
                  {portfolio.description}
                </div>
              </Box>
              <Chip
                label={`${portfolio.avgSuccessRate.toFixed(1)}%`}
                size="small"
                color="success"
                variant="outlined"
                sx={{ height: 20 }}
              />
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PortfolioSelector;
