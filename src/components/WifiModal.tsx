'use client';

import React, { useState } from 'react';
import { useCyber } from '../context/CyberContext';
import { Wifi, X, Lock, User, ArrowRight, ShieldCheck, Zap, Radio } from 'lucide-react';

export default function WifiModal() {
  const { activeModal, setActiveModal, showToast, siteSettings } = useCyber();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  if (activeModal !== 'wifi') return null;

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    setTimeout(() => {
      setIsConnecting(false);
      setConnected(true);
      showToast('Connected to BJ WiFi', 'You now have high-speed 24-hour hotspot internet access.', 'success');
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-box" style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <Wifi size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>{siteSettings?.brandName || 'BJ Services'} 24hr WiFi Access</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mikrotik Campus Hotspot Gateway</p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModal(null);
              setConnected(false);
            }}
            style={{ padding: '0.4rem', color: 'var(--text-muted)', borderRadius: '8px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">
          {connected ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--success-bg)',
                  color: 'var(--success-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}
              >
                <ShieldCheck size={32} />
              </div>

              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                Access Authorized!
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Connected to <strong style={{ color: 'var(--primary)' }}>{siteSettings?.wifiRates?.hotspotSsid || 'BJ_SERVICES_5GHz_FIBRE'}</strong>. {siteSettings?.wifiRates?.generatorStatus || 'Generator backup active.'}
              </p>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.82rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Speed:</span>
                  <strong style={{ color: '#10b981' }}>{siteSettings?.wifiRates?.speed || '150 Mbps Symmetrical'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>IP Address:</span>
                  <code style={{ color: 'var(--text-main)' }}>192.168.88.142</code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                  <span style={{ color: 'var(--text-main)' }}>{siteSettings?.contact?.address || 'Old Registry FUTO Beside PPRC'}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveModal(null);
                  setConnected(false);
                }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleConnect}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '4px' }}>
                  Hotspot Username or Voucher Code
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Enter voucher or username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '4px' }}>
                  Password (or leave blank for voucher pin)
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>

              {/* Voucher Quick Price Info */}
              <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                  Hotspot Voucher Rates:
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                  <span>1 Hour: <strong>₦{(siteSettings?.wifiRates?.oneHour || 300).toLocaleString()}</strong></span>
                  <span>4 Hours: <strong>₦{(siteSettings?.wifiRates?.fourHours || 600).toLocaleString()}</strong></span>
                  <span>24 Hours: <strong style={{ color: 'var(--primary)' }}>₦{(siteSettings?.wifiRates?.twentyFourHours || 1000).toLocaleString()}</strong></span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isConnecting}
                className="btn btn-primary"
                style={{ width: '100%', gap: '0.5rem' }}
              >
                {isConnecting ? (
                  <span>Authenticating with Router...</span>
                ) : (
                  <>
                    <span>Connect to Internet</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
