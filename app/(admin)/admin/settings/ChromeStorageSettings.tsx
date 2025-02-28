'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, CircularProgress, Alert, Stack } from '@mui/material';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Save as SaveIcon } from '@mui/icons-material';
import { useTheme } from '@/app/contexts/ThemeContext';
import Cookies from 'js-cookie';
import process from 'process';

const ChromeStorageSettings = () => {
  const { theme } = useTheme();
  const [storageData, setStorageData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');

  useEffect(() => {
    fetchStorageData();
  }, []);

  const fetchStorageData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = Cookies.get('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/chrome-storage`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const formattedData = JSON.stringify(response.data.data, null, 2);
      setStorageData(response.data.data);
      setEditorContent(formattedData);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch storage data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setEditorContent(value);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = Cookies.get('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const updatedData = JSON.parse(editorContent);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/chrome-storage`, updatedData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setSuccessMessage('Chrome storage state updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchStorageData();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to update storage data');
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <Stack spacing={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" color={isDark ? 'white' : 'grey.900'}>
          Chrome Storage Editor
        </Typography>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          startIcon={<SaveIcon />}
          sx={{
            bgcolor: 'emerald.500',
            '&:hover': {
              bgcolor: 'emerald.600',
            },
            color: 'white',
            px: 3
          }}
        >
          Save Changes
        </Button>
      </Box>
      
      {error && (
        <Alert 
          severity="error" 
          variant="filled"
          sx={{
            '& .MuiAlert-icon': {
              color: 'inherit'
            }
          }}
        >
          {error}
        </Alert>
      )}
      
      {successMessage && (
        <Alert 
          severity="success" 
          variant="filled"
          sx={{
            bgcolor: 'emerald.500',
            '& .MuiAlert-icon': {
              color: 'inherit'
            }
          }}
        >
          {successMessage}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress sx={{ color: isDark ? 'emerald.400' : 'emerald.500' }} />
        </Box>
      ) : (
        <Paper 
          variant="outlined" 
          sx={{ 
            height: '500px',
            bgcolor: isDark ? '#0a0a0a' : 'grey.50',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'grey.200'
          }}
        >
          <Editor
            height="100%"
            defaultLanguage="json"
            value={editorContent}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              formatOnPaste: true,
              formatOnType: true,
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2
            }}
            theme={isDark ? 'vs-dark' : 'light'}
          />
        </Paper>
      )}
    </Stack>
  );
};

export default ChromeStorageSettings; 