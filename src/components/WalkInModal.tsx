'use client';

import React, { useState } from 'react';
import { useCyber } from '../context/CyberContext';
import { PaymentMethod } from '../types';
import { X, UserPlus, Banknote, CreditCard, CheckCircle2, ChevronDown } from 'lucide-react';

export default function WalkInModal() {
  const {
    activeModal,
    setActiveModal,
    services,
    createTask,
    verifyPayment,
    showToast
  } = useCyber();

  if (activeModal !== 'walkin') return null;

  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [autoApprovePayment, setAutoApprovePayment] = useState(true);

  const selectedSrv = services.find((s) => s.id === serviceId) || services[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    const task = createTask(
      serviceId,
      {
        name: customerName,
        phone: customerPhone,
        email: '',
        isWalkIn: true
      },
      { walkInCounterNotes: 'Created at front desk by counter cashier' },
      [],
      'normal'
    );

    if (autoApprovePayment) {
      verifyPayment(
        task.id,
        paymentMethod,
        `COUNTER_${paymentMethod.toUpperCase()}_${Date.now()}`,
        'Front Desk Cashier'
      );
    }

    showToast(
      'Walk-in Task Created',
      `Task ${task.id} created for ${customerName} (${autoApprovePayment ? 'Payment Confirmed' : 'Awaiting Payment'}).`,
      'success'
    );

    setActiveModal(null);
    setCustomerName('');
    setCustomerPhone('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-box" style={{ maxWidth: '520px' }}>
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
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <UserPlus size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Walk-in Counter Service Request</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Create trackable pipeline task on behalf of walk-in student</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            style={{ padding: '0.4rem', color: 'var(--text-muted)', borderRadius: '8px' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '6px' }}>
              Select Service *
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                style={{
                  width: '100%',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  padding: '0.75rem 2.6rem 0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
                }}
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id} style={{ color: 'var(--text-main)', background: '#ffffff', padding: '8px' }}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ChevronDown size={18} />
              </div>
            </div>
            {selectedSrv && (
              <div
                style={{
                  marginTop: '0.45rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}
              >
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontWeight: 700
                  }}
                >
                  {selectedSrv.category}
                </span>
                <span>• SLA: ~{selectedSrv.estimatedMinutes} mins</span>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.45rem' }}>
                Walk-in Customer Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Somto Igwe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.45rem' }}>
                Mobile Number (for SMS) *
              </label>
              <input
                type="tel"
                required
                placeholder="080..."
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.84rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.45rem' }}>
              Counter Payment Method
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '8px',
                  background: paymentMethod === 'cash' ? 'var(--bg-inset)' : 'var(--bg-surface)',
                  border: paymentMethod === 'cash' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                  color: paymentMethod === 'cash' ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <Banknote size={15} />
                <span>Cash at Desk</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('pos')}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '8px',
                  background: paymentMethod === 'pos' ? 'var(--bg-inset)' : 'var(--bg-surface)',
                  border: paymentMethod === 'pos' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                  color: paymentMethod === 'pos' ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <CreditCard size={15} />
                <span>POS Swipe</span>
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-surface)',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Payment Already Received at Desk
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Auto-approves payment so operator can start immediately
              </div>
            </div>

            <input
              type="checkbox"
              checked={autoApprovePayment}
              onChange={(e) => setAutoApprovePayment(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total to Collect:</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                ₦{selectedSrv.totalPrice.toLocaleString()}
              </div>
            </div>

            <button type="submit" className="btn btn-accent w-full sm:w-auto">
              <span>Create Task & Queue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
