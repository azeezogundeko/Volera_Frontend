'use client';

import { useState } from 'react';
import { 
  Mail, 
  Users, 
  Send, 
  Loader2, 
  Search,
  Info,
  AlertCircle,
  Eye,
  Copy,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/app/contexts/ThemeContext';
import toast from 'react-hot-toast';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  description: string;
  lastUsed?: string;
}

const TEMPLATES: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to Volera!',
    description: 'Sent to new users after registration',
    lastUsed: '2024-03-15',
    content: `Hello {{name}},

Welcome to Volera! We're excited to have you on board.

Here are a few things you can do to get started:
1. Complete your profile
2. Explore our features
3. Connect with others

If you have any questions, feel free to reach out to our support team.

Best regards,
The Volera Team`
  },
  {
    id: '2',
    name: 'New Feature Announcement',
    subject: 'New Features Available!',
    description: 'Announce new platform features to users',
    lastUsed: '2024-03-10',
    content: `Hi {{name}},

We've just launched some exciting new features that we think you'll love:

{{features}}

Log in to try them out!

Best regards,
The Volera Team`
  },
  {
    id: '3',
    name: 'Price Drop Alert',
    subject: 'Price Drop on Your Wishlist Items',
    description: 'Notify users about price drops',
    content: `Dear {{name}},

Good news! Some items in your wishlist have dropped in price:

{{items}}

Don't miss out on these deals!

Best regards,
The Volera Team`
  }
];

export default function EmailManagement() {
  const { theme } = useTheme();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [customSubject, setCustomSubject] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setCustomSubject(template.subject);
    setCustomContent(template.content);
    setPreviewMode(false);
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

  const filteredTemplates = TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
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
            )}>Email Management</h1>
            <p className={cn(
              "mt-1 text-sm",
              theme === 'dark' ? "text-gray-400" : "text-gray-600"
            )}>Send bulk emails to your users</p>
          </div>
          <div className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-lg border",
            theme === 'dark' 
              ? "bg-[#1a1a1a] border-white/10" 
              : "bg-white border-gray-200"
          )}>
            <Mail className={cn(
              "w-4 h-4",
              theme === 'dark' ? "text-emerald-400" : "text-emerald-500"
            )} />
            <span className={cn(
              "text-sm font-medium",
              theme === 'dark' ? "text-emerald-400" : "text-emerald-500"
            )}>Bulk Email Sender</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
          {/* Templates Sidebar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={cn(
                "text-lg font-semibold",
                theme === 'dark' ? "text-white" : "text-gray-900"
              )}>Email Templates</h2>
              <Info className={cn(
                "w-4 h-4",
                theme === 'dark' ? "text-gray-400" : "text-gray-500"
              )} />
            </div>

            {/* Search */}
            <div className="relative">
              <Search className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
                theme === 'dark' ? "text-gray-400" : "text-gray-500"
              )} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  'w-full pl-10 pr-4 py-2 rounded-lg transition-colors',
                  theme === 'dark'
                    ? "bg-[#1a1a1a] border-white/10 text-white placeholder-gray-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
                  'border focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                )}
              />
            </div>

            <div className="space-y-3">
              {filteredTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={cn(
                    'w-full p-4 rounded-lg text-left transition-all duration-200',
                    'border',
                    theme === 'dark'
                      ? [
                          'bg-[#1a1a1a] border-white/10',
                          'hover:border-emerald-500/30',
                          selectedTemplate?.id === template.id && 'bg-emerald-500/10 border-emerald-500/30'
                        ]
                      : [
                          'bg-white border-gray-200',
                          'hover:border-emerald-500/30',
                          selectedTemplate?.id === template.id && 'bg-emerald-50 border-emerald-500/30'
                        ]
                  )}
                >
                  <p className={cn(
                    "font-medium",
                    theme === 'dark' 
                      ? selectedTemplate?.id === template.id ? "text-emerald-400" : "text-white"
                      : selectedTemplate?.id === template.id ? "text-emerald-600" : "text-gray-900"
                  )}>{template.name}</p>
                  <p className={cn(
                    "text-sm mt-1",
                    theme === 'dark' ? "text-gray-400" : "text-gray-600"
                  )}>{template.description}</p>
                  {template.lastUsed && (
                    <p className={cn(
                      "text-xs mt-2",
                      theme === 'dark' ? "text-gray-500" : "text-gray-400"
                    )}>Last used: {template.lastUsed}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Email Editor */}
          <div className={cn(
            "rounded-xl p-6 border",
            theme === 'dark'
              ? "bg-[#1a1a1a] border-white/10"
              : "bg-white border-gray-200"
          )}>
            <div className="space-y-6">
              {/* Editor Controls */}
              <div className="flex items-center justify-between">
                <h3 className={cn(
                  "font-semibold",
                  theme === 'dark' ? "text-white" : "text-gray-900"
                )}>
                  {selectedTemplate ? 'Edit Template' : 'Compose Email'}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      theme === 'dark'
                        ? "hover:bg-white/10"
                        : "hover:bg-gray-100"
                    )}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(customContent)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      theme === 'dark'
                        ? "hover:bg-white/10"
                        : "hover:bg-gray-100"
                    )}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Recipients Filter */}
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  theme === 'dark' ? "text-gray-300" : "text-gray-700"
                )}>
                  Recipients
                </label>
                <select
                  value={recipientFilter}
                  onChange={(e) => setRecipientFilter(e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg transition-colors',
                    theme === 'dark'
                      ? "bg-[#0a0a0a] border-white/10 text-white"
                      : "bg-white border-gray-200 text-gray-900",
                    'border focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                  )}
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Users</option>
                  <option value="inactive">Inactive Users</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  theme === 'dark' ? "text-gray-300" : "text-gray-700"
                )}>
                  Subject
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Enter email subject"
                  className={cn(
                    'w-full px-3 py-2 rounded-lg transition-colors',
                    theme === 'dark'
                      ? "bg-[#0a0a0a] border-white/10 text-white placeholder-gray-500"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
                    'border focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                  )}
                />
              </div>

              {/* Content */}
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  theme === 'dark' ? "text-gray-300" : "text-gray-700"
                )}>
                  Content
                </label>
                {previewMode ? (
                  <div className={cn(
                    'w-full px-4 py-3 rounded-lg min-h-[300px]',
                    theme === 'dark'
                      ? "bg-[#0a0a0a] border-white/10"
                      : "bg-gray-50 border-gray-200",
                    'border'
                  )}>
                    <div className="prose prose-sm max-w-none">
                      {customContent.split('\n').map((line, i) => (
                        <p key={i} className={cn(
                          "mb-2",
                          theme === 'dark' ? "text-white" : "text-gray-900"
                        )}>{line}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    placeholder="Enter email content..."
                    rows={12}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg transition-colors',
                      theme === 'dark'
                        ? "bg-[#0a0a0a] border-white/10 text-white placeholder-gray-500"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
                      'border focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                      'resize-none'
                    )}
                  />
                )}
              </div>

              {/* Template Variables */}
              {selectedTemplate && (
                <div className={cn(
                  "p-4 rounded-lg",
                  theme === 'dark'
                    ? "bg-[#0a0a0a] border border-white/10"
                    : "bg-gray-50 border border-gray-200"
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-emerald-500" />
                    <p className={cn(
                      "text-sm font-medium",
                      theme === 'dark' ? "text-white" : "text-gray-900"
                    )}>Available Variables</p>
                  </div>
                  <div className="space-y-1">
                    <p className={cn(
                      "text-sm",
                      theme === 'dark' ? "text-gray-400" : "text-gray-600"
                    )}>
                      Use these variables in your template:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li className="text-sm text-emerald-500">{'{{name}}'}</li>
                      <li className="text-sm text-emerald-500">{'{{email}}'}</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Send Button */}
              <button
                onClick={handleSendEmails}
                disabled={isLoading}
                className={cn(
                  'w-full py-3 px-4 rounded-lg',
                  'bg-emerald-500 hover:bg-emerald-600',
                  'text-white font-medium',
                  'transition-all duration-200',
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