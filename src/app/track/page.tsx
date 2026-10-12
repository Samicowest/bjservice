'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCyber } from '../../context/CyberContext';
import { STATUS_METADATA } from '../../utils/stateMachine';
import PipelineStepper from '../../components/PipelineStepper';
import Breadcrumb from '../../components/Breadcrumb';
import {
  Search,
  CheckCircle2,
  Clock,
  Download,
  AlertTriangle,
  User,
  Phone,
  Calendar,
  FileText,
  ShieldCheck,
  CreditCard,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  Send,
  UploadCloud
} from 'lucide-react';

function TrackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCode = searchParams.get('code') || '';

  const { tasks, deliverTask, resolveNeedsInfo, showToast } = useCyber();

  const [query, setQuery] = useState(initialCode);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [responseNote, setResponseNote] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) {
      setQuery(codeParam);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/track?code=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleDemoSelect = (code: string) => {
    setQuery(code);
    router.push(`/track?code=${encodeURIComponent(code)}`);
  };

  const handleCopy = (code: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    showToast('Copied', `Tracking code ${code} copied to clipboard.`, 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDownload = (task: any) => {
    deliverTask(task.id, task.customerName || 'Customer');
    showToast('Download Ready', `Downloading verified delivery document for ${task.id}...`, 'success');
  };

  const handleResolveNeedsInfo = (taskId: string) => {
    if (!responseNote.trim()) {
      showToast('Action Required', 'Please enter a note or explanation before submitting.', 'warning');
      return;
    }
    setIsResolving(true);
    setTimeout(() => {
      resolveNeedsInfo(taskId, responseNote.trim());
      setIsResolving(false);
      setResponseNote('');
      showToast('Information Submitted', 'Your document / info was uploaded to the operator. Processing resumed.', 'success');
    }, 800);
  };

  // Find matching tasks
  const searchResults = query.trim()
    ? tasks.filter(
        (t) =>
          t.trackingCode.toLowerCase().includes(query.toLowerCase().trim()) ||
          t.id.toLowerCase().includes(query.toLowerCase().trim()) ||
          t.customerPhone.includes(query.trim()) ||
          t.customerEmail?.toLowerCase().includes(query.toLowerCase().trim())
      )
    : [];

  const demoCodes = [
    { code: 'BJ-TRK-78401', label: 'Acceptance Fee (Paid)', status: 'paid' },
    { code: 'BJ-TRK-90234', label: 'JAMB CAPS (Needs Info)', status: 'needs_info' },
    { code: 'BJ-TRK-44109', label: 'NYSC Registration (In Progress)', status: 'in_progress' },
    { code: 'BJ-TRK-11924', label: 'Smart ID Card (Completed)', status: 'completed' }
  ];

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 4rem' }}>
      <Breadcrumb items={[{ label: 'Application Tracking' }]} />

      {/* Hero Header */}
      <div
        className="glass-card"
        style={{
          padding: '2rem 2.25rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--primary-light) 100%)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            <Search size={16} />
            <span>REAL-TIME PIPELINE RADAR</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.35rem)', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Track Your Application & Download Documents
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: '0.6rem 0 0', lineHeight: 1.55 }}>
            Check the live processing status of your cybercafe task. Track payments, assigned operator counter, resolve pending queries, and download completed PDF deliverables.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/services" className="btn btn-outline" style={{ borderRadius: '12px', fontSize: '0.84rem' }}>
            <span>Order New Service</span>
          </Link>
          <Link href="/forms" className="btn btn-primary" style={{ borderRadius: '12px', fontSize: '0.84rem' }}>
            <span>Official Forms Desk</span>
          </Link>
        </div>
      </div>

      {/* Tracking Search Input Card */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-card)',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative', flex: '1 1 320px' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
            />
            <input
              type="text"
              placeholder="Enter Tracking Code (e.g. BJ-TRK-78401) or Customer Phone Number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 2.85rem',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-inset)',
                color: 'var(--text-main)',
                fontSize: '0.92rem'
              }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ borderRadius: '12px', padding: '0.85rem 1.75rem', fontSize: '0.9rem', fontWeight: 700 }}
          >
            <Search size={16} />
            <span>Track Application</span>
          </button>
        </form>

        {/* Demo Test Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
          <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Quick Test Samples:</span>
          {demoCodes.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => handleDemoSelect(item.code)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: query === item.code ? 'var(--primary-light)' : 'var(--bg-inset)',
                color: query === item.code ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.74rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              <strong>{item.code}</strong> ({item.status.replace('_', ' ')})
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {query.trim() && searchResults.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-card)'
          }}
        >
          <AlertTriangle size={42} color="var(--warning)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            No Application Found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            We could not find any active task matching code "<strong>{query}</strong>". Please verify your receipt or try your phone number.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => handleDemoSelect('BJ-TRK-78401')}
              className="btn btn-secondary btn-sm"
            >
              Test with Demo Task (BJ-TRK-78401)
            </button>
            <Link href="/services" className="btn btn-primary btn-sm">
              Apply for a Service
            </Link>
          </div>
        </div>
      ) : searchResults.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {searchResults.map((task) => {
            const statusMeta = STATUS_METADATA[task.status] || {
              label: task.status,
              color: 'var(--text-muted)',
              badgeClass: 'badge-gray',
              iconName: 'Clock'
            };

            return (
              <div
                key={task.id}
                className="glass-card"
                style={{
                  borderRadius: '24px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                {/* Header Strip */}
                <div
                  style={{
                    padding: '1.25rem 1.75rem',
                    backgroundColor: 'var(--bg-inset)',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        border: '1px solid var(--primary-glow)'
                      }}
                    >
                      {task.trackingCode}
                    </span>
                    <button
                      onClick={() => handleCopy(task.trackingCode)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                      title="Copy Tracking Code"
                    >
                      {copiedCode === task.trackingCode ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                      <span>{copiedCode === task.trackingCode ? 'Copied' : 'Copy'}</span>
                    </button>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>ID: {task.id}</span>
                  </div>

                  {/* Status Badge */}
                  <span
                    style={{
                      fontSize: '0.82rem',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '9999px',
                      fontWeight: 700,
                      backgroundColor: statusMeta.badgeBg,
                      color: statusMeta.badgeText,
                      border: `1px solid ${statusMeta.borderColor}`
                    }}
                  >
                    {statusMeta.label}
                  </span>
                </div>

                {/* Main Card Content */}
                <div style={{ padding: '1.75rem' }}>
                  {/* Task Header & Details */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                        {task.serviceName}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.82rem', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <User size={14} /> {task.customerName}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Phone size={14} /> {task.customerPhone}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={14} /> Submitted {task.createdAt}
                        </span>
                        {task.priority === 'express' && (
                          <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'var(--accent-orange-light)', color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.72rem' }}>
                            ⚡ EXPRESS PRIORITY
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>Service Fee</span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ₦{task.totalAmount.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: task.payment.status === 'verified' ? 'var(--success)' : 'var(--warning)', display: 'block', fontWeight: 600 }}>
                        {task.payment.status === 'verified' ? '✓ Payment Verified' : '⚠ Payment Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Visual Pipeline Stepper */}
                  <div style={{ marginBottom: '2rem', padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                      Live Execution Pipeline (Stage Progress)
                    </div>
                    <PipelineStepper
                      currentStatus={task.status}
                      needsInfoReason={task.needsInfoRecords?.[task.needsInfoRecords.length - 1]?.reason}
                    />
                  </div>

                  {/* Needs Info Action Banner */}
                  {task.status === 'needs_info' && (
                    <div
                      style={{
                        padding: '1.5rem',
                        borderRadius: '16px',
                        background: 'var(--warning-bg)',
                        border: '1.5px solid var(--warning-border)',
                        marginBottom: '1.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                        <AlertTriangle size={22} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--warning)', margin: 0 }}>
                            Action Required by Student / Customer
                          </h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0.35rem 0 0', fontWeight: 500 }}>
                            Operator Note: <strong>"{task.needsInfoRecords?.[task.needsInfoRecords.length - 1]?.reason || 'Please provide updated document or correct details'}"</strong>
                          </p>
                        </div>
                      </div>

                      {/* Response Form */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <textarea
                          rows={2}
                          placeholder="Type your response note, updated RRR number, or clarification for the operator..."
                          value={responseNote}
                          onChange={(e) => setResponseNote(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: '1px solid var(--border-strong)',
                            background: '#ffffff',
                            color: 'var(--text-main)',
                            fontSize: '0.85rem'
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleResolveNeedsInfo(task.id)}
                            disabled={isResolving}
                            className="btn btn-primary btn-sm"
                            style={{ borderRadius: '8px' }}
                          >
                            <Send size={14} />
                            <span>{isResolving ? 'Submitting...' : 'Send to Operator & Resume'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Completed / Ready for Collection Banner */}
                  {(task.status === 'completed' || task.status === 'delivered') && (
                    <div
                      style={{
                        padding: '1.5rem',
                        borderRadius: '16px',
                        background: 'var(--success-bg)',
                        border: '1.5px solid var(--success-border)',
                        marginBottom: '1.75rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <CheckCircle2 size={26} color="var(--success)" />
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--success)', margin: 0 }}>
                            Application Completed & Ready!
                          </h4>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                            {task.deliveryFiles?.[0]?.name || 'Official Stamped Document ready for instant download or desk pickup.'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownload(task)}
                        className="btn btn-primary"
                        style={{ borderRadius: '10px', padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                      >
                        <Download size={16} />
                        <span>Download Official Document</span>
                      </button>
                    </div>
                  )}

                  {/* Operator Info & Timeline */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontWeight: 600 }}>Assigned Operator</span>
                      <strong style={{ color: 'var(--text-main)' }}>
                        {task.assignedWorkerId ? 'Blessing Nwachukwu (Counter 1)' : 'Pending Desk Assignment'}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontWeight: 600 }}>Estimated Finish</span>
                      <strong style={{ color: 'var(--accent-orange)' }}>
                        {task.estimatedTurnaroundMinutes ? `~${task.estimatedTurnaroundMinutes} mins` : '~20 minutes'}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontWeight: 600 }}>Location for Physical Pickup</span>
                      <strong style={{ color: 'var(--text-main)' }}>
                        Old Registry Area, Beside PPRC, FUTO
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty / Welcome Guide */
        <div
          className="glass-card"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            borderRadius: '24px',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-card)'
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
            <Search size={30} />
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Instant Application & Task Tracker
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 1.5rem', lineHeight: 1.55 }}>
            Every submission made online or walk-in at BJ Services receives a unique code (e.g. <code>BJ-TRK-78401</code>). Enter it above to see real-time progress.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleDemoSelect('BJ-TRK-78401')}
              className="btn btn-primary btn-sm"
            >
              <span>Test with Demo Code: BJ-TRK-78401 →</span>
            </button>
            <Link href="/services" className="btn btn-outline btn-sm">
              <span>View All Services</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>Loading Application Tracking...</div>}>
      <TrackContent />
    </Suspense>
  );
}
