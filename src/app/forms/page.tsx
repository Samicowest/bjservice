'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Breadcrumb from '../../components/Breadcrumb';
import TranscriptForm from '../../components/TranscriptForm';
import SupplementaryForm from '../../components/SupplementaryForm';
import SchoolFeesForm from '../../components/SchoolFeesForm';
import StudentBioDataForm from '../../components/StudentBioDataForm';
import PostUtmeForm from '../../components/PostUtmeForm';
import {
  FileText,
  GraduationCap,
  CreditCard,
  UserCheck,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Printer,
  Search
} from 'lucide-react';

type FormType = 'overview' | 'transcript' | 'supplementary' | 'school_fees' | 'bio_data' | 'post_utme';

function FormsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialType = (searchParams.get('type') as FormType) || 'overview';

  const [activeForm, setActiveForm] = useState<FormType>(
    ['transcript', 'supplementary', 'school_fees', 'bio_data', 'post_utme'].includes(initialType)
      ? initialType
      : 'overview'
  );

  const [lastSubmittedTask, setLastSubmittedTask] = useState<string | null>(null);

  useEffect(() => {
    const typeParam = searchParams.get('type') as FormType;
    if (typeParam && ['transcript', 'supplementary', 'school_fees', 'bio_data', 'post_utme'].includes(typeParam)) {
      setActiveForm(typeParam);
    }
  }, [searchParams]);

  const selectForm = (type: FormType) => {
    setActiveForm(type);
    setLastSubmittedTask(null);
    if (type === 'overview') {
      router.push('/forms');
    } else {
      router.push(`/forms?type=${type}`);
    }
  };

  const handleFormSuccess = (taskId: string) => {
    setLastSubmittedTask(taskId);
  };

  const formCards = [
    {
      id: 'transcript' as FormType,
      title: 'FUTO Academic Transcript Request',
      code: 'REG-TRN-01',
      desc: 'Official undergraduate and postgraduate transcript generation. Destination address, TPS code, and Remita clearance.',
      badge: 'Alumni & Final Year',
      turnaround: '24 - 48 Hours',
      icon: GraduationCap,
      color: '#0284c7'
    },
    {
      id: 'supplementary' as FormType,
      title: 'Supplementary Admission Form',
      code: 'ADM-SUP-02',
      desc: 'FUTO supplementary portal processing for changing courses or second choice admissions. Verified with admission office.',
      badge: 'Aspirants',
      turnaround: 'Same Day',
      icon: FileSpreadsheet,
      color: '#ea580c'
    },
    {
      id: 'school_fees' as FormType,
      title: 'School Fees & Remita Payment',
      code: 'FIN-REM-03',
      desc: 'Portal clearance invoice generation, Remita payment clearance, and official bursary stamped receipt for all faculties.',
      badge: '100L - 500L',
      turnaround: '15 Minutes',
      icon: CreditCard,
      color: '#16a34a'
    },
    {
      id: 'bio_data' as FormType,
      title: 'Student Bio-Data Verification',
      code: 'REG-BIO-04',
      desc: 'Comprehensive personal profile, next of kin, LGA indigene certification, and primary academic record verification.',
      badge: 'Freshers (100L)',
      turnaround: '20 Minutes',
      icon: UserCheck,
      color: '#7c3aed'
    },
    {
      id: 'post_utme' as FormType,
      title: 'Post-UTME Screening Form',
      code: 'ADM-PUT-05',
      desc: 'Screening registration, O-level breakdown submission, aggregate calculation, and verified venue printout.',
      badge: 'JAMB Candidates',
      turnaround: '15 Minutes',
      icon: FileText,
      color: '#0891b2'
    }
  ];

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 4rem' }}>
      <Breadcrumb
        items={[
          { label: 'Official Forms Desk', href: activeForm !== 'overview' ? '/forms' : undefined },
          ...(activeForm !== 'overview'
            ? [{ label: formCards.find((f) => f.id === activeForm)?.title || 'Fill Form' }]
            : [])
        ]}
      />

      {/* Hero Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2rem 2.25rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-inset) 100%)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div style={{ maxWidth: '660px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            <ShieldCheck size={16} />
            <span>FUTO ACCREDITED STUDENT DESK</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.35rem)', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Official Academic Forms & Document Processing
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: '0.6rem 0 0', lineHeight: 1.55 }}>
            Generate officially stamped, verified FUTO registry documents. Every submission enters our live pipeline, complete with tracking code and instant delivery download.
          </p>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/services" className="btn btn-outline" style={{ borderRadius: '12px', fontSize: '0.84rem' }}>
            <span>Browse Full Catalog</span>
          </Link>
          <Link href="/track" className="btn btn-primary" style={{ borderRadius: '12px', fontSize: '0.84rem' }}>
            <Search size={14} />
            <span>Track Submission</span>
          </Link>
        </div>
      </div>



      {/* Success Notification Banner if form just submitted */}
      {lastSubmittedTask && (
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            borderRadius: '16px',
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <CheckCircle2 size={24} color="var(--success)" />
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--success)', margin: 0 }}>
                Form Submitted Successfully!
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                Your task ID is <strong>{lastSubmittedTask}</strong>. It has been queued for immediate processing.
              </p>
            </div>
          </div>

          <Link
            href={`/track?code=${lastSubmittedTask}`}
            className="btn btn-primary btn-sm"
            style={{ borderRadius: '8px', fontSize: '0.8rem' }}
          >
            <span>Track Application Now →</span>
          </Link>
        </div>
      )}

      {/* View 1: Overview Grid of the 5 Official Forms */}
      {activeForm === 'overview' && (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}
          >
            {formCards.map((form) => {
              const Icon = form.icon;
              return (
                <div
                  key={form.id}
                  className="glass-card hover-lift"
                  style={{
                    padding: '1.5rem',
                    borderRadius: '20px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: 'var(--bg-card)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: `${form.color}15`,
                          color: form.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'var(--bg-inset)',
                          color: 'var(--text-dim)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        {form.code}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                      {form.title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {form.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                      <span>Target: <strong>{form.badge}</strong></span>
                      <span>Turnaround: <strong>{form.turnaround}</strong></span>
                    </div>

                    <button
                      onClick={() => selectForm(form.id)}
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem', borderRadius: '10px' }}
                    >
                      <span>Fill & Generate Form</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: Individual Form Components with Back Link */}
      {activeForm !== 'overview' && (
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <button
              onClick={() => selectForm('overview')}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', borderRadius: '8px' }}
            >
              <span>← Back to All Forms</span>
            </button>

            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              Form Code: {formCards.find((f) => f.id === activeForm)?.code}
            </span>
          </div>

          <div>
            {activeForm === 'transcript' && <TranscriptForm onSuccess={handleFormSuccess} standalone={true} />}
            {activeForm === 'supplementary' && <SupplementaryForm onSuccess={handleFormSuccess} standalone={true} />}
            {activeForm === 'school_fees' && <SchoolFeesForm onSuccess={handleFormSuccess} standalone={true} />}
            {activeForm === 'bio_data' && <StudentBioDataForm onSuccess={handleFormSuccess} standalone={true} />}
            {activeForm === 'post_utme' && <PostUtmeForm onSuccess={handleFormSuccess} standalone={true} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FormsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>Loading Official Forms Desk...</div>}>
      <FormsContent />
    </Suspense>
  );
}
