'use client';

import { useState, useEffect } from 'react';
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
import Cookies from 'js-cookie';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  description: string;
  last_used?: string;
  html_content?: string;
  variables?: string[];
  html_preview?: string | null;
}

export default function EmailManagement() {
  const { theme } = useTheme();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [customSubject, setCustomSubject] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [recipientFilter, setRecipientFilter] = useState<'active' | 'inactive' | 'all' | 'waitlist' | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [specificEmails, setSpecificEmails] = useState('');
  const [accountKey, setAccountKey] = useState('no-reply');

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Reset variable values when template changes
  useEffect(() => {
    if (selectedTemplate) {
      const variables = getTemplateVariables(selectedTemplate);
      const initialValues = variables.reduce((acc, variable) => {
        acc[variable] = '';
        return acc;
      }, {} as Record<string, string>);
      setVariableValues(initialValues);
    } else {
      setVariableValues({});
    }
  }, [selectedTemplate]);

  const fetchTemplates = async () => {
    const loadingToast = toast.loading('Loading email templates...');
    try {
      const token = Cookies.get('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/email/templates`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.detail) {
          throw new Error(data.detail);
        }
        throw new Error('Failed to fetch templates');
      }

      const templatesArray = Object.values(data) as EmailTemplate[];
      setTemplates(templatesArray);
      toast.success(`${templatesArray.length} email templates loaded`);
    } catch (error) {
      console.error('Template fetch error:', error);
      toast.error(
        error instanceof Error 
          ? `Failed to load templates: ${error.message}`
          : 'Failed to load email templates'
      );
    } finally {
      toast.dismiss(loadingToast);
      setIsLoadingTemplates(false);
    }
  };

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setCustomSubject(template.subject);
    setCustomContent(template.content || template.html_content || '');
    setPreviewMode(false);
    toast.success(`Template "${template.name}" selected`);
  };

  // Extract variables from content if not provided directly
  const getTemplateVariables = (template: EmailTemplate): string[] => {
    if (template.variables) {
      return template.variables;
    }
    const content = template.content || template.html_content;
    if (!content) return [];
    const matches = content.match(/{{([^}]+)}}/g) || [];
    return [...new Set(matches.map(match => match.replace(/[{}]/g, '')))];
  };

  const handleSendEmails = async () => {
    // Validation checks with specific error messages
    if (!customSubject.trim()) {
      toast.error('Please enter an email subject');
      return;
    }

    if (!customContent.trim()) {
      toast.error('Please enter email content');
      return;
    }

    if (!accountKey) {
      toast.error('Please select a sending account');
      return;
    }

    // If filter is not selected and no specific emails provided
    if (!recipientFilter && !specificEmails.trim()) {
      toast.error('Please either select a recipient filter or enter specific email addresses');
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Process email addresses
      const emails = specificEmails
        .split('\n')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      // Show processing toast
      const loadingToast = toast.loading('Sending emails...');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/email/bulk/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          template_id: selectedTemplate?.id,
          subject: customSubject,
          content: customContent,
          account_key: accountKey,
          emails: emails.length > 0 ? emails : undefined,
          variables: Object.keys(variableValues).length > 0 ? variableValues : undefined,
          filters: recipientFilter || undefined
        }),
      });

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        if (data.detail === "No users found matching the criteria") {
          throw new Error(data.detail);
        }
        throw new Error(data.detail || 'Failed to send emails');
      }

      // Success message with details from the response
      toast.success(
        `${data.message || 'Emails queued successfully'} (Task ID: ${data.data.task_id})`
      );

      // Reset form
      setSelectedTemplate(null);
      setCustomSubject('');
      setCustomContent('');
      setVariableValues({});
      setSpecificEmails('');
      setRecipientFilter('');
    } catch (error) {
      console.error('Send email error:', error);
      toast.error(
        error instanceof Error 
          ? `Error: ${error.message}` 
          : 'Failed to send emails. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    let previewContent = customContent;
    Object.entries(variableValues).forEach(([key, value]) => {
      if (value) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        previewContent = previewContent.replace(regex, value);
      }
    });
    setCustomContent(previewContent);
    setPreviewMode(true);
    toast.success('Preview mode activated with variable values');
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Content copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy content');
      });
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
          <div className="space-y-4 h-[calc(100vh-12rem)] flex flex-col">
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

            {/* Scrollable Templates List */}
            <div className={cn(
              "flex-1 overflow-y-auto pr-2",
              "scrollbar-thin scrollbar-track-transparent",
              theme === 'dark' 
                ? "scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20" 
                : "scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300"
            )}>
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
                    {template.last_used && (
                      <p className={cn(
                        "text-xs mt-2",
                        theme === 'dark' ? "text-gray-500" : "text-gray-400"
                      )}>Last used: {template.last_used}</p>
                    )}
                  </button>
                ))}
              </div>
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
              <div className="space-y-4">
                <div>
                  <label className={cn(
                    "block text-sm font-medium mb-2",
                    theme === 'dark' ? "text-gray-300" : "text-gray-700"
                  )}>
                    Sending Account
                  </label>
                  <select
                    value={accountKey}
                    onChange={(e) => setAccountKey(e.target.value)}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg transition-colors',
                      theme === 'dark'
                        ? "bg-[#0a0a0a] border-white/10 text-white"
                        : "bg-white border-gray-200 text-gray-900",
                      'border focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                    )}
                  >
                    <option value="no-reply">no-reply@volera.app</option>
                    <option value="info">info@volera.app</option>
                    <option value="support">support@volera.app</option>
                  </select>
                </div>

                <div>
                  <label className={cn(
                    "block text-sm font-medium mb-2",
                    theme === 'dark' ? "text-gray-300" : "text-gray-700"
                  )}>
                    Recipients
                  </label>
                  <select
                    value={recipientFilter}
                    onChange={(e) => setRecipientFilter(e.target.value as 'active' | 'inactive' | 'all' | 'waitlist' | '')}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg transition-colors mb-2',
                      theme === 'dark'
                        ? "bg-[#0a0a0a] border-white/10 text-white"
                        : "bg-white border-gray-200 text-gray-900",
                      'border focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                    )}
                  >
                    <option value="">Select Filter (Optional)</option>
                    <option value="all">All Users</option>
                    <option value="active">Active Users</option>
                    <option value="inactive">Inactive Users</option>
                    <option value="waitlist">Waitlist Users</option>
                  </select>

                  <div>
                    <label className={cn(
                      "block text-sm font-medium mb-2",
                      theme === 'dark' ? "text-gray-300" : "text-gray-700"
                    )}>
                      Specific Email Addresses (Optional)
                    </label>
                    <textarea
                      value={specificEmails}
                      onChange={(e) => setSpecificEmails(e.target.value)}
                      placeholder="Enter email addresses (one per line)"
                      rows={3}
                      className={cn(
                        'w-full px-3 py-2 rounded-lg transition-colors',
                        theme === 'dark'
                          ? "bg-[#0a0a0a] border-white/10 text-white placeholder-gray-500"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
                        'border focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                        'resize-none'
                      )}
                    />
                    <p className={cn(
                      "mt-1 text-xs",
                      theme === 'dark' ? "text-gray-400" : "text-gray-500"
                    )}>
                      Enter multiple email addresses, one per line
                    </p>
                  </div>
                </div>
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
                    'w-full px-4 py-3 rounded-lg min-h-[300px] overflow-auto whitespace-pre-wrap',
                    theme === 'dark'
                      ? "bg-[#0a0a0a] border-white/10"
                      : "bg-gray-50 border-gray-200",
                    'border'
                  )}>
                    <div className="prose prose-sm max-w-none">
                      {customContent}
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
                      'resize-none font-mono text-sm'
                    )}
                  />
                )}
              </div>

              {/* Template Variables */}
              {selectedTemplate && (
                <>
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
                        {getTemplateVariables(selectedTemplate).map((variable) => (
                          <li 
                            key={variable} 
                            className={cn(
                              "text-sm text-emerald-500 cursor-pointer hover:text-emerald-400",
                              "transition-colors duration-200"
                            )}
                            onClick={() => {
                              const variableText = `{{${variable}}}`;
                              setCustomContent(prev => prev + variableText);
                            }}
                          >
                            {`{{${variable}}}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Variable Values Section */}
                  <div className={cn(
                    "p-4 rounded-lg",
                    theme === 'dark'
                      ? "bg-[#0a0a0a] border border-white/10"
                      : "bg-gray-50 border border-gray-200"
                  )}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-emerald-500" />
                        <p className={cn(
                          "text-sm font-medium",
                          theme === 'dark' ? "text-white" : "text-gray-900"
                        )}>Variable Values (Optional)</p>
                      </div>
                      <button
                        onClick={handlePreview}
                        className={cn(
                          "text-xs px-2 py-1 rounded",
                          "bg-emerald-500/10 text-emerald-500",
                          "hover:bg-emerald-500/20 transition-colors"
                        )}
                      >
                        Preview with Values
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getTemplateVariables(selectedTemplate).map((variable) => {
                        // Determine if this variable typically contains longer text
                        const isLongText = [
                          'features', 'recommendations', 'content', 'description',
                          'items', 'message', 'details', 'announcement'
                        ].some(keyword => variable.toLowerCase().includes(keyword));

                        return (
                          <div key={variable} className={cn(
                            "space-y-1",
                            isLongText && "md:col-span-2" // Take full width for long text fields
                          )}>
                            <label className={cn(
                              "block text-sm font-medium",
                              theme === 'dark' ? "text-gray-300" : "text-gray-700"
                            )}>
                              {variable}
                            </label>
                            {isLongText ? (
                              <textarea
                                value={variableValues[variable] || ''}
                                onChange={(e) => setVariableValues(prev => ({
                                  ...prev,
                                  [variable]: e.target.value
                                }))}
                                placeholder={`Enter ${variable}...`}
                                rows={4}
                                className={cn(
                                  'w-full px-3 py-2 rounded-lg text-sm transition-colors',
                                  theme === 'dark'
                                    ? "bg-[#1a1a1a] border-white/10 text-white placeholder-gray-500"
                                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
                                  'border focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                                  'resize-y min-h-[100px]'
                                )}
                              />
                            ) : (
                              <input
                                type="text"
                                value={variableValues[variable] || ''}
                                onChange={(e) => setVariableValues(prev => ({
                                  ...prev,
                                  [variable]: e.target.value
                                }))}
                                placeholder={`Enter ${variable}...`}
                                className={cn(
                                  'w-full px-3 py-2 rounded-lg text-sm transition-colors',
                                  theme === 'dark'
                                    ? "bg-[#1a1a1a] border-white/10 text-white placeholder-gray-500"
                                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
                                  'border focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                                )}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
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