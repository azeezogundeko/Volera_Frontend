import React, { useEffect, useState } from 'react';
import { NotificationContainer } from './Notification';
import { websocketService } from '@/lib/websocket';

export function WebSocketNotifications() {
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([]);

  useEffect(() => {
    const handleNotification = (notification: { id: string; message: any; type: any; }) => {
      setNotifications(prev => [...prev, {
        id: notification.id,
        message: notification.message,
        type: notification.type
      }]);

      // Remove notification after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
    };

    // Subscribe to WebSocket notifications
    websocketService.subscribeToNotifications(handleNotification);

    // No need to call unsubscribe since it's not returning a cleanup function
    return () => {
      // Cleanup will be handled by the WebSocket service internally
    };
  }, []);

  return <NotificationContainer notifications={notifications} />;
} 