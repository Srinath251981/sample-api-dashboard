// types/index.ts
export interface APIStats {
  id: string;
  name: string;
  endpoint: string;
  portfolio: string;
  successRate: number;
  totalRequests: number;
  totalErrors: number;
  avgResponseTime: number;
  p95ResponseTime: number;
  statusCodes: StatusCodeDistribution;
  lastUpdated: string;
  uptime: number;
}

export interface StatusCodeDistribution {
  "2xx": number;
  "3xx": number;
  "4xx": number;
  "5xx": number;
}

export interface TimeRangeData {
  timestamp: string;
  avgResponseTime: number;
  p95: number;
  totalRequests: number;
  errors: number;
  successRate: number;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  apiCount: number;
  totalRequests: number;
  avgSuccessRate: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  portfolios: Portfolio[];
  apiList: APIStats[];
  responseTimes: TimeRangeData[];
  statusCodes: StatusCodeDistribution;
  throughput: ThroughputData[];
  heatmapData: HeatmapData[];
}

export interface DashboardSummary {
  totalAPIs: number;
  activeAPIs: number;
  totalRequests: number;
  totalErrors: number;
  overallSuccessRate: number;
  avgResponseTime: number;
}

export interface ThroughputData {
  timestamp: string;
  requestsPerMinute: number;
  errorsPerMinute: number;
}

export interface HeatmapData {
  hour: number;
  day: string;
  value: number;
}

export type TimeRange =
  | "live"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";
