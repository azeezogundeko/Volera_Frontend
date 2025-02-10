'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  User, 
  Clock, 
  Filter, 
  Search, 
  Mail, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/app/contexts/ThemeContext';
import toast from 'react-hot-toast';

interface Complaint {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export default function ComplaintsPage() {
  const { theme } = useTheme();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedComplaint, setExpandedComplaint] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/complaints?status=${filter}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setIsLoading(false);
    }
  };

  const updateComplaintStatus = async (id: string, status: 'resolved' | 'rejected') => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/complaints/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        toast.success(`Complaint marked as ${status}`);
        fetchComplaints();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update complaint status');
    }
  };

  const filteredComplaints = complaints.filter(complaint => 
    complaint.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme === 'dark' 
          ? 'text-yellow-400 bg-yellow-400/10'
          : 'text-yellow-600 bg-yellow-50';
      case 'resolved':
        return theme === 'dark'
          ? 'text-emerald-400 bg-emerald-400/10'
          : 'text-emerald-600 bg-emerald-50';
      case 'rejected':
        return theme === 'dark'
          ? 'text-red-400 bg-red-400/10'
          : 'text-red-600 bg-red-50';
      default:
        return theme === 'dark'
          ? 'text-gray-400 bg-gray-400/10'
          : 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={cn(
      "min-h-screen p-4 lg:p-8",
      theme === 'dark' ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900"
    )}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={cn(
              "text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent"
            )}>Complaints & Contact</h1>
            <p className={cn(
              "mt-1 text-sm",
              theme === 'dark' ? "text-gray-400" : "text-gray-600"
            )}>Manage user complaints and inquiries</p>
          </div>
          <div className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-lg",
            theme === 'dark' 
              ? "bg-[#1a1a1a] border-white/10" 
              : "bg-white border-gray-200",
            "border"
          )}>
            <MessageSquare className={cn(
              "w-4 h-4",
              theme === 'dark' ? "text-emerald-400" : "text-emerald-500"
            )} />
            <span className={cn(
              "text-sm font-medium",
              theme === 'dark' ? "text-emerald-400" : "text-emerald-500"
            )}>Message Center</span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <Filter className={cn(
              "w-4 h-4",
              theme === 'dark' ? "text-gray-400" : "text-gray-500"
            )} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className={cn(
                'px-3 py-2 rounded-lg transition-colors',
                theme === 'dark'
                  ? "bg-[#1a1a1a] border-white/10 text-white"
                  : "bg-white border-gray-200 text-gray-900",
                'border focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
              )}
            >
              <option value="all">All Messages</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="relative w-full sm:w-auto">
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
              theme === 'dark' ? "text-gray-400" : "text-gray-500"
            )} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                'w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg transition-colors',
                theme === 'dark'
                  ? "bg-[#1a1a1a] border-white/10 text-white placeholder-gray-500"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
                'border focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
              )}
            />
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
              <p className={cn(
                "mt-2",
                theme === 'dark' ? "text-gray-400" : "text-gray-600"
              )}>Loading messages...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className={cn(
              "text-center py-12 rounded-xl border",
              theme === 'dark'
                ? "bg-[#1a1a1a] border-white/10"
                : "bg-white border-gray-200"
            )}>
              <MessageSquare className={cn(
                "w-12 h-12 mx-auto mb-4",
                theme === 'dark' ? "text-gray-600" : "text-gray-400"
              )} />
              <p className={theme === 'dark' ? "text-gray-400" : "text-gray-600"}>
                No messages found
              </p>
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className={cn(
                  "rounded-xl border transition-all duration-200",
                  theme === 'dark'
                    ? "bg-[#1a1a1a] border-white/10 hover:border-emerald-500/30"
                    : "bg-white border-gray-200 hover:border-emerald-500/30"
                )}
              >
                {/* Complaint Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          theme === 'dark' ? "bg-white/5" : "bg-gray-100"
                        )}>
                          <User className={cn(
                            "w-4 h-4",
                            theme === 'dark' ? "text-white/70" : "text-gray-600"
                          )} />
                        </div>
                        <div>
                          <p className={cn(
                            "font-medium",
                            theme === 'dark' ? "text-white" : "text-gray-900"
                          )}>{complaint.userName}</p>
                          <p className={cn(
                            "text-sm",
                            theme === 'dark' ? "text-gray-400" : "text-gray-600"
                          )}>{complaint.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-medium',
                        getStatusColor(complaint.status)
                      )}>
                        {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </span>
                      {complaint.status === 'pending' && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                            className={cn(
                              "p-1.5 rounded-lg transition-colors",
                              theme === 'dark'
                                ? "hover:bg-emerald-500/10 text-emerald-400"
                                : "hover:bg-emerald-50 text-emerald-600"
                            )}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => updateComplaintStatus(complaint.id, 'rejected')}
                            className={cn(
                              "p-1.5 rounded-lg transition-colors",
                              theme === 'dark'
                                ? "hover:bg-red-500/10 text-red-400"
                                : "hover:bg-red-50 text-red-600"
                            )}
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => setExpandedComplaint(
                          expandedComplaint === complaint.id ? null : complaint.id
                        )}
                        className={cn(
                          "p-1.5 rounded-lg transition-colors",
                          theme === 'dark'
                            ? "hover:bg-white/10"
                            : "hover:bg-gray-100"
                        )}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className={cn(
                      "font-medium mb-2",
                      theme === 'dark' ? "text-white" : "text-gray-900"
                    )}>{complaint.subject}</h3>
                    <p className={cn(
                      "text-sm whitespace-pre-wrap",
                      theme === 'dark' ? "text-gray-400" : "text-gray-600",
                      expandedComplaint === complaint.id ? "" : "line-clamp-2"
                    )}>{complaint.message}</p>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm">
                    {complaint.phone && (
                      <div className={cn(
                        "flex items-center gap-1",
                        theme === 'dark' ? "text-gray-400" : "text-gray-600"
                      )}>
                        <Phone className="w-4 h-4" />
                        {complaint.phone}
                      </div>
                    )}
                    <div className={cn(
                      "flex items-center gap-1",
                      theme === 'dark' ? "text-gray-400" : "text-gray-600"
                    )}>
                      <Clock className="w-4 h-4" />
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 