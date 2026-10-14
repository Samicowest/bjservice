'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCyber } from '../../context/CyberContext';
import { CyberService } from '../../types';
import { CATEGORIES } from '../../data/services';
import Breadcrumb from '../../components/Breadcrumb';
import {
  Layers,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  Printer,
  Wifi,
  FileText,
  Filter,
  X
} from 'lucide-react';

function ServicesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Services';

  const {
    services,
    setSelectedServiceForOrder,
    setActiveModal,
    isLoggedIn
  } = useCyber();

  const [activeCategory, setActiveCategory] = useState(
    CATEGORIES.includes(initialCategory) ? initialCategory : 'All Services'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartOrder = (service: CyberService) => {
    setSelectedServiceForOrder(service);
    setActiveModal('order');
  };

  const filteredServices = services.filter((srv) => {
    const matchesCat = activeCategory === 'All Services' || srv.category === activeCategory;
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 4rem' }}>
      <Breadcrumb items={[{ label: 'Services Directory' }]} />

      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2rem 2.25rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            <Layers size={16} />
            <span>ACCREDITED CAMPUS CATALOG</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.35rem)', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Services Directory & Instant Ordering
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: '0.6rem 0 0', lineHeight: 1.55 }}>
            Browse 20+ certified cybercafe services for FUTO student admissions, Remita receipts, smart plastic ID printing, and thesis finishing. All tasks are trackable via unique pipeline codes.
          </p>
        </div>

        {/* Quick Route Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            href="/forms"
            className="btn btn-outline"
            style={{ borderRadius: '12px', padding: '0.65rem 1.15rem', fontSize: '0.84rem' }}
          >
            <FileText size={15} />
            <span>Official Forms Desk</span>
          </Link>
          <Link
            href="/track"
            className="btn btn-primary"
            style={{ borderRadius: '12px', padding: '0.65rem 1.15rem', fontSize: '0.84rem' }}
          >
            <Search size={15} />
            <span>Track Application</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
          />
          <input
            type="text"
            placeholder="Search services by keyword (e.g. Acceptance, Transcript, NYSC, PVC card)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.85rem',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '0.9rem'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat;
            const count = cat === 'All Services' 
              ? services.length 
              : services.filter((s) => s.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                  color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: isSelected ? '0 2px 8px var(--primary-glow)' : 'var(--shadow-sm)',
                  transition: 'var(--transition)'
                }}
              >
                <span>{cat}</span>
                <span
                  style={{
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    background: isSelected ? 'var(--primary)' : 'var(--bg-inset)',
                    color: isSelected ? '#ffffff' : 'var(--text-dim)',
                    fontWeight: 700
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <Search size={40} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            No Services Found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            No service matched your search query "{searchQuery}". Try a different keyword or reset filters.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('All Services'); }}
            className="btn btn-secondary btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
            gap: '1.5rem'
          }}
        >
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="glass-card hover-lift"
              style={{
                borderRadius: '20px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-card)',
                transition: 'var(--transition)'
              }}
            >
              {/* Image banner */}
              {srv.image && (
                <div style={{ height: '150px', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-inset)' }}>
                  <img
                    src={srv.image}
                    alt={srv.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)'
                    }}
                  />
                  
                  {/* Category Pill on Image */}
                  <div style={{ position: 'absolute', bottom: '10px', left: '12px', display: 'flex', gap: '0.4rem' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(0,0,0,0.65)',
                        backdropFilter: 'blur(6px)',
                        color: 'white',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}
                    >
                      {srv.category}
                    </span>
                    {srv.popular && (
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'var(--accent-orange)',
                          color: 'white',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}
                      >
                        Popular 🔥
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.35 }}>
                    {srv.name}
                  </h3>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0.4rem 0 1.15rem', flex: 1 }}>
                  {srv.shortDesc}
                </p>

                {/* Actions & Official Desk Link */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.9rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.78rem', fontWeight: 600 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    <span>Active Portal</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 auto', justifyContent: 'flex-end' }}>
                    {/* If there's an official form desk version */}
                    {srv.officialFormId && (
                      <Link
                        href={`/forms?type=${srv.officialFormId}`}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.78rem', padding: '0.48rem 0.75rem', borderRadius: '8px' }}
                        title="Open in Official Forms Desk"
                      >
                        <FileText size={13} />
                        <span>Official Form</span>
                      </Link>
                    )}

                    <button
                      onClick={() => handleStartOrder(srv)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.82rem', padding: '0.48rem 1rem', borderRadius: '8px', fontWeight: 700 }}
                    >
                      <span>Apply Now</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Cross-link Section */}
      <div
        className="glass-card"
        style={{
          marginTop: '4rem',
          padding: '2rem',
          borderRadius: '20px',
          background: 'var(--bg-inset)',
          border: '1px solid var(--border-subtle)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            Need Official FUTO Documentation?
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            Generate stamped Academic Transcripts, Supplementary Admission slips, and Bio-data files directly.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          <Link href="/forms" className="btn btn-primary btn-sm">
            <span>Go to Official Forms Desk →</span>
          </Link>
          <Link href="/workspace" className="btn btn-secondary btn-sm">
            <span>Book Workspace Desk →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>Loading Services Directory...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
