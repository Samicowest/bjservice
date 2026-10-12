'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCyber } from '../../context/CyberContext';
import AdminDashboardView from '../../components/AdminDashboardView';
import SuperAdminView from '../../components/SuperAdminView';
import Breadcrumb from '../../components/Breadcrumb';
import { ShieldCheck, ArrowRight, Settings, Users, CreditCard } from 'lucide-react';

export default function AdminPage() {
  const { isLoggedIn, currentRole, setActiveModal } = useCyber();
  const [subTab, setSubTab] = useState<'manager' | 'system'>('manager');

  const isAdminRole = currentRole === 'admin' || currentRole === 'super_admin';

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 4rem' }}>
      <Breadcrumb items={[{ label: 'Admin Console' }]} />

      {!isLoggedIn || !isAdminRole ? (
        <div style={{ maxWidth: '640px', margin: '2rem auto 4rem' }}>
          <div
            className="glass-card"
            style={{
              padding: '2.5rem 2rem',
              borderRadius: '24px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: '#ffedd5',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <ShieldCheck size={32} />
            </div>

            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.45rem', letterSpacing: '-0.02em' }}>
              BJ Services Administrative Console
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 1.75rem' }}>
              Management oversight for payment verification (cash at counter and bank transfers), staff queue dispatch, audit trails, and revenue statistics.
            </p>

            <div style={{ maxWidth: '340px', margin: '0 auto' }}>
              <button
                onClick={() => setActiveModal('login')}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', borderRadius: '12px', fontSize: '0.92rem', fontWeight: 700 }}
              >
                <span>Sign In to Admin Console</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Sub Tab Switcher for Admin vs System Configuration */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <button
              onClick={() => setSubTab('manager')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.15rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: subTab === 'manager' ? '1.5px solid var(--accent-orange)' : '1px solid var(--border-subtle)',
                background: subTab === 'manager' ? 'var(--accent-orange-light)' : 'var(--bg-card)',
                color: subTab === 'manager' ? 'var(--accent-orange)' : 'var(--text-muted)'
              }}
            >
              <CreditCard size={14} />
              <span>Operations & Payments</span>
            </button>

            <button
              onClick={() => setSubTab('system')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.15rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: subTab === 'system' ? '1.5px solid var(--success)' : '1px solid var(--border-subtle)',
                background: subTab === 'system' ? 'var(--success-bg)' : 'var(--bg-card)',
                color: subTab === 'system' ? 'var(--success)' : 'var(--text-muted)'
              }}
            >
              <Settings size={14} />
              <span>System & Audit Configuration</span>
            </button>
          </div>

          {subTab === 'manager' ? <AdminDashboardView /> : <SuperAdminView />}
        </div>
      )}
    </div>
  );
}
