'use client';

import React, { useState } from 'react';
import { useCyber } from '../context/CyberContext';
import { GraduationCap, ShieldCheck, CreditCard, Mail, Phone, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

interface SupplementaryFormProps {
  onSuccess?: (taskId: string) => void;
  standalone?: boolean;
}

export default function SupplementaryForm({ onSuccess, standalone = true }: SupplementaryFormProps) {
  const { createTask, showToast } = useCyber();
  const [formData, setFormData] = useState({
    surname: '',
    otherNames: '',
    supplementaryCourse: '',
    email: '',
    jambRegNumber: '',
    mobileNo: '',
    date: new Date().toISOString().split('T')[0],
    amount: '12000',
    rrr: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const task = createTask(
        'supplementary-admission',
        {
          name: `${formData.surname} ${formData.otherNames}`.trim(),
          phone: formData.mobileNo,
          email: formData.email,
          isWalkIn: false
        },
        formData,
        [],
        'normal'
      );

      setIsSubmitting(false);
      showToast('Supplementary Form Submitted', `Task ${task.id} entered pipeline. Ref: ${task.trackingCode}`, 'success');
      if (onSuccess) onSuccess(task.id);
    }, 400);
  };

  return (
    <div className={standalone ? "official-form-container max-w-3xl mx-auto p-5 sm:p-7 md:p-9 bg-white shadow-xl rounded-2xl border border-slate-200 w-full" : "w-full"}>
      {/* Header Badge */}
      {standalone && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2.5">
            <ShieldCheck size={14} className="text-purple-600" />
            <span>BJ Services • Official FUTO Admissions Desk</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Supplementary Admission Form
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            FUTO Supplementary Admissions portal entry with JAMB CAPS compatibility check.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Candidate Identity & Choice */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: '#faf5ff', color: '#9333ea' }}>
              <GraduationCap size={18} />
            </div>
            <div>
              <h3 className="form-section-title">1. Candidate Details & Supplementary Choice</h3>
              <p className="text-xs text-slate-500">Specify your personal details and proposed course of study</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label>Surname <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="surname"
                placeholder="e.g. Nwosu"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Other Names <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="otherNames"
                placeholder="e.g. Chidera Precious"
                value={formData.otherNames}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label>Proposed Supplementary Course of Choice <span className="text-red-500 font-bold">*</span></label>
            <input
              type="text"
              name="supplementaryCourse"
              placeholder="e.g. Biomedical Technology / Information Technology"
              value={formData.supplementaryCourse}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Section 2: JAMB & Contact Verification */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: '#faf5ff', color: '#9333ea' }}>
              <Mail size={18} />
            </div>
            <div>
              <h3 className="form-section-title">2. JAMB Credentials & Contact Info</h3>
              <p className="text-xs text-slate-500">Must correspond with your JAMB CAPS profile</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label>JAMB Registration Number <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="jambRegNumber"
                placeholder="e.g. 202410984120EA"
                value={formData.jambRegNumber}
                onChange={handleChange}
                required
                className="font-mono tracking-wider uppercase"
              />
            </div>
            <div>
              <label>Active WhatsApp / Phone Number <span className="text-red-500 font-bold">*</span></label>
              <input
                type="tel"
                name="mobileNo"
                placeholder="e.g. 08061234567"
                value={formData.mobileNo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>Email Address <span className="text-red-500 font-bold">*</span></label>
              <input
                type="email"
                name="email"
                placeholder="e.g. candidate@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Application Date <span className="text-red-500 font-bold">*</span></label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Remita Payment Code */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: '#faf5ff', color: '#9333ea' }}>
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="form-section-title">3. Payment & Remita Billing Reference</h3>
              <p className="text-xs text-slate-500">Enter official invoice payment verification details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>Supplementary Form Fee (₦) <span className="text-red-500 font-bold">*</span></label>
              <input
                type="number"
                name="amount"
                placeholder="12000"
                value={formData.amount}
                onChange={handleChange}
                required
                className="font-mono"
              />
            </div>
            <div>
              <label>Remita Retrieval Reference (RRR) <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="rrr"
                placeholder="e.g. 1902-8410-4491"
                value={formData.rrr}
                onChange={handleChange}
                required
                className="font-mono tracking-wider"
              />
            </div>
          </div>
        </div>

        {/* Admissions Desk Verification Badge */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div className="font-bold text-slate-900 uppercase tracking-wide">
                FUTO Admissions Portal Gateway
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Verified against current FUTO Supplementary quota listings & JAMB CAPS transfer requirements.
              </div>
            </div>
          </div>
          <span className="shrink-0 bg-purple-100 text-purple-700 font-mono text-[10px] font-bold px-2.5 py-1 rounded-md border border-purple-200">
            ADMISSIONS-APPROVED
          </span>
        </div>

        {/* Official Fee Summary */}
        <div className="p-5 sm:p-6 rounded-2xl bg-purple-50/80 border border-purple-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-purple-900 tracking-wide">
                  Official Supplementary Processing Total
                </span>
                <span className="text-[10px] bg-purple-200/80 text-purple-800 font-bold px-2 py-0.5 rounded">
                  All Inclusive
                </span>
              </div>
              <div className="text-xs text-slate-600 mt-1">
                FUTO Supplementary Application: ₦12,000 • Admissions Desk Processing & Verification: ₦1,500
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-2xl font-black text-purple-700">₦13,500</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-purple-500/20 transition-all transform active:scale-[0.99] cursor-pointer"
        >
          {isSubmitting ? (
            <span>Transmitting to Admissions Desk...</span>
          ) : (
            <>
              <span>Submit Supplementary Form (₦13,500)</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
