'use client';

import { useState } from 'react';
import { Box, Container, Typography, Paper, Stack, Tab, Tabs, Button, TextField, IconButton, Divider, Alert } from '@mui/material';
import { Settings as SettingsIcon, PersonAdd, Delete, Storage, ClearAll, Refresh } from '@mui/icons-material';
import { useTheme } from '@/app/contexts/ThemeContext';
import ChromeStorageSettings from './ChromeStorageSettings';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SettingsPage = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isDark = theme === 'dark';

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCreateAdmin = async () => {
    // Implementation for creating admin
  };

  const handleClearCache = async (type: 'clear' | 'refresh') => {
    try {
      setIsLoading(true);
      const token = Cookies.get('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/clear-cache`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (response.data.message) {
        toast.success(type === 'clear' 
          ? 'Successfully cleared all caches' 
          : 'Successfully refreshed cache'
        );
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to clear cache';
      toast.error(errorMessage);
      console.error('Cache operation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        sx={{ 
          p: 4,
          bgcolor: isDark ? '#1a1a1a' : 'white',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'grey.200'
        }}
      >
        <Stack spacing={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <SettingsIcon 
              sx={{ 
                color: isDark ? 'emerald.400' : 'emerald.500',
                bgcolor: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.1)',
                p: 1,
                borderRadius: 2
              }} 
            />
            <Box>
              <Typography 
                variant="h4" 
                component="h1"
                sx={{
                  background: 'linear-gradient(to right, #10b981, #059669)',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                Settings
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: isDark ? 'grey.400' : 'grey.600',
                  mt: 0.5
                }}
              >
                Manage your application settings
              </Typography>
            </Box>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  color: isDark ? 'grey.400' : 'grey.600',
                  '&.Mui-selected': {
                    color: isDark ? 'emerald.400' : 'emerald.600',
                  }
                },
                '& .MuiTabs-indicator': {
                  bgcolor: isDark ? 'emerald.400' : 'emerald.500',
                }
              }}
            >
              <Tab label="Admin Management" />
              <Tab label="Cache Control" />
              <Tab label="Chrome Settings" />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <Stack spacing={3}>
              <Typography variant="h6" color={isDark ? 'white' : 'grey.900'}>
                Create New Admin
              </Typography>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter admin email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: isDark ? '#0a0a0a' : 'white',
                      '& fieldset': {
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'grey.200',
                      },
                      '&:hover fieldset': {
                        borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'grey.300',
                      },
                    },
                    '& input': {
                      color: isDark ? 'white' : 'grey.900',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={handleCreateAdmin}
                  sx={{
                    bgcolor: 'emerald.500',
                    '&:hover': {
                      bgcolor: 'emerald.600',
                    },
                    color: 'white',
                    px: 3
                  }}
                >
                  Create Admin
                </Button>
              </Box>
            </Stack>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Stack spacing={3}>
              <Typography variant="h6" color={isDark ? 'white' : 'grey.900'}>
                Cache Management
              </Typography>
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: isDark ? 'grey.400' : 'grey.600',
                    mb: 2
                  }}
                >
                  Clear or refresh the application cache. This includes both VectorStore and DiskCacheDB caches.
                </Typography>
                <Alert 
                  severity="warning" 
                  sx={{ mb: 3 }}
                >
                  Clearing the cache will remove all stored data. This action cannot be undone.
                </Alert>
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    startIcon={<ClearAll />}
                    onClick={() => handleClearCache('clear')}
                    disabled={isLoading}
                    sx={{
                      borderColor: isDark ? 'emerald.400' : 'emerald.500',
                      color: isDark ? 'emerald.400' : 'emerald.500',
                      '&:hover': {
                        borderColor: isDark ? 'emerald.300' : 'emerald.600',
                        bgcolor: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.1)',
                      },
                    }}
                  >
                    {isLoading ? 'Clearing...' : 'Clear All Cache'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={() => handleClearCache('refresh')}
                    disabled={isLoading}
                    sx={{
                      borderColor: isDark ? 'emerald.400' : 'emerald.500',
                      color: isDark ? 'emerald.400' : 'emerald.500',
                      '&:hover': {
                        borderColor: isDark ? 'emerald.300' : 'emerald.600',
                        bgcolor: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.1)',
                      },
                    }}
                  >
                    {isLoading ? 'Refreshing...' : 'Refresh Cache'}
                  </Button>
                </Box>
              </Box>
            </Stack>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <ChromeStorageSettings />
          </TabPanel>
        </Stack>
      </Paper>
    </Container>
  );
};

export default SettingsPage; 