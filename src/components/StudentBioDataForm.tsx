'use client';

import React, { useState } from 'react';
import { useCyber } from '../context/CyberContext';
import { User, ShieldCheck, MapPin, Users, GraduationCap, Lock, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface StudentBioDataFormProps {
  onSuccess?: (taskId: string) => void;
  standalone?: boolean;
}

export default function StudentBioDataForm({ onSuccess, standalone = true }: StudentBioDataFormProps) {
  const { createTask, showToast } = useCyber();
  const [formData, setFormData] = useState({
    jambRegNo: '',
    surname: '',
    firstName: '',
    middleName: '',
    emailAddress: '',
    password: '',
    state: '',
    lga: '',
    sex: 'MALE',
    dob: '',
    homeTown: '',
    bloodGroup: 'O+',
    genotype: 'AA',
    contactAddress: '',
    permanentAddress: '',
    phoneNo: '',
    religion: 'Christianity',
    maritalStatus: 'Single',
    nin: '',
    sponsorSurname: '',
    sponsorFirstName: '',
    sponsorMiddleName: '',
    sponsorPhoneNo: '',
    sponsorRelationship: 'Parent',
    sponsorAddress: '',
    nextOfKinSurname: '',
    nextOfKinFirstName: '',
    nextOfKinMiddleName: '',
    nextOfKinPhoneNo: '',
    nextOfKinRelationship: 'Sibling',
    nextOfKinAddress: '',
    department: '',
    modeOfEntry: 'UTME',
    studentType: 'UNDERGRADUATE',
    modeOfStudy: 'FULL TIME',
    entryYear: '2024/2025',
    entryLevel: '100 Level',
    yearOfStudy: 'Year 1',
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
        'student-bio-data',
        {
          name: `${formData.surname} ${formData.firstName} ${formData.middleName}`.trim(),
          phone: formData.phoneNo,
          email: formData.emailAddress,
          isWalkIn: false
        },
        formData,
        [],
        'normal'
      );

      setIsSubmitting(false);
      showToast('Bio Data Form Submitted', `Task ${task.id} entered pipeline. Ref: ${task.trackingCode}`, 'success');
      if (onSuccess) onSuccess(task.id);
    }, 400);
  };

  return (
    <div className={standalone ? "official-form-container max-w-3xl mx-auto p-5 sm:p-7 md:p-9 bg-white shadow-xl rounded-2xl border border-slate-200 w-full" : "w-full"}>
      {/* Header Badge */}
      {standalone && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2.5">
            <ShieldCheck size={14} className="text-orange-600" />
            <span>BJ Services • Official FUTO Registry Profile Desk</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Bio-Data & Portal Enrolment Form
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
            Complete official institutional record form for FUTO Edu-Portal database sync, smart ID profile & matriculation clearance.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Details */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
              <User size={18} />
            </div>
            <div>
              <h3 className="form-section-title">1. Personal Identity & Vital Details</h3>
              <p className="text-xs text-slate-500">Official student biodata for biometric portal registration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label>JAMB Registration Number <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="jambRegNo"
                placeholder="e.g. 20241098412"
                value={formData.jambRegNo}
                onChange={handleChange}
                required
                className="font-mono tracking-wide"
              />
            </div>
            <div>
              <label>Surname <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="surname"
                placeholder="e.g. Eze"
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
                placeholder="e.g. Chinedu"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label>Middle Name</label>
              <input
                type="text"
                name="middleName"
                placeholder="e.g. Kenneth"
                value={formData.middleName}
                onChange={handleChange}
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
              <label>Date of Birth <span className="text-red-500 font-bold">*</span></label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label>Blood Group <span className="text-red-500 font-bold">*</span></label>
              <select name="bloodGroup" className="form-select" value={formData.bloodGroup} onChange={handleChange} required>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div>
              <label>Genotype <span className="text-red-500 font-bold">*</span></label>
              <select name="genotype" className="form-select" value={formData.genotype} onChange={handleChange} required>
                <option value="AA">AA</option>
                <option value="AS">AS</option>
                <option value="SS">SS</option>
                <option value="AC">AC</option>
              </select>
            </div>
            <div>
              <label>State of Origin <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="state"
                placeholder="e.g. Imo State"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>L.G.A <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="lga"
                placeholder="e.g. Owerri West"
                value={formData.lga}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label>Hometown</label>
              <input
                type="text"
                name="homeTown"
                placeholder="e.g. Ihiagwa"
                value={formData.homeTown}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Religion</label>
              <select name="religion" className="form-select" value={formData.religion} onChange={handleChange}>
                <option value="Christianity">Christianity</option>
                <option value="Islam">Islam</option>
                <option value="Other">Other</option>
              </select>
            </div>
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
          </div>
        </div>

        {/* Section 2: Contact Information & Portal Access */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
              <Lock size={18} />
            </div>
            <div>
              <h3 className="form-section-title">2. Portal Login & Residential Addresses</h3>
              <p className="text-xs text-slate-500">Security password and address details for postal records</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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
            <div>
              <label>Phone Number <span className="text-red-500 font-bold">*</span></label>
              <input
                type="tel"
                name="phoneNo"
                placeholder="e.g. 08101234567"
                value={formData.phoneNo}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>FUTO Portal Password <span className="text-red-500 font-bold">*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create portal password"
                  value={formData.password}
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
              <label>Residential Contact Address <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="contactAddress"
                placeholder="e.g. Hostel B, Room 204, FUTO Campus"
                value={formData.contactAddress}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Permanent Home Address <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="permanentAddress"
                placeholder="e.g. 14 Wetheral Road, Owerri, Imo State"
                value={formData.permanentAddress}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Sponsor & Next of Kin Details */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
              <Users size={18} />
            </div>
            <div>
              <h3 className="form-section-title">3. Sponsor & Next of Kin Records</h3>
              <p className="text-xs text-slate-500">Contact information in case of institutional emergency</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Sponsor */}
            <div className="p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-3">
                Sponsor Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label>Sponsor Surname <span className="text-red-500 font-bold">*</span></label>
                  <input
                    type="text"
                    name="sponsorSurname"
                    placeholder="Surname"
                    value={formData.sponsorSurname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>First Name <span className="text-red-500 font-bold">*</span></label>
                  <input
                    type="text"
                    name="sponsorFirstName"
                    placeholder="First name"
                    value={formData.sponsorFirstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Phone Number <span className="text-red-500 font-bold">*</span></label>
                  <input
                    type="tel"
                    name="sponsorPhoneNo"
                    placeholder="Phone"
                    value={formData.sponsorPhoneNo}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label>Relationship <span className="text-red-500 font-bold">*</span></label>
                  <input
                    type="text"
                    name="sponsorRelationship"
                    placeholder="e.g. Father / Mother / Guardian"
                    value={formData.sponsorRelationship}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Sponsor Address <span className="text-red-500 font-bold">*</span></label>
                  <input
                    type="text"
                    name="sponsorAddress"
                    placeholder="Full residential or office address"
                    value={formData.sponsorAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Next of Kin */}
            <div className="p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-3">
                Next of Kin Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label>Next of Kin Surname <span className="text-red-500 font-bold">*</span></label>
                  <input
                    type="text"
                    name="nextOfKinSurname"
                    placeholder="Surname"
                    value={formData.nextOfKinSurname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>First Name <span className="text-red-500 font-bold">*</span></label>
                  <input
                    type="text"
                    name="nextOfKinFirstName"
                    placeholder="First name"
                    value={formData.nextOfKinFirstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Phone Number <span className="text-red-500 font-bold">*</span></label>
                  <input
                    type="tel"
                    name="nextOfKinPhoneNo"
                    placeholder="Phone"
                    value={formData.nextOfKinPhoneNo}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label>Relationship <span className="text-red-500 font-bold">*</span></label>
                  <input
                    type="text"
                    name="nextOfKinRelationship"
                    placeholder="e.g. Brother / Sister / Uncle"
                    value={formData.nextOfKinRelationship}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Next of Kin Address <span className="text-red-500 font-bold">*</span></label>
                  <input
                    type="text"
                    name="nextOfKinAddress"
                    placeholder="Full address"
                    value={formData.nextOfKinAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Academic Programme Details */}
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
              <GraduationCap size={18} />
            </div>
            <div>
              <h3 className="form-section-title">4. Academic Enrolment & Programme</h3>
              <p className="text-xs text-slate-500">Degree details matching your admission letter</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label>Department / Course <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="department"
                placeholder="e.g. Computer Science"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Mode of Entry <span className="text-red-500 font-bold">*</span></label>
              <select name="modeOfEntry" className="form-select" value={formData.modeOfEntry} onChange={handleChange} required>
                <option value="UTME">UTME (JAMB)</option>
                <option value="DIRECT_ENTRY">Direct Entry (DE)</option>
                <option value="TRANSFER">Inter-University Transfer</option>
                <option value="PRE-DEGREE">Pre-Degree</option>
                <option value="JUPEB">JUPEB</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label>Student Type <span className="text-red-500 font-bold">*</span></label>
              <select name="studentType" className="form-select" value={formData.studentType} onChange={handleChange} required>
                <option value="UNDERGRADUATE">Undergraduate</option>
                <option value="POSTGRADUATE">Postgraduate</option>
                <option value="JUPEB">JUPEB</option>
                <option value="PRE-DEGREE">Pre-Degree</option>
              </select>
            </div>
            <div>
              <label>Mode of Study <span className="text-red-500 font-bold">*</span></label>
              <select name="modeOfStudy" className="form-select" value={formData.modeOfStudy} onChange={handleChange} required>
                <option value="FULL TIME">Full Time</option>
                <option value="PART TIME">Part Time</option>
              </select>
            </div>
            <div>
              <label>Entry Level <span className="text-red-500 font-bold">*</span></label>
              <select name="entryLevel" className="form-select" value={formData.entryLevel} onChange={handleChange} required>
                <option value="100 Level">100 Level</option>
                <option value="200 Level">200 Level</option>
                <option value="300 Level">300 Level</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
            <div>
              <label>Entry Academic Year <span className="text-red-500 font-bold">*</span></label>
              <input
                type="text"
                name="entryYear"
                placeholder="e.g. 2024/2025"
                value={formData.entryYear}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Official Fee Summary */}
        <div className="p-5 sm:p-6 rounded-2xl bg-orange-50/80 border border-orange-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-orange-900 tracking-wide">
                  Official Bio-Data Portal Registration Fee
                </span>
                <span className="text-[10px] bg-orange-200/80 text-orange-800 font-bold px-2 py-0.5 rounded">
                  FUTO Standard
                </span>
              </div>
              <div className="text-xs text-slate-600 mt-1">
                FUTO Profile Registration: ₦2,000 • Bio-Data Clearance & Laminated Slip: ₦500
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-2xl font-black text-orange-700">₦2,500</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/20 transition-all transform active:scale-[0.99] cursor-pointer"
        >
          {isSubmitting ? (
            <span>Synchronizing Registry Records...</span>
          ) : (
            <>
              <span>Submit Bio Data Form (₦2,500)</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
