'use client';

import React from 'react';
import { TaskStatus } from '../types';
import { STATUS_METADATA } from '../utils/stateMachine';
import { Check, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface PipelineStepperProps {
  currentStatus: TaskStatus;
  needsInfoReason?: string;
  compact?: boolean;
}

export default function PipelineStepper({
  currentStatus,
  needsInfoReason,
  compact = false
}: PipelineStepperProps) {
  const isNeedsInfo = currentStatus === 'needs_info';
  const isCancelledOrRejected = currentStatus === 'cancelled' || currentStatus === 'rejected';

  // 3 Professional Milestones: Payment -> Progress -> Completed
  // 1. Payment Phase:
  //    - 'draft', 'pending_payment' => in payment phase
  //    - 'paid', 'assigned', 'in_progress', 'needs_info', 'completed', 'delivered' => payment completed
  const isPaymentCompleted =
    currentStatus === 'paid' ||
    currentStatus === 'assigned' ||
    currentStatus === 'in_progress' ||
    currentStatus === 'needs_info' ||
    currentStatus === 'completed' ||
    currentStatus === 'delivered';
  const isPaymentCurrent = currentStatus === 'draft' || currentStatus === 'pending_payment';

  // 2. Progress Phase:
  //    - 'paid', 'assigned', 'in_progress', 'needs_info' => active in progress phase
  //    - 'completed', 'delivered' => progress completed
  const isProgressCompleted = currentStatus === 'completed' || currentStatus === 'delivered';
  const isProgressCurrent =
    currentStatus === 'paid' ||
    currentStatus === 'assigned' ||
    currentStatus === 'in_progress' ||
    currentStatus === 'needs_info';

  // 3. Completed Phase:
  const isCompletedPhaseCompleted = currentStatus === 'completed' || currentStatus === 'delivered';

  const steps = [
    {
      key: 'payment',
      label: 'Payment',
      number: 1,
      isCompleted: isPaymentCompleted,
      isCurrent: isPaymentCurrent,
      isAlert: false
    },
    {
      key: 'progress',
      label: 'Progress',
      number: 2,
      isCompleted: isProgressCompleted,
      isCurrent: isProgressCurrent && !isProgressCompleted,
      isAlert: isNeedsInfo
    },
    {
      key: 'completed',
      label: 'Completed',
      number: 3,
      isCompleted: isCompletedPhaseCompleted,
      isCurrent: isCompletedPhaseCompleted,
      isAlert: false
    }
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* Alert Banner if Needs Info, Rejected, or Cancelled */}
      {(isNeedsInfo || isCancelledOrRejected) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            backgroundColor: isNeedsInfo ? '#fef2f2' : '#f8fafc',
            border: `1px solid ${isNeedsInfo ? '#fecaca' : '#cbd5e1'}`
          }}
        >
          {isNeedsInfo ? (
            <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
          ) : (
            <XCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isNeedsInfo ? '#b91c1c' : '#334155' }}>
              {isNeedsInfo ? 'Action Needed: Customer Clarification Required' : `Order ${currentStatus.toUpperCase()}`}
            </div>
            <div style={{ fontSize: '0.82rem', color: isNeedsInfo ? '#7f1d1d' : '#64748b', marginTop: '2px' }}>
              {needsInfoReason || STATUS_METADATA[currentStatus]?.description || 'Processing paused.'}
            </div>
          </div>
        </div>
      )}

      {/* 3-Step Professional Stepper */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          padding: compact ? '0.4rem 0.5rem' : '0.85rem 1rem',
          maxWidth: '560px',
          margin: '0 auto'
        }}
      >
        {steps.map((step, index) => {
          let circleBg = 'var(--bg-inset)';
          let circleBorder = 'var(--border-strong)';
          let textColor = 'var(--text-dim)';
          let icon = <span>{step.number}</span>;

          if (step.isCompleted) {
            circleBg = '#dcfce7';
            circleBorder = '#16a34a';
            textColor = '#15803d';
            icon = <Check size={compact ? 13 : 16} strokeWidth={2.5} color="#15803d" />;
          } else if (step.isAlert) {
            circleBg = '#fee2e2';
            circleBorder = '#ef4444';
            textColor = '#dc2626';
            icon = <AlertTriangle size={compact ? 13 : 16} color="#dc2626" />;
          } else if (step.isCurrent) {
            circleBg = 'var(--primary-light)';
            circleBorder = 'var(--primary)';
            textColor = 'var(--primary)';
            icon = <Clock size={compact ? 13 : 16} color="var(--primary)" />;
          }

          const isLineActive = index === 0 ? isPaymentCompleted : isProgressCompleted;

          return (
            <React.Fragment key={step.key}>
              {/* Step Circle & Label */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 2,
                  position: 'relative',
                  minWidth: compact ? '60px' : '85px'
                }}
              >
                <div
                  style={{
                    width: compact ? '28px' : '38px',
                    height: compact ? '28px' : '38px',
                    borderRadius: '50%',
                    backgroundColor: circleBg,
                    border: `2px solid ${circleBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: compact ? '0.78rem' : '0.88rem',
                    fontWeight: 800,
                    color: textColor,
                    boxShadow: step.isCurrent && !step.isCompleted ? '0 0 14px var(--primary-glow)' : 'none',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {icon}
                </div>

                <span
                  style={{
                    fontSize: compact ? '0.74rem' : '0.84rem',
                    fontWeight: step.isCurrent || step.isCompleted ? 700 : 500,
                    color: step.isCompleted
                      ? '#15803d'
                      : step.isAlert
                      ? '#dc2626'
                      : step.isCurrent
                      ? 'var(--primary)'
                      : 'var(--text-dim)',
                    marginTop: '6px',
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: '2.5px',
                    backgroundColor: isLineActive ? '#16a34a' : 'var(--border-subtle)',
                    margin: compact ? '0 6px' : '0 10px',
                    position: 'relative',
                    top: compact ? '-8px' : '-13px',
                    zIndex: 1,
                    transition: 'background-color 0.3s ease',
                    borderRadius: '2px'
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
