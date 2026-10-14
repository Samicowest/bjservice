'use client';

import React, { useState } from 'react';
import { useCyber } from '../context/CyberContext';
import { GraduationCap, Mail, Phone, Building, MapPin, CreditCard, ShieldCheck, ArrowRight } from 'lucide-react';

interface TranscriptFormProps {
  onSuccess?: (taskId: string) => void;
  standalone?: boolean;
}

export default function TranscriptForm({ onSuccess, standalone = true }: TranscriptFormProps) {
  const { createTask, showToast } = useCyber();
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    phoneNumber: '',
    emailAddress: '',
    matricNumber: '',
    department: '',
    programme: '',
    dateOfGraduation: '',
    institutionName: '',
    address: '',
    rrr: '',
    tpsCode: '',
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
        'remita-transcript',
        {
          name: `${formData.lastName} ${formData.firstName} ${formData.middleName}`.trim(),
          phone: formData.phoneNumber,
          email: formData.emailAddress,
          isWalkIn: false
        },
        formData,
        [],
        'normal'
      );

      setIsSubmitting(false);
      showToast('Transcript Order Queued', `Task ${task.id} entered pipeline. Ref: ${task.trackingCode}`, 'success');
      if (onSuccess) onSuccess(task.id);
    }, 400);
  };

  return (
    <div className={standalone ? "official-form-container max-w-3xl mx-auto p-5 sm:p-7 md:p-9 bg-white shadow-xl rounded-2xl border border-slate-200 w-full" : "w-full"}>
      {/* Header Badge (Shown if standalone) */}
      {standalone && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2.5">
            <ShieldCheck size={14} className="text-blue-600" />
            <span>BJ Services • Official FUTO Registry Desk</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Transcript Processing Application
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Accredited academic records processing with FUTO Records & Registry electronic verification.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Academic & Student Identity */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon">
              <GraduationCap size={18} />
            </div>
            <div>
              <h3 className="form-section-title">1. Student & Academic Profile</h3>
              <p className="text-xs text-slate-500">Provide accurate details matching your official FUTO student records</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label>Last Name / Surname <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="lastName"
                placeholder="e.g. Okonkwo"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>First Name <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="firstName"
                placeholder="e.g. Chukwuemeka"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Middle Name</label>
              <input
                type="text"
                name="middleName"
                placeholder="e.g. David"
                value={formData.middleName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label>Matriculation Number <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="matricNumber"
                placeholder="e.g. 20181094821"
                value={formData.matricNumber}
                onChange={handleChange}
                required
                className="font-mono"
              />
            </div>
            <div>
              <label>Department / Discipline <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="department"
                placeholder="e.g. Electrical & Electronic Eng."
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>Programme of Study <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="programme"
                placeholder="e.g. B.Eng (Regular / Weekend)"
                value={formData.programme}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Graduation Date (or Month/Year) <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="dateOfGraduation"
                placeholder="DD/MM/YYYY or Nov 2023"
                value={formData.dateOfGraduation}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Details */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon">
              <Phone size={18} />
            </div>
            <div>
              <h3 className="form-section-title">2. Applicant Contact Information</h3>
              <p className="text-xs text-slate-500">For SMS updates and official verification confirmations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>Active WhatsApp / Phone Number <span className="text-red-500 font-bold">*</span></label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="e.g. 08031234567"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Official Email Address <span className="text-red-500 font-bold">*</span></label>
              <input
                type="email"
                name="emailAddress"
                placeholder="e.g. student@futo.edu.ng"
                value={formData.emailAddress}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Destination Address */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon">
              <Building size={18} />
            </div>
            <div>
              <h3 className="form-section-title">3. Destination Institution & Dispatch</h3>
              <p className="text-xs text-slate-500">Where the official sealed or digital transcript will be delivered</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label>Recipient Institution / Organization <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="institutionName"
                placeholder="e.g. World Education Services (WES) / University of Toronto"
                value={formData.institutionName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Full Postal / Courier Delivery Address <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="address"
                placeholder="e.g. Office of the Registrar, 10 King's College Circle, Toronto ON M5S 3K1, Canada"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 4: Remita & Verification Keys */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon">
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="form-section-title">4. Payment & Verification Keys (Optional)</h3>
              <p className="text-xs text-slate-500">Provide existing reference numbers or leave blank for desk auto-generation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>Remita Retrieval Reference (RRR)</label>
              <input
                type="text"
                name="rrr"
                placeholder="e.g. 2804-9812-4019"
                value={formData.rrr}
                onChange={handleChange}
                className="font-mono tracking-wider"
              />
            </div>
            <div>
              <label>TPS / Tracking Code (If any)</label>
              <input
                type="text"
                name="tpsCode"
                placeholder="e.g. TPS-2024-FUTO-09"
                value={formData.tpsCode}
                onChange={handleChange}
                className="font-mono"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            ℹ️ If you do not have an RRR yet, our cybercafe desk will generate and verify one automatically upon order queueing.
          </p>
        </div>

        {/* Official Fee Summary Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/80 border border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-blue-900 tracking-wide">
                  Official Transcript Clearance Fee
                </span>
                <span className="text-[10px] bg-blue-200/80 text-blue-800 font-bold px-2 py-0.5 rounded">
                  FUTO Approved
                </span>
              </div>
              <div className="text-xs text-slate-600 mt-1">
                FUTO Base Registry Processing: ₦15,000 • Desk Courier Packaging & Verification: ₦2,000
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-2xl font-black text-blue-700">₦17,000</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.99] cursor-pointer"
        >
          {isSubmitting ? (
            <span>Securing & Submitting...</span>
          ) : (
            <>
              <span>Submit Transcript Application (₦17,000)</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
