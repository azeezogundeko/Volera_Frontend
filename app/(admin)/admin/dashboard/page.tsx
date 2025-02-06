'use client';

import { useEffect, useState } from 'react';
import { 
  Users, Activity, AlertTriangle, Mail, 
  TrendingUp, ShoppingBag, MessageSquare, 
  BarChart2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Line, Bar } from 'react-chartjs-2';
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
  Legend
);

interface DashboardStats {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  errorRate: number;
  totalOrders: number;
  totalMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    errorRate: 0,
    totalOrders: 0,
    totalMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'User Growth',
        data: [100, 220, 350, 500, 780, 1000],
        borderColor: '#10b981',
        backgroundColor: '#10b98120',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const errorRateData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Error Rate',
        data: [2.1, 1.8, 2.3, 1.5, 1.9, 1.2, 1.6],
        backgroundColor: '#ef4444',
      },
    ],
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-emerald-400">
              <Activity className="w-4 h-4" />
              System Status: Healthy
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            trend="+12%"
            isLoading={isLoading}
          />
          <StatCard
            title="New Users (Today)"
            value={stats.newUsers}
            icon={TrendingUp}
            trend="+5%"
            isLoading={isLoading}
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={Activity}
            trend="+8%"
            isLoading={isLoading}
          />
          <StatCard
            title="Error Rate"
            value={`${stats.errorRate}%`}
            icon={AlertTriangle}
            trend="-2%"
            trendType="negative"
            isLoading={isLoading}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingBag}
            trend="+15%"
            isLoading={isLoading}
          />
          <StatCard
            title="Total Messages"
            value={stats.totalMessages}
            icon={MessageSquare}
            trend="+20%"
            isLoading={isLoading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">User Growth</h2>
            <Line 
              data={userGrowthData} 
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                  },
                  x: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                  },
                },
                plugins: {
                  legend: {
                    labels: { color: 'rgba(255, 255, 255, 0.7)' },
                  },
                },
              }}
            />
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Error Rate</h2>
            <Bar 
              data={errorRateData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                  },
                  x: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                  },
                },
                plugins: {
                  legend: {
                    labels: { color: 'rgba(255, 255, 255, 0.7)' },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendType = 'positive',
  isLoading
}: { 
  title: string; 
  value: number | string; 
  icon: any; 
  trend: string;
  trendType?: 'positive' | 'negative';
  isLoading: boolean;
}) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/70">{title}</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-white/10 animate-pulse rounded mt-1" />
          ) : (
            <p className="text-2xl font-semibold mt-1">{value}</p>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-lg',
          'bg-white/5'
        )}>
          <Icon className="w-5 h-5 text-white/70" />
        </div>
      </div>
      {!isLoading && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cn(
            'text-sm',
            trendType === 'positive' ? 'text-emerald-400' : 'text-red-400'
          )}>
            {trend}
          </span>
          <span className="text-sm text-white/50">vs last month</span>
        </div>
      )}
    </div>
  );
} 