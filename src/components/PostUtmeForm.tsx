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
    <div className={standalone ? "official-form-container max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-white shadow-xl rounded-2xl border border-slate-200 w-full" : "w-full"}>
      {/* Header Badge */}
      {standalone && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
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
      <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50 border border-amber-200 mb-5 sm:mb-6 flex items-start gap-3">
        <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-extrabold uppercase tracking-wide block mb-0.5">
            Mandatory O&apos;Level JAMB CAPS Verification:
          </strong>
          Make sure your complete WAEC/NECO/NABTEB grades are uploaded to the JAMB central admission portal. BJ Services verifies and uploads this simultaneously to prevent admission forfeitures.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Section 1: Candidate Identity */}
        <div className="p-3.5 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-slate-200">
            <User size={18} className="text-blue-600 shrink-0" />
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              1. Candidate Biodata & Preferred Course
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label>Surname *</label>
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
              <label>First Name *</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
            <div>
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Gender / Sex *</label>
              <select name="sex" className="form-select" value={formData.sex} onChange={handleChange} required>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label>State of Origin *</label>
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
              <label>L.G.A *</label>
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

          <div className="mt-3">
            <label>First Choice Course of Study in FUTO *</label>
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
        <div className="p-3.5 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-slate-200">
            <Phone size={18} className="text-blue-600 shrink-0" />
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              2. JAMB Registration & Contact Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label>JAMB Registration Number *</label>
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
              <label>WhatsApp / Phone Number *</label>
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
              <label>Email Address *</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
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
              <label>Candidate Contact Address *</label>
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
        <div className="p-3.5 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-slate-200">
            <User size={18} className="text-blue-600 shrink-0" />
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              3. Parent / Sponsor Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label>Sponsor Full Name *</label>
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
              <label>Relationship *</label>
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
              <label>Sponsor Phone Number *</label>
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
        <div className="p-3.5 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3.5 pb-2 border-b border-slate-200 gap-2">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-rose-600 shrink-0" />
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                4. 1st Sitting O&apos;Level Scratch Card & Examination
              </h3>
            </div>
            <span className="self-start sm:self-auto text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
              WAEC / NECO / NABTEB
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label>Scratch Card PIN *</label>
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
              <label>Scratch Card Serial Number *</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div>
              <label>Exam Centre Name / Code *</label>
              <input
                type="text"
                name="sitting1ExamCenter"
                placeholder="e.g. FUTO Int'l Secondary School"
                value={formData.sitting1ExamCenter}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Examination Number *</label>
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
              <label>Exam Year *</label>
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
        <div className="p-3.5 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3.5 pb-2 border-b border-slate-200 gap-2">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-slate-500 shrink-0" />
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                5. 2nd Sitting O&apos;Level Examination (Optional)
              </h3>
            </div>
            <span className="self-start sm:self-auto text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
              If Combining Results
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
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
        <div className="p-4 sm:p-5 rounded-xl bg-rose-50/70 border border-rose-200">
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
