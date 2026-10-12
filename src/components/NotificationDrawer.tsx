'use client';

import React from 'react';
import { useCyber } from '../context/CyberContext';
import { Bell, X, Check, Trash2, Clock, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function NotificationDrawer() {
  const {
    activeModal,
    setActiveModal,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    tasks,
    setActiveTaskDetail
  } = useCyber();

  if (activeModal !== 'notifications') return null;

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        className="modal-content-box"
        style={{
          maxWidth: '420px',
          height: '100vh',
          maxHeight: '100vh',
          borderRadius: '16px 0 0 16px',
          display: 'flex',
          flexDirection: 'column',
          margin: 0
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bell size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>Activity & Notifications</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                title="Clear all"
                style={{ padding: '0.35rem', color: 'var(--text-muted)' }}
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={() => setActiveModal(null)}
              style={{ padding: '0.35rem', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Bell size={36} color="var(--text-dim)" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.85rem' }}>No recent notifications.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.map((n) => {
                let icon = <Info size={16} color="var(--primary)" />;
                if (n.type === 'success') icon = <CheckCircle2 size={16} color="#10b981" />;
                if (n.type === 'warning') icon = <AlertTriangle size={16} color="#f59e0b" />;

                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationAsRead(n.id);
                      if (n.taskId) {
                        const targetTask = tasks.find((t) => t.id === n.taskId);
                        if (targetTask) {
                          setActiveModal(null);
                          setActiveTaskDetail(targetTask);
                        }
                      }
                    }}
                    style={{
                      background: n.read ? 'var(--bg-surface)' : 'var(--bg-inset)',
                      border: n.read ? '1px solid var(--border-subtle)' : '1px solid var(--primary)',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: 'var(--shadow-card)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                        {icon}
                        <span>{n.title}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '2px 0 6px' }}>
                      {n.message}
                    </p>

                    {n.taskId && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                        Tap to view task {n.taskId} →
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
