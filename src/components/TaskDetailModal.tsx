'use client';

import React, { useState } from 'react';
import { useCyber } from '../context/CyberContext';
import { STATUS_METADATA } from '../utils/stateMachine';
import PipelineStepper from './PipelineStepper';
import {
  X,
  Clock,
  User,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle2,
  Send,
  Upload
} from 'lucide-react';

export default function TaskDetailModal() {
  const {
    activeTaskDetail,
    setActiveTaskDetail,
    currentRole,
    workers,
    resolveNeedsInfo,
    verifyPayment,
    assignWorker,
    transitionTaskStatus,
    deliverTask,
    showToast
  } = useCyber();

  const [customerResponseNote, setCustomerResponseNote] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');

  if (!activeTaskDetail) return null;

  const task = activeTaskDetail;
  const meta = STATUS_METADATA[task.status];

  const handleResolveNeedsInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerResponseNote.trim()) return;

    resolveNeedsInfo(task.id, customerResponseNote);
    showToast('Clarification Sent', 'Operator has been notified and task has resumed.', 'success');
    setCustomerResponseNote('');
  };

  const handleDownload = () => {
    deliverTask(task.id, currentRole === 'customer' ? task.customerName : 'Front Desk');
    showToast('Download Complete', 'Verified stamped document downloaded.', 'success');
  };

  const handleAdminAssign = () => {
    if (!selectedAssignee) return;
    assignWorker(task.id, selectedAssignee, 'Manager Benjamin (Admin)');
    showToast('Worker Assigned', 'Task assigned to operator.', 'success');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-box" style={{ maxWidth: '780px' }}>
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '4px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-main)' }}>
                {task.serviceName}
              </span>
              <span
                className="badge"
                style={{
                  background: meta.badgeBg,
                  color: meta.badgeText,
                  borderColor: meta.borderColor
                }}
              >
                {meta.label}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <span>
                Task ID: <strong style={{ color: 'var(--text-main)' }}>{task.id}</strong>
              </span>
              <span>•</span>
              <span>
                Tracking Ref: <code style={{ color: 'var(--primary)' }}>{task.trackingCode}</code>
              </span>
              <span>•</span>
              <span>Category: {task.category}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTaskDetail(null)}
            style={{ padding: '0.4rem', color: 'var(--text-muted)', borderRadius: '8px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Pipeline Stepper */}
          <div style={{ marginBottom: '1.75rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <PipelineStepper
              currentStatus={task.status}
              needsInfoReason={task.needsInfoRecords[task.needsInfoRecords.length - 1]?.reason}
            />
          </div>

          {/* If In Needs Info State: Response Box */}
          {task.status === 'needs_info' && (
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fb7185', fontWeight: 700, marginBottom: '0.5rem' }}>
                <AlertTriangle size={18} />
                <span>Action Required: Provide Requested Information</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 500 }}>
                <strong>Operator Note:</strong> {task.needsInfoRecords[task.needsInfoRecords.length - 1]?.reason}
              </p>

              <form onSubmit={handleResolveNeedsInfo}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 600 }}>
                    Your Clarification or Updated Details:
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Center number is 429104. Uploaded a new flat clear photo of WAEC slip."
                    value={customerResponseNote}
                    onChange={(e) => setCustomerResponseNote(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                  <button type="submit" className="btn btn-primary btn-sm rounded-full">
                    <Send size={14} />
                    <span>Submit & Resume Application</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Delivery Files (if Completed or Delivered) */}
          {task.deliveryFiles.length > 0 && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: 700 }}>
                  <CheckCircle2 size={18} />
                  <span>Official Delivery File Ready</span>
                </div>
                <button onClick={handleDownload} className="btn btn-primary btn-sm rounded-full" style={{ background: '#10b981' }}>
                  <Download size={14} />
                  <span>Download File</span>
                </button>
              </div>

              {task.deliveryNotes && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '4px', fontWeight: 500 }}>
                  <strong>Operator Stamping Note:</strong> {task.deliveryNotes}
                </p>
              )}

              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {task.deliveryFiles.map((df) => (
                  <div key={df.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-surface)', padding: '0.4rem 0.75rem', borderRadius: '9999px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 500 }}>
                    <FileText size={15} color="#15803d" />
                    <span>{df.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Columns: Customer & Application Data */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* Customer Details */}
            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Customer & Contacts
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={14} color="var(--text-muted)" />
                  <strong style={{ color: 'var(--text-main)' }}>{task.customerName}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={14} color="var(--text-muted)" />
                  <span style={{ color: 'var(--text-main)' }}>{task.customerPhone}</span>
                </div>
                {task.customerEmail && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={14} color="var(--text-muted)" />
                    <span style={{ color: 'var(--text-main)' }}>{task.customerEmail}</span>
                  </div>
                )}
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Assigned Operator: </span>
                  <strong style={{ color: task.assignedWorkerName ? 'var(--primary)' : 'var(--text-dim)' }}>
                    {task.assignedWorkerName || 'Pending Allocation'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Payment & Billing */}
            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Billing & Verification
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Amount:</span>
                  <strong style={{ color: '#10b981', fontSize: '1rem' }}>₦{task.totalAmount.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                  <span style={{ fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-main)' }}>{task.payment.method}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Status:</span>
                  <span style={{ fontWeight: 700, color: task.payment.status === 'verified' ? '#10b981' : '#f59e0b' }}>
                    {task.payment.status.toUpperCase()}
                  </span>
                </div>
                {task.payment.reference && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Ref:</span>
                    <code style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>{task.payment.reference}</code>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields Data */}
          <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', marginBottom: 0, border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Submitted Form Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
              {Object.entries(task.formData).map(([k, val]) => (
                <div key={k}>
                  <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {k.replace(/([A-Z])/g, ' $1')}:{' '}
                  </span>
                  <strong style={{ color: 'var(--text-main)' }}>{String(val || 'N/A')}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
