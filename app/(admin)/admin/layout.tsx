'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Mail, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  AlertCircle,
  Sun,
  Moon,
  Shield,
  BarChart,
  Users,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { ThemeProvider, useTheme } from '@/app/contexts/ThemeContext';

const menuCategories = [
  {
    name: 'Overview',
    items: [
      {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/admin/dashboard'
      },
      {
        title: 'Analytics',
        icon: BarChart,
        href: '/admin/analytics'
      }
    ]
  },
  {
    name: 'Management',
    items: [
      {
        title: 'Email Management',
        icon: Mail,
        href: '/admin/email'
      }
    ]
  },
  {
    name: 'Support',
    items: [
      {
        title: 'Complaints & Contact',
        icon: MessageSquare,
        href: '/admin/complaints'
      },
      {
        title: 'Error Logs',
        icon: AlertCircle,
        href: '/admin/error-logs',
        badge: 'New'
      }
    ]
  },
  {
    name: 'System',
    items: [
      {
        title: 'Settings',
        icon: Settings,
        href: '/admin/settings'
      }
    ]
  }
];

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return children;
  }

  return (
    <div className={cn(
      "min-h-screen",
      theme === 'dark' ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900"
    )}>
      {/* Mobile Toggle Button - Floating */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={cn(
          "lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg transition-colors",
          theme === 'dark'
            ? "bg-[#1a1a1a] hover:bg-white/10 border border-white/10"
            : "bg-white hover:bg-gray-100 border border-gray-200",
          "shadow-lg"
        )}
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-72 transition-transform duration-200 z-40',
        'lg:translate-x-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        theme === 'dark'
          ? "bg-[#1a1a1a] border-r border-white/10"
          : "bg-white border-r border-gray-200"
      )}>
        <div className="h-full flex flex-col">
          {/* Logo/Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-inherit">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                theme === 'dark' 
                  ? "bg-emerald-500/10" 
                  : "bg-emerald-50"
              )}>
                <Shield className={cn(
                  "w-5 h-5",
                  theme === 'dark' ? "text-emerald-400" : "text-emerald-500"
                )} />
              </div>
              <h1 className={cn(
                "text-lg font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent"
              )}>Admin Portal</h1>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-lg transition-colors",
                theme === 'dark'
                  ? "hover:bg-white/10"
                  : "hover:bg-gray-100"
              )}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
            {menuCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <h2 className={cn(
                  "px-4 text-xs font-semibold truncate",
                  theme === 'dark' ? "text-gray-400" : "text-gray-500"
                )}>{category.name}</h2>
                {category.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200',
                        theme === 'dark'
                          ? [
                              'text-gray-400 hover:text-white',
                              isActive && 'bg-emerald-500/10 text-emerald-400'
                            ]
                          : [
                              'text-gray-600 hover:text-gray-900',
                              isActive && 'bg-emerald-50 text-emerald-600'
                            ]
                      )}
                    >
                      <item.icon className={cn(
                        "w-5 h-5 flex-shrink-0 transition-colors",
                        isActive && (theme === 'dark' ? "text-emerald-400" : "text-emerald-600")
                      )} />
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <span className={cn(
                          "px-2 py-0.5 text-xs rounded-full ml-auto",
                          theme === 'dark'
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-emerald-100 text-emerald-600"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-inherit">
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors",
                theme === 'dark'
                  ? "text-gray-400 hover:text-white hover:bg-red-500/10"
                  : "text-gray-600 hover:text-red-600 hover:bg-red-50"
              )}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        'transition-all duration-200',
        isSidebarOpen ? 'lg:pl-72' : 'pl-0'
      )}>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </ThemeProvider>
  );
} 