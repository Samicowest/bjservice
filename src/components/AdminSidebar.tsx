'use client';

import React from 'react';
import Link from 'next/link';
import { useCyber } from '../context/CyberContext';
import {
  CreditCard,
  Layers,
  Sliders,
  ShieldCheck,
  X,
  ExternalLink,
  GraduationCap,
  Laptop,
  LogOut,
  Sparkles,
  Zap,
  ChevronRight,
  ShieldAlert,
  Clock,
  ArrowRight
} from 'lucide-react';

export type AdminTabType = 'manager' | 'services' | 'settings' | 'system';

interface AdminSidebarProps {
  activeTab: AdminTabType;
  onSelectTab: (tab: AdminTabType) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile
}: AdminSidebarProps) {
  const { tasks, services, currentUser, currentRole, logout, setActiveModal } = useCyber();

  const pendingPaymentsCount = tasks.filter(
    (t) => t.status === 'pending_payment' || t.payment?.status === 'pending_verification'
  ).length;

  const unassignedCount = tasks.filter(
    (t) => t.status === 'paid' && !t.assignedWorkerId
  ).length;

  const navItems: {
    id: AdminTabType;
    label: string;
    description: string;
    icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
    badge?: string | number;
    badgeVariant?: 'warning' | 'primary' | 'success' | 'purple';
  }[] = [
    {
      id: 'manager',
      label: 'Operations & Queue',
      description: 'Payment verification & dispatch',
      icon: CreditCard,
      badge: pendingPaymentsCount > 0 ? `${pendingPaymentsCount} pending` : undefined,
      badgeVariant: 'warning'
    },
    {
      id: 'services',
      label: 'Services & Forms Studio',
      description: 'Catalog pricing & dynamic forms',
      icon: Layers,
      badge: `${services.length} Live`,
      badgeVariant: 'primary'
    },
    {
      id: 'settings',
      label: 'Master Site Controls',
      description: 'Marquee, urgent bulletin & rates',
      icon: Sliders,
      badge: 'LIVE SYNC',
      badgeVariant: 'success'
    },
    {
      id: 'system',
      label: 'Executive Suite & RBAC',
      description: 'Staff roles, audit logs & DB',
      icon: ShieldCheck,
      badge: currentRole === 'super_admin' ? 'Master' : 'Admin',
      badgeVariant: 'purple'
    }
  ];

  const handleItemClick = (id: AdminTabType) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const getBadgeStyle = (variant?: 'warning' | 'primary' | 'success' | 'purple') => {
    switch (variant) {
      case 'warning':
        return { background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' };
      case 'success':
        return { background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' };
      case 'purple':
        return { background: '#f3e8ff', color: '#7e22ce', border: '1px solid #e9d5ff' };
      case 'primary':
      default:
        return { background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' };
    }
  };

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '1.25rem 1rem',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}
    >
      {/* 1. Brand & Header Block */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1.25rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #ea580c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.15rem',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              flexShrink: 0
            }}
          >
            BJ
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                BJ<span style={{ color: 'var(--primary)' }}>Admin</span>
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  background: 'var(--accent-orange-light)',
                  color: 'var(--accent-orange)'
                }}
              >
                PRO
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
              Executive Hub & Control Desk
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="admin-mobile-close-btn"
          style={{
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      {/* 2. System Heartbeat Status Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '0.75rem 0.85rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981',
              display: 'inline-block'
            }}
          />
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#15803d' }}>
            Live Dispatch Active
          </span>
        </div>
        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-dim)' }}>
          FUTO Center
        </span>
      </div>

      {/* 3. Main Navigation Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1 }}>
        <div
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-dim)',
            padding: '0 0.5rem 0.35rem'
          }}
        >
          Workspace Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.85rem',
                borderRadius: '12px',
                border: isActive ? '1.5px solid var(--primary)' : '1px solid transparent',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-main)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
              }}
              className={isActive ? '' : 'hover:bg-[var(--bg-inset)]'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '9px',
                    background: isActive ? '#ffffff' : 'var(--bg-inset)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: isActive ? '0 2px 6px rgba(2, 132, 199, 0.15)' : 'none',
                    flexShrink: 0
                  }}
                >
                  <Icon size={17} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? 'var(--primary)' : 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: isActive ? 'var(--primary)' : 'var(--text-dim)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      opacity: isActive ? 0.85 : 1
                    }}
                  >
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    flexShrink: 0,
                    marginLeft: '0.5rem',
                    ...getBadgeStyle(item.badgeVariant)
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* 4. Quick Portals Jump Section */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-dim)',
              padding: '0 0.5rem 0.5rem'
            }}
          >
            Quick Portal Jumps
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <Link
              href="/"
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'background 0.15s ease'
              }}
              className="hover:bg-[var(--bg-inset)] hover:text-[var(--primary)]"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ExternalLink size={14} color="var(--primary)" />
                <span>Open Live Website</span>
              </div>
              <ChevronRight size={13} color="var(--text-dim)" />
            </Link>

            <Link
              href="/portal"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'background 0.15s ease'
              }}
              className="hover:bg-[var(--bg-inset)] hover:text-[var(--primary)]"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={14} color="var(--purple)" />
                <span>Student Portal</span>
              </div>
              <ChevronRight size={13} color="var(--text-dim)" />
            </Link>

            <Link
              href="/operator"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'background 0.15s ease'
              }}
              className="hover:bg-[var(--bg-inset)] hover:text-[var(--primary)]"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Laptop size={14} color="var(--accent-orange)" />
                <span>Operator Desk</span>
              </div>
              <ChevronRight size={13} color="var(--text-dim)" />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Bottom User Persona Footer */}
      <div
        style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#ffedd5',
              border: '1.5px solid #fed7aa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              flexShrink: 0
            }}
          >
            {currentUser?.avatar || '👨‍💼'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {currentUser?.name || 'Amos Ayinla'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px',
                  background: currentRole === 'super_admin' ? '#f3e8ff' : '#ffedd5',
                  color: currentRole === 'super_admin' ? '#7e22ce' : '#ea580c'
                }}
              >
                {currentRole === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign Out"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease'
          }}
          className="hover:text-[var(--danger)] hover:bg-[var(--bg-inset)]"
          aria-label="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (Visible on screens >= 1024px) */}
      <aside className="admin-desktop-sidebar">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay (Rendered on mobile when mobileOpen is true) */}
      {mobileOpen && (
        <div
          className="admin-mobile-drawer-backdrop"
          onClick={onCloseMobile}
        >
          <div
            className="admin-mobile-drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Styles for Responsive Drawer & Transitions */}
      <style jsx global>{`
        /* Desktop Layout */
        .admin-desktop-sidebar {
          width: 275px;
          min-width: 275px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          box-shadow: var(--shadow-card);
          position: sticky;
          top: 90px;
          height: calc(100vh - 120px);
          max-height: 820px;
          display: flex;
          flex-direction: column;
          z-index: 20;
        }

        .admin-mobile-close-btn {
          display: none !important;
        }

        .admin-mobile-drawer-backdrop {
          display: none;
        }

        /* Mobile Layout (< 1024px) */
        @media (max-width: 1023px) {
          .admin-desktop-sidebar {
            display: none !important;
          }

          .admin-mobile-close-btn {
            display: flex !important;
          }

          .admin-mobile-drawer-backdrop {
            display: block !important;
            position: fixed;
            inset: 0;
            background-color: rgba(15, 23, 42, 0.55);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            z-index: 9999;
            animation: fadeIn 0.2s ease-out;
          }

          .admin-mobile-drawer-panel {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: min(85vw, 320px);
            background: var(--bg-card);
            box-shadow: 10px 0 30px rgba(0, 0, 0, 0.25);
            z-index: 10000;
            animation: slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            overflow-y: auto;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
