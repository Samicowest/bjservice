'use client';

import React, { useState } from 'react';
import { useCyber } from '../context/CyberContext';
import { CAFE_INFO } from '../data/staff';
import { AttachedFile, PaymentMethod, Priority } from '../types';
import {
  X,
  CreditCard,
  Building,
  Banknote,
  Upload,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';
import TranscriptForm from './TranscriptForm';
import SupplementaryForm from './SupplementaryForm';
import SchoolFeesForm from './SchoolFeesForm';
import StudentBioDataForm from './StudentBioDataForm';
import PostUtmeForm from './PostUtmeForm';

export default function OrderServiceModal() {
  const {
    activeModal,
    setActiveModal,
    selectedServiceForOrder,
    createTask,
    verifyPayment,
    showToast
  } = useCyber();

  if (activeModal !== 'order' || !selectedServiceForOrder) return null;

  const srv = selectedServiceForOrder;

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<AttachedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successTask, setSuccessTask] = useState<any>(null);

  const expressSurcharge = priority === 'express' ? 500 : 0;
  const grandTotal = srv.totalPrice + expressSurcharge;

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSimulatedFileUpload = () => {
    const fakeFileName = srv.requiredDocTypes[0]
      ? `${srv.requiredDocTypes[0].replace(/[^a-zA-Z0-9]/g, '_')}_document.pdf`
      : 'Applicant_Credential.pdf';

    const newFile: AttachedFile = {
      id: `file-${Date.now()}`,
      name: fakeFileName,
      size: 420000,
      type: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      uploadedBy: customerName || 'Customer',
      url: '#'
    };

    setUploadedFiles((prev) => [...prev, newFile]);
    showToast('File Attached', `${fakeFileName} attached successfully.`, 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const created = createTask(
        srv.id,
        {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          isWalkIn: false
        },
        formData,
        uploadedFiles,
        priority
      );

      // If online payment (Paystack or Flutterwave), simulate instant payment verification webhook!
      if (paymentMethod === 'paystack' || paymentMethod === 'flutterwave') {
        verifyPayment(
          created.id,
          paymentMethod,
          `${paymentMethod.toUpperCase()}_AUTO_${Date.now()}`,
          `${paymentMethod === 'paystack' ? 'Paystack' : 'Flutterwave'} Automated Webhook`
        );
      }

      setIsProcessing(false);
      setSuccessTask(created);
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content-box"
        style={{
          maxWidth: srv.officialFormId ? '860px' : '640px',
          width: '100%'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', border: '1px solid var(--border-subtle)' }}>
                {srv.category}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>~{srv.estimatedMinutes} mins SLA</span>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 800 }}>
                Official Fee: ₦{srv.totalPrice.toLocaleString()}
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>{srv.name}</h2>
          </div>

          <button
            onClick={() => {
              setActiveModal(null);
              setSuccessTask(null);
            }}
            style={{ padding: '0.4rem', color: 'var(--text-muted)', borderRadius: '8px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 md:p-7">
          {!successTask && srv.image && (
            <div style={{ height: '120px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem', position: 'relative' }}>
              <img
                src={srv.image}
                alt={srv.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '10px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}
              >
                Official BJ Services Processing Desk
              </div>
            </div>
          )}
          {successTask ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--success-bg)',
                  color: 'var(--success-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Order Successfully Placed!
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Your request has entered the BJ Services cybercafe pipeline.
              </p>

              <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tracking Code:</span>
                  <code style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>{successTask.trackingCode}</code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Task ID:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{successTask.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Paid:</span>
                  <span style={{ fontWeight: 800, color: '#10b981' }}>₦{grandTotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Payment Status:</span>
                  <span style={{ fontWeight: 700, color: paymentMethod === 'cash' || paymentMethod === 'bank_transfer' ? '#f59e0b' : '#10b981' }}>
                    {paymentMethod === 'cash' || paymentMethod === 'bank_transfer' ? 'Pending Counter Verification' : 'Verified Automatically'}
                  </span>
                </div>
              </div>

            </div>
          ) : srv.officialFormId ? (
            <div>
              <div style={{ marginBottom: '1.25rem', padding: '0.85rem 1rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
                  📋 <strong>Official Digital Registry Form:</strong> Verified FUTO Cybercafe processing with real-time status tracking.
                </span>
                <span className="badge" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                  Auto-registers into Pipeline
                </span>
              </div>

              {srv.officialFormId === 'transcript' && (
                <TranscriptForm
                  standalone={false}
                  onSuccess={(taskId) => {
                    setActiveModal(null);
                    showToast('Transcript Submitted', `Task ${taskId} is now in processing queue.`, 'success');
                  }}
                />
              )}

              {srv.officialFormId === 'supplementary' && (
                <SupplementaryForm
                  standalone={false}
                  onSuccess={(taskId) => {
                    setActiveModal(null);
                    showToast('Supplementary Submitted', `Task ${taskId} is now in processing queue.`, 'success');
                  }}
                />
              )}

              {srv.officialFormId === 'school-fees' && (
                <SchoolFeesForm
                  standalone={false}
                  onSuccess={(taskId) => {
                    setActiveModal(null);
                    showToast('School Fees Form Submitted', `Task ${taskId} is now in processing queue.`, 'success');
                  }}
                />
              )}

              {srv.officialFormId === 'bio-data' && (
                <StudentBioDataForm
                  standalone={false}
                  onSuccess={(taskId) => {
                    setActiveModal(null);
                    showToast('Bio Data Form Submitted', `Task ${taskId} is now in processing queue.`, 'success');
                  }}
                />
              )}

              {srv.officialFormId === 'post-utme' && (
                <PostUtmeForm
                  standalone={false}
                  onSuccess={(taskId) => {
                    setActiveModal(null);
                    showToast('Post-UTME Form Submitted', `Task ${taskId} is now in processing queue.`, 'success');
                  }}
                />
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Customer Contact Section */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  1. Applicant Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Victor Chibuike"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Mobile Phone (SMS updates) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 08149204812"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. student@futo.edu.ng"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Service Specific Fields */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  2. {srv.name} Form Details
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {srv.fields.map((f) => (
                    <div key={f.id}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                        {f.label} {f.required && '*'}
                      </label>
                      {f.type === 'select' ? (
                        <select
                          className="form-select"
                          required={f.required}
                          value={formData[f.id] || ''}
                          onChange={(e) => handleFieldChange(f.id, e.target.value)}
                        >
                          <option value="">-- Choose Option --</option>
                          {f.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={f.type}
                          required={f.required}
                          placeholder={f.placeholder}
                          value={formData[f.id] || ''}
                          onChange={(e) => handleFieldChange(f.id, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* File Upload Section */}
              {srv.requiredDocTypes.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    3. Required Document Attachments
                  </h4>

                  <div
                    style={{
                      border: '2px dashed rgba(2, 132, 199, 0.35)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      textAlign: 'center',
                      background: 'rgba(2, 132, 199, 0.04)',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <Upload size={24} color="var(--primary)" style={{ margin: '0 auto 0.4rem' }} />
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                      Attach {srv.requiredDocTypes.join(' or ')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 10px' }}>
                      PDF, JPG or PNG (Clear scan prevents Needs Info delays)
                    </div>
                    <button
                      type="button"
                      onClick={handleSimulatedFileUpload}
                      className="btn btn-secondary btn-sm"
                    >
                      <span>Simulate Upload Document</span>
                    </button>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {uploadedFiles.map((f) => (
                        <div
                          key={f.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'var(--bg-inset)',
                            border: '1px solid var(--border-subtle)',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            fontSize: '0.82rem'
                          }}
                        >
                          <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <FileText size={15} /> {f.name}
                          </span>
                          <span style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 700 }}>
                            Ready
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Express Queue Priority Toggle */}
              <div
                style={{
                  background: priority === 'express' ? 'rgba(234, 88, 12, 0.1)' : 'var(--bg-surface)',
                  border: priority === 'express' ? '1px solid var(--accent-orange)' : '1px solid var(--border-subtle)',
                  padding: '1rem',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  cursor: 'pointer'
                }}
                onClick={() => setPriority(priority === 'express' ? 'normal' : 'express')}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <Sparkles size={16} color="var(--accent-orange)" />
                    <span>Express Priority Queue (+₦500)</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Immediate operator assignment & instant turnaround priority.
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={priority === 'express'}
                  onChange={() => {}}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--accent-orange)' }}
                />
              </div>

              {/* Payment Methods */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  4. Select Payment Method
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
                  {[
                    { id: 'paystack', label: 'Paystack Card/Bank', icon: <CreditCard size={16} /> },
                    { id: 'flutterwave', label: 'Flutterwave', icon: <Building size={16} /> },
                    { id: 'bank_transfer', label: 'Direct Bank Transfer', icon: <Banknote size={16} /> },
                    { id: 'cash', label: 'Cash at Counter', icon: <Banknote size={16} /> }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: '10px',
                        background: paymentMethod === method.id ? 'var(--bg-inset)' : 'var(--bg-surface)',
                        border: paymentMethod === method.id ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                        color: paymentMethod === method.id ? 'var(--primary)' : 'var(--text-muted)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      {method.icon}
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'bank_transfer' && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Transfer to: <strong style={{ color: 'var(--text-main)' }}>{CAFE_INFO.bankDetails.bankName}</strong> • Acc: <strong style={{ color: 'var(--primary)' }}>{CAFE_INFO.bankDetails.accountNumber}</strong> ({CAFE_INFO.bankDetails.accountName}). Admin confirms credit alert.
                  </div>
                )}
              </div>

              {/* Submit Button & Total Breakdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 border-t border-[var(--border-subtle)]">
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grand Total to Pay:</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>
                    ₦{grandTotal.toLocaleString()}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn btn-primary w-full sm:w-auto"
                  style={{ minWidth: '180px' }}
                >
                  {isProcessing ? 'Processing Pipeline...' : `Confirm & Submit (₦${grandTotal.toLocaleString()})`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
