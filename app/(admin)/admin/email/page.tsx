'use client';

import { useState } from 'react';
import { Mail, Users, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

const TEMPLATES: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to Volera!',
    content: `Hello {{name}},

Welcome to Volera! We're excited to have you on board...`
  },
  {
    id: '2',
    name: 'New Feature Announcement',
    subject: 'New Features Available!',
    content: `Hi {{name}},

We've just launched some exciting new features...`
  },
  {
    id: '3',
    name: 'Price Drop Alert',
    subject: 'Price Drop on Your Wishlist Items',
    content: `Dear {{name}},

Good news! Some items in your wishlist have dropped in price...`
  }
];

export default function EmailManagement() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [customSubject, setCustomSubject] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('all'); // all, active, inactive
  const [isLoading, setIsLoading] = useState(false);

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setCustomSubject(template.subject);
    setCustomContent(template.content);
  };

  const handleSendEmails = async () => {
    if (!customSubject.trim() || !customContent.trim()) {
      toast.error('Please fill in both subject and content');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/email/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({
          subject: customSubject,
          content: customContent,
          recipientFilter,
        }),
      });

      if (response.ok) {
        toast.success('Emails queued for sending');
        // Reset form
        setSelectedTemplate(null);
        setCustomSubject('');
        setCustomContent('');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send emails');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send emails');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Email Management</h1>
          <div className="flex items-center gap-2 text-white/70">
            <Mail className="w-4 h-4" />
            <span>Bulk Email Sender</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Templates Sidebar */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Email Templates</h2>
            <div className="space-y-2">
              {TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={cn(
                    'w-full p-3 rounded-lg text-left',
                    'border transition-colors',
                    selectedTemplate?.id === template.id
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-[#1a1a1a] border-white/10 text-white/70 hover:border-white/20'
                  )}
                >
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-white/50 truncate">{template.subject}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Email Editor */}
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/10">
            <div className="space-y-6">
              {/* Recipients Filter */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Recipients
                </label>
                <select
                  value={recipientFilter}
                  onChange={(e) => setRecipientFilter(e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-[#0a0a0a]',
                    'border border-white/10',
                    'text-white',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                  )}
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Users</option>
                  <option value="inactive">Inactive Users</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Enter email subject"
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-[#0a0a0a]',
                    'border border-white/10',
                    'text-white',
                    'placeholder-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                  )}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Content
                </label>
                <textarea
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Enter email content..."
                  rows={12}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-[#0a0a0a]',
                    'border border-white/10',
                    'text-white',
                    'placeholder-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                    'resize-none'
                  )}
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendEmails}
                disabled={isLoading}
                className={cn(
                  'w-full py-2 px-4 rounded-lg',
                  'bg-emerald-500 hover:bg-emerald-600',
                  'text-white font-medium',
                  'transition-colors duration-200',
                  'flex items-center justify-center gap-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Emails
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 