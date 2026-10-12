'use client';

import React from 'react';
import Link from 'next/link';
import { useCyber } from '../../context/CyberContext';
import CustomerView from '../../components/CustomerView';
import Breadcrumb from '../../components/Breadcrumb';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Search,
  Wifi,
  Lock
} from 'lucide-react';

export default function PortalPage() {
  const { isLoggedIn, currentRole, currentUser, setActiveModal } = useCyber();

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 4rem' }}>
      <Breadcrumb items={[{ label: 'Student Portal' }]} />

      {!isLoggedIn || currentRole !== 'customer' ? (
        <div style={{ maxWidth: '680px', margin: '2rem auto 4rem' }}>
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
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <GraduationCap size={32} />
            </div>

            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.45rem', letterSpacing: '-0.02em' }}>
              FUTO Student Portal & Orders Workspace
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 1.75rem' }}>
              Sign in to view your live cybercafe pipeline, track submitted admission & Remita payments, resolve document queries, and download verified files.
            </p>

            <div style={{ maxWidth: '320px', margin: '0 auto 2rem' }}>
              <button
                onClick={() => setActiveModal('login')}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', borderRadius: '12px', fontSize: '0.92rem', fontWeight: 700 }}
              >
                <span>Sign In to Access Portal</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
              <Link href="/services" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                <Sparkles size={13} /> Browse Services
              </Link>
              <Link href="/forms" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                <FileText size={13} /> Official Forms Desk
              </Link>
              <Link href="/track" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                <Search size={13} /> Track with Code
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <CustomerView />
      )}
    </div>
  );
}
