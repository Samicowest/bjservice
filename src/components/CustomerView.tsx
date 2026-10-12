'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCyber } from '../context/CyberContext';
import { CyberService, CyberTask } from '../types';
import { CATEGORIES } from '../data/services';
import { STATUS_METADATA } from '../utils/stateMachine';
import PipelineStepper from './PipelineStepper';
import {
  Sparkles,
  Clock,
  ArrowRight,
  Search,
  FileText,
  CreditCard,
  Download,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Wifi,
  Laptop,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileSpreadsheet,
  PlusCircle,
  GraduationCap,
  Layers,
  ArrowLeft,
  UserCheck
} from 'lucide-react';
import TranscriptForm from './TranscriptForm';
import SupplementaryForm from './SupplementaryForm';
import SchoolFeesForm from './SchoolFeesForm';
import StudentBioDataForm from './StudentBioDataForm';
import PostUtmeForm from './PostUtmeForm';

export default function CustomerView() {
  const {
    tasks,
    services,
    currentUser,
    setSelectedServiceForOrder,
    setActiveModal,
    setActiveTaskDetail,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    deliverTask,
    showToast
  } = useCyber();

  // Clean Navigation Tabs within Customer Dashboard
  const [activeMainTab, setActiveMainTab] = useState<'my_orders' | 'services' | 'official_forms' | 'wifi'>('my_orders');
  
  // Filter for orders tab
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'in_progress' | 'needs_info' | 'completed'>('all');

  // Official Forms Desk Selected Form (null means show the 5 cards showcase)
  const [selectedOfficialDoc, setSelectedOfficialDoc] = useState<'transcript' | 'supplementary' | 'school_fees' | 'bio_data' | 'post_utme' | null>(null);

  // Student orders (matching current user email or name, or showing all customer tasks in demo)
  const myTasks = tasks.filter((t) => {
    if (!currentUser) return true;
    // Show tasks for this customer or general customer tasks
    return t.customerEmail === currentUser?.email || t.customerName.includes('Victor') || !t.isWalkIn;
  });

  const filteredTasks = myTasks.filter((t) => {
    if (orderStatusFilter === 'in_progress') {
      return t.status === 'in_progress' || t.status === 'assigned' || t.status === 'paid' || t.status === 'draft';
    }
    if (orderStatusFilter === 'needs_info') {
      return t.status === 'needs_info' || t.status === 'pending_payment';
    }
    if (orderStatusFilter === 'completed') {
      return t.status === 'completed' || t.status === 'delivered';
    }
    return true;
  });

  // Filtered Services for Catalog Tab
  const filteredServices = services.filter((srv) => {
    const matchesCat = selectedCategory === 'All Services' || srv.category === selectedCategory;
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStartOrder = (srv: CyberService) => {
    setSelectedServiceForOrder(srv);
    setActiveModal('order');
  };

  const handleDownload = (task: CyberTask) => {
    if (task.status === 'completed') {
      deliverTask(task.id, task.customerName || 'Customer');
    }
    showToast('Download Ready', `Downloading delivery document for ${task.id}...`, 'success');
  };

  // Metrics
  const activeCount = myTasks.filter((t) => ['in_progress', 'assigned', 'paid'].includes(t.status)).length;
  const needsInfoCount = myTasks.filter((t) => t.status === 'needs_info' || t.status === 'pending_payment').length;
  const completedCount = myTasks.filter((t) => ['completed', 'delivered'].includes(t.status)).length;

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      {/* Dashboard Top Header & Welcome */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem 2rem',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
            <GraduationCap size={15} />
            <span>FUTO STUDENT PORTAL & WORKSPACE</span>
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
            Welcome back, {currentUser?.name || 'Student'} 👋
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.35rem 0 0' }}>
            Reg: {currentUser?.matricNo || '2021/109482'} • Dept: {currentUser?.department || 'Electrical & Electronic Engineering'}
          </p>
        </div>

        {/* Quick Action Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            href="/services"
            className="btn btn-primary"
            style={{ borderRadius: '12px', padding: '0.65rem 1.1rem', fontSize: '0.88rem', textDecoration: 'none' }}
          >
            <PlusCircle size={16} />
            <span>Apply for Service</span>
          </Link>
          <Link
            href="/forms"
            className="btn btn-outline"
            style={{ borderRadius: '12px', padding: '0.65rem 1.1rem', fontSize: '0.88rem', textDecoration: 'none' }}
          >
            <FileText size={16} />
            <span>Official Forms (5)</span>
          </Link>
          <Link
            href="/track"
            className="btn btn-outline"
            style={{ borderRadius: '12px', padding: '0.65rem 1.1rem', fontSize: '0.88rem', textDecoration: 'none' }}
          >
            <Search size={16} />
            <span>Track Code</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div
          onClick={() => { setActiveMainTab('my_orders'); setOrderStatusFilter('in_progress'); }}
          className="glass-card"
          style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active in Pipeline</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{activeCount}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Being processed by operators</div>
        </div>

        <div
          onClick={() => { setActiveMainTab('my_orders'); setOrderStatusFilter('needs_info'); }}
          className="glass-card"
          style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Awaiting Your Action</span>
            <AlertTriangle size={15} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--warning)' }}>{needsInfoCount}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Requires document or payment</div>
        </div>

        <div
          onClick={() => { setActiveMainTab('my_orders'); setOrderStatusFilter('completed'); }}
          className="glass-card"
          style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Ready for Collection</span>
            <CheckCircle2 size={15} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>{completedCount}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Download PDF or collect plastic ID</div>
        </div>

        <div
          onClick={() => { setActiveMainTab('my_orders'); setOrderStatusFilter('all'); }}
          className="glass-card"
          style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Submissions</span>
            <Layers size={15} color="var(--text-muted)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{myTasks.length}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>All-time cybercafe history</div>
        </div>
      </div>

      {/* Main Navigation Tab Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.65rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '2rem',
          paddingBottom: '0.75rem'
        }}
      >
        <button
          onClick={() => setActiveMainTab('my_orders')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            border: activeMainTab === 'my_orders' ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
            background: activeMainTab === 'my_orders' ? 'var(--primary-light)' : 'var(--bg-surface)',
            color: activeMainTab === 'my_orders' ? 'var(--primary)' : 'var(--text-muted)',
            boxShadow: activeMainTab === 'my_orders' ? '0 2px 8px var(--primary-glow)' : 'var(--shadow-sm)',
            transition: 'var(--transition)'
          }}
        >
          <FileText size={15} />
          <span>My Orders</span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              background: activeMainTab === 'my_orders' ? 'var(--primary)' : 'var(--bg-inset)',
              color: activeMainTab === 'my_orders' ? '#ffffff' : 'var(--text-dim)',
              fontWeight: 700
            }}
          >
            {myTasks.length}
          </span>
        </button>

        <Link
          href="/services"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            color: 'var(--text-muted)',
            boxShadow: 'var(--shadow-sm)',
            textDecoration: 'none',
            transition: 'var(--transition)'
          }}
          className="hover:text-[var(--primary)] hover:border-[var(--primary)]"
        >
          <PlusCircle size={15} />
          <span>Services Directory</span>
        </Link>

        <Link
          href="/forms"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            color: 'var(--text-muted)',
            boxShadow: 'var(--shadow-sm)',
            textDecoration: 'none',
            transition: 'var(--transition)'
          }}
          className="hover:text-[var(--primary)] hover:border-[var(--primary)]"
        >
          <FileSpreadsheet size={15} />
          <span>Official Forms Desk</span>
        </Link>

        <Link
          href="/workspace"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            color: 'var(--text-muted)',
            boxShadow: 'var(--shadow-sm)',
            textDecoration: 'none',
            transition: 'var(--transition)'
          }}
          className="hover:text-[var(--primary)] hover:border-[var(--primary)]"
        >
          <Laptop size={15} />
          <span>Workspace & WiFi</span>
        </Link>

        <Link
          href="/track"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            color: 'var(--text-muted)',
            boxShadow: 'var(--shadow-sm)',
            textDecoration: 'none',
            transition: 'var(--transition)'
          }}
          className="hover:text-[var(--primary)] hover:border-[var(--primary)]"
        >
          <Search size={15} />
          <span>Track Application</span>
        </Link>
      </div>

      {/* TAB 1: MY ORDERS & PIPELINE */}
      {activeMainTab === 'my_orders' && (
        <section>
          {/* Sub-filter tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-inset)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              {(['all', 'in_progress', 'needs_info', 'completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setOrderStatusFilter(filter)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: orderStatusFilter === filter ? 'var(--primary)' : 'transparent',
                    color: orderStatusFilter === filter ? '#ffffff' : 'var(--text-muted)',
                    textTransform: 'capitalize'
                  }}
                >
                  {filter.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveModal('track')}
              className="btn btn-outline btn-sm"
              style={{ borderRadius: '8px', fontSize: '0.78rem' }}
            >
              <Search size={14} />
              <span>Track with Code</span>
            </button>
          </div>

          {filteredTasks.length === 0 ? (
            <div
              className="glass-card"
              style={{ padding: '3rem', textAlign: 'center', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            >
              <FileText size={40} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                No Orders in this Category
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                You do not have any orders matching the "{orderStatusFilter}" filter right now.
              </p>
              <button onClick={() => setActiveMainTab('services')} className="btn btn-primary btn-sm">
                <span>Browse Cybercafe Catalog</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredTasks.map((task) => {
                const meta = STATUS_METADATA[task.status];
                return (
                  <div
                    key={task.id}
                    className="glass-card"
                    style={{
                      padding: '1.5rem',
                      borderRadius: '16px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              color: 'var(--primary)',
                              background: 'var(--primary-light)',
                              padding: '2px 8px',
                              borderRadius: '6px'
                            }}
                          >
                            {task.trackingCode}
                          </span>
                          <span
                            style={{
                              background: meta.badgeBg,
                              color: meta.badgeText,
                              border: `1px solid ${meta.borderColor}`,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700
                            }}
                          >
                            {meta.label}
                          </span>
                          {task.priority === 'express' && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '2px 6px', borderRadius: '4px' }}>
                              ⚡ EXPRESS
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                          {task.serviceName}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                          Submitted: {new Date(task.createdAt).toLocaleDateString()} at {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Operator: {task.assignedWorkerName || 'Desk Queue'}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          ₦{task.totalAmount.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: task.payment.status === 'verified' ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>
                          Payment: {task.payment.status.toUpperCase()} ({task.payment.method})
                        </div>
                      </div>
                    </div>

                    {/* Compact Pipeline Progress Indicator */}
                    <div style={{ background: 'var(--bg-inset)', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
                      <PipelineStepper currentStatus={task.status} compact />
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Ref: {task.id}
                      </div>

                      <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <button
                          onClick={() => setActiveTaskDetail(task)}
                          className="btn btn-outline btn-sm"
                          style={{ borderRadius: '8px', fontSize: '0.8rem' }}
                        >
                          <span>Full Audit & Details</span>
                          <ChevronRight size={14} />
                        </button>

                        {(task.status === 'completed' || task.status === 'delivered') && (
                          <button
                            onClick={() => handleDownload(task)}
                            className="btn btn-success btn-sm"
                            style={{ borderRadius: '8px', fontSize: '0.8rem' }}
                          >
                            <Download size={14} />
                            <span>Download Delivery PDF</span>
                          </button>
                        )}

                        {task.status === 'needs_info' && (
                          <button
                            onClick={() => setActiveTaskDetail(task)}
                            className="btn btn-warning btn-sm"
                            style={{ borderRadius: '8px', fontSize: '0.8rem' }}
                          >
                            <AlertTriangle size={14} />
                            <span>Resolve Operator Request</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: SERVICE CATALOG */}
      {activeMainTab === 'services' && (
        <section>
          {/* Search & Category Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (e.g. School Fees, Remita, Transcript, JAMB, Plastic ID)..."
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.8rem',
                  borderRadius: '14px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem', paddingBottom: '0.5rem' }}>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`category-pill ${isActive ? 'active' : ''}`}
                    style={{
                      padding: '0.55rem 1.25rem',
                      borderRadius: '9999px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      background: isActive ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : 'var(--bg-surface)',
                      color: isActive ? '#ffffff' : 'var(--text-muted)',
                      boxShadow: isActive ? '0 4px 14px var(--primary-glow)' : '0 1px 3px rgba(0, 0, 0, 0.04)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="glass-card"
                style={{
                  padding: '0',
                  borderRadius: '18px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)'
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
                        borderRadius: '6px'
                      }}
                    >
                      <Clock size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: '-1px' }} />
                      {srv.estimatedMinutes}m
                    </div>
                  </div>
                )}

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem', lineHeight: 1.35 }}>
                      {srv.name}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: '0 0 1rem' }}>
                      {srv.shortDesc}
                    </p>
                  </div>

                  <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => handleStartOrder(srv)}
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
      )}

      {/* TAB 3: OFFICIAL DOCUMENTS DESK (5 FORMS) */}
      {activeMainTab === 'official_forms' && (
        <section>
          {selectedOfficialDoc === null ? (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Official Academic Application Portals
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                  Select one of the 5 official FUTO institutional documents below to complete its digital application form:
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {[
                  {
                    id: 'transcript',
                    title: 'Transcript Processing Form',
                    code: 'DOC-TRP-01',
                    desc: 'Institution address, graduation date, RRR code, and TPS tracking code.',
                    badge: 'FUTO Alumni / Registry',
                    accent: '#0284c7',
                    image: '/images/hub_thesis_binding.jpg'
                  },
                  {
                    id: 'school_fees',
                    title: 'School Fees Remita Form',
                    code: 'DOC-SCH-02',
                    desc: 'Faculty, level, session, application/reg no, portal password, Remita RRR.',
                    badge: 'Annual Clearance',
                    accent: '#15803d',
                    image: '/images/hub_remita_payment.jpg'
                  },
                  {
                    id: 'supplementary',
                    title: 'Supplementary Admissions Form',
                    code: 'DOC-SUP-03',
                    desc: 'JAMB reg number, supplementary course choice, payment RRR, office verification.',
                    badge: 'Admissions Desk',
                    accent: '#7e22ce',
                    image: '/images/hub_biometrics_registration.jpg'
                  },
                  {
                    id: 'bio_data',
                    title: 'Student Bio-Data Form',
                    code: 'DOC-BIO-04',
                    desc: 'Personal details, NIN, blood group, genotype, next of kin, sponsor declaration.',
                    badge: 'Freshers & Returning',
                    accent: '#ea580c',
                    image: '/images/slide_cybercafe_1791618919524.jpg'
                  },
                  {
                    id: 'post_utme',
                    title: 'Post-UTME Screening Form',
                    code: 'DOC-UTM-05',
                    desc: 'JAMB score, 1st & 2nd sitting O\'Level scratch cards, center details & JAMB CAPS.',
                    badge: 'Screening Portal',
                    accent: '#db2777',
                    image: '/images/hub_biometrics_registration.jpg'
                  }
                ].map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedOfficialDoc(doc.id as any)}
                    className="glass-card"
                    style={{
                      padding: '0',
                      borderRadius: '18px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-card)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = doc.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    {doc.image && (
                      <div style={{ height: '140px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={doc.image}
                          alt={doc.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '10px',
                            background: 'rgba(15, 23, 42, 0.8)',
                            backdropFilter: 'blur(4px)',
                            color: '#ffffff',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}
                        >
                          {doc.badge}
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '10px',
                            background: 'rgba(255, 255, 255, 0.94)',
                            backdropFilter: 'blur(4px)',
                            color: doc.accent,
                            fontSize: '0.72rem',
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            padding: '2px 7px',
                            borderRadius: '6px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                          }}
                        >
                          {doc.code}
                        </div>
                      </div>
                    )}

                    <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                          {doc.title}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: '0 0 1.25rem' }}>
                          {doc.desc}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: doc.accent, fontSize: '0.82rem', fontWeight: 700, paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                        <span>Open Application Form</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto">
              {/* Back button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-6">
                <button
                  onClick={() => setSelectedOfficialDoc(null)}
                  className="btn btn-outline btn-sm self-start"
                  style={{ borderRadius: '8px' }}
                >
                  <ArrowLeft size={14} />
                  <span>Back to Applications Directory</span>
                </button>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Submitting directly creates a trackable task in your pipeline.
                </span>
              </div>

              {/* Form rendering */}
              <div className="w-full">
                {selectedOfficialDoc === 'transcript' && <TranscriptForm standalone={true} />}
                {selectedOfficialDoc === 'supplementary' && <SupplementaryForm standalone={true} />}
                {selectedOfficialDoc === 'school_fees' && <SchoolFeesForm standalone={true} />}
                {selectedOfficialDoc === 'bio_data' && <StudentBioDataForm standalone={true} />}
                {selectedOfficialDoc === 'post_utme' && <PostUtmeForm standalone={true} />}
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 4: CAMPUS WIFI & HOTSPOT */}
      {activeMainTab === 'wifi' && (
        <section>
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--bg-surface) 100%)',
              border: '1px solid var(--border-subtle)',
              maxWidth: '720px',
              margin: '0 auto',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: '0 4px 12px var(--primary-glow)' }}>
                <Wifi size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  BJ Services Campus High-Speed Fibre WiFi
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                  Unlimited Grace & Mercy Hotspot • Old Registry Area
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              ℹ️ <strong>Walk-in Service:</strong> High-speed campus fibre WiFi is available on-site at BJ Services (Old Registry Area, beside PPRC Building). Access vouchers are obtained directly at the counter.
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
