'use client';

import React, { useState } from 'react';
import { useCyber } from '../context/CyberContext';
import { STATUS_METADATA } from '../utils/stateMachine';
import PipelineStepper from './PipelineStepper';
import { Search, X, CheckCircle2, Clock, Download, ChevronRight, FileText } from 'lucide-react';

export default function TrackModal() {
  const { activeModal, setActiveModal, tasks, setActiveTaskDetail, deliverTask, showToast } = useCyber();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  if (activeModal !== 'track') return null;

  const results = query.trim()
    ? tasks.filter(
        (t) =>
          t.trackingCode.toLowerCase().includes(query.toLowerCase().trim()) ||
          t.id.toLowerCase().includes(query.toLowerCase().trim()) ||
          t.customerPhone.includes(query.trim())
      )
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const handleDownload = (task: any) => {
    deliverTask(task.id, task.customerName || 'Customer');
    showToast('Download Started', `Downloading delivery document for ${task.id}...`, 'success');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-box" style={{ maxWidth: '620px' }}>
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
              <Search size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Public Application Tracking</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Check live task status by code or phone number</p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModal(null);
              setQuery('');
              setSearched(false);
            }}
            style={{ padding: '0.4rem', color: 'var(--text-muted)', borderRadius: '8px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              required
              placeholder="e.g. BJ-TRK-78401 or 08149204812"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearched(false);
              }}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary btn-sm justify-center py-2.5 sm:py-2">
              <Search size={15} />
              <span>Track Now</span>
            </button>
          </form>

          {/* Preset Example Quick Searches */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Try:</span>
            {['BJ-TRK-78401', 'BJ-TRK-90412', 'BJ-TRK-66103'].map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setQuery(ex);
                  setSearched(true);
                }}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--primary)'
                }}
              >
                {ex}
              </button>
            ))}
          </div>

          {searched && (
            <div>
              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>No task matched your search.</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>
                    Double-check your reference code or mobile phone.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {results.map((task) => {
                    const meta = STATUS_METADATA[task.status];
                    return (
                      <div
                        key={task.id}
                        style={{
                          background: 'var(--bg-surface)',
                          border: `1px solid ${meta.borderColor}`,
                          borderRadius: '12px',
                          padding: '1.25rem',
                          boxShadow: 'var(--shadow-card)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                              {task.serviceName}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              Applicant: <strong style={{ color: 'var(--text-main)' }}>{task.customerName}</strong> ({task.customerPhone})
                            </div>
                          </div>

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

                        <div style={{ background: 'var(--bg-inset)', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.75rem' }}>
                          <PipelineStepper
                            currentStatus={task.status}
                            needsInfoReason={task.needsInfoRecords[task.needsInfoRecords.length - 1]?.reason}
                            compact={true}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {task.assignedWorkerName && (
                              <span>Assigned Operator: <strong style={{ color: 'var(--primary)' }}>{task.assignedWorkerName}</strong></span>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {(task.status === 'completed' || task.status === 'delivered') && (
                              <button
                                onClick={() => handleDownload(task)}
                                className="btn btn-primary btn-sm"
                                style={{ background: '#10b981' }}
                              >
                                <Download size={13} />
                                <span>Download</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setActiveModal(null);
                                setActiveTaskDetail(task);
                              }}
                              className="btn btn-secondary btn-sm"
                            >
                              <span>View Full Details</span>
                              <ChevronRight size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
