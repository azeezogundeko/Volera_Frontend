import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-400',
          text: 'text-green-800',
          icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-400',
          text: 'text-red-800',
          icon: <XCircle className="w-5 h-5 text-red-400" />,
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-400',
          text: 'text-gray-800',
          icon: null,
        };
    }
  };

  const styles = getNotificationStyles();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 300);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className={`fixed top-4 right-4 ${styles.bg} border ${styles.border} ${styles.text} px-4 py-3 rounded-lg shadow-lg min-w-[320px] flex items-center justify-between`}
        >
          <div className="flex items-center space-x-3">
            {styles.icon}
            <span className="font-medium">{message}</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 hover:bg-black/5 p-1 rounded-full transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// NotificationContainer component to handle multiple notifications
export const NotificationContainer: React.FC<{ 
  notifications: Array<{ id: string; message: string; type: 'success' | 'error' }> 
}> = ({ notifications }) => {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-3">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
        />
      ))}
    </div>
  );
};

export default Notification;
