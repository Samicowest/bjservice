'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCyber } from '../context/CyberContext';
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Clock,
  Wifi,
  Laptop,
  FileText,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  Calendar,
  GraduationCap,
  CreditCard,
  Zap,
  Award,
  ChevronRight,
  Send,
  Building
} from 'lucide-react';

export default function PublicLandingView() {
  const { setActiveModal, setSelectedServiceForOrder, services, siteSettings } = useCyber();
  const [catalogSearch, setCatalogSearch] = useState('');

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Instant Smart ID Printing",
      desc: "Heavy-duty Fargo digital printing producing verified waterproof NIMC & student plastic cards.",
      image: "/images/hub_pvc_smartcard.jpg"
    },
    {
      title: "Remita Clearance & School Fees",
      desc: "Instant RRR generation, university portal payment, and bank-stamped verified e-receipts.",
      image: "/images/hub_remita_payment.jpg"
    },
    {
      title: "Accredited Biometric Registrations",
      desc: "NYSC mobilization, JAMB CAPS result uploads, and Post-UTME screening on certified terminals.",
      image: "/images/hub_biometrics_registration.jpg"
    },
    {
      title: "Hardcover Thesis & Document Finishing",
      desc: "High-grade leatherette project binding, gold lettering, and official registry transcripts.",
      image: "/images/hub_thesis_binding.jpg"
    },
    {
      title: "High-Speed Campus WiFi & Hub",
      desc: "150 Mbps fibre hotspot with 24/7 generator backup for student research and online portals.",
      image: "/images/slide_wifi_1791618932400.jpg"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Touch swipe handling for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleOrderService = (serviceId: string) => {
    const srv = services.find((s) => s.id === serviceId) || services[0];
    setSelectedServiceForOrder(srv);
    setActiveModal('order');
  };

  // Filter catalog services
  const filteredServices = services.filter((s) => {
    const q = catalogSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.shortDesc.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ padding: '2rem 0 5rem' }}>
      

      {/* 2. HERO SLIDER SECTION (Responsive Mobile-First with Touch Swipe) */}
      <section
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          borderRadius: 'clamp(20px, 4vw, 32px)',
          marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.25)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'clamp(440px, 62vh, 580px)',
          backgroundColor: '#0a0f1d',
          userSelect: 'none'
        }}
      >
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url('${slide.image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 35%',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 0
            }}
          >
            {/* Tuned high-readability gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, rgba(10, 15, 29, 0.55) 0%, rgba(10, 15, 29, 0.72) 50%, rgba(10, 15, 29, 0.92) 100%)'
              }}
            />
          </div>
        ))}

        <div
          style={{
            maxWidth: '860px',
            width: '100%',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
            padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2.5rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box'
          }}
        >
          {/* Top Pill Badge - Clean, Responsive, Never Clips */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              padding: 'clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.85rem, 3vw, 1.35rem)',
              borderRadius: '9999px',
              fontSize: 'clamp(0.72rem, 2.2vw, 0.85rem)',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: 'clamp(1.2rem, 3.5vw, 2.2rem)',
              maxWidth: '95%',
              lineHeight: 1.3,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Sparkles size={14} color="var(--accent-orange)" style={{ flexShrink: 0 }} />
            <span className="hero-badge-full">{siteSettings?.heroBadge || 'BJ SERVICES (UNLIMITED GRACE & MERCY) • FUTO'}</span>
            <span className="hero-badge-mobile">{siteSettings?.heroBadgeMobile || 'BJ SERVICES • FUTO DIGITAL HUB'}</span>
          </div>

          {/* Heading - Fluid scale, wraps cleanly */}
          <h1
            style={{
              fontSize: 'clamp(1.65rem, 6vw, 3.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.035em',
              lineHeight: 1.15,
              color: '#ffffff',
              marginBottom: 'clamp(0.85rem, 2.5vw, 1.5rem)',
              textShadow: '0 4px 16px rgba(0,0,0,0.65)',
              maxWidth: '780px',
              wordBreak: 'break-word',
              padding: '0 0.5rem'
            }}
          >
            {slides[currentSlide].title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 'clamp(0.88rem, 2.6vw, 1.2rem)',
              lineHeight: 1.55,
              color: 'rgba(255, 255, 255, 0.92)',
              maxWidth: '680px',
              margin: '0 auto clamp(1.5rem, 4vw, 2.75rem)',
              fontWeight: 500,
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              padding: '0 0.5rem'
            }}
          >
            {slides[currentSlide].desc}
          </p>

          {/* Navigation Action Links Cluster */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
              maxWidth: '96%',
              margin: '0 auto'
            }}
          >
            <Link
              href="/services"
              className="btn btn-primary"
              style={{
                padding: 'clamp(0.75rem, 2.2vw, 1rem) clamp(1.4rem, 3.8vw, 2.2rem)',
                fontSize: 'clamp(0.88rem, 2.2vw, 1.05rem)',
                fontWeight: 700,
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                boxShadow: '0 8px 25px rgba(2, 132, 199, 0.55)',
                border: '2px solid rgba(255,255,255,0.2)',
                textDecoration: 'none'
              }}
            >
              <span className="hero-btn-full">Explore All Services & Apply</span>
              <span className="hero-btn-mobile">Explore Services</span>
              <ArrowRight size={17} style={{ flexShrink: 0 }} />
            </Link>

            <Link
              href="/forms"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: 'clamp(0.75rem, 2.2vw, 1rem) clamp(1.2rem, 3vw, 1.7rem)',
                fontSize: 'clamp(0.82rem, 2vw, 0.95rem)',
                fontWeight: 700,
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
              className="hover:bg-white/25"
            >
              <FileText size={15} />
              <span>Official Forms Desk</span>
            </Link>

            <Link
              href="/track"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: 'clamp(0.75rem, 2.2vw, 1rem) clamp(1.2rem, 3vw, 1.7rem)',
                fontSize: 'clamp(0.82rem, 2vw, 0.95rem)',
                fontWeight: 700,
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
              className="hover:bg-white/25"
            >
              <Search size={15} />
              <span>Track Application</span>
            </Link>

            <Link
              href="/workspace"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: 'clamp(0.75rem, 2.2vw, 1rem) clamp(1.2rem, 3vw, 1.7rem)',
                fontSize: 'clamp(0.82rem, 2vw, 0.95rem)',
                fontWeight: 700,
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
              className="hover:bg-white/25"
            >
              <Laptop size={15} />
              <span>Workspace & WiFi</span>
            </Link>
          </div>
        </div>

        {/* Slide Indicators */}
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(1rem, 2.5vw, 1.75rem)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            zIndex: 1
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: currentSlide === i ? '28px' : '8px',
                height: '8px',
                borderRadius: '9999px',
                background: currentSlide === i ? 'var(--accent-orange)' : 'rgba(255,255,255,0.35)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                padding: 0
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>



      {/* 3. URGENT DEADLINES & UPCOMING TIMELINES RADAR */}
      <section id="deadlines" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: '1 1 280px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-orange)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              <Clock size={15} />
              <span>CLOSING WINDOWS & PORTAL CUTOFFS</span>
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              Services with Approaching Deadlines
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0.35rem 0 0' }}>
              Avoid late registration surcharges and loss of academic admissions. Process in advance at BJ Services.
            </p>
          </div>

          <Link
            href="/services"
            className="btn btn-outline btn-sm"
            style={{ borderRadius: '9999px', textDecoration: 'none' }}
          >
            <span>View Services Directory (4 Deadlines)</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Deadline Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '1.5rem'
          }}
        >
          {/* Deadline Card 1: NYSC */}
          <div
            className="glass-card"
            style={{
              padding: '0',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid rgba(234, 88, 12, 0.3)',
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-card)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ height: '140px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img
                src="/images/hub_biometrics_registration.jpg"
                alt="NYSC Registration & Biometrics Desk"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '4px 9px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                }}
              >
                <AlertTriangle size={12} /> CLOSING IN 5 DAYS
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}
              >
                Cutoff: Oct 15, 2025
              </div>
            </div>

            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  NYSC 2025 Batch 'A' Registration & Biometrics
                </h3>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Accredited center registration. Senate approved list verification, biometric capture, green card download & kit sizing.
                </p>

                <div style={{ background: 'var(--bg-inset)', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div>⏱️ <strong>SLA:</strong> ~35 mins at BJ Services Desk</div>
                  <div>📋 <strong>Required:</strong> Statement of Result, Passport</div>
                </div>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => handleOrderService('nysc-registration-center')}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', borderRadius: '9999px', justifyContent: 'center' }}
                >
                  <span>Register for NYSC</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Deadline Card 2: JAMB CAPS */}
          <div
            className="glass-card"
            style={{
              padding: '0',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid rgba(2, 132, 199, 0.3)',
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-card)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ height: '140px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img
                src="/images/slide_cybercafe_1791618919524.jpg"
                alt="JAMB CAPS O'Level Desk"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '4px 9px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                }}
              >
                <Calendar size={12} /> CRUCIAL FOR ADMISSION
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}
              >
                Cutoff: Oct 22, 2025
              </div>
            </div>

            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  JAMB CAPS O'Level & Result Upload
                </h3>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Direct central admissions processing. Don't lose admission due to unuploaded WAEC, NECO, or NABTEB results on CAPS.
                </p>

                <div style={{ background: 'var(--bg-inset)', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div>⏱️ <strong>SLA:</strong> ~20 mins instant verification</div>
                  <div>📋 <strong>Required:</strong> JAMB Profile Code, Exam Number</div>
                </div>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => handleOrderService('jamb-caps-olevel-upload')}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', borderRadius: '9999px', justifyContent: 'center' }}
                >
                  <span>Upload to CAPS</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Deadline Card 3: School Fees */}
          <div
            className="glass-card"
            style={{
              padding: '0',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-card)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ height: '140px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img
                src="/images/hub_remita_payment.jpg"
                alt="School Fees Remita Counter"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: '#d97706',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '4px 9px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                }}
              >
                <Clock size={12} /> AVOID LATE PENALTY
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}
              >
                Normal: Oct 28, 2025
              </div>
            </div>

            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  FUTO School Fees & Course Form Clearance
                </h3>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Direct Remita RRR invoice generation and university portal payment clearance with instant official receipt printing.
                </p>

                <div style={{ background: 'var(--bg-inset)', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div>⏱️ <strong>SLA:</strong> ~30 mins (No bank lines)</div>
                  <div>📋 <strong>Required:</strong> Matric Number, Department</div>
                </div>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem' }}>
                <Link
                  href="/forms?type=school_fees"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, borderRadius: '9999px', justifyContent: 'center', textDecoration: 'none' }}
                >
                  <span>Pay School Fees</span>
                  <ArrowRight size={13} />
                </Link>
                <button
                  onClick={() => handleOrderService('futo-school-fees')}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: '9999px', padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                  title="Instant Order Modal"
                >
                  <span>Instant</span>
                </button>
              </div>
            </div>
          </div>

          {/* Deadline Card 4: Supplementary Admission */}
          <div
            className="glass-card"
            style={{
              padding: '0',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-card)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ height: '140px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img
                src="/images/hub_thesis_binding.jpg"
                alt="Supplementary Admission & Registry Desk"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: '#7c3aed',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '4px 9px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                }}
              >
                <Sparkles size={12} /> LIMITED DEPARTMENT SLOTS
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}
              >
                Cutoff: Nov 05, 2025
              </div>
            </div>

            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  FUTO Supplementary Admission & JUPEB
                </h3>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Official supplementary form filing. Select eligible departmental programs, verify 10-digit JAMB number, and get receipt.
                </p>

                <div style={{ background: 'var(--bg-inset)', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div>⏱️ <strong>SLA:</strong> ~20 mins at Desk</div>
                  <div>📋 <strong>Required:</strong> JAMB Slip, O'Level Statement</div>
                </div>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem' }}>
                <Link
                  href="/forms?type=supplementary"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, borderRadius: '9999px', justifyContent: 'center', textDecoration: 'none' }}
                >
                  <span>Apply Supplementary</span>
                  <ArrowRight size={13} />
                </Link>
                <button
                  onClick={() => handleOrderService('supplementary-admission')}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: '9999px', padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                  title="Instant Order Modal"
                >
                  <span>Instant</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUICK OVERVIEW OF BJ SERVICES & CORE CAPABILITIES */}
      <section
        id="overview"
        style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          padding: '3rem 2rem',
          marginBottom: '4rem',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CAMPUS TECH EXCELLENCE
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0 0.5rem' }}>
            What BJ Services Renders for FUTO
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.6 }}>
            BJ Services (Unlimited Grace & Mercy) is FUTO's premier administrative and digital solutions center. Located at Old Registry Beside PPRC, we combine heavy-duty hardware with verified online portal clearing to ensure your academic operations run effortlessly.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Pillar 1 */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: '135px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img src="/images/hub_remita_payment.jpg" alt="Online Fees & Remita Desk" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', left: '10px', width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.92)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <CreditCard size={18} />
              </div>
            </div>
            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                1. Online Fees & Remita
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <CheckCircle2 size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Instant Remita RRR Invoice Generation</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <CheckCircle2 size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Acceptance & School Fees Clearance</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <CheckCircle2 size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Hostels, Medicals & Portal Dues</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <CheckCircle2 size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Official Stamped & Verified E-Receipts</span>
                </li>
              </ul>
              <Link
                href="/services?category=Fees%20%26%20Payments"
                style={{ marginTop: 'auto', paddingTop: '0.85rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Browse Fees & Remita →</span>
              </Link>
            </div>
          </div>

          {/* Pillar 2 */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: '135px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img src="/images/hub_biometrics_registration.jpg" alt="Admissions & Registrations Desk" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', left: '10px', width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.92)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <GraduationCap size={18} />
              </div>
            </div>
            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                2. Admissions & Registrations
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>NYSC Mobilization & Biometric Capture</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>JAMB CAPS O'Level Statement Uploads</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Post-UTME Registration & Screening</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>FUTO Form 18, 19 & Transcripts</span>
                </li>
              </ul>
              <Link
                href="/forms"
                style={{ marginTop: 'auto', paddingTop: '0.85rem', color: '#10b981', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Open Official Forms Desk →</span>
              </Link>
            </div>
          </div>

          {/* Pillar 3 */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: '135px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img src="/images/hub_pvc_smartcard.jpg" alt="Smart Plastic ID & Printing Desk" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', left: '10px', width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.92)', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <Award size={18} />
              </div>
            </div>
            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                3. Smart Plastic ID & Printing
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <CheckCircle2 size={15} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>NIMC / NIN Smart Plastic PVC Cards</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <CheckCircle2 size={15} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Verified Original JAMB Slips with QR</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <CheckCircle2 size={15} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>High-Speed Photocopying & Color Print</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <CheckCircle2 size={15} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Project / Thesis Binding & Laminations</span>
                </li>
              </ul>
              <Link
                href="/services?category=Printing%20%26%20IDs"
                style={{ marginTop: 'auto', paddingTop: '0.85rem', color: '#7c3aed', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Explore Printing & IDs →</span>
              </Link>
            </div>
          </div>

          {/* Pillar 4 */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: '135px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img src="/images/slide_wifi_1791618932400.jpg" alt="Campus Fibre WiFi & Research Hotspot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', left: '10px', width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.92)', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <Wifi size={18} />
              </div>
            </div>
            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                4. Coworking & Academic Workspace
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                Dedicated workstations with 150 Mbps fibre WiFi, individual power sockets, air conditioning, and continuous Lister generator power. Register your desk or book daily passes.
              </p>
              <Link
                href="/workspace"
                style={{ marginTop: 'auto', paddingTop: '0.85rem', color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Register Workspace & View Desks →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Why Choose BJ Services Trust Metrics */}
        <div style={{ background: 'var(--bg-inset)', padding: '1.5rem 2rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>99.8%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>On-Time Portal Delivery</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10b981' }}>100%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Verified Remita RRR Receipts</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-orange)' }}>&lt; 20m</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Average Processing SLA</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#7c3aed' }}>24/7</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Generator Power & Hotspot</div>
          </div>
        </div>
      </section>

      {/* 4.5. INSIDE BJ SERVICES CAMPUS HUB (Equipment & Workstations Photo Showcase) */}
      <section id="hub-showcase" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: '1 1 280px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              <Sparkles size={15} />
              <span>FACILITY & EQUIPMENT SHOWCASE</span>
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              Inside BJ Services Campus Hub
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0.35rem 0 0' }}>
              Tour our live physical stations beside PPRC Old Registry, FUTO. Real hardware, verified operators, and instant turnaround.
            </p>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span>All 4 Hub Stations Fully Online</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))', gap: '1.5rem' }}>
          {/* Station 1: Fargo PVC ID */}
          <div className="glass-card" style={{ background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-subtle)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '180px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img src="/images/hub_pvc_smartcard.jpg" alt="Fargo Smartcard Printing Desk" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>
                🪪 Hardware Station 01
              </div>
            </div>
            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  PVC Smart Card Printing Suite
                </h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                  Heavy-duty digital retransfer printers producing verified waterproof NIMC NIN cards, student identity cards, and staff badges with high-density QR codes.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Output SLA: <strong>&lt; 15 mins</strong></span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Dual-Sided Lamination</span>
              </div>
            </div>
          </div>

          {/* Station 2: Remita Desk */}
          <div className="glass-card" style={{ background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-subtle)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '180px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img src="/images/hub_remita_payment.jpg" alt="Remita Payment Clearance Desk" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>
                💳 Financial Station 02
              </div>
            </div>
            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  Remita & School Fees Clearance
                </h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                  Official collection desk with dual-monitor payment confirmation, immediate Remita RRR generation, bank gateway clearing, and stamped receipts.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Bank Switch: <strong>Instant Settlement</strong></span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>Zero Queues</span>
              </div>
            </div>
          </div>

          {/* Station 3: Biometrics Terminal */}
          <div className="glass-card" style={{ background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-subtle)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '180px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img src="/images/hub_biometrics_registration.jpg" alt="Accredited Biometric Desk" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>
                🔬 Portal Station 03
              </div>
            </div>
            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  Accredited Biometric Terminal
                </h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                  High-precision optical fingerprint scanners and HD webcams certified for NYSC mobilization, JAMB CAPS profile uploads, and Post-UTME screening.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Accuracy: <strong>100% Certified</strong></span>
                <span style={{ color: '#7c3aed', fontWeight: 700 }}>NYSC Approved</span>
              </div>
            </div>
          </div>

          {/* Station 4: Thesis & Document Finishing */}
          <div className="glass-card" style={{ background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-subtle)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '180px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img src="/images/hub_thesis_binding.jpg" alt="Thesis Binding and Finishing Desk" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>
                📚 Finishing Station 04
              </div>
            </div>
            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  Hardcover Thesis & Binding Desk
                </h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                  Premium university project and dissertation binding with embossed gold foil titling, official transcript envelopes, and departmental clearance dossiers.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Finishing: <strong>Gold Embossing</strong></span>
                <span style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>Standard FUTO Spec</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE ALL-SERVICES DIRECTORY & CATALOG */}
      <section id="catalog" style={{ marginBottom: '3.5rem' }}>
        <div className="flex justify-between items-end mb-7 flex-wrap gap-4">
          <div className="flex-1 min-w-[280px]">
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              OFFICIAL SERVICES & GUARANTEED SLAS
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.2rem 0 0' }}>
              Browse Complete Services Directory
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.25rem 0 0' }}>
              Select any service below to view requirements and place your order instantly.
            </p>
          </div>

          {/* Search Bar - Modern Pill */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={16} color="var(--primary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Search services (e.g. Fees, JAMB, ID)..."
              style={{
                width: '100%',
                padding: '0.62rem 2.2rem 0.62rem 2.4rem',
                borderRadius: '9999px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
            {catalogSearch && (
              <button
                onClick={() => setCatalogSearch('')}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  color: 'var(--text-dim)',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>



        {/* Services Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: '1.25rem'
          }}
        >
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="glass-card"
              style={{
                padding: '0',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              {srv.image && (
                <div style={{ height: '140px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={srv.image}
                    alt={srv.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '10px',
                      background: 'rgba(15, 23, 42, 0.78)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}
                  >
                    {srv.category}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '10px',
                      background: 'rgba(255, 255, 255, 0.94)',
                      backdropFilter: 'blur(4px)',
                      color: 'var(--text-main)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '6px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Clock size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: '-1px' }} />
                    {srv.estimatedMinutes}m
                  </div>
                </div>
              )}

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem', lineHeight: 1.35 }}>
                    {srv.name}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: '0 0 1rem' }}>
                    {srv.shortDesc}
                  </p>
                </div>

                <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    onClick={() => {
                      setSelectedServiceForOrder(srv);
                      setActiveModal('order');
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', borderRadius: '9999px', padding: '0.55rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
                  >
                    <span>Apply Now</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PROFESSIONAL TRANSITION & PHYSICAL DESK FOOTER */}
      <div
        style={{
          margin: '5rem auto 3.5rem',
          textAlign: 'center',
          position: 'relative',
          maxWidth: '850px',
          width: '100%'
        }}
      >
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--border-subtle) 20%, var(--border-subtle) 80%, transparent)'
          }}
        />
        <div style={{ marginTop: '-14px', display: 'flex', justifyContent: 'center' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              padding: '0.35rem 1.15rem',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            <Building size={13} color="var(--primary)" />
            <span>Campus Center & Physical Inquiries</span>
          </span>
        </div>
      </div>

      <section
        id="contact"
        className="glass-card"
        style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '2rem',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '4.5rem'
        }}
      >
        <div>
          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            BJ Services (Unlimited Grace & Mercy)
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Your dependable campus technology partner at the Federal University of Technology, Owerri (FUTO). Fully accredited for admissions, Remita clearances, school fees, and academic document processing.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
              <MapPin size={16} color="var(--primary)" /> Business Center Area, Beside PPRC Building, Old Registry Area, FUTO.
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
              <Phone size={16} color="#10b981" /> 08166221330, 08033892455 (WhatsApp Available)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
              <Mail size={16} color="var(--accent-orange)" /> bjservicesoffice2022@gmail.com
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', background: 'var(--bg-inset)', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            DESK HOURS & INSTANT SUPPORT
          </span>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Monday – Saturday: 7:30 AM – 8:00 PM
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Sunday: 1:00 PM – 6:00 PM (Emergency JAMB/Clearance Sessions)
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', width: '100%', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/2348033892455"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ flex: 1, minWidth: '160px', borderRadius: '9999px', justifyContent: 'center', textDecoration: 'none' }}
            >
              <span>Chat on WhatsApp</span>
              <Send size={14} />
            </a>

            <button
              onClick={() => setActiveModal('login')}
              className="btn btn-outline"
              style={{ flex: 1, minWidth: '160px', borderRadius: '9999px', justifyContent: 'center' }}
            >
              <span>Staff / Admin Sign In</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
