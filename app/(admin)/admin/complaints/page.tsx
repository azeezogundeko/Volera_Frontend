'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, User, Clock, Filter, Search, Mail, Phone, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/complaints?status=${filter}`
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
        return 'text-yellow-500 bg-yellow-500/10';
      case 'resolved':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'rejected':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Complaints & Contact</h1>
          <div className="flex items-center gap-2 text-white/70">
            <MessageSquare className="w-4 h-4" />
            <span>Message Center</span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <Filter className="w-4 h-4 text-white/70" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className={cn(
                'px-3 py-2 rounded-lg',
                'bg-[#1a1a1a]',
                'border border-white/10',
                'text-white',
                'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
              )}
            >
              <option value="all">All Messages</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                'w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg',
                'bg-[#1a1a1a]',
                'border border-white/10',
                'text-white',
                'placeholder-white/30',
                'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
              )}
            />
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-white/70">Loading messages...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-12 bg-[#1a1a1a] rounded-xl border border-white/10">
              <MessageSquare className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">No messages found</p>
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-[#1a1a1a] rounded-xl p-6 border border-white/10 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-white/70" />
                      <span className="font-medium">{complaint.userName}</span>
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs',
                        getStatusColor(complaint.status)
                      )}>
                        {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {complaint.email}
                      </div>
                      {complaint.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {complaint.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {complaint.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                        className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => updateComplaintStatus(complaint.id, 'rejected')}
                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-2">{complaint.subject}</h3>
                  <p className="text-white/70 whitespace-pre-wrap">{complaint.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 