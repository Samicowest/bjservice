'use client';

import React from 'react';
import { useCyber } from '../context/CyberContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function Toast() {
  const { toast, hideToast } = useCyber();

  if (!toast) return null;

  const typeConfig = {
    success: {
      icon: <CheckCircle2 size={20} color="#059669" />,
      border: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.12)'
    },
    warning: {
      icon: <AlertTriangle size={20} color="#d97706" />,
      border: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.12)'
    },
    error: {
      icon: <XCircle size={20} color="#dc2626" />,
      border: '#ef4444',
      bgGlow: 'rgba(239, 68, 68, 0.12)'
    },
    info: {
      icon: <Info size={20} color="#0284c7" />,
      border: '#0284c7',
      bgGlow: 'rgba(2, 132, 199, 0.12)'
    }
  }[toast.type || 'info'];

  return (
    <div
      className="toast-box"
      style={{
        borderLeft: `5px solid ${typeConfig.border}`,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        borderRight: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.15), 0 6px 12px -3px rgba(15, 23, 42, 0.08)'
      }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: typeConfig.bgGlow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {typeConfig.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: '0.94rem',
            color: '#0f172a',
            lineHeight: 1.3,
            letterSpacing: '-0.01em'
          }}
        >
          {toast.title}
        </div>
        <div
          style={{
            fontSize: '0.85rem',
            color: '#334155',
            marginTop: '3px',
            lineHeight: 1.45,
            fontWeight: 500
          }}
        >
          {toast.message}
        </div>
      </div>

      <button
        onClick={hideToast}
        aria-label="Dismiss alert"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#64748b',
          padding: '6px',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f1f5f9';
          e.currentTarget.style.color = '#0f172a';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#64748b';
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
}
