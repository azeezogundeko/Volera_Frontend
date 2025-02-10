'use client';

import { useEffect, useState } from 'react';
import { 
  Users, Activity, AlertTriangle, 
  TrendingUp, ShoppingBag, MessageSquare, 
  DollarSign, CreditCard, Wallet,
  TrendingDown 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/app/contexts/ThemeContext';

interface DashboardStats {
  totalUsers: number;
  newUsers: number;
  newTransactions: number;
  errorRate: number;
  totalTransactions: number;
  activeUsers: number;
  inactiveUsers: number;
  totalMessages: number;
  revenue: {
    today: number;
    thisMonth: number;
    total: number;
    trend: number;
  };
}

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    newUsers: 0,
    newTransactions: 0,
    errorRate: 0,
    totalTransactions: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalMessages: 0,
    revenue: {
      today: 0,
      thisMonth: 0,
      total: 0,
      trend: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        if (statsResponse.ok) {
          const { stats: statsData } = await statsResponse.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
            )}>Dashboard Overview</h1>
            <p className={cn(
              "mt-1 text-sm",
              theme === 'dark' ? "text-gray-400" : "text-gray-600"
            )}>Monitor your system&apos;s performance and metrics</p>
          </div>
          <div className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-lg",
            theme === 'dark' ? "bg-[#1a1a1a]" : "bg-white",
            theme === 'dark' ? "border-white/10" : "border-gray-200",
            "border"
          )}>
            <Activity className={cn(
              "w-4 h-4",
              theme === 'dark' ? "text-emerald-400" : "text-emerald-500"
            )} />
            <span className={cn(
              "text-sm font-medium",
              theme === 'dark' ? "text-emerald-400" : "text-emerald-500"
            )}>System Status: Healthy</span>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          <StatCard
            title="Today's Revenue"
            value={`$${stats.revenue.today.toLocaleString()}`}
            icon={DollarSign}
            trend={`${stats.revenue.trend > 0 ? '+' : ''}${stats.revenue.trend}%`}
            trendType={stats.revenue.trend >= 0 ? 'positive' : 'negative'}
            isLoading={isLoading}
            theme={theme}
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${stats.revenue.thisMonth.toLocaleString()}`}
            icon={CreditCard}
            trend="+15%"
            isLoading={isLoading}
            theme={theme}
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.revenue.total.toLocaleString()}`}
            icon={Wallet}
            trend="+25%"
            isLoading={isLoading}
            theme={theme}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            trend="+12%"
            isLoading={isLoading}
            theme={theme}
          />
          <StatCard
            title="New Users (Today)"
            value={stats.newUsers}
            icon={TrendingUp}
            trend="+5%"
            isLoading={isLoading}
            theme={theme}
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={Activity}
            trend={`${((stats.activeUsers / (stats.activeUsers + stats.inactiveUsers)) * 100).toFixed(1)}%`}
            isLoading={isLoading}
            theme={theme}
          />
          <StatCard
            title="Error Rate"
            value={`${stats.errorRate}%`}
            icon={AlertTriangle}
            trend="-2%"
            trendType="negative"
            isLoading={isLoading}
            theme={theme}
          />
          <StatCard
            title="New Transactions"
            value={stats.newTransactions}
            icon={ShoppingBag}
            trend="+15%"
            isLoading={isLoading}
            theme={theme}
          />
          <StatCard
            title="Total Transactions"
            value={stats.totalTransactions}
            icon={MessageSquare}
            trend="+20%"
            isLoading={isLoading}
            theme={theme}
          />
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
  isLoading,
  theme
}: { 
  title: string; 
  value: number | string; 
  icon: any; 
  trend: string;
  trendType?: 'positive' | 'negative';
  isLoading: boolean;
  theme: 'dark' | 'light';
}) {
  return (
    <div className={cn(
      "rounded-xl p-6 border transition-all duration-200",
      theme === 'dark'
        ? "bg-[#1a1a1a] border-white/10 hover:border-emerald-500/50"
        : "bg-white border-gray-200 hover:border-emerald-500/50"
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className={cn(
            "text-sm",
            theme === 'dark' ? "text-gray-400" : "text-gray-600"
          )}>{title}</p>
          {isLoading ? (
            <div className={cn(
              "h-8 w-24 animate-pulse rounded mt-1",
              theme === 'dark' ? "bg-white/10" : "bg-gray-200"
            )} />
          ) : (
            <p className={cn(
              "text-2xl font-semibold mt-1",
              theme === 'dark' ? "text-white" : "text-gray-900"
            )}>{value}</p>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-lg',
          theme === 'dark' ? "bg-white/5" : "bg-gray-100"
        )}>
          <Icon className={cn(
            "w-5 h-5",
            theme === 'dark' ? "text-white/70" : "text-gray-600"
          )} />
        </div>
      </div>
      {!isLoading && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cn(
            'text-sm font-medium',
            trendType === 'positive' 
              ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'
              : theme === 'dark' ? 'text-red-400' : 'text-red-500'
          )}>
            {trend}
          </span>
          <span className={cn(
            "text-sm",
            theme === 'dark' ? "text-gray-500" : "text-gray-600"
          )}>vs last month</span>
        </div>
      )}
    </div>
  );
} 