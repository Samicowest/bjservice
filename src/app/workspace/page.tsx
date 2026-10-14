'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';
import { useCyber } from '../../context/CyberContext';
import {
  Laptop,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Check,
  ChevronRight,
  Download,
  Copy
} from 'lucide-react';

export default function WorkspacePage() {
  const { showToast, siteSettings } = useCyber();

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [userType, setUserType] = useState('undergraduate');
  const [planId, setPlanId] = useState('plan-day');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Pass State
  const [generatedPass, setGeneratedPass] = useState<{
    passId: string;
    wifiVoucher: string;
    guestName: string;
    planName: string;
    planPrice: number;
    deskNumber: string;
    ssid: string;
    date: string;
    timeSlot: string;
  } | null>(null);

  const workspacePlans = [
    {
      id: 'plan-day',
      name: 'Full Day Focus Pass',
      price: 800,
      duration: 'Full Day (8:00 AM – 8:00 PM)',
      popular: true,
      badge: 'MOST POPULAR',
      features: [
        'High-Speed 150 Mbps Fibre WiFi Included',
        'Dedicated AC Power Socket at Desk',
        'Air-Conditioned Academic Lounge',
        '5 Free Black & White Laser Prints',
        'Continuous Lister Generator Backup'
      ],
      desc: 'Perfect for exam revision, thesis research, and long study sprints.'
    },
    {
      id: 'plan-week',
      name: '7-Day Research Sprint',
      price: 3500,
      duration: '7 Consecutive Days',
      badge: 'BEST VALUE',
      features: [
        'Unlimited 150 Mbps Optical Fibre WiFi',
        'Reserved Desk Station for 7 Days',
        'Personal Locker Storage',
        'Priority Network Printing & Scanning',
        'Dual Power Backup (Lister + Solar Inverter)'
      ],
      desc: 'Ideal for final-year project defence prep, coding marathons, and seminar write-ups.'
    },
    {
      id: 'plan-month',
      name: 'Monthly Pro Workstation',
      price: 12000,
      duration: '30 Days Full Access',
      badge: 'DEV & TECH CHOICE',
      features: [
        'Dedicated Workstation with Dual Screen Space',
        'Priority QoS High-Bandwidth Fibre WiFi',
        '24/7 Power Guarantee with Zero Switchover Delay',
        'Free Project Formatting & Proofreading Advice',
        'Complimentary Locker & Cafe Water Access'
      ],
      desc: 'Built for software developers, tech freelancers, and graduate researchers.'
    }
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      showToast('Incomplete Details', 'Please enter your full name and phone number to reserve your desk.', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const selectedPlanObj = workspacePlans.find((p) => p.id === planId) || workspacePlans[0];
      const randomDeskNum = Math.floor(Math.random() * 24) + 1;
      const deskCode = `Desk ${randomDeskNum < 10 ? '0' + randomDeskNum : randomDeskNum}`;
      const randomPassId = `BJ-WS-${Math.floor(1000 + Math.random() * 9000)}`;
      const randomWifiPin = `WIFI-${Math.floor(100000 + Math.random() * 900000)}`;

      setGeneratedPass({
        passId: randomPassId,
        wifiVoucher: randomWifiPin,
        guestName: fullName,
        planName: selectedPlanObj.name,
        planPrice: selectedPlanObj.price,
        deskNumber: deskCode,
        ssid: siteSettings?.wifiRates?.hotspotSsid || 'BJ_SERVICES_5GHz_FIBRE',
        date: new Date().toLocaleDateString('en-GB'),
        timeSlot: 'Full Day Access (8:00 AM – 8:00 PM)'
      });

      setIsSubmitting(false);
      showToast('Workspace Reserved!', `Your desk (${deskCode}) and WiFi voucher have been registered.`, 'success');
    }, 800);
  };

  const copyWifiCode = () => {
    if (!generatedPass) return;
    navigator.clipboard.writeText(generatedPass.wifiVoucher);
    showToast('Copied to Clipboard!', `WiFi Voucher code "${generatedPass.wifiVoucher}" copied.`, 'success');
  };

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 4rem' }}>
      <Breadcrumb items={[{ label: 'Workspace & Hub Registration' }]} />

      {/* Hero Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2rem 2.25rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(14, 165, 233, 0.12) 100%)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.45rem' }}>
            <Laptop size={16} />
            <span>FUTO OLD REGISTRY BESIDE PPRC • TECH & ACADEMIC HUB</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.35rem)', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Register Your Workspace & Desk
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: '0.65rem 0 0', lineHeight: 1.55 }}>
            Book your dedicated air-conditioned seat at BJ Services Hub. Every workspace reservation includes 
            uninterrupted <strong style={{ color: 'var(--primary)' }}>150 Mbps Optical Fibre WiFi</strong>, individual 
            grounded power sockets, and continuous heavy-duty Lister generator backup.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', alignItems: 'flex-start' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.9rem',
              borderRadius: '9999px',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#16a34a'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            <span>18 Desks Available Today</span>
          </div>

          <a
            href="#register-form"
            className="btn btn-primary"
            style={{ borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700 }}
          >
            <span>Book Seat & Get WiFi Pass</span>
            <ChevronRight size={15} />
          </a>
        </div>
      </div>

      {/* Main Content Grid: Plan Selection & Registration Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        
        {/* Left Column: Workspace Plans */}
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
              Select Your Workspace Plan
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
              All plans include free 150 Mbps WiFi voucher, charging outlet, and quiet study room access.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {workspacePlans.map((plan) => {
              const isSelected = planId === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setPlanId(plan.id)}
                  className="glass-card hover-lift"
                  style={{
                    padding: '1.35rem',
                    borderRadius: '16px',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.45rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                          {plan.name}
                        </h3>
                        {plan.badge && (
                          <span
                            style={{
                              fontSize: '0.66rem',
                              fontWeight: 800,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              background: plan.popular ? 'var(--accent-orange)' : 'var(--bg-surface)',
                              color: plan.popular ? '#ffffff' : 'var(--primary)',
                              border: plan.popular ? 'none' : '1px solid var(--border-subtle)'
                            }}
                          >
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>⏳ {plan.duration}</span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ₦{plan.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 0.85rem', lineHeight: 1.45 }}>
                    {plan.desc}
                  </p>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.76rem', color: 'var(--text-main)' }}>
                    {plan.features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Check size={13} color="#10b981" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Desk Reservation & WiFi Pass Form */}
        <div id="register-form">
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
              Reserve Desk & Generate Pass
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
              Fill in your details below to instantly lock in your seat and receive your WiFi access voucher.
            </p>
          </div>

          <div
            className="glass-card"
            style={{
              padding: '1.75rem',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            {generatedPass ? (
              /* Success Workspace Pass Badge */
              <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'var(--success-bg)',
                      color: 'var(--success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem'
                    }}
                  >
                    <CheckCircle2 size={34} />
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem' }}>
                    Workspace Pass Confirmed!
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                    Your desk reservation is active. Please present this card at Desk 1 upon arrival.
                  </p>
                </div>

                {/* Styled Pass Ticket */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-inset) 100%)',
                    borderRadius: '16px',
                    border: '2px dashed var(--primary-glow)',
                    padding: '1.35rem',
                    marginBottom: '1.5rem',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>BJ SERVICES WORKSPACE PASS</span>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>{generatedPass.guestName}</div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-orange)', background: 'var(--accent-orange-light)', padding: '3px 8px', borderRadius: '6px' }}>
                      {generatedPass.passId}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem', marginBottom: '0.85rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', display: 'block' }}>Assigned Station:</span>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.92rem' }}>{generatedPass.deskNumber}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', display: 'block' }}>Plan Booked:</span>
                      <strong style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>{generatedPass.planName} (₦{generatedPass.planPrice})</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', display: 'block' }}>Booking Date:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{generatedPass.date}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', display: 'block' }}>Session Slot:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{generatedPass.timeSlot}</strong>
                    </div>
                  </div>

                  {/* WiFi Voucher Box inside Pass */}
                  <div
                    style={{
                      background: 'rgba(14, 165, 233, 0.08)',
                      border: '1px solid var(--primary-glow)',
                      borderRadius: '12px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.74rem', fontWeight: 700 }}>
                        <Wifi size={14} />
                        <span>INCLUDED WIFI VOUCHER PIN:</span>
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-main)', marginTop: '2px' }}>
                        {generatedPass.wifiVoucher}
                      </div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>SSID: {generatedPass.ssid}</span>
                    </div>

                    <button
                      onClick={copyWifiCode}
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: '8px', fontSize: '0.74rem', fontWeight: 700, gap: '0.35rem' }}
                      title="Copy WiFi voucher PIN"
                    >
                      <Copy size={13} />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => window.print()}
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
                  >
                    <Download size={15} />
                    <span>Print / Save Pass</span>
                  </button>

                  <button
                    onClick={() => {
                      setGeneratedPass(null);
                      setFullName('');
                      setPhone('');
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
                  >
                    <span>Book Another Desk</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Emmanuel Chukwuemeka"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-inset)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0803 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-inset)',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. emma@futo.edu.ng"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-inset)',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                      User Category
                    </label>
                    <select
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="form-select"
                      style={{
                        width: '100%',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.88rem',
                        fontWeight: 600
                      }}
                    >
                      <option value="undergraduate">FUTO Undergraduate Student</option>
                      <option value="finalist">Finalist Project Researcher</option>
                      <option value="postgrad">Postgraduate / Masters Scholar</option>
                      <option value="developer">Tech Freelancer / Programmer</option>
                      <option value="candidate">Post-UTME / Fresh Intake</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                      Department / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SEET / Mechanical Eng"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-inset)',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    marginTop: '0.5rem'
                  }}
                >
                  <ShieldCheck size={18} />
                  <span>{isSubmitting ? 'Allocating Desk & Voucher...' : 'Register Workspace & Generate Pass'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
