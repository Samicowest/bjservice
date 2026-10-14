'use client';

import React from 'react';
import Link from 'next/link';
import { useCyber } from '../context/CyberContext';
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Wifi,
  CreditCard,
  Printer,
  FileText,
  Layers,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export default function Footer() {
  const { siteSettings } = useCyber();
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', borderTop: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
      {/* Top Value Banner - Clean Light Cards */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-inset)', padding: '1.25rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>FUTO Accredited Hub</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Certified Portal & Remita Center</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--accent-orange-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-orange)' }}>
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>Fast 15-Min Turnaround</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Trackable pipeline with live status</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
              <Wifi size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>24hr {siteSettings?.wifiRates?.speed || '150 Mbps'} WiFi</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{siteSettings?.wifiRates?.generatorStatus || 'Lister generator backup active'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--purple-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple)' }}>
              <Printer size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>Heavy-Duty PVC Fargo</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Waterproof smart plastic IDs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation Columns */}
      <div className="container" style={{ padding: '3.5rem 1rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
          
          {/* Column 1: Brand & Physical Desk */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #f97316 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  color: 'white',
                  boxShadow: '0 3px 8px rgba(14, 165, 233, 0.3)'
                }}
              >
                BJ
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {siteSettings?.brandName?.slice(0, 2) || 'BJ'}<span style={{ color: 'var(--primary)' }}>{siteSettings?.brandName?.slice(2) || 'Services'}</span>
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Premier cybercafe & academic operations pipeline for FUTO students, staff, and general public. 
              {siteSettings?.tagline ? ` ${siteSettings.tagline} digital center.` : ' Unlimited Grace & Mercy digital center.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={15} color="var(--primary)" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span>{siteSettings?.contact?.address || 'Old Registry Area, Beside PPRC, FUTO Main Campus, Owerri, Imo State'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>{siteSettings?.contact?.primaryPhone || '08166221330'}{siteSettings?.contact?.secondaryPhone ? ` / ${siteSettings.contact.secondaryPhone}` : ''}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={15} color="var(--accent-orange)" style={{ flexShrink: 0 }} />
                <span>{siteSettings?.contact?.openingHours || 'Monday – Saturday: 7:30 AM – 9:00 PM'}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.1rem' }}>
              Navigation Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.84rem' }}>
              <li>
                <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s ease' }} className="hover:text-[var(--primary)]">
                  <ChevronRight size={13} color="var(--primary)" /> Home Overview
                </Link>
              </li>
              <li>
                <Link href="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s ease' }} className="hover:text-[var(--primary)]">
                  <ChevronRight size={13} color="var(--primary)" /> Services Directory (20+)
                </Link>
              </li>
              <li>
                <Link href="/forms" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s ease' }} className="hover:text-[var(--primary)]">
                  <ChevronRight size={13} color="var(--primary)" /> Official Forms Desk
                </Link>
              </li>
              <li>
                <Link href="/workspace" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s ease' }} className="hover:text-[var(--primary)]">
                  <ChevronRight size={13} color="var(--primary)" /> Workspace & Study Hub
                </Link>
              </li>
              <li>
                <Link href="/portal" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s ease' }} className="hover:text-[var(--primary)]">
                  <ChevronRight size={13} color="var(--primary)" /> Student Portal & Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Services */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.1rem' }}>
              Popular Services
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.84rem' }}>
              <li>
                <Link href="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s ease' }} className="hover:text-[var(--accent-orange)]">
                  <ChevronRight size={13} color="var(--accent-orange)" /> Remita School Fees Payment
                </Link>
              </li>
              <li>
                <Link href="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s ease' }} className="hover:text-[var(--accent-orange)]">
                  <ChevronRight size={13} color="var(--accent-orange)" /> JAMB CAPS O'Level Upload
                </Link>
              </li>
              <li>
                <Link href="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s ease' }} className="hover:text-[var(--accent-orange)]">
                  <ChevronRight size={13} color="var(--accent-orange)" /> NYSC Mobilization & Green Card
                </Link>
              </li>
              <li>
                <Link href="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s ease' }} className="hover:text-[var(--accent-orange)]">
                  <ChevronRight size={13} color="var(--accent-orange)" /> Fargo PVC Plastic Smart ID Cards
                </Link>
              </li>
              <li>
                <Link href="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s ease' }} className="hover:text-[var(--accent-orange)]">
                  <ChevronRight size={13} color="var(--accent-orange)" /> Hardcover Project Thesis Binding
                </Link>
              </li>
              <li>
                <Link href="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }} className="hover:text-[var(--accent-orange)]">
                  <ChevronRight size={13} color="var(--accent-orange)" /> FUTO Acceptance Fee Clearance
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Academic Forms */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.1rem' }}>
              Official Student Forms
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.84rem' }}>
              <li>
                <Link href="/forms?type=transcript" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s ease' }} className="hover:text-[var(--primary)]">
                  <ChevronRight size={13} color="#10b981" /> Academic Transcript Request
                </Link>
              </li>
              <li>
                <Link href="/forms?type=supplementary" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s ease' }} className="hover:text-[var(--primary)]">
                  <ChevronRight size={13} color="#10b981" /> Supplementary Admission Form
                </Link>
              </li>
              <li>
                <Link href="/forms?type=school_fees" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s ease' }} className="hover:text-[var(--primary)]">
                  <ChevronRight size={13} color="#10b981" /> School Fees Remita Form
                </Link>
              </li>
              <li>
                <Link href="/forms?type=bio_data" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s ease' }} className="hover:text-[var(--primary)]">
                  <ChevronRight size={13} color="#10b981" /> Student Bio-Data Verification
                </Link>
              </li>
              <li>
                <Link href="/forms?type=post_utme" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s ease' }} className="hover:text-[var(--primary)]">
                  <ChevronRight size={13} color="#10b981" /> Post-UTME Screening Form
                </Link>
              </li>
            </ul>

            <div style={{ marginTop: '1.5rem', padding: '0.95rem', borderRadius: '12px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                Need Help with Portal Filing?
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                Visit our physical desk at FUTO Old Registry beside PPRC.
              </div>
              <Link
                href="/services"
                className="btn btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
              >
                <span>Explore All Services →</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.78rem',
            color: 'var(--text-dim)'
          }}
        >
          <div>
            © {currentYear} BJ Services (Unlimited Grace & Mercy) Cybercafe. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link href="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="hover:text-[var(--primary)]">Services</Link>
            <Link href="/forms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="hover:text-[var(--primary)]">Official Forms</Link>
            <Link href="/workspace" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="hover:text-[var(--primary)]">Workspace</Link>
            <Link href="/portal" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="hover:text-[var(--primary)]">Student Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
