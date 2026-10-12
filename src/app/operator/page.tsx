'use client';

import React from 'react';
import Link from 'next/link';
import { useCyber } from '../../context/CyberContext';
import WorkerDeskView from '../../components/WorkerDeskView';
import Breadcrumb from '../../components/Breadcrumb';
import { Briefcase, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function OperatorPage() {
  const { isLoggedIn, currentRole, setActiveModal } = useCyber();

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 4rem' }}>
      <Breadcrumb items={[{ label: 'Operator Desk' }]} />

      {!isLoggedIn || currentRole !== 'worker' ? (
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
                background: '#f3e8ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <Briefcase size={32} />
            </div>

            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.45rem', letterSpacing: '-0.02em' }}>
              BJ Services Operator Processing Desk
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 1.75rem' }}>
              Staff workspace for managing queue tasks, updating job milestones, flagging missing student documents, and uploading final delivery receipts.
            </p>

            <button
              onClick={() => setActiveModal('login')}
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.75rem', borderRadius: '12px', fontSize: '0.92rem', fontWeight: 700 }}
            >
              <span>Sign In with Staff Account</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <WorkerDeskView />
      )}
    </div>
  );
}
