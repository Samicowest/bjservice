'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCyber } from '../context/CyberContext';
import {
  Bell,
  Flame,
  Clock,
  Layers,
  Sparkles,
  FileText,
  Search,
  Laptop,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  LogOut,
  UserCheck,
  Megaphone,
  AlertTriangle
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    currentRole,
    isLoggedIn,
    unreadNotificationCount,
    setActiveModal,
    logout,
    siteSettings
  } = useCyber();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [bulletinDismissed, setBulletinDismissed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const navLinks = [
    { label: 'Home', href: '/', icon: Sparkles },
    { label: 'Services', href: '/services', icon: Layers },
    { label: 'Official Forms', href: '/forms', icon: FileText },
    { label: 'Workspace', href: '/workspace', icon: Laptop }
  ];

  const getDashboardHref = () => {
    if (currentRole === 'customer') return '/portal';
    if (currentRole === 'worker') return '/operator';
    return '/admin';
  };

  const getDashboardLabel = () => {
    if (currentRole === 'customer') return 'Student Portal';
    if (currentRole === 'worker') return 'Operator Desk';
    return 'Admin Console';
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'var(--bg-surface)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
      {/* 0. Live Campus Urgent Bulletin Banner */}
      {siteSettings?.urgentBulletin?.active && !bulletinDismissed && (
        <div
          style={{
            background:
              siteSettings.urgentBulletin.type === 'alert'
                ? 'linear-gradient(90deg, #991b1b 0%, #dc2626 100%)'
                : siteSettings.urgentBulletin.type === 'warning'
                ? 'linear-gradient(90deg, #b45309 0%, #d97706 100%)'
                : siteSettings.urgentBulletin.type === 'success'
                ? 'linear-gradient(90deg, #15803d 0%, #16a34a 100%)'
                : 'linear-gradient(90deg, #1e40af 0%, #2563eb 100%)',
            color: '#ffffff',
            padding: '0.45rem clamp(0.75rem, 3vw, 1.5rem)',
            fontSize: '0.78rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            zIndex: 101,
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 0 }}>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                background: 'rgba(255,255,255,0.25)',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                letterSpacing: '0.04em',
                flexShrink: 0
              }}
            >
              {siteSettings.urgentBulletin.badge || 'BULLETIN'}
            </span>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <strong>{siteSettings.urgentBulletin.title}:</strong> {siteSettings.urgentBulletin.message}
            </div>
          </div>
          <button
            onClick={() => setBulletinDismissed(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.85)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            aria-label="Dismiss bulletin"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Main Single Navigation Bar */}
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(0.6rem, 2vw, 0.9rem) clamp(0.75rem, 3vw, 1.5rem)',
          gap: '1rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        {/* Brand Logo with Link to Home */}
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none', color: 'inherit' }}
          onClick={() => {
            setMobileMenuOpen(false);
            setProfileDropdownOpen(false);
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '11px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #f97316 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: 'white',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)',
              flexShrink: 0
            }}
          >
            BJ
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                BJ<span style={{ color: 'var(--primary)' }}>Services</span>
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '0.15rem 0.45rem',
                  background: 'var(--accent-orange-light)',
                  color: 'var(--accent-orange)',
                  borderRadius: '4px',
                  border: '1px solid var(--accent-orange-glow)',
                  fontWeight: 700
                }}
              >
                FUTO HUB
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0 }}>
              Cybercafe & Academic Pipeline
            </p>
          </div>
        </Link>

        {/* Desktop Primary Navigation Links */}
        <nav
          className="hide-mobile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            padding: '4px 6px',
            borderRadius: '12px'
          }}
        >
          {navLinks.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: active ? 700 : 600,
                  color: active ? 'var(--primary)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  background: active ? 'var(--primary-light)' : 'transparent',
                  boxShadow: active ? '0 1px 3px rgba(2, 132, 199, 0.12)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} color={active ? 'var(--primary)' : 'currentColor'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & User Account Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          
          {/* Notification Bell (Visible when logged in) */}
          {isLoggedIn && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setActiveModal('notifications')}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.5rem', borderRadius: '8px', position: 'relative' }}
                aria-label="View notifications"
              >
                <Bell size={17} />
                {unreadNotificationCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: '#f43f5e',
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 10px rgba(244, 63, 94, 0.6)'
                    }}
                  >
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* User Profile / Sign In Button & Clean Dropdown */}
          {isLoggedIn && currentUser ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--bg-inset)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '0.35rem 0.65rem',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  transition: 'all 0.15s ease'
                }}
                title="Account menu & portal"
              >
                <span style={{ fontSize: '1.15rem' }}>{currentUser.avatar}</span>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {currentUser.badge}
                  </span>
                </div>
                <ChevronDown size={14} color="var(--text-muted)" style={{ transform: profileDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '230px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
                    zIndex: 200,
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                    animation: 'fadeIn 0.15s ease-out'
                  }}
                >
                  <div style={{ padding: '0.5rem 0.65rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.2rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {currentUser.title}
                    </div>
                  </div>

                  <Link
                    href={getDashboardHref()}
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.55rem 0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      background: 'var(--primary-light)',
                      textDecoration: 'none'
                    }}
                  >
                    <Briefcase size={14} />
                    <span>Open {getDashboardLabel()}</span>
                  </Link>

                  <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.4rem 0' }} />

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                      router.push('/');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.55rem 0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#ef4444',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveModal('login')}
              className="btn btn-primary btn-sm hide-mobile"
              style={{
                borderRadius: '10px',
                padding: '0.45rem 0.9rem',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}
            >
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="show-mobile-btn"
            style={{
              padding: '0.45rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: mobileMenuOpen ? 'var(--primary-light)' : 'var(--bg-card)',
              color: mobileMenuOpen ? 'var(--primary)' : 'var(--text-main)',
              cursor: 'pointer',
              display: 'none'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '2px solid var(--primary)',
            padding: '1rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {navLinks.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: active ? 700 : 600,
                    color: active ? 'var(--primary)' : 'var(--text-main)',
                    textDecoration: 'none',
                    background: active ? 'var(--primary-light)' : 'var(--bg-inset)',
                    border: active ? '1px solid var(--primary-glow)' : '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={16} color={active ? 'var(--primary)' : 'var(--text-muted)'} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={15} color="var(--text-dim)" />
                </Link>
              );
            })}

            {/* Mobile Account / Dashboard Shortcuts */}
            {isLoggedIn && currentUser ? (
              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    border: '1px solid var(--primary-glow)'
                  }}
                >
                  <Briefcase size={14} />
                  <span>My Dashboard ({getDashboardLabel()})</span>
                </Link>
                <div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      router.push('/');
                    }}
                    className="btn btn-sm"
                    style={{ width: '100%', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActiveModal('login');
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Campus Announcement Marquee Ticker (With Master Admin Dynamic Announcements) */}
      {siteSettings?.showTicker && (
        <div
          style={{
            backgroundColor: 'var(--bg-inset)',
            borderBottom: '2px solid var(--accent-orange)',
            padding: '6px 0',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--text-muted)'
          }}
        >
          <div className="marquee-track" style={{ display: 'inline-block', animation: 'marqueeScroll 55s linear infinite' }}>
            {siteSettings.announcementTicker && (
              <span style={{ color: '#0284c7', marginRight: '3.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}>
                <Megaphone size={14} color="var(--primary)" />
                <span>{siteSettings.announcementTicker}</span>
              </span>
            )}
            <Link href="/services" style={{ color: '#0284c7', marginRight: '3.5rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Flame size={14} color="#ea580c" /> {siteSettings?.brandName || 'BJ Services'} ({siteSettings?.tagline || 'Unlimited Grace & Mercy'}) — FUTO Old Registry Beside PPRC
            </Link>
            <Link href="/services" style={{ color: '#059669', marginRight: '3.5rem', textDecoration: 'none' }}>
              🎓 Accredited NYSC Registration & Mobilization Center →
            </Link>
            <Link href="/forms?type=school_fees" style={{ color: '#d97706', marginRight: '3.5rem', textDecoration: 'none' }}>
              ⚡ 2025/2026 FUTO Acceptance & School Fees Remita Portal Active →
            </Link>
            <Link href="/forms?type=transcript" style={{ color: '#2563eb', marginRight: '3.5rem', textDecoration: 'none' }}>
              📜 Official Academic Transcript & Supplementary Form Desk →
            </Link>
            <Link href="/workspace" style={{ color: '#ea580c', marginRight: '3.5rem', textDecoration: 'none' }}>
              🏢 Tech & Academic Workspace Hub with 150 Mbps Fibre WiFi & Generator Backup →
            </Link>
            <Link href="/portal" style={{ color: '#7c3aed', marginRight: '3.5rem', textDecoration: 'none' }}>
              🎓 Student Portal & Real-Time Application Tracking Pipeline →
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marqueeScroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @media (max-width: 900px) {
          .hide-mobile {
            display: none !important;
          }
          .show-mobile-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}
