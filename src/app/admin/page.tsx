'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCyber } from '../../context/CyberContext';
import AdminDashboardView from '../../components/AdminDashboardView';
import SuperAdminView from '../../components/SuperAdminView';
import ServiceManagerView from '../../components/ServiceManagerView';
import SiteSettingsView from '../../components/SiteSettingsView';
import AdminSidebar, { AdminTabType } from '../../components/AdminSidebar';
import {
  ShieldCheck,
  ArrowRight,
  Menu,
  ExternalLink,
  ChevronRight,
  Sliders,
  Layers,
  CreditCard,
  Settings,
  Sparkles
} from 'lucide-react';

export default function AdminPage() {
  const { isLoggedIn, currentRole, setActiveModal } = useCyber();
  const [subTab, setSubTab] = useState<AdminTabType>('manager');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isAdminRole = currentRole === 'admin' || currentRole === 'super_admin';

  const tabMeta: Record<
    AdminTabType,
    { title: string; subtitle: string; icon: React.ComponentType<{ size?: number; color?: string }> }
  > = {
    manager: {
      title: 'Operations & Payment Queue',
      subtitle: 'Verify bank transfers and counter cash receipts, monitor SLA turnarounds, and dispatch tasks to workers.',
      icon: CreditCard
    },
    services: {
      title: 'Services & Forms Studio',
      subtitle: 'Design official registration forms, configure pricing breakdowns, and publish services directly to the live catalog.',
      icon: Layers
    },
    settings: {
      title: 'Master Site Controls & Live Content',
      subtitle: 'Manage top marquee announcements, urgent campus bulletins, bank account details, and WiFi hotspot rates.',
      icon: Sliders
    },
    system: {
      title: 'Executive Suite & Audit Governance',
      subtitle: 'Manage staff roles, inspect immutable audit logs, and oversee system security.',
      icon: Settings
    }
  };

  const currentMeta = tabMeta[subTab];
  const CurrentIcon = currentMeta.icon;

  return (
    <div className="container" style={{ padding: '1rem clamp(0.5rem, 2vw, 1rem) 4rem', maxWidth: '1440px' }}>
      
      {!isLoggedIn || !isAdminRole ? (
        <div style={{ maxWidth: '640px', margin: '3rem auto 5rem' }}>
          <div
            className="glass-card"
            style={{
              padding: '2.75rem 2rem',
              borderRadius: '24px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '20px',
                background: '#ffedd5',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.2)'
              }}
            >
              <ShieldCheck size={34} />
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.45rem', letterSpacing: '-0.02em' }}>
              BJ Services Administrative Console
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 2rem' }}>
              Management oversight for payment verification (cash at counter and bank transfers), staff queue dispatch, audit trails, and live website controls.
            </p>

            <div style={{ maxWidth: '340px', margin: '0 auto' }}>
              <button
                onClick={() => setActiveModal('login')}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.9rem',
                  borderRadius: '14px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  boxShadow: '0 6px 20px rgba(2, 132, 199, 0.35)'
                }}
              >
                <span>Sign In to Admin Console</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Mobile Top Navigation Bar (< 1024px) */}
          <div className="admin-mobile-top-bar">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              style={{
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '0.55rem 0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
              aria-label="Open sidebar menu"
            >
              <Menu size={18} color="var(--primary)" />
              <span>Menu</span>
            </button>
          </div>

          {/* Main Layout Container: Left Sidebar & Right Content */}
          <div className="admin-dashboard-layout">
            
            {/* Left Sidebar (Desktop Fixed / Mobile Drawer) */}
            <AdminSidebar
              activeTab={subTab}
              onSelectTab={(tab) => setSubTab(tab)}
              mobileOpen={mobileSidebarOpen}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />

            {/* Right Main Content Area */}
            <main className="admin-main-viewport">
              
              {/* Responsive Page Header */}
              <div
                className="admin-page-header"
                style={{
                  padding: '1.25rem 1.75rem',
                  borderRadius: '16px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
                    <Link href="/admin" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
                      Admin Hub
                    </Link>
                    <ChevronRight size={12} />
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      {currentMeta.title}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <CurrentIcon size={22} color="var(--primary)" />
                    <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
                      {currentMeta.title}
                    </h1>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0', lineHeight: 1.4 }}>
                    {currentMeta.subtitle}
                  </p>
                </div>

                <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Link
                    href="/"
                    target="_blank"
                    className="btn btn-secondary btn-sm"
                    style={{ borderRadius: '10px', textDecoration: 'none' }}
                  >
                    <ExternalLink size={14} />
                    <span>View Public Home</span>
                  </Link>
                </div>
              </div>

              {/* View Routing */}
              <div style={{ width: '100%', minWidth: 0 }}>
                {subTab === 'manager' && <AdminDashboardView />}
                {subTab === 'services' && <ServiceManagerView />}
                {subTab === 'settings' && <SiteSettingsView />}
                {subTab === 'system' && <SuperAdminView />}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Responsive Grid & Breakpoint Styles */}
      <style jsx>{`
        .admin-dashboard-layout {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          width: 100%;
        }

        .admin-main-viewport {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .admin-mobile-top-bar {
          display: none;
        }

        @media (max-width: 1023px) {
          .admin-mobile-top-bar {
            display: flex;
            align-items: center;
            justifyContent: flex-start;
            padding: 0.65rem 0.85rem;
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            box-shadow: var(--shadow-sm);
            margin-bottom: 0.75rem;
          }

          .admin-page-header {
            padding: 1rem 1.15rem !important;
            margin-bottom: 1rem !important;
            border-radius: 14px !important;
          }

          .admin-header-actions {
            display: none !important;
          }

          .admin-dashboard-layout {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
