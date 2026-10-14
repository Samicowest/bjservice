'use client';

import React, { useState } from 'react';
import { useCyber } from '../context/CyberContext';
import { ShieldCheck, AlertCircle, Award, User, Phone, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface PostUtmeFormProps {
  onSuccess?: (taskId: string) => void;
  standalone?: boolean;
}

export default function PostUtmeForm({ onSuccess, standalone = true }: PostUtmeFormProps) {
  const { createTask, showToast } = useCyber();
  const [formData, setFormData] = useState({
    surname: '',
    firstName: '',
    otherNames: '',
    dateOfBirth: '',
    sex: 'MALE',
    stateOfOrigin: '',
    lga: '',
    course: '',
    candidateContactAddress: '',
    nin: '',
    phoneNo: '',
    email: '',
    sponsorName: '',
    sponsorRelationship: '',
    sponsorPhoneNo: '',
    jambRegNo: '',
    // 1st Sitting O'Level
    sitting1Pin: '',
    sitting1SerialNo: '',
    sitting1ExamCenter: '',
    sitting1ExamNo: '',
    sitting1Year: '',
    // 2nd Sitting O'Level
    sitting2Pin: '',
    sitting2SerialNo: '',
    sitting2ExamCenter: '',
    sitting2ExamNo: '',
    sitting2Year: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const task = createTask(
        'online-app-post-utme',
        {
          name: `${formData.surname} ${formData.firstName} ${formData.otherNames}`.trim(),
          phone: formData.phoneNo,
          email: formData.email,
          isWalkIn: false
        },
        formData,
        [],
        'normal'
      );

      setIsSubmitting(false);
      showToast('Post UTME Form Submitted', `Task ${task.id} entered pipeline. Ref: ${task.trackingCode}`, 'success');
      if (onSuccess) onSuccess(task.id);
    }, 400);
  };

  return (
    <div className={standalone ? "official-form-container max-w-3xl mx-auto p-5 sm:p-7 md:p-9 bg-white shadow-xl rounded-2xl border border-slate-200 w-full" : "w-full"}>
      {/* Header Badge */}
      {standalone && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2.5">
            <ShieldCheck size={14} className="text-rose-600" />
            <span>BJ Services • Accredited FUTO CBT & Registration Hub</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Post-UTME Online Screening Registration
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
            Official FUTO admission screening clearance with direct JAMB CAPS O&apos;Level result synchronization.
          </p>
        </div>
      )}

      {/* Mandatory JAMB CAPS Warning Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 mb-6 flex items-start gap-3.5">
        <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-extrabold uppercase tracking-wide block mb-1">
            Mandatory O&apos;Level JAMB CAPS Verification:
          </strong>
          Make sure your complete WAEC/NECO/NABTEB grades are uploaded to the JAMB central admission portal. BJ Services verifies and uploads this simultaneously to prevent admission forfeitures.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Candidate Identity */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: '#fff1f2', color: '#e11d48' }}>
              <User size={18} />
            </div>
            <div>
              <h3 className="form-section-title">1. Candidate Biodata & Preferred Course</h3>
              <p className="text-xs text-slate-500">Provide basic identity details as registered on JAMB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label>Surname <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="surname"
                placeholder="e.g. Maduabuchi"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>First Name <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="firstName"
                placeholder="e.g. Somtochukwu"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Other Names</label>
              <input
                type="text"
                name="otherNames"
                placeholder="e.g. Bryan"
                value={formData.otherNames}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label>Date of Birth <span className="text-red-500 font-bold">*</span></label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Gender / Sex <span className="text-red-500 font-bold">*</span></label>
              <select name="sex" className="form-select" value={formData.sex} onChange={handleChange} required>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label>State of Origin <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="stateOfOrigin"
                placeholder="e.g. Anambra"
                value={formData.stateOfOrigin}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>L.G.A <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="lga"
                placeholder="e.g. Idemili North"
                value={formData.lga}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label>First Choice Course of Study in FUTO <span className="text-red-500 font-bold">*</span></label>
            <input
              type="text"
              name="course"
              placeholder="e.g. Computer Science / Petroleum Engineering"
              value={formData.course}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Section 2: JAMB & Contact Information */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: '#fff1f2', color: '#e11d48' }}>
              <Phone size={18} />
            </div>
            <div>
              <h3 className="form-section-title">2. JAMB Registration & Contact Details</h3>
              <p className="text-xs text-slate-500">Official candidate credentials for portal validation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label>JAMB Registration Number <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="jambRegNo"
                placeholder="e.g. 202410492819GA"
                value={formData.jambRegNo}
                onChange={handleChange}
                required
                className="font-mono tracking-wider uppercase"
              />
            </div>
            <div>
              <label>WhatsApp / Phone Number <span className="text-red-500 font-bold">*</span></label>
              <input
                type="tel"
                name="phoneNo"
                placeholder="e.g. 08149876543"
                value={formData.phoneNo}
                onChange={handleChange}
                required
              />
            </div>
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>National ID No. (NIN)</label>
              <input
                type="text"
                name="nin"
                placeholder="11-digit NIN"
                maxLength={11}
                value={formData.nin}
                onChange={handleChange}
                className="font-mono tracking-wider"
              />
            </div>
            <div>
              <label>Candidate Contact Address <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="candidateContactAddress"
                placeholder="Residential address"
                value={formData.candidateContactAddress}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Sponsor Profile */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: '#fff1f2', color: '#e11d48' }}>
              <User size={18} />
            </div>
            <div>
              <h3 className="form-section-title">3. Parent / Sponsor Profile</h3>
              <p className="text-xs text-slate-500">Contact details for guardian or sponsor</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label>Sponsor Full Name <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="sponsorName"
                placeholder="e.g. Chief John Maduabuchi"
                value={formData.sponsorName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Relationship <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="sponsorRelationship"
                placeholder="e.g. Father / Mother"
                value={formData.sponsorRelationship}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Sponsor Phone Number <span className="text-red-500 font-bold">*</span></label>
              <input
                type="tel"
                name="sponsorPhoneNo"
                placeholder="e.g. 08031234567"
                value={formData.sponsorPhoneNo}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 4: 1st Sitting O'Level */}
        <div className="form-section-card">
          <div className="form-section-header flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="form-section-icon" style={{ background: '#fff1f2', color: '#e11d48' }}>
                <Award size={18} />
              </div>
              <div>
                <h3 className="form-section-title">4. 1st Sitting O&apos;Level Scratch Card & Examination</h3>
                <p className="text-xs text-slate-500">Required for official online result verification</p>
              </div>
            </div>
            <span className="self-start sm:self-auto text-[10px] font-bold bg-rose-100 text-rose-700 px-2.5 py-1 rounded border border-rose-200">
              WAEC / NECO / NABTEB
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label>Scratch Card PIN <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="sitting1Pin"
                placeholder="e.g. 8401 2910 4019"
                value={formData.sitting1Pin}
                onChange={handleChange}
                className="font-mono tracking-wider"
              />
            </div>
            <div>
              <label>Scratch Card Serial Number <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="sitting1SerialNo"
                placeholder="e.g. WRC2024810291"
                value={formData.sitting1SerialNo}
                onChange={handleChange}
                className="font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label>Exam Centre Name / Code <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="sitting1ExamCenter"
                placeholder="e.g. FUTO Int'l Secondary School"
                value={formData.sitting1ExamCenter}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Examination Number <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="sitting1ExamNo"
                placeholder="e.g. 4120918204"
                value={formData.sitting1ExamNo}
                onChange={handleChange}
                className="font-mono"
              />
            </div>
            <div>
              <label>Exam Year <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="sitting1Year"
                placeholder="e.g. 2024"
                value={formData.sitting1Year}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Section 5: 2nd Sitting O'Level (Optional) */}
        <div className="form-section-card">
          <div className="form-section-header flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="form-section-icon" style={{ background: '#f1f5f9', color: '#64748b' }}>
                <Award size={18} />
              </div>
              <div>
                <h3 className="form-section-title">5. 2nd Sitting O&apos;Level Examination (Optional)</h3>
                <p className="text-xs text-slate-500">Fill only if combining results across two sittings</p>
              </div>
            </div>
            <span className="self-start sm:self-auto text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded border border-slate-200">
              If Combining Results
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label>Scratch Card PIN</label>
              <input
                type="text"
                name="sitting2Pin"
                placeholder="Optional PIN"
                value={formData.sitting2Pin}
                onChange={handleChange}
                className="font-mono tracking-wider"
              />
            </div>
            <div>
              <label>Serial Number</label>
              <input
                type="text"
                name="sitting2SerialNo"
                placeholder="Optional Serial"
                value={formData.sitting2SerialNo}
                onChange={handleChange}
                className="font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label>Exam Centre Name / Code</label>
              <input
                type="text"
                name="sitting2ExamCenter"
                placeholder="Exam center"
                value={formData.sitting2ExamCenter}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Examination Number</label>
              <input
                type="text"
                name="sitting2ExamNo"
                placeholder="Exam number"
                value={formData.sitting2ExamNo}
                onChange={handleChange}
                className="font-mono"
              />
            </div>
            <div>
              <label>Exam Year</label>
              <input
                type="text"
                name="sitting2Year"
                placeholder="e.g. 2023"
                value={formData.sitting2Year}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Official Fee Summary */}
        <div className="p-5 sm:p-6 rounded-2xl bg-rose-50/80 border border-rose-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-rose-900 tracking-wide">
                  Official Post-UTME Registration Fee
                </span>
                <span className="text-[10px] bg-rose-200/80 text-rose-800 font-bold px-2 py-0.5 rounded">
                  Screening & CAPS Sync
                </span>
              </div>
              <div className="text-xs text-slate-600 mt-1">
                FUTO Screening Portal Invoice: ₦2,500 • O&apos;Level Verification & Laminated Slip: ₦1,000
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-2xl font-black text-rose-700">₦3,500</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-rose-500/20 transition-all transform active:scale-[0.99] cursor-pointer"
        >
          {isSubmitting ? (
            <span>Validating O&apos;Level & JAMB CAPS...</span>
          ) : (
            <>
              <span>Submit Post UTME Form (₦3,500)</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
