// utils/dummyData.ts
import { 
  DashboardData, 
  TimeRange, 
  TimeRangeData, 
  Portfolio,
  APIStats,
  StatusCodeDistribution,
  ThroughputData,
  HeatmapData
} from '../types';

const generateTimeStamps = (timeRange: TimeRange): string[] => {
  const now = new Date();
  const stamps: string[] = [];
  let count = 0;

  switch (timeRange) {
    case 'live':
      count = 60; // last 60 minutes
      for (let i = count; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 60000);
        stamps.push(date.toISOString());
      }
      break;
    case 'daily':
      count = 24; // last 24 hours
      for (let i = count; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 3600000);
        stamps.push(date.toISOString());
      }
      break;
    case 'weekly':
      count = 7; // last 7 days
      for (let i = count; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 86400000);
        stamps.push(date.toISOString());
      }
      break;
    case 'monthly':
      count = 30; // last 30 days
      for (let i = count; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 86400000);
        stamps.push(date.toLocaleDateString());
      }
      break;
    case 'yearly':
      count = 12; // last 12 months
      for (let i = count; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        stamps.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      }
      break;
  }

  return stamps;
};

const generatePortfolios = (): Portfolio[] => [
  {
    id: 'all',
    name: 'All Portfolios',
    description: 'Combined view of all APIs',
    apiCount: 25,
    totalRequests: 1250000,
    avgSuccessRate: 98.7
  },
  {
    id: 'payment',
    name: 'Payment Services',
    description: 'Payment gateway and transaction APIs',
    apiCount: 8,
    totalRequests: 850000,
    avgSuccessRate: 99.2
  },
  {
    id: 'auth',
    name: 'Authentication',
    description: 'User authentication and authorization',
    apiCount: 5,
    totalRequests: 200000,
    avgSuccessRate: 99.8
  },
  {
    id: 'inventory',
    name: 'Inventory Management',
    description: 'Product and stock management APIs',
    apiCount: 6,
    totalRequests: 150000,
    avgSuccessRate: 97.5
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Data analysis and reporting APIs',
    apiCount: 6,
    totalRequests: 50000,
    avgSuccessRate: 98.9
  }
];

const generateAPIStats = (): APIStats[] => [
  {
    id: 'api-001',
    name: 'Process Payment',
    endpoint: '/api/v1/payments/process',
    portfolio: 'payment',
    successRate: 99.5,
    totalRequests: 450000,
    totalErrors: 2250,
    avgResponseTime: 145,
    p95ResponseTime: 320,
    statusCodes: { '2xx': 447750, '3xx': 0, '4xx': 1800, '5xx': 450 },
    lastUpdated: new Date().toISOString(),
    uptime: 99.9
  },
  {
    id: 'api-002',
    name: 'User Login',
    endpoint: '/api/v1/auth/login',
    portfolio: 'auth',
    successRate: 99.8,
    totalRequests: 120000,
    totalErrors: 240,
    avgResponseTime: 85,
    p95ResponseTime: 210,
    statusCodes: { '2xx': 119760, '3xx': 0, '4xx': 192, '5xx': 48 },
    lastUpdated: new Date().toISOString(),
    uptime: 99.95
  },
  {
    id: 'api-003',
    name: 'Get Product Details',
    endpoint: '/api/v1/products/{id}',
    portfolio: 'inventory',
    successRate: 97.2,
    totalRequests: 80000,
    totalErrors: 2240,
    avgResponseTime: 65,
    p95ResponseTime: 180,
    statusCodes: { '2xx': 77760, '3xx': 0, '4xx': 1792, '5xx': 448 },
    lastUpdated: new Date().toISOString(),
    uptime: 99.2
  },
  {
    id: 'api-004',
    name: 'Generate Report',
    endpoint: '/api/v1/analytics/report',
    portfolio: 'analytics',
    successRate: 98.7,
    totalRequests: 25000,
    totalErrors: 325,
    avgResponseTime: 420,
    p95ResponseTime: 980,
    statusCodes: { '2xx': 24675, '3xx': 0, '4xx': 260, '5xx': 65 },
    lastUpdated: new Date().toISOString(),
    uptime: 98.5
  }
];

export const generateDashboardData = (timeRange: TimeRange, portfolioId?: string): DashboardData => {
  const timestamps = generateTimeStamps(timeRange);
  
  const responseTimes: TimeRangeData[] = timestamps.map((timestamp, index) => ({
    timestamp,
    avgResponseTime: Math.floor(Math.random() * 200) + 50,
    p95: Math.floor(Math.random() * 500) + 150,
    totalRequests: Math.floor(Math.random() * 1000) + 100,
    errors: Math.floor(Math.random() * 20),
    successRate: 95 + Math.random() * 4
  }));

  const throughput: ThroughputData[] = timestamps.map((timestamp, index) => ({
    timestamp,
    requestsPerMinute: Math.floor(Math.random() * 800) + 200,
    errorsPerMinute: Math.floor(Math.random() * 10)
  }));

  const heatmapData: HeatmapData[] = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  days.forEach(day => {
    for (let hour = 0; hour < 24; hour++) {
      heatmapData.push({
        day,
        hour,
        value: Math.floor(Math.random() * 1000) + (hour >= 9 && hour <= 17 ? 500 : 100)
      });
    }
  });

  const statusCodes: StatusCodeDistribution = {
    '2xx': Math.floor(Math.random() * 90000) + 80000,
    '3xx': Math.floor(Math.random() * 5000),
    '4xx': Math.floor(Math.random() * 3000) + 1000,
    '5xx': Math.floor(Math.random() * 500) + 100
  };

  const totalRequests = statusCodes['2xx'] + statusCodes['3xx'] + statusCodes['4xx'] + statusCodes['5xx'];
  const totalErrors = statusCodes['4xx'] + statusCodes['5xx'];

  return {
    summary: {
      totalAPIs: 25,
      activeAPIs: 24,
      totalRequests,
      totalErrors,
      overallSuccessRate: ((totalRequests - totalErrors) / totalRequests * 100),
      avgResponseTime: 156
    },
    portfolios: generatePortfolios(),
    apiList: generateAPIStats(),
    responseTimes,
    statusCodes,
    throughput,
    heatmapData
  };
};