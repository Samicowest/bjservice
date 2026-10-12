'use client';

import React, { useState } from 'react';
import { useCyber } from '../context/CyberContext';
import { CyberTask } from '../types';
import { STATUS_METADATA } from '../utils/stateMachine';
import {
  Briefcase,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Upload,
  User,
  Phone,
  FileText,
  ChevronRight,
  Send,
  Layers,
  Search,
  Zap,
  UserCheck,
  Copy,
  Check,
  ExternalLink,
  X,
  Filter
} from 'lucide-react';

export default function WorkerDeskView() {
  const {
    tasks,
    activeWorkerId,
    setActiveWorkerId,
    workers,
    transitionTaskStatus,
    requestNeedsInfo,
    completeTask,
    setActiveTaskDetail,
    showToast
  } = useCyber();

  const activeWorker = workers.find((w) => w.id === activeWorkerId) || workers[0];
  const [workerTab, setWorkerTab] = useState<'queue' | 'completed'>('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'express'>('all');
  const [copiedTrackingCode, setCopiedTrackingCode] = useState<string | null>(null);

  // State for "Needs Info" prompt
  const [flaggingTaskId, setFlaggingTaskId] = useState<string | null>(null);
  const [needsInfoReason, setNeedsInfoReason] = useState('');

  // State for "Complete Task" prompt
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [resultFileName, setResultFileName] = useState('');

  // Tasks assigned to this operator
  const myTasks = tasks.filter((t) => t.assignedWorkerId === activeWorker.id);

  // Counts for each tab:
  // Queue = tasks in progress or assigned that have not been completed
  const queueCount = myTasks.filter((t) => t.status !== 'completed' && t.status !== 'delivered').length;
  const completedCount = myTasks.filter((t) => t.status === 'completed' || t.status === 'delivered').length;

  const filteredTasks = myTasks.filter((t) => {
    // 1. Status Filter: Queue vs Completed
    if (workerTab === 'queue' && (t.status === 'completed' || t.status === 'delivered')) return false;
    if (workerTab === 'completed' && !(t.status === 'completed' || t.status === 'delivered')) return false;

    // 2. Priority Filter
    if (priorityFilter === 'express' && t.priority !== 'express') return false;

    // 3. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = t.customerName.toLowerCase().includes(q);
      const matchesPhone = t.customerPhone.toLowerCase().includes(q);
      const matchesCode = t.trackingCode.toLowerCase().includes(q);
      const matchesId = t.id.toLowerCase().includes(q);
      const matchesService = t.serviceName.toLowerCase().includes(q);
      return matchesName || matchesPhone || matchesCode || matchesId || matchesService;
    }

    return true;
  });

  const handleCopyCode = (code: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    }
    setCopiedTrackingCode(code);
    showToast('Copied', `Tracking code ${code} copied to clipboard.`, 'info');
    setTimeout(() => setCopiedTrackingCode(null), 2000);
  };

  const handleStartWork = (task: CyberTask) => {
    const res = transitionTaskStatus(
      task.id,
      'in_progress',
      `Operator ${activeWorker.name} initiated live processing on portal.`
    );
    if (res.success) {
      showToast('Started Work', `${task.id} is now In Progress.`, 'success');
    }
  };

  const handleSubmitNeedsInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flaggingTaskId || !needsInfoReason.trim()) return;

    requestNeedsInfo(flaggingTaskId, needsInfoReason, activeWorker.name);
    showToast('Needs Info Requested', 'Customer notified to clarify or upload correction.', 'warning');
    setFlaggingTaskId(null);
    setNeedsInfoReason('');
  };

  const handleFinishTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingTaskId) return;

    const file = {
      id: `res-${Date.now()}`,
      name: resultFileName || 'Official_Stamped_Document.pdf',
      size: 640000,
      type: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      uploadedBy: activeWorker.name,
      isResult: true,
      url: '#'
    };

    completeTask(
      completingTaskId,
      activeWorker.name,
      file,
      completionNotes || 'Job finished on portal with official e-receipt generated.'
    );
    showToast('Task Completed', `${completingTaskId} marked Completed. Customer notified.`, 'success');
    setCompletingTaskId(null);
    setCompletionNotes('');
    setResultFileName('');
    setWorkerTab('completed');
  };

  return (
    <div style={{ padding: '1.5rem 0 4rem' }}>
      {/* ============================================================
          1. Operator Executive Profile & Bento Workload Header
          ============================================================ */}
      <div
        className="glass-card"
        style={{
          padding: '1.5rem',
          marginBottom: '1.75rem',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.04) 0%, rgba(126, 34, 206, 0.05) 100%)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px'
        }}
      >
        {/* Top Flex Row: Operator Details & Persona Switcher */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          {/* Operator Identity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: '1 1 280px' }}>
            {/* Profile Image & Online Status Pill at the Top */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)',
                  border: '2px solid #e0e7ff',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  flexShrink: 0
                }}
              >
                {activeWorker.avatar}
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#dcfce7',
                  color: '#15803d',
                  border: '1px solid #bbf7d0',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase'
                }}
              >
                <span className="pulse-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                Online Operator
              </span>
            </div>

            {/* Operator Name & Professional Desk Title */}
            <div>
              <h2
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  margin: 0
                }}
              >
                {activeWorker.name}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
                {activeWorker.title} • BJ Services Desk
              </p>
            </div>
          </div>

          {/* Switch Operator Persona Dropdown */}
          <div style={{ flex: '1 1 260px', maxWidth: '340px', minWidth: '240px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.73rem',
                color: 'var(--text-dim)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '6px'
              }}
            >
              <UserCheck size={13} color="var(--primary)" />
              Operator Desk View:
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={activeWorkerId}
                onChange={(e) => setActiveWorkerId(e.target.value)}
                className="pill-select"
                style={{
                  width: '100%',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  paddingRight: '2rem'
                }}
              >
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.avatar} {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '1.25rem 0' }} />

        {/* Workload Metrics (Side-by-side) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '0.85rem',
            width: '100%'
          }}
        >
          {/* Metric 1: Active Queue */}
          <div
            style={{
              background: 'var(--bg-surface)',
              padding: '0.9rem 1.15rem',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                Active Queue Load
              </span>
              <Layers size={16} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: activeWorker.activeTaskCount > 4 ? 'var(--danger)' : 'var(--primary)', lineHeight: 1.1, marginTop: '0.45rem' }}>
              {activeWorker.activeTaskCount}
            </div>
          </div>

          {/* Metric 2: Finished Today */}
          <div
            style={{
              background: 'var(--bg-surface)',
              padding: '0.9rem 1.15rem',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                Finished Today
              </span>
              <CheckCircle2 size={16} color="var(--success)" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--success)', lineHeight: 1.1, marginTop: '0.45rem' }}>
              {activeWorker.completedTodayCount}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          2. Operator Workflow Tabs: Queue & Completed Only
          ============================================================ */}
      <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setWorkerTab('queue')}
          style={{
            padding: '0.6rem 1.35rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            borderRadius: '9999px',
            border: workerTab === 'queue' ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
            background: workerTab === 'queue' ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : 'var(--bg-surface)',
            color: workerTab === 'queue' ? '#ffffff' : 'var(--text-main)',
            boxShadow: workerTab === 'queue' ? '0 4px 14px rgba(2, 132, 199, 0.25)' : 'var(--shadow-sm)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          <span>Queue</span>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: workerTab === 'queue' ? 'rgba(255, 255, 255, 0.28)' : 'var(--bg-inset)',
              color: workerTab === 'queue' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            {queueCount}
          </span>
        </button>

        <button
          onClick={() => setWorkerTab('completed')}
          style={{
            padding: '0.6rem 1.35rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            borderRadius: '9999px',
            border: workerTab === 'completed' ? '1.5px solid #15803d' : '1px solid var(--border-subtle)',
            background: workerTab === 'completed' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'var(--bg-surface)',
            color: workerTab === 'completed' ? '#ffffff' : 'var(--text-main)',
            boxShadow: workerTab === 'completed' ? '0 4px 14px rgba(16, 185, 129, 0.25)' : 'var(--shadow-sm)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          <span>Completed</span>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: workerTab === 'completed' ? 'rgba(255, 255, 255, 0.28)' : 'var(--bg-inset)',
              color: workerTab === 'completed' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            {completedCount}
          </span>
        </button>
      </div>

      {/* ============================================================
          3. Quick Search & Priority Filter Toolbar
          ============================================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '440px' }}>
          <Search
            size={16}
            color="var(--text-dim)"
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, ID, or tracking code..."
            style={{
              paddingLeft: '2.5rem',
              paddingRight: searchQuery ? '2.5rem' : '1rem',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              height: '40px'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)',
                padding: '4px'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Priority Filter Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setPriorityFilter(priorityFilter === 'express' ? 'all' : 'express')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              border: priorityFilter === 'express' ? '1.5px solid var(--accent-orange)' : '1px solid var(--border-subtle)',
              background: priorityFilter === 'express' ? 'var(--accent-orange-light)' : 'var(--bg-surface)',
              color: priorityFilter === 'express' ? 'var(--accent-orange)' : 'var(--text-muted)',
              transition: 'var(--transition)'
            }}
          >
            <Zap size={14} color={priorityFilter === 'express' ? 'var(--accent-orange)' : 'var(--text-dim)'} />
            <span>⚡ Express Only</span>
          </button>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      </div>

      {/* ============================================================
          4. Task Queue Cards
          ============================================================ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredTasks.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3.5rem 1.5rem',
              background: 'var(--bg-card)',
              borderRadius: '18px',
              border: '1px dashed var(--border-strong)'
            }}
          >
            <Briefcase size={42} color="var(--text-dim)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>
              {workerTab === 'queue' ? 'No active tasks in your queue' : 'No completed jobs yet'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '420px', margin: '4px auto 0' }}>
              {searchQuery
                ? `No tasks matching "${searchQuery}". Clear your search query to see all items.`
                : workerTab === 'queue'
                ? 'All caught up! New student applications will automatically appear here in your queue.'
                : 'Completed student applications and delivered stamped files are archived here.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '1rem' }}
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const meta = STATUS_METADATA[task.status];
            const isUrgent = task.priority === 'express';

            return (
              <div
                key={task.id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  borderLeft: `5px solid ${isUrgent ? 'var(--accent-orange)' : meta.borderColor}`,
                  background: isUrgent ? 'linear-gradient(135deg, rgba(234, 88, 12, 0.03) 0%, #ffffff 100%)' : 'var(--bg-card)',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                {/* Header: Service Name, Badges & SLA */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                        {task.serviceName}
                      </span>
                      {isUrgent && (
                        <span
                          style={{
                            background: '#ffedd5',
                            color: '#ea580c',
                            border: '1px solid #fdba74',
                            padding: '3px 9px',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Zap size={11} color="#ea580c" />
                          EXPRESS SLA
                        </span>
                      )}
                      <span
                        style={{
                          background: meta.badgeBg,
                          color: meta.badgeText,
                          border: `1px solid ${meta.borderColor}`,
                          padding: '3px 9px',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em'
                        }}
                      >
                        {meta.label}
                      </span>
                    </div>

                    {/* Metadata Items with Pill Details */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.84rem',
                        color: 'var(--text-muted)',
                        flexWrap: 'wrap'
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <strong style={{ color: 'var(--text-main)' }}>#{task.id}</strong>
                      </span>

                      <span>•</span>

                      {/* Tracking Code with Instant Copy */}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <code
                          style={{
                            color: 'var(--primary)',
                            background: 'var(--primary-light)',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.82rem'
                          }}
                        >
                          {task.trackingCode}
                        </code>
                        <button
                          onClick={() => handleCopyCode(task.trackingCode)}
                          title="Copy tracking code"
                          style={{
                            color: copiedTrackingCode === task.trackingCode ? 'var(--success)' : 'var(--text-dim)',
                            padding: '2px',
                            cursor: 'pointer'
                          }}
                        >
                          {copiedTrackingCode === task.trackingCode ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </span>

                      <span>•</span>

                      {/* Customer Name */}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <User size={13} color="var(--primary)" />
                        <strong style={{ color: 'var(--text-main)' }}>{task.customerName}</strong>
                      </span>

                      <span>•</span>

                      {/* Phone Number */}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Phone size={13} color="var(--success)" />
                        <a
                          href={`tel:${task.customerPhone}`}
                          style={{ color: 'var(--primary)', fontWeight: 600 }}
                        >
                          {task.customerPhone}
                        </a>
                      </span>
                    </div>
                  </div>

                  {/* SLA Target Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'var(--bg-inset)',
                      padding: '0.45rem 0.9rem',
                      borderRadius: '9999px',
                      border: '1px solid var(--border-subtle)',
                      flexShrink: 0
                    }}
                  >
                    <Clock size={14} color="var(--primary)" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Target: ~{task.estimatedTurnaroundMinutes}m SLA
                    </span>
                  </div>
                </div>

                {/* Form Data & Submitted Student Details */}
                <div
                  style={{
                    background: 'var(--bg-inset)',
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '1rem',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--text-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.65rem'
                    }}
                  >
                    Student Application Details:
                  </div>

                  {/* Responsive Details Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '0.6rem'
                    }}
                  >
                    {Object.entries(task.formData).map(([k, val]) => (
                      <div
                        key={k}
                        style={{
                          background: 'var(--bg-surface)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <span
                          style={{
                            display: 'block',
                            fontSize: '0.72rem',
                            color: 'var(--text-dim)',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                            marginBottom: '2px'
                          }}
                        >
                          {k.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <strong
                          style={{
                            display: 'block',
                            fontSize: '0.86rem',
                            color: 'var(--text-main)',
                            wordBreak: 'break-word'
                          }}
                        >
                          {String(val || 'N/A')}
                        </strong>
                      </div>
                    ))}
                  </div>

                  {/* Customer Uploaded Files (e.g. JAMB slip, statement of result) */}
                  {task.customerFiles.length > 0 && (
                    <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                        Customer Uploaded Credentials:
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {task.customerFiles.map((f) => (
                          <div
                            key={f.id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              padding: '0.35rem 0.8rem',
                              borderRadius: '9999px',
                              fontSize: '0.8rem',
                              color: 'var(--text-main)',
                              fontWeight: 500
                            }}
                          >
                            <FileText size={14} color="var(--primary)" />
                            <span>{f.name}</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                              ({Math.round(f.size / 1024)} KB)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* If In 'Needs Info' State: display current issue */}
                {task.status === 'needs_info' && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      borderRadius: '12px',
                      padding: '1rem',
                      marginBottom: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontWeight: 700, fontSize: '0.88rem' }}>
                      <AlertTriangle size={16} />
                      <span>FLAGGED: AWAITING CUSTOMER CLARIFICATION</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '4px', fontWeight: 500 }}>
                      {task.needsInfoRecords[task.needsInfoRecords.length - 1]?.reason}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '4px', fontWeight: 600 }}>
                      ⏳ Turnaround timer is currently paused until customer updates details.
                    </div>
                  </div>
                )}

                {/* Operator Action Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.65rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--border-subtle)'
                  }}
                >
                  <button
                    onClick={() => setActiveTaskDetail(task)}
                    className="btn btn-secondary btn-sm rounded-full"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>View Full Log & Files</span>
                    <ChevronRight size={14} />
                  </button>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {/* Action 1: If Assigned -> Start Work */}
                    {task.status === 'assigned' && (
                      <button
                        onClick={() => handleStartWork(task)}
                        className="btn btn-primary btn-sm rounded-full"
                      >
                        <Play size={14} />
                        <span>Start Work</span>
                      </button>
                    )}

                    {/* Action 2: If In Progress -> Flag Needs Info OR Mark Completed */}
                    {task.status === 'in_progress' && (
                      <>
                        <button
                          onClick={() => setFlaggingTaskId(task.id)}
                          className="btn btn-danger btn-sm rounded-full"
                        >
                          <AlertTriangle size={14} />
                          <span>Flag: Needs Info</span>
                        </button>

                        <button
                          onClick={() => {
                            setCompletingTaskId(task.id);
                            setResultFileName(`${task.serviceName.replace(/\s+/g, '_')}_Official_Delivery.pdf`);
                          }}
                          className="btn btn-sm rounded-full"
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: '#ffffff',
                            boxShadow: '0 3px 12px rgba(16, 185, 129, 0.25)'
                          }}
                        >
                          <FileCheck size={14} />
                          <span>Complete & Upload Result</span>
                        </button>
                      </>
                    )}

                    {/* Action 3: If Needs Info -> Option to manually resume */}
                    {task.status === 'needs_info' && (
                      <button
                        onClick={() => {
                          transitionTaskStatus(task.id, 'in_progress', 'Operator received clarification at front desk.');
                          showToast('Resumed Work', 'Task resumed back to In Progress.', 'success');
                        }}
                        className="btn btn-primary btn-sm rounded-full"
                      >
                        <Play size={14} />
                        <span>Resume Work (Clarification Received)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ============================================================
          5. MODAL: Flag "Needs Info"
          ============================================================ */}
      {flaggingTaskId && (
        <div className="modal-overlay">
          <div className="modal-content-box" style={{ padding: '1.75rem', maxWidth: '520px', width: '92%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--danger)', marginBottom: '0.75rem' }}>
              <AlertTriangle size={20} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Request Missing Info or Better Document</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              State clearly why the application cannot proceed. This note is sent directly to the student via SMS/Email and their dashboard. The deadline timer will be paused.
            </p>

            <form onSubmit={handleSubmitNeedsInfo}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Reason / Required Correction:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. The uploaded WAEC result is blurry and the PIN cannot be read on the JAMB CAPS portal. Please upload a clear photo or flat scan."
                  value={needsInfoReason}
                  onChange={(e) => setNeedsInfoReason(e.target.value)}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setFlaggingTaskId(null)}
                  className="btn btn-secondary btn-sm rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-danger btn-sm rounded-full"
                >
                  <Send size={14} />
                  <span>Send Request & Pause Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          6. MODAL: Upload Result & Complete Task
          ============================================================ */}
      {completingTaskId && (
        <div className="modal-overlay">
          <div className="modal-content-box" style={{ padding: '1.75rem', maxWidth: '540px', width: '92%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--success)', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={22} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Complete Task & Upload Stamped Result</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Upload the finalized document (e.g. Remita verified receipt, JAMB CAPS upload verification printout, or smart card scan) for the student to download.
            </p>

            <form onSubmit={handleFinishTask}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Delivery Document Name:
                </label>
                <input
                  type="text"
                  required
                  value={resultFileName}
                  onChange={(e) => setResultFileName(e.target.value)}
                  placeholder="e.g. FUTO_Acceptance_Remita_Receipt_Stamped.pdf"
                  style={{ borderRadius: '9999px', padding: '0.6rem 1rem' }}
                />
              </div>

              {/* Upload Dropzone Preview */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Attach Verification File / Stamped Copy:
                </label>
                <div
                  style={{
                    border: '2px dashed var(--primary)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    textAlign: 'center',
                    background: 'var(--primary-light)'
                  }}
                >
                  <Upload size={26} color="var(--primary)" style={{ margin: '0 auto 0.4rem' }} />
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                    File Attached: <span style={{ color: 'var(--primary)' }}>{resultFileName}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Standard cybercafe digital watermarking applied.
                  </div>
                </div>
              </div>

              {/* Quick Completion Notes */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Quick Completion Notes:
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {[
                    'Successfully cleared on FUTO portal. Print slip for PPRC biometric verification.',
                    'Remita payment confirmed and official e-receipt attached.',
                    'JAMB CAPS admission accepted and verified on portal.'
                  ].map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCompletionNotes(sug)}
                      style={{
                        fontSize: '0.73rem',
                        background: 'var(--bg-inset)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '9999px',
                        padding: '3px 10px',
                        color: 'var(--text-main)',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      + {sug.slice(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Operator Completion Notes for Student:
                </label>
                <textarea
                  rows={3}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="e.g. Successfully cleared on the FUTO acceptance portal. Take this printed slip to the Old Registry beside PPRC for biometric stamping."
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setCompletingTaskId(null)}
                  className="btn btn-secondary btn-sm rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    boxShadow: '0 3px 12px rgba(16, 185, 129, 0.25)'
                  }}
                >
                  <CheckCircle2 size={14} />
                  <span>Finalize & Notify Customer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
