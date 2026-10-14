'use client';

import React, { useState } from 'react';
import { useCyber } from '../context/CyberContext';
import { GraduationCap, ShieldCheck, CreditCard, Lock, Calendar, Phone, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface SchoolFeesFormProps {
  onSuccess?: (taskId: string) => void;
  standalone?: boolean;
}

export default function SchoolFeesForm({ onSuccess, standalone = true }: SchoolFeesFormProps) {
  const { createTask, showToast } = useCyber();
  const [formData, setFormData] = useState({
    surname: '',
    otherNames: '',
    school: '',
    dept: '',
    level: '',
    category: 'UNDERGRADUATE',
    session: '',
    applNo: '',
    matricOrJambNo: '',
    futoPortalPassword: '',
    mobileNo: '',
    date: new Date().toISOString().split('T')[0],
    amount: '52000',
    rrr: '',
    payUpBalanceRrr: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const task = createTask(
        'futo-school-fees',
        {
          name: `${formData.surname} ${formData.otherNames}`.trim(),
          phone: formData.mobileNo,
          email: '',
          isWalkIn: false
        },
        formData,
        [],
        'normal'
      );

      setIsSubmitting(false);
      showToast('School Fees Form Submitted', `Task ${task.id} entered pipeline. Ref: ${task.trackingCode}`, 'success');
      if (onSuccess) onSuccess(task.id);
    }, 400);
  };

  const categories = [
    { id: 'UNDERGRADUATE', label: 'Undergraduate' },
    { id: 'PG', label: 'Postgraduate (PG)' },
    { id: 'JUPEB', label: 'JUPEB' },
    { id: 'PRE-DEGREE', label: 'Pre-Degree' },
  ];

  return (
    <div className={standalone ? "official-form-container max-w-3xl mx-auto p-5 sm:p-7 md:p-9 bg-white shadow-xl rounded-2xl border border-slate-200 w-full" : "w-full"}>
      {/* Header Badge */}
      {standalone && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>BJ Services • Official FUTO Portal Clearance Desk</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            School Fees Clearance Form
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Direct payment verification, Remita RRR generation, and FUTO portal course clearance stamping.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selector Pills */}
        <div className="form-section-card">
          <label className="text-sm font-bold text-slate-800 mb-3 block">
            Academic Category / Degree Level <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {categories.map((cat) => {
              const active = formData.category === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`py-3 px-3 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 1: Student Identity & Faculty */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <GraduationCap size={18} />
            </div>
            <div>
              <h3 className="form-section-title">1. Student Identity & Faculty</h3>
              <p className="text-xs text-slate-500">Provide personal profile as recorded on the FUTO student portal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label>Surname <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="surname"
                placeholder="e.g. Anyanwu"
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
                placeholder="e.g. Kelechi Emmanuel"
                value={formData.otherNames}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label>School / Faculty <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="school"
                placeholder="e.g. SEET / SICT / SOES"
                value={formData.school}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Department <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="dept"
                placeholder="e.g. Mechanical Eng."
                value={formData.dept}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Current Level <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="level"
                placeholder="e.g. 100L / 200L / 500L"
                value={formData.level}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: FUTO Portal & Matric Records */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <Lock size={18} />
            </div>
            <div>
              <h3 className="form-section-title">2. FUTO Portal & Academic Registration</h3>
              <p className="text-xs text-slate-500">Portal credentials to authenticate course registration clearance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label>Session You Want to Pay <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="session"
                placeholder="e.g. 2023/2024"
                value={formData.session}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Matric No. / JAMB Reg. No. <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="matricOrJambNo"
                placeholder="e.g. 20211104812"
                value={formData.matricOrJambNo}
                onChange={handleChange}
                required
                className="font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label>
                Application No. <span className="text-slate-400 font-normal">(PG / JUPEB only)</span>
              </label>
              <input
                type="text"
                name="applNo"
                placeholder="e.g. FUTO/PG/2024/0912"
                value={formData.applNo}
                onChange={handleChange}
                className="font-mono"
              />
            </div>

            <div>
              <label>FUTO Portal Password <span className="text-red-500 font-bold">*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="futoPortalPassword"
                  placeholder="Enter portal password"
                  value={formData.futoPortalPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>Mobile Number (SMS Alert) <span className="text-red-500 font-bold">*</span></label>
              <input
                type="tel"
                name="mobileNo"
                placeholder="e.g. 08123456789"
                value={formData.mobileNo}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Submission Date <span className="text-red-500 font-bold">*</span></label>
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

        {/* Section 3: Remita & Payment Invoice */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="form-section-title">3. Remita Billing & Payment Information</h3>
              <p className="text-xs text-slate-500">Provide generated Remita Retrieval Reference or billing amount</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label>Invoice Amount (₦) <span className="text-red-500 font-bold">*</span></label>
              <input
                type="number"
                name="amount"
                placeholder="52000"
                value={formData.amount}
                onChange={handleChange}
                required
                className="font-mono"
              />
            </div>
            <div>
              <label>Remita RRR <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="rrr"
                placeholder="e.g. 3401-2091-8841"
                value={formData.rrr}
                onChange={handleChange}
                required
                className="font-mono"
              />
            </div>
            <div>
              <label>Pay-up Balance RRR</label>
              <input
                type="text"
                name="payUpBalanceRrr"
                placeholder="If split payment"
                value={formData.payUpBalanceRrr}
                onChange={handleChange}
                className="font-mono"
              />
            </div>
          </div>
        </div>

        {/* Digital Front Desk Audit Verification Badge */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div className="font-bold text-slate-900 uppercase tracking-wide">
                Digital Registry Verification Switch
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Auto-assigned to front desk operator with electronic receipt stamping upon payment confirmation.
              </div>
            </div>
          </div>
          <span className="shrink-0 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-200">
            FUTO-PORTAL-V3
          </span>
        </div>

        {/* Official Fee Summary */}
        <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-emerald-900 tracking-wide">
                  Official School Fees Clearance Total
                </span>
                <span className="text-[10px] bg-emerald-200/80 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  All Fees Included
                </span>
              </div>
              <div className="text-xs text-slate-600 mt-1">
                FUTO Remita Portal Invoice: ₦52,000 • Desk Processing & Clearance Stamp: ₦2,000
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-2xl font-black text-emerald-700">₦54,000</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform active:scale-[0.99] cursor-pointer"
        >
          {isSubmitting ? (
            <span>Processing FUTO Clearance...</span>
          ) : (
            <>
              <span>Submit School Fees Form (₦54,000)</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
