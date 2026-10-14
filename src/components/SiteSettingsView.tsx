'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCyber } from '../context/CyberContext';
import { SiteSettings } from '../types';
import {
  Sliders,
  Bell,
  Megaphone,
  CreditCard,
  Wifi,
  Building,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  ExternalLink,
  ShieldAlert,
  Phone,
  Mail,
  Clock,
  MapPin,
  Sparkles,
  Zap,
  Info,
  Radio,
  Eye,
  Check
} from 'lucide-react';

export default function SiteSettingsView() {
  const { siteSettings, updateSiteSettings, resetSiteSettings, showToast } = useCyber();

  // Local draft state for atomic editing
  const [draft, setDraft] = useState<SiteSettings>(siteSettings);
  const [activeSection, setActiveSection] = useState<'ticker' | 'bulletin' | 'banking' | 'wifi' | 'branding'>('ticker');
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmResetModal, setConfirmResetModal] = useState(false);

  const handleChange = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleNestedChange = <K extends keyof SiteSettings, NK extends keyof SiteSettings[K]>(
    parentKey: K,
    nestedKey: NK,
    value: SiteSettings[K][NK]
  ) => {
    setDraft((prev) => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as any),
        [nestedKey]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSiteSettings(draft);
    setHasChanges(false);
  };

  const handleReset = () => {
    resetSiteSettings();
    setConfirmResetModal(false);
    // Reload local draft
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('bj_site_settings');
        if (stored) {
          setDraft(JSON.parse(stored));
        }
      }
      setHasChanges(false);
    }, 50);
  };

  // Quick preset headlines for announcements
  const tickerPresets = [
    '🚨 FUTO 2024/2025 Supplementary & Direct Entry Screening Now Active • NIMC Smart Card Production In Progress Beside PPRC • 150 Mbps High-Speed Fibre Hotspot Available 24/7',
    '🎓 Urgent: NYSC Batch C Mobilization and Green Card Form Submissions Active • Free Document Verification at Our Desk',
    '⚡ FUTO School Fees & Acceptance Remita Generation: Get 100% Verified Bank-Stamped Receipts in Under 10 Minutes',
    '🖨️ Heavy-Duty Plastic ID Printing: Fargo Ultra-Resolution Waterproof PVC Cards Ready in 15 Minutes Beside PPRC'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Master Admin Header Card */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem 2rem',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 60%, #eff6ff 100%)',
          border: '1.5px solid #bbf7d0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 14px rgba(16, 185, 129, 0.35)',
              flexShrink: 0
            }}
          >
            <Sliders size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
                Master Site Controls & Live Content Studio
              </h2>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  background: '#dcfce7',
                  color: '#15803d',
                  border: '1px solid #86efac'
                }}
              >
                LIVE SYNC ENABLED
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0.25rem 0 0', lineHeight: 1.5 }}>
              Edit live website announcements, urgent campus bulletins, bank account details, WiFi rates, and contact info in real-time.
            </p>
          </div>
        </div>

        {/* Global Save / Reset Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            href="/"
            target="_blank"
            className="btn btn-secondary"
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              padding: '0.6rem 1rem',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              textDecoration: 'none'
            }}
          >
            <Eye size={15} />
            <span>Preview Live Site</span>
            <ExternalLink size={13} />
          </Link>

          <button
            onClick={() => setConfirmResetModal(true)}
            className="btn btn-secondary"
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '0.6rem 1rem',
              borderRadius: '10px',
              color: 'var(--error)'
            }}
          >
            <RotateCcw size={15} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="btn btn-primary"
            style={{
              fontSize: '0.86rem',
              fontWeight: 800,
              padding: '0.65rem 1.4rem',
              borderRadius: '10px',
              background: hasChanges ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'var(--bg-inset)',
              borderColor: hasChanges ? '#059669' : 'var(--border-subtle)',
              color: hasChanges ? '#ffffff' : 'var(--text-dim)',
              boxShadow: hasChanges ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none',
              cursor: hasChanges ? 'pointer' : 'default'
            }}
          >
            <Save size={16} />
            <span>{hasChanges ? 'Save Changes Now' : 'All Changes Saved'}</span>
          </button>
        </div>
      </div>

      {/* Control Studio Layout: Left Section Tabs & Right Editor Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Navigation Sidebar */}
        <div
          className="glass-card"
          style={{
            padding: '1rem',
            borderRadius: '16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div style={{ padding: '0.5rem 0.75rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
              Site Control Sections
            </span>
          </div>

          {[
            { id: 'ticker', label: 'Marquee & Announcements', icon: Megaphone, badge: draft.showTicker ? 'Active' : 'Off', badgeColor: draft.showTicker ? '#16a34a' : '#64748b' },
            { id: 'bulletin', label: 'Urgent Campus Bulletin', icon: AlertTriangle, badge: draft.urgentBulletin?.active ? 'Live Banner' : 'Hidden', badgeColor: draft.urgentBulletin?.active ? '#ea580c' : '#64748b' },
            { id: 'banking', label: 'Bank Details & Remita Switch', icon: CreditCard, badge: draft.bankDetails?.bankName?.split(' ')[0] || 'Bank', badgeColor: '#0284c7' },
            { id: 'wifi', label: 'WiFi Hotspot & Power Status', icon: Wifi, badge: `₦${draft.wifiRates?.oneHour || 300}/hr`, badgeColor: '#8b5cf6' },
            { id: 'branding', label: 'Branding, Hotlines & Hours', icon: Building, badge: 'Official', badgeColor: '#059669' }
          ].map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: active ? '1.5px solid var(--primary)' : '1px solid transparent',
                  background: active ? 'var(--primary-light)' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Icon size={17} color={active ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    background: active ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-inset)',
                    color: item.badgeColor
                  }}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}

          {/* Quick Notice Card */}
          <div
            style={{
              marginTop: '1rem',
              padding: '0.9rem',
              borderRadius: '12px',
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              <Sparkles size={13} color="var(--primary)" />
              <span>Real-Time Reflection</span>
            </div>
            Any update saved here immediately updates the live public landing page, navbar ticker, payment modal, and footer.
          </div>
        </div>

        {/* Dynamic Editor Panel */}
        <div style={{ gridColumn: 'span 2' }}>
          
          {/* SECTION 1: MARQUEE & TICKER */}
          {activeSection === 'ticker' && (
            <div
              className="glass-card"
              style={{
                padding: '2rem',
                borderRadius: '20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem' }}>
                    Top Marquee & Live Announcement Strip
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                    Controls the scrolling ticker displayed at the top of the entire website.
                  </p>
                </div>

                {/* Show/Hide Ticker Toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Display Marquee:
                  </span>
                  <div
                    onClick={() => handleChange('showTicker', !draft.showTicker)}
                    style={{
                      width: '46px',
                      height: '26px',
                      borderRadius: '9999px',
                      background: draft.showTicker ? '#10b981' : 'var(--border-subtle)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        position: 'absolute',
                        top: '3px',
                        left: draft.showTicker ? '23px' : '3px',
                        transition: 'left 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: draft.showTicker ? '#15803d' : 'var(--text-dim)' }}>
                    {draft.showTicker ? 'ON' : 'OFF'}
                  </span>
                </label>
              </div>

              {/* Live Preview of Ticker */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Live Preview on Header:
                </label>
                <div
                  style={{
                    padding: '0.65rem 1rem',
                    borderRadius: '10px',
                    background: 'linear-gradient(90deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.2)'
                  }}
                >
                  <Megaphone size={15} color="#fed7aa" style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {draft.announcementTicker || 'No announcement message specified.'}
                  </span>
                </div>
              </div>

              {/* Ticker Content Textarea */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                  Announcement Message Content
                </label>
                <textarea
                  rows={3}
                  value={draft.announcementTicker}
                  onChange={(e) => handleChange('announcementTicker', e.target.value)}
                  placeholder="Enter the message you want students and visitors to see on the top ticker..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.86rem',
                    lineHeight: 1.5,
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Quick Presets */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Apply Quick Standard Presets:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {tickerPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChange('announcementTicker', preset)}
                      style={{
                        padding: '0.6rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-inset)',
                        color: 'var(--text-main)',
                        fontSize: '0.78rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        lineHeight: 1.4,
                        transition: 'all 0.15s ease'
                      }}
                      className="hover:border-[var(--primary)]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: URGENT CAMPUS BULLETIN */}
          {activeSection === 'bulletin' && (
            <div
              className="glass-card"
              style={{
                padding: '2rem',
                borderRadius: '20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem' }}>
                    Campus Urgent Bulletin Banner
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                    Prominently pins a high-visibility alert banner on the home page and header during crucial registry deadlines.
                  </p>
                </div>

                {/* Banner Active Toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Active Status:
                  </span>
                  <div
                    onClick={() => handleNestedChange('urgentBulletin', 'active', !draft.urgentBulletin.active)}
                    style={{
                      width: '46px',
                      height: '26px',
                      borderRadius: '9999px',
                      background: draft.urgentBulletin.active ? '#ea580c' : 'var(--border-subtle)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        position: 'absolute',
                        top: '3px',
                        left: draft.urgentBulletin.active ? '23px' : '3px',
                        transition: 'left 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: draft.urgentBulletin.active ? '#c2410c' : 'var(--text-dim)' }}>
                    {draft.urgentBulletin.active ? 'PUBLISHED' : 'HIDDEN'}
                  </span>
                </label>
              </div>

              {/* Severity Style Switcher */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                  Alert Type & Severity Theme
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  {[
                    { id: 'info', label: 'Information (Blue)', bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
                    { id: 'warning', label: 'Warning (Amber)', bg: '#fffbeb', border: '#fde68a', color: '#b45309' },
                    { id: 'alert', label: 'Critical Alert (Red)', bg: '#fef2f2', border: '#fecaca', color: '#b91c1c' },
                    { id: 'success', label: 'Notice / Cleared (Green)', bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d' }
                  ].map((styleOption) => {
                    const selected = draft.urgentBulletin.type === styleOption.id;
                    return (
                      <button
                        key={styleOption.id}
                        onClick={() => handleNestedChange('urgentBulletin', 'type', styleOption.id as any)}
                        style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: '10px',
                          border: selected ? `2px solid ${styleOption.color}` : '1px solid var(--border-subtle)',
                          background: selected ? styleOption.bg : 'var(--bg-inset)',
                          color: styleOption.color,
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        {styleOption.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Badge */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Bulletin Title
                  </label>
                  <input
                    type="text"
                    value={draft.urgentBulletin.title}
                    onChange={(e) => handleNestedChange('urgentBulletin', 'title', e.target.value)}
                    placeholder="e.g. FUTO Academic Desk Notice"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    value={draft.urgentBulletin.badge || 'LIVE UPDATE'}
                    onChange={(e) => handleNestedChange('urgentBulletin', 'badge', e.target.value)}
                    placeholder="e.g. DEADLINE or NOTICE"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                  Bulletin Instructions / Message Body
                </label>
                <textarea
                  rows={3}
                  value={draft.urgentBulletin.message}
                  onChange={(e) => handleNestedChange('urgentBulletin', 'message', e.target.value)}
                  placeholder="Detailed instructions or screening announcement for students..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.86rem',
                    lineHeight: 1.5,
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Live Preview Box */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Live Preview as rendered on website:
                </label>
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: '14px',
                    background:
                      draft.urgentBulletin.type === 'alert'
                        ? '#fef2f2'
                        : draft.urgentBulletin.type === 'warning'
                        ? '#fffbeb'
                        : draft.urgentBulletin.type === 'success'
                        ? '#f0fdf4'
                        : '#eff6ff',
                    border: `1.5px solid ${
                      draft.urgentBulletin.type === 'alert'
                        ? '#fca5a5'
                        : draft.urgentBulletin.type === 'warning'
                        ? '#fcd34d'
                        : draft.urgentBulletin.type === 'success'
                        ? '#86efac'
                        : '#93c5fd'
                    }`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem'
                  }}
                >
                  <AlertTriangle
                    size={22}
                    color={
                      draft.urgentBulletin.type === 'alert'
                        ? '#dc2626'
                        : draft.urgentBulletin.type === 'warning'
                        ? '#d97706'
                        : draft.urgentBulletin.type === 'success'
                        ? '#16a34a'
                        : '#0284c7'
                    }
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: 'rgba(0,0,0,0.08)',
                          color: 'var(--text-main)'
                        }}
                      >
                        {draft.urgentBulletin.badge || 'NOTICE'}
                      </span>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        {draft.urgentBulletin.title || 'Official Announcement'}
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
                      {draft.urgentBulletin.message || 'No message provided.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: BANK DETAILS & REMITA SWITCH */}
          {activeSection === 'banking' && (
            <div
              className="glass-card"
              style={{
                padding: '2rem',
                borderRadius: '20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem' }}>
                  Banking & Remita Account Details
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                  This bank account is displayed on customer invoices, order checkout modals, and payment receipts.
                </p>
              </div>

              {/* Bank Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Primary Bank Name
                  </label>
                  <input
                    type="text"
                    value={draft.bankDetails.bankName}
                    onChange={(e) => handleNestedChange('bankDetails', 'bankName', e.target.value)}
                    placeholder="e.g. Moniepoint Microfinance Bank"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={draft.bankDetails.accountNumber}
                    onChange={(e) => handleNestedChange('bankDetails', 'accountNumber', e.target.value)}
                    placeholder="e.g. 8166221330"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem', fontWeight: 700, letterSpacing: '0.05em' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Account Beneficiary / Company Name
                  </label>
                  <input
                    type="text"
                    value={draft.bankDetails.accountName}
                    onChange={(e) => handleNestedChange('bankDetails', 'accountName', e.target.value)}
                    placeholder="e.g. BJ SERVICES ENTERPRISE"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Alternative / Backup Bank
                  </label>
                  <input
                    type="text"
                    value={draft.bankDetails.alternativeBank}
                    onChange={(e) => handleNestedChange('bankDetails', 'alternativeBank', e.target.value)}
                    placeholder="e.g. Zenith Bank (1014829104 - BJ Services)"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                </div>
              </div>

              {/* Payment Methods Switches */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.65rem' }}>
                  Payment Method Activation Controls
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  
                  {/* Allow Transfer Switch */}
                  <div
                    onClick={() => handleNestedChange('bankDetails', 'allowTransfer', !draft.bankDetails.allowTransfer)}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      border: draft.bankDetails.allowTransfer ? '1.5px solid #10b981' : '1px solid var(--border-subtle)',
                      background: draft.bankDetails.allowTransfer ? '#f0fdf4' : 'var(--bg-inset)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        Direct Bank Transfer
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Allows students to transfer to Moniepoint/Zenith
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: draft.bankDetails.allowTransfer ? '#15803d' : 'var(--text-dim)' }}>
                      {draft.bankDetails.allowTransfer ? 'ENABLED' : 'PAUSED'}
                    </span>
                  </div>

                  {/* Allow Cash Switch */}
                  <div
                    onClick={() => handleNestedChange('bankDetails', 'allowCashAtCounter', !draft.bankDetails.allowCashAtCounter)}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      border: draft.bankDetails.allowCashAtCounter ? '1.5px solid #10b981' : '1px solid var(--border-subtle)',
                      background: draft.bankDetails.allowCashAtCounter ? '#f0fdf4' : 'var(--bg-inset)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        Cash at Counter / Desk
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Allows in-person cash settlement at PPRC
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: draft.bankDetails.allowCashAtCounter ? '#15803d' : 'var(--text-dim)' }}>
                      {draft.bankDetails.allowCashAtCounter ? 'ENABLED' : 'PAUSED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Checkout Card Preview */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Live Preview in Customer Checkout Modal:
                </label>
                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1.5px dashed #cbd5e1',
                    fontSize: '0.84rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <CreditCard size={16} color="var(--primary)" />
                    <strong style={{ color: 'var(--text-main)' }}>Official Banking Instruction:</strong>
                  </div>
                  <div style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Transfer to: <strong style={{ color: 'var(--text-main)' }}>{draft.bankDetails.bankName}</strong> • Acc: <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{draft.bankDetails.accountNumber}</strong> ({draft.bankDetails.accountName}).
                  </div>
                  {draft.bankDetails.alternativeBank && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      Alternative: {draft.bankDetails.alternativeBank}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: WIFI HOTSPOT & POWER STATUS */}
          {activeSection === 'wifi' && (
            <div
              className="glass-card"
              style={{
                padding: '2rem',
                borderRadius: '20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem' }}>
                  Campus WiFi Hotspot & Rates Manager
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                  Set instant voucher ticket prices, hotspot network SSID, and campus generator power status.
                </p>
              </div>

              {/* Rate Inputs */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.65rem' }}>
                  Hotspot Voucher Pricing Rates (₦)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      1-Hour Access Pass
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>₦</span>
                      <input
                        type="number"
                        value={draft.wifiRates.oneHour}
                        onChange={(e) => handleNestedChange('wifiRates', 'oneHour', Number(e.target.value) || 0)}
                        style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 28px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', fontWeight: 700 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      4-Hour Access Pass
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>₦</span>
                      <input
                        type="number"
                        value={draft.wifiRates.fourHours}
                        onChange={(e) => handleNestedChange('wifiRates', 'fourHours', Number(e.target.value) || 0)}
                        style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 28px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', fontWeight: 700 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      24-Hour Access Pass
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>₦</span>
                      <input
                        type="number"
                        value={draft.wifiRates.twentyFourHours}
                        onChange={(e) => handleNestedChange('wifiRates', 'twentyFourHours', Number(e.target.value) || 0)}
                        style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 28px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SSID and Speed */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Network Broadcast SSID Name
                  </label>
                  <input
                    type="text"
                    value={draft.wifiRates.hotspotSsid}
                    onChange={(e) => handleNestedChange('wifiRates', 'hotspotSsid', e.target.value)}
                    placeholder="e.g. BJ_SERVICES_5GHz_FIBRE"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem', fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Advertised Speed Spec
                  </label>
                  <input
                    type="text"
                    value={draft.wifiRates.speed}
                    onChange={(e) => handleNestedChange('wifiRates', 'speed', e.target.value)}
                    placeholder="e.g. 150 Mbps Symmetrical"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                </div>
              </div>

              {/* Power / Generator Status */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                  Lister Generator & Power Status Note
                </label>
                <input
                  type="text"
                  value={draft.wifiRates.generatorStatus}
                  onChange={(e) => handleNestedChange('wifiRates', 'generatorStatus', e.target.value)}
                  placeholder="e.g. Lister Generator & Solar Inverter Active (24/7 Guaranteed Power)"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                />
              </div>

              {/* Preview in Wifi Modal */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Live Preview in WiFi Modal:
                </label>
                <div style={{ background: 'var(--bg-inset)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                    Hotspot Voucher Rates:
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-main)' }}>
                    <span>1 Hour: <strong>₦{draft.wifiRates.oneHour.toLocaleString()}</strong></span>
                    <span>4 Hours: <strong>₦{draft.wifiRates.fourHours.toLocaleString()}</strong></span>
                    <span>24 Hours: <strong style={{ color: 'var(--primary)' }}>₦{draft.wifiRates.twentyFourHours.toLocaleString()}</strong></span>
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.74rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Zap size={13} />
                    <span>{draft.wifiRates.generatorStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: BRANDING, HOTLINES & OPERATING HOURS */}
          {activeSection === 'branding' && (
            <div
              className="glass-card"
              style={{
                padding: '2rem',
                borderRadius: '20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem' }}>
                  Branding, Hotlines & Operating Hours
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                  Updates the official contact numbers, desk location, and opening hours across the footer and contact sections.
                </p>
              </div>

              {/* Tagline & Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={draft.brandName}
                    onChange={(e) => handleChange('brandName', e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={draft.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Hero Top Pill Badge (Desktop)
                  </label>
                  <input
                    type="text"
                    value={draft.heroBadge}
                    onChange={(e) => handleChange('heroBadge', e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                </div>
              </div>

              {/* Contact Lines */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Primary Phone Hotline
                  </label>
                  <input
                    type="text"
                    value={draft.contact.primaryPhone}
                    onChange={(e) => handleNestedChange('contact', 'primaryPhone', e.target.value)}
                    placeholder="08166221330"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Secondary Phone Support
                  </label>
                  <input
                    type="text"
                    value={draft.contact.secondaryPhone}
                    onChange={(e) => handleNestedChange('contact', 'secondaryPhone', e.target.value)}
                    placeholder="08033892455"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    WhatsApp Desk Line
                  </label>
                  <input
                    type="text"
                    value={draft.contact.whatsapp}
                    onChange={(e) => handleNestedChange('contact', 'whatsapp', e.target.value)}
                    placeholder="+2348033892455"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={draft.contact.email}
                    onChange={(e) => handleNestedChange('contact', 'email', e.target.value)}
                    placeholder="bjservicesoffice2022@gmail.com"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                </div>
              </div>

              {/* Physical Desk & Hours */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Campus Physical Desk Location
                  </label>
                  <input
                    type="text"
                    value={draft.contact.address}
                    onChange={(e) => handleNestedChange('contact', 'address', e.target.value)}
                    placeholder="Old Registry Area, Beside PPRC Building, FUTO Main Campus, Imo State"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                    Public Operating Hours
                  </label>
                  <input
                    type="text"
                    value={draft.contact.openingHours}
                    onChange={(e) => handleNestedChange('contact', 'openingHours', e.target.value)}
                    placeholder="Monday – Saturday: 7:30 AM – 9:00 PM"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Confirmation Modal for Reset Defaults */}
      {confirmResetModal && (
        <div className="modal-overlay">
          <div className="modal-content-box" style={{ maxWidth: '440px', padding: '1.75rem', textAlign: 'center' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#fef2f2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <RotateCcw size={28} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Restore Factory Site Settings?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              This will reset all announcements, tickers, bank details, and WiFi rates back to the original BJ Services default values.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setConfirmResetModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.65rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.65rem', background: '#dc2626', borderColor: '#b91c1c' }}
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
