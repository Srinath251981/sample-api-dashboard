// components/Dashboard/TimeRangeSelector.tsx
import React from "react";
import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import { TimeRange } from "../../types";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  value,
  onChange,
}) => {
  const ranges: { label: string; value: TimeRange }[] = [
    { label: "Live", value: "live" },
    { label: "Today", value: "daily" },
    { label: "Week", value: "weekly" },
    { label: "Month", value: "monthly" },
    { label: "Year", value: "yearly" },
    { label: "Custom", value: "custom" },
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(e, newValue) => newValue && onChange(newValue)}
        aria-label="time range"
        size="small"
      >
        {ranges.map((range) => (
          <ToggleButton key={range.value} value={range.value}>
            {range.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default TimeRangeSelector;
