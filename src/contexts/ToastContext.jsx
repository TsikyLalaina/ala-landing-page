import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext({});

export const useToast = () => useContext(ToastContext);

const TOAST_TYPES = {
  success: { icon: CheckCircle, bg: '#059669', border: '#10b981' },
  error: { icon: AlertCircle, bg: '#dc2626', border: '#ef4444' },
  info: { icon: Info, bg: '#0B3D2E', border: '#4ADE80' },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none'
      }}>
        <AnimatePresence>
          {toasts.map(({ id, message, type }) => {
            const config = TOAST_TYPES[type];
            const Icon = config.icon;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                style={{
                  background: config.bg,
                  border: `1px solid ${config.border}`,
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'white',
                  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)',
                  maxWidth: '360px',
                  pointerEvents: 'auto',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                }}
              >
                <Icon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '14px', lineHeight: '1.4' }}>{message}</span>
                <button
                  onClick={() => removeToast(id)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X style={{ width: '16px', height: '16px', color: 'white' }} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
