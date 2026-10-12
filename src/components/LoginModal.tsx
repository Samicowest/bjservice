'use client';

import React, { useState } from 'react';
import { useCyber } from '../context/CyberContext';
import { createClient, isSupabaseConfigured } from '../lib/supabase/client';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  ShieldCheck,
  UserPlus,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function LoginModal() {
  const { activeModal, setActiveModal, showToast } = useCyber();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (activeModal !== 'login') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email || !password) {
      showToast('Missing Fields', 'Please enter your email and password.', 'warning');
      return;
    }

    if (!isSupabaseConfigured()) {
      showToast('Supabase Error', 'Supabase credentials are not configured.', 'error');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) {
          setAuthError(error.message);
          showToast('Sign In Failed', error.message, 'error');
        } else {
          showToast('Welcome Back!', 'Signed in successfully.', 'success');
          setActiveModal(null);
        }
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim() || email.split('@')[0]
            }
          }
        });

        if (error) {
          setAuthError(error.message);
          showToast('Sign Up Failed', error.message, 'error');
        } else {
          if (data.session) {
            showToast('Account Created', 'Welcome to BJ Services!', 'success');
            setActiveModal(null);
          } else {
            showToast(
              'Account Created',
              'Please check your email to confirm your account or sign in now.',
              'success'
            );
            setMode('signin');
          }
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(6px)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveModal(null);
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          borderRadius: '24px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ padding: '2rem 1.75rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </h2>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-surface)',
              padding: '4px',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setAuthError(null);
              }}
              style={{
                flex: 1,
                padding: '0.65rem 0.5rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 700,
                border: 'none',
                background: mode === 'signin' ? 'var(--bg-card)' : 'transparent',
                color: mode === 'signin' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: mode === 'signin' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setAuthError(null);
              }}
              style={{
                flex: 1,
                padding: '0.65rem 0.5rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 700,
                border: 'none',
                background: mode === 'signup' ? 'var(--bg-card)' : 'transparent',
                color: mode === 'signup' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: mode === 'signup' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Error Notice */}
          {authError && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={16} />
              <span>{authError}</span>
            </div>
          )}

          {/* Email & Password Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    style={{
                      width: '100%',
                      padding: '0.72rem 0.85rem 0.72rem 2.4rem',
                      borderRadius: '10px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  style={{
                    width: '100%',
                    padding: '0.72rem 0.85rem 0.72rem 2.4rem',
                    borderRadius: '10px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '0.72rem 0.85rem 0.72rem 2.4rem',
                    borderRadius: '10px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                padding: '0.85rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.92rem',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : mode === 'signin' ? (
                <>
                  <ShieldCheck size={18} />
                  <span>Sign In</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </form>

          {/* Bottom Switcher */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {mode === 'signin' ? (
              <span>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setAuthError(null);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setAuthError(null);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
