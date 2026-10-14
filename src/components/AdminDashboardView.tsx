'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCyber } from '../context/CyberContext';
import { CyberTask } from '../types';
import { STATUS_METADATA } from '../utils/stateMachine';
import {
  ShieldCheck,
  CreditCard,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Users,
  ChevronRight,
  ChevronDown,
  Check,
  TrendingUp,
  FileText,
  AlertCircle,
  Plus
} from 'lucide-react';

const STATUS_FILTER_OPTIONS: { id: string; label: string; color: string; bg: string }[] = [
  { id: 'all', label: 'All Statuses', color: 'var(--primary)', bg: 'var(--primary-light)' },
  { id: 'pending_payment', label: 'Pending Payment', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  { id: 'paid', label: 'Paid & Unassigned', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.15)' },
  { id: 'assigned', label: 'Assigned', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
  { id: 'in_progress', label: 'In Progress', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
  { id: 'needs_info', label: 'Needs Info', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' },
  { id: 'completed', label: 'Completed', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  { id: 'delivered', label: 'Delivered', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' },
];

export default function AdminDashboardView() {
  const {
    tasks,
    workers,
    verifyPayment,
    assignWorker,
    transitionTaskStatus,
    setActiveTaskDetail,
    setActiveModal,
    showToast
  } = useCyber();

  const [adminTab, setAdminTab] = useState<'pending_payments' | 'unassigned' | 'all_tasks'>('pending_payments');
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setStatusDropdownOpen(false);
      }
    }
    if (statusDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [statusDropdownOpen]);

  const getStatusCount = (statusId: string) => {
    if (statusId === 'all') return tasks.length;
    return tasks.filter((t) => t.status === statusId).length;
  };

  const currentStatusOpt = STATUS_FILTER_OPTIONS.find((opt) => opt.id === statusFilter) || STATUS_FILTER_OPTIONS[0];
  const currentCount = getStatusCount(statusFilter);

  // Metrics
  const pendingPayments = tasks.filter((t) => t.status === 'pending_payment');
  const unassignedPaid = tasks.filter((t) => t.status === 'paid');
  const activeProcessing = tasks.filter((t) => t.status === 'in_progress' || t.status === 'assigned');
  const totalRevenue = tasks
    .filter((t) => t.status !== 'cancelled' && t.status !== 'rejected' && t.status !== 'draft')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  // Filtered tasks for All Tasks table
  const filteredAllTasks = tasks.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
      t.trackingCode.toLowerCase().includes(tableSearch.toLowerCase()) ||
      t.customerName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      t.customerPhone.includes(tableSearch) ||
      t.serviceName.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprovePayment = (task: CyberTask) => {
    const ref = task.payment.reference || `ADMIN_CONFIRM_${Date.now()}`;
    verifyPayment(task.id, task.payment.method || 'cash', ref, 'Manager Benjamin (Admin)');
    showToast('Payment Verified', `${task.id} moved to Paid. Assign to worker next.`, 'success');
  };

  const handleQuickAssign = (taskId: string, workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    assignWorker(taskId, workerId, 'Manager Benjamin (Admin)');
    showToast('Task Assigned', `Assigned ${taskId} to ${worker?.name}.`, 'success');
  };

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      {/* Admin KPI Ribbon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              Pending Payment Approvals
            </span>
            <CreditCard size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>
            {pendingPayments.length}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            Cash at counter or bank transfers
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #0ea5e9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              Paid & Unassigned
            </span>
            <Users size={18} color="#0ea5e9" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>
            {unassignedPaid.length}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            Ready for operator desk allocation
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              In-Flight Active Tasks
            </span>
            <Clock size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a78bfa' }}>
            {activeProcessing.length}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            Currently with cybercafe operators
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              Total Revenue Pipeline
            </span>
            <TrendingUp size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>
            ₦{totalRevenue.toLocaleString()}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            FUTO portal fees & service charges
          </p>
        </div>
      </div>

      {/* Admin Action Tabs */}
      <div className="admin-action-tabs-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div className="admin-tabs-segmented" style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-inset)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          <button
            onClick={() => setAdminTab('pending_payments')}
            className="admin-tab-btn"
            style={{
              padding: '0.55rem 0.95rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: adminTab === 'pending_payments' ? 'var(--warning-bg)' : 'transparent',
              color: adminTab === 'pending_payments' ? 'var(--warning)' : 'var(--text-muted)',
              border: adminTab === 'pending_payments' ? '1px solid var(--warning-border)' : '1px solid transparent',
              cursor: 'pointer'
            }}
          >
            <CreditCard size={15} color={adminTab === 'pending_payments' ? 'var(--warning)' : 'currentColor'} />
            <span className="tab-label-desktop">Payment Approvals</span>
            <span className="tab-label-mobile">Approvals</span>
            <span style={{ padding: '2px 6px', borderRadius: '9999px', fontSize: '0.72rem', background: adminTab === 'pending_payments' ? 'var(--warning)' : 'var(--bg-card)', color: adminTab === 'pending_payments' ? '#ffffff' : 'var(--warning)', fontWeight: 800 }}>
              {pendingPayments.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('unassigned')}
            className="admin-tab-btn"
            style={{
              padding: '0.55rem 0.95rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: adminTab === 'unassigned' ? 'var(--primary-light)' : 'transparent',
              color: adminTab === 'unassigned' ? 'var(--primary)' : 'var(--text-muted)',
              border: adminTab === 'unassigned' ? '1px solid var(--primary-glow)' : '1px solid transparent',
              cursor: 'pointer'
            }}
          >
            <Users size={15} color={adminTab === 'unassigned' ? 'var(--primary)' : 'currentColor'} />
            <span className="tab-label-desktop">Assign Operators</span>
            <span className="tab-label-mobile">Assign</span>
            <span style={{ padding: '2px 6px', borderRadius: '9999px', fontSize: '0.72rem', background: adminTab === 'unassigned' ? 'var(--primary)' : 'var(--bg-card)', color: adminTab === 'unassigned' ? '#ffffff' : 'var(--primary)', fontWeight: 800 }}>
              {unassignedPaid.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('all_tasks')}
            className="admin-tab-btn"
            style={{
              padding: '0.55rem 0.95rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: adminTab === 'all_tasks' ? 'var(--purple-bg)' : 'transparent',
              color: adminTab === 'all_tasks' ? 'var(--purple)' : 'var(--text-muted)',
              border: adminTab === 'all_tasks' ? '1px solid var(--purple-border)' : '1px solid transparent',
              cursor: 'pointer'
            }}
          >
            <FileText size={15} color={adminTab === 'all_tasks' ? 'var(--purple)' : 'currentColor'} />
            <span className="tab-label-desktop">Master Pipeline ({tasks.length})</span>
            <span className="tab-label-mobile">Pipeline ({tasks.length})</span>
          </button>
        </div>

        {/* Quick Walk-in Button */}
        <button
          onClick={() => setActiveModal('walkin')}
          className="btn btn-accent btn-sm walkin-btn"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Plus size={15} />
          <span className="walkin-text-desktop">New Walk-in Service (Counter)</span>
          <span className="walkin-text-mobile">Walk-in Order</span>
        </button>
      </div>

      {/* TAB 1: Payment Approvals Queue */}
      {adminTab === 'pending_payments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pendingPayments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border-strong)' }}>
              <CheckCircle2 size={40} color="var(--success)" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>All payments verified!</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                No pending cash receipts or bank transfer alerts awaiting sign-off.
              </p>
            </div>
          ) : (
            pendingPayments.map((task) => (
              <div
                key={task.id}
                className="glass-card payment-approval-card"
                style={{
                  padding: '1.25rem 1.5rem',
                  borderLeft: '5px solid var(--warning)',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>{task.serviceName}</span>
                    <span className="badge" style={{ background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid var(--warning-border)' }}>
                      {task.payment.method?.toUpperCase()} PAYMENT
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem 0.85rem', fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span>
                    Task ID: <strong style={{ color: 'var(--text-main)' }}>{task.id}</strong>
                  </span>
                  <span style={{ opacity: 0.4 }}>•</span>
                  <span>
                    Customer: <strong style={{ color: 'var(--text-main)' }}>{task.customerName}</strong> ({task.customerPhone})
                  </span>
                  <span style={{ opacity: 0.4 }}>•</span>
                  <span>
                    Payment Ref: <code style={{ color: 'var(--primary)' }}>{task.payment.reference || 'Counter Cash'}</code>
                  </span>
                  <span style={{ opacity: 0.4 }}>•</span>
                  <span>
                    Time: {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Responsive Amount & Actions Footer */}
                <div className="payment-card-footer">
                  <div className="payment-card-amount">
                    <div className="payment-amount-val">
                      ₦{task.totalAmount.toLocaleString()}
                    </div>
                    <div className="payment-amount-sub">
                      Amount to confirm
                    </div>
                  </div>

                  <div className="payment-card-actions">
                    <button
                      onClick={() => handleApprovePayment(task)}
                      className="btn btn-primary btn-sm btn-approve"
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '10px' }}
                    >
                      <CheckCircle2 size={16} />
                      <span className="approve-text-desktop">Confirm & Approve</span>
                      <span className="approve-text-mobile">Approve</span>
                    </button>

                    <button
                      onClick={() => {
                        transitionTaskStatus(task.id, 'rejected', 'Payment not received or teller invalid.');
                        showToast('Order Rejected', `${task.id} marked as rejected.`, 'error');
                      }}
                      className="btn btn-danger btn-sm btn-reject"
                      style={{ borderRadius: '10px' }}
                    >
                      <XCircle size={16} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Operator Assignment Matrix */}
      {adminTab === 'unassigned' && (
        <div>
          {/* Operator Workload Snapshot */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {workers.map((w) => (
              <div
                key={w.id}
                className="glass-card"
                style={{ padding: '1.25rem', borderTop: '3px solid #8b5cf6' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                  <div style={{ fontSize: '1.8rem' }}>{w.avatar}</div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{w.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{w.title}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#cbd5e1', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span>Active Queue Load:</span>
                  <strong style={{ color: w.activeTaskCount > 3 ? '#f43f5e' : '#38bdf8' }}>
                    {w.activeTaskCount} tasks
                  </strong>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
            Paid Tasks Awaiting Operator Assignment ({unassignedPaid.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {unassignedPaid.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border-strong)' }}>
                <CheckCircle2 size={36} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
                <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>No unassigned tasks!</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>All paid applications have been allocated to staff.</p>
              </div>
            ) : (
              unassignedPaid.map((task) => (
                <div
                  key={task.id}
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    background: 'var(--bg-card)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>{task.serviceName}</span>
                      <span className="badge" style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)' }}>
                        PAID ₦{task.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Customer: <strong style={{ color: 'var(--text-main)' }}>{task.customerName}</strong> ({task.customerPhone}) • SLA: ~{task.estimatedTurnaroundMinutes} mins
                    </div>
                  </div>

                  {/* Assign to Worker Dropdown / Action */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Assign to:</span>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {workers.map((w) => (
                        <button
                          key={w.id}
                          onClick={() => handleQuickAssign(task.id, w.id)}
                          className="btn btn-secondary btn-sm"
                          title={`Assign to ${w.name} (${w.activeTaskCount} active)`}
                        >
                          <span>{w.avatar} {w.name.split(' ')[0]}</span>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>({w.activeTaskCount})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Master Pipeline Table */}
      {adminTab === 'all_tasks' && (
        <div>
          {/* Search & Filter Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.85rem' }}>
            <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '380px', minWidth: '200px' }}>
              <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search tracking code, phone, student..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                style={{ paddingLeft: '36px', fontSize: '0.85rem', width: '100%' }}
              />
            </div>

            {/* Custom Modern Status Filter Dropdown */}
            <div ref={statusDropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.58rem 0.95rem',
                  borderRadius: '12px',
                  background: 'var(--bg-card)',
                  border: statusDropdownOpen ? '1.5px solid var(--primary)' : '1.5px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: statusDropdownOpen ? '0 0 0 3px var(--primary-glow), var(--shadow-sm)' : 'var(--shadow-sm)',
                  transition: 'all 0.18s ease'
                }}
                aria-haspopup="listbox"
                aria-expanded={statusDropdownOpen}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: currentStatusOpt.color,
                      boxShadow: `0 0 6px ${currentStatusOpt.color}88`
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 500 }}>Status:</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{currentStatusOpt.label}</span>
                </div>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.12rem 0.45rem',
                    borderRadius: '20px',
                    background: currentStatusOpt.bg,
                    color: currentStatusOpt.color,
                    marginLeft: '0.1rem'
                  }}
                >
                  {currentCount}
                </span>

                <ChevronDown
                  size={15}
                  color="var(--text-muted)"
                  style={{
                    transform: statusDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    marginLeft: '0.1rem'
                  }}
                />
              </button>

              {/* Popover Dropdown Menu */}
              {statusDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    zIndex: 70,
                    minWidth: '245px',
                    maxWidth: 'calc(100vw - 32px)',
                    background: 'var(--bg-card)',
                    borderRadius: '14px',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 16px 36px -4px rgba(0, 0, 0, 0.14), 0 4px 12px rgba(0, 0, 0, 0.06)',
                    padding: '0.4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                  role="listbox"
                >
                  <div style={{ padding: '0.4rem 0.65rem 0.25rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Filter by Task Status
                  </div>

                  {STATUS_FILTER_OPTIONS.map((opt) => {
                    const isSelected = statusFilter === opt.id;
                    const count = getStatusCount(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setStatusFilter(opt.id);
                          setStatusDropdownOpen(false);
                        }}
                        role="option"
                        aria-selected={isSelected}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          width: '100%',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '9px',
                          border: 'none',
                          background: isSelected ? 'var(--primary-light)' : 'transparent',
                          color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.12s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: opt.color,
                              flexShrink: 0
                            }}
                          />
                          <span>{opt.label}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              padding: '0.1rem 0.42rem',
                              borderRadius: '12px',
                              background: isSelected ? 'var(--primary-glow)' : 'var(--bg-surface)',
                              color: isSelected ? 'var(--primary)' : 'var(--text-muted)'
                            }}
                          >
                            {count}
                          </span>
                          {isSelected && <Check size={14} color="var(--primary)" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-inset)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Task ID / Ref</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Service</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Customer / Phone</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Assigned Worker</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Amount</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAllTasks.map((t) => {
                  const meta = STATUS_METADATA[t.status];
                  return (
                    <tr
                      key={t.id}
                      style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }}
                    >
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.id}</div>
                        <code style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{t.trackingCode}</code>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{t.serviceName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{t.category}</div>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>{t.customerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.customerPhone}</div>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span
                          className="badge"
                          style={{
                            background: meta.badgeBg,
                            color: meta.badgeText,
                            borderColor: meta.borderColor,
                            fontSize: '0.72rem'
                          }}
                        >
                          {meta.label}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        {t.assignedWorkerName ? (
                          <span style={{ color: '#a78bfa', fontWeight: 600 }}>{t.assignedWorkerName}</span>
                        ) : (
                          <span style={{ color: '#64748b', fontStyle: 'italic' }}>Unassigned</span>
                        )}
                      </td>

                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#34d399' }}>
                        ₦{t.totalAmount.toLocaleString()}
                      </td>

                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <button
                          onClick={() => setActiveTaskDetail(t)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                        >
                          <span>Manage</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Responsive Styles for Admin Tabs & Payment Cards */}
      <style jsx>{`
        .tab-label-mobile,
        .walkin-text-mobile,
        .approve-text-mobile {
          display: none;
        }

        .tab-label-desktop,
        .walkin-text-desktop,
        .approve-text-desktop {
          display: inline;
        }

        .payment-card-footer {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          width: 100%;
          gap: 1rem;
          flex-wrap: wrap;
          padding-top: 0.85rem;
          border-top: 1px solid var(--border-subtle);
        }

        .payment-card-amount {
          text-align: left;
        }

        .payment-amount-val {
          font-size: 1.35rem;
          font-weight: 800;
          color: #10b981;
          line-height: 1.2;
        }

        .payment-amount-sub {
          font-size: 0.72rem;
          color: var(--text-dim);
        }

        .payment-card-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        @media (max-width: 680px) {
          .tab-label-desktop,
          .walkin-text-desktop,
          .approve-text-desktop {
            display: none !important;
          }

          .tab-label-mobile,
          .walkin-text-mobile,
          .approve-text-mobile {
            display: inline !important;
          }

          .admin-action-tabs-row {
            flex-direction: column;
            align-items: stretch !important;
            gap: 0.75rem !important;
          }

          .admin-tabs-segmented {
            width: 100%;
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
          }

          .admin-tab-btn {
            padding: 0.5rem 0.35rem !important;
            font-size: 0.78rem !important;
            justify-content: center !important;
            flex-direction: column !important;
            gap: 0.25rem !important;
            text-align: center !important;
          }

          .walkin-btn {
            width: 100%;
            justify-content: center !important;
            padding: 0.6rem 1rem !important;
          }

          .payment-approval-card {
            padding: 1rem 1.15rem !important;
          }

          .payment-card-footer {
            flex-direction: column;
            align-items: stretch !important;
            gap: 0.75rem;
          }

          .payment-card-amount {
            display: flex;
            align-items: baseline;
            justifyContent: space-between;
            width: 100%;
          }

          .payment-card-actions {
            display: grid !important;
            grid-template-columns: 1fr auto !important;
            gap: 0.5rem !important;
            width: 100% !important;
          }

          .btn-approve {
            justify-content: center !important;
            padding: 0.55rem 0.75rem !important;
          }

          .btn-reject {
            justify-content: center !important;
            padding: 0.55rem 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
}
