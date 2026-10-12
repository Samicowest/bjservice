'use client';

import React from 'react';
import Link from 'next/link';
import { useCyber } from '../context/CyberContext';
import PublicLandingView from '../components/PublicLandingView';
import { ArrowRight, UserCheck, Briefcase, ShieldCheck } from 'lucide-react';

export default function Home() {
  const { currentRole, currentUser, isLoggedIn } = useCyber();

  const roleDestination =
    currentRole === 'customer'
      ? '/portal'
      : currentRole === 'worker'
      ? '/operator'
      : '/admin';

  const roleLabel =
    currentRole === 'customer'
      ? 'Student Portal & Orders'
      : currentRole === 'worker'
      ? 'Operator Processing Desk'
      : 'Administrative Console';

  return (
    <div style={{ width: '100%' }}>
      {/* If logged in, show an informative banner linking directly to their workspace */}
      {isLoggedIn && currentUser && (
        <div
          style={{
            backgroundColor: 'var(--primary-light)',
            borderBottom: '1px solid var(--primary-glow)',
            padding: '0.65rem 1rem',
            textAlign: 'center'
          }}
        >
          <div
            className="container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.85rem',
              flexWrap: 'wrap',
              fontSize: '0.82rem'
            }}
          >
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
              👋 Welcome, <strong>{currentUser.name}</strong> ({currentUser.badge})
            </span>
            <Link
              href={roleDestination}
              className="btn btn-primary btn-sm"
              style={{
                borderRadius: '9999px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.75rem',
                textDecoration: 'none'
              }}
            >
              <span>Go to {roleLabel}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* Main Public Home Content with rich link navigation */}
      <div className="container">
        <PublicLandingView />
      </div>
    </div>
  );
}
