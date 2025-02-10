'use client';

import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { useTheme } from '@/app/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartDataResponse {
  success: boolean;
  data: {
    userGrowth: {
      labels: string[];
      data: number[];
    };
    dailyNewUsers: {
      labels: string[];
      data: number[];
    };
    errorRate: {
      labels: string[];
      data: number[];
    };
    revenue: {
      labels: string[];
      data: number[];
    };
  };
}

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<ChartDataResponse['data']>({
    userGrowth: { labels: [], data: [] },
    dailyNewUsers: { labels: [], data: [] },
    errorRate: { labels: [], data: [] },
    revenue: { labels: [], data: [] }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chartResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/charts`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        if (chartResponse.ok) {
          const chartResponseData: ChartDataResponse = await chartResponse.json();
          
          if (chartResponseData.success) {
            setChartData(chartResponseData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const userGrowthData = {
    labels: chartData.userGrowth?.labels || [],
    datasets: [
      {
        label: 'User Growth',
        data: chartData.userGrowth?.data || [],
        borderColor: theme === 'dark' ? '#10b981' : '#059669',
        backgroundColor: theme === 'dark' ? '#10b98120' : '#10b98110',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const dailyNewUsersData = {
    labels: chartData.dailyNewUsers?.labels || [],
    datasets: [
      {
        label: 'New Users',
        data: chartData.dailyNewUsers?.data || [],
        borderColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
        backgroundColor: theme === 'dark' ? '#3b82f620' : '#3b82f610',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const errorRateData = {
    labels: chartData.errorRate?.labels || [],
    datasets: [
      {
        label: 'Error Rate',
        data: chartData.errorRate?.data || [],
        backgroundColor: theme === 'dark' ? '#ef4444' : '#dc2626',
      },
    ],
  };

  const revenueData = {
    labels: chartData.revenue?.labels || [],
    datasets: [
      {
        label: 'Revenue',
        data: chartData.revenue?.data || [],
        borderColor: theme === 'dark' ? '#8b5cf6' : '#6d28d9',
        backgroundColor: theme === 'dark' ? '#8b5cf620' : '#8b5cf610',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: { 
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' 
        },
      },
      x: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: { 
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' 
        },
      },
    },
    plugins: {
      legend: {
        labels: { 
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' 
        },
      },
    },
  };

  return (
    <div className={cn(
      "p-4 lg:p-8 min-h-screen",
      theme === 'dark' ? "bg-[#0a0a0a]" : "bg-gray-50"
    )}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={cn(
              "text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent",
            )}>Analytics</h1>
            <p className={cn(
              "mt-1 text-sm",
              theme === 'dark' ? "text-gray-400" : "text-gray-600"
            )}>Detailed analytics and trends</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <ChartCard
            title="Revenue Generation"
            chart={<Line data={revenueData} options={chartOptions} />}
            theme={theme}
          />
          
          <ChartCard
            title="Monthly User Growth"
            chart={<Line data={userGrowthData} options={chartOptions} />}
            theme={theme}
          />
          
          <ChartCard
            title="Daily New Users"
            chart={<Line data={dailyNewUsersData} options={chartOptions} />}
            theme={theme}
          />

          <ChartCard
            title="Error Rate"
            chart={<Bar data={errorRateData} options={chartOptions} />}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  chart,
  theme,
  className
}: {
  title: string;
  chart: React.ReactNode;
  theme: 'dark' | 'light';
  className?: string;
}) {
  return (
    <div className={cn(
      "rounded-xl p-6 border transition-all duration-200",
      theme === 'dark'
        ? "bg-[#1a1a1a] border-white/10 hover:border-emerald-500/50"
        : "bg-white border-gray-200 hover:border-emerald-500/50",
      className
    )}>
      <h2 className={cn(
        "text-lg font-semibold mb-4",
        theme === 'dark' ? "text-white" : "text-gray-900"
      )}>{title}</h2>
      {chart}
    </div>
  );
} 