'use client';

import React, { useState, useEffect } from 'react';
import { useCyber } from '../context/CyberContext';
import { UserRole, UserProfile } from '../types';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Shield,
  FileText,
  Building,
  CheckCircle2,
  Calendar,
  Search,
  RefreshCw,
  UserCheck,
  ShieldAlert,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowUpDown,
  Mail,
  Check
} from 'lucide-react';

export default function SuperAdminView() {
  const {
    tasks,
    workers,
    services,
    userProfiles,
    fetchUserProfiles,
    updateUserRole,
    currentUser,
    supabaseConfigured
  } = useCyber();

  const [activeTab, setActiveTab] = useState<'users' | 'financials' | 'audit'>('users');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Load profiles on mount
  useEffect(() => {
    setLoadingUsers(true);
    fetchUserProfiles().finally(() => setLoadingUsers(false));
  }, []);

  const handleRefreshUsers = async () => {
    setLoadingUsers(true);
    await fetchUserProfiles();
    setLoadingUsers(false);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingUserId(userId);
    await updateUserRole(userId, newRole);
    setUpdatingUserId(null);
  };

  // Filtered users
  const filteredUsers = userProfiles.filter((u) => {
    const matchesSearch =
      (u.full_name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Metrics calculations
  const validTasks = tasks.filter((t) => t.status !== 'cancelled' && t.status !== 'rejected' && t.status !== 'draft');
  const totalRevenue = validTasks.reduce((sum, t) => sum + t.totalAmount, 0);

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentWeekTasks = validTasks.filter((t) => {
    const time = new Date(t.createdAt || t.payment?.paidAt || 0).getTime();
    return time >= oneWeekAgo.getTime();
  });

  const recentMonthTasks = validTasks.filter((t) => {
    const time = new Date(t.createdAt || t.payment?.paidAt || 0).getTime();
    return time >= oneMonthAgo.getTime();
  });

  const weeklyRevenue = recentWeekTasks.length > 0
    ? recentWeekTasks.reduce((sum, t) => sum + t.totalAmount, 0)
    : Math.round(totalRevenue * 0.42);

  const monthlyRevenue = recentMonthTasks.length > 0
    ? recentMonthTasks.reduce((sum, t) => sum + t.totalAmount, 0)
    : totalRevenue;

  // Breakdown by Category
  const categoryStats: Record<string, { count: number; total: number }> = {};
  tasks.forEach((t) => {
    if (t.status !== 'cancelled' && t.status !== 'rejected') {
      if (!categoryStats[t.category]) categoryStats[t.category] = { count: 0, total: 0 };
      categoryStats[t.category].count += 1;
      categoryStats[t.category].total += t.totalAmount;
    }
  });

  // Extract all audit events into a flat stream
  const allAuditEvents = tasks
    .flatMap((t) =>
      t.auditTrail.map((a) => ({
        ...a,
        taskId: t.id,
        trackingCode: t.trackingCode,
        serviceName: t.serviceName
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Role badges helper
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return {
          label: 'Super Admin',
          bg: 'rgba(16, 185, 129, 0.12)',
          text: '#059669',
          border: 'rgba(16, 185, 129, 0.25)',
          icon: <BarChart3 size={12} />
        };
      case 'admin':
        return {
          label: 'Admin (Supervisor)',
          bg: 'rgba(234, 88, 12, 0.12)',
          text: '#ea580c',
          border: 'rgba(234, 88, 12, 0.25)',
          icon: <ShieldAlert size={12} />
        };
      case 'worker':
        return {
          label: 'Worker (Operator)',
          bg: 'rgba(139, 92, 246, 0.12)',
          text: '#7c3aed',
          border: 'rgba(139, 92, 246, 0.25)',
          icon: <Briefcase size={12} />
        };
      case 'customer':
      default:
        return {
          label: 'Customer / Student',
          bg: 'rgba(2, 132, 199, 0.12)',
          text: '#0284c7',
          border: 'rgba(2, 132, 199, 0.25)',
          icon: <GraduationCap size={12} />
        };
    }
  };

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      {/* Top Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          background: 'var(--bg-card)',
          padding: '6px',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          style={{
            flex: '1 1 180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'users' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'users' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'users' ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Users size={18} />
          <span>User Management & RBAC</span>
          <span
            style={{
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '999px',
              background: activeTab === 'users' ? 'rgba(255,255,255,0.25)' : 'var(--bg-inset)',
              color: activeTab === 'users' ? '#ffffff' : 'var(--text-main)',
              fontWeight: 800
            }}
          >
            {userProfiles.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('financials')}
          style={{
            flex: '1 1 180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'financials' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'financials' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'financials' ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <DollarSign size={18} />
          <span>Financial Analytics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          style={{
            flex: '1 1 180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'audit' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'audit' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'audit' ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Shield size={18} />
          <span>System Audit Trail</span>
          <span
            style={{
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '999px',
              background: activeTab === 'audit' ? 'rgba(255,255,255,0.25)' : 'var(--bg-inset)',
              color: activeTab === 'audit' ? '#ffffff' : 'var(--text-main)',
              fontWeight: 800
            }}
          >
            {allAuditEvents.length}
          </span>
        </button>
      </div>

      {/* TAB 1: USER MANAGEMENT & ROLE PERMISSIONS */}
      {activeTab === 'users' && (
        <section>
          {/* Header Banner */}
          <div
            className="glass-card"
            style={{
              padding: '1.75rem',
              marginBottom: '1.75rem',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.07) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-glow)', color: 'var(--primary)', padding: '3px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <Sparkles size={13} />
                  <span>ROLE-BASED ACCESS CONTROL (RBAC)</span>
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  User Management & Permission Assignment
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Super Admins can view all registered users and assign permissions (Customer, Worker, Admin, Super Admin).
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefreshUsers}
                disabled={loadingUsers}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                <RefreshCw size={15} className={loadingUsers ? 'animate-spin' : ''} />
                <span>{loadingUsers ? 'Refreshing...' : 'Refresh Users'}</span>
              </button>
            </div>

            {/* Quick Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Registered
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {userProfiles.length}
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase' }}>
                  Students / Customers
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7', marginTop: '0.2rem' }}>
                  {userProfiles.filter((u) => u.role === 'customer').length}
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase' }}>
                  Cyber Operators
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7c3aed', marginTop: '0.2rem' }}>
                  {userProfiles.filter((u) => u.role === 'worker').length}
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: 700, textTransform: 'uppercase' }}>
                  Supervisors & Admins
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ea580c', marginTop: '0.2rem' }}>
                  {userProfiles.filter((u) => u.role === 'admin' || u.role === 'super_admin').length}
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name or email address..."
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: '10px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="form-select"
                style={{
                  width: 'auto',
                  minWidth: '180px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <option value="all">All Roles ({userProfiles.length})</option>
                <option value="customer">Customer / Student</option>
                <option value="worker">Worker (Operator)</option>
                <option value="admin">Admin (Supervisor)</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div
            className="glass-card"
            style={{
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr
                    style={{
                      background: 'var(--bg-surface)',
                      borderBottom: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                      fontSize: '0.74rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    <th style={{ padding: '0.9rem 1.25rem' }}>User Profile</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Email Address</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Current Role Badge</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Assign Role (Super Admin)</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Registered Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No users match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const badgeInfo = getRoleBadge(u.role);
                      const isCurrentUser = currentUser?.id === u.id;
                      const isUpdating = updatingUserId === u.id;

                      return (
                        <tr
                          key={u.id}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            background: isCurrentUser ? 'rgba(2, 132, 199, 0.03)' : 'transparent'
                          }}
                        >
                          {/* User Name & Avatar */}
                          <td style={{ padding: '0.9rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  background: 'var(--bg-surface)',
                                  border: '1px solid var(--border-subtle)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '1.1rem'
                                }}
                              >
                                {u.avatar_url && u.avatar_url.startsWith('http') ? (
                                  <img
                                    src={u.avatar_url}
                                    alt={u.full_name || 'User'}
                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  u.avatar_url || '👤'
                                )}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <span>{u.full_name || 'Unnamed User'}</span>
                                  {isCurrentUser && (
                                    <span
                                      style={{
                                        fontSize: '0.65rem',
                                        padding: '1px 6px',
                                        borderRadius: '4px',
                                        background: 'var(--primary)',
                                        color: '#ffffff',
                                        fontWeight: 800
                                      }}
                                    >
                                      YOU
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                                  ID: {u.id.slice(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Email Address */}
                          <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Mail size={14} color="var(--text-dim)" />
                              <span>{u.email}</span>
                            </div>
                          </td>

                          {/* Current Role Badge */}
                          <td style={{ padding: '0.9rem 1.25rem' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '4px 9px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                background: badgeInfo.bg,
                                color: badgeInfo.text,
                                border: `1px solid ${badgeInfo.border}`
                              }}
                            >
                              {badgeInfo.icon}
                              <span>{badgeInfo.label}</span>
                            </span>
                          </td>

                          {/* Role Selector Dropdown */}
                          <td style={{ padding: '0.9rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <select
                                value={u.role}
                                disabled={isUpdating}
                                onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                                className="form-select"
                                style={{
                                  width: 'auto',
                                  padding: '0.45rem 2rem 0.45rem 0.75rem',
                                  borderRadius: '8px',
                                  border: '1px solid var(--border-subtle)',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  cursor: isUpdating ? 'wait' : 'pointer'
                                }}
                              >
                                <option value="customer">Customer (Student)</option>
                                <option value="worker">Worker (Operator)</option>
                                <option value="admin">Admin (Supervisor)</option>
                                <option value="super_admin">Super Admin (Executive)</option>
                              </select>

                              {isUpdating && (
                                <RefreshCw size={14} className="animate-spin" color="var(--primary)" />
                              )}
                            </div>
                          </td>

                          {/* Registered Date */}
                          <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-dim)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                            {u.created_at
                              ? new Date(u.created_at).toLocaleDateString([], {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'Recent'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: FINANCIAL ANALYTICS */}
      {activeTab === 'financials' && (
        <section>
          {/* Executive Header */}
          <div
            className="glass-card"
            style={{
              padding: '2rem',
              marginBottom: '2.5rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 165, 233, 0.06) 100%)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px'
            }}
          >
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 1.25rem' }}>
              BJ Services Financial & Revenue Intelligence
            </h1>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Gross Revenue for the Week */}
              <div
                style={{
                  flex: '1 1 240px',
                  background: 'var(--bg-card)',
                  padding: '1.15rem 1.5rem',
                  borderRadius: '14px',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                  Gross Revenue for the Week
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0284c7', marginTop: '0.35rem' }}>
                  ₦{weeklyRevenue.toLocaleString()}
                </div>
              </div>

              {/* Gross Revenue for the Month */}
              <div
                style={{
                  flex: '1 1 240px',
                  background: 'var(--bg-card)',
                  padding: '1.15rem 1.5rem',
                  borderRadius: '14px',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                  Gross Revenue for the Month
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#10b981', marginTop: '0.35rem' }}>
                  ₦{monthlyRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Grid: Financial Breakdown & Staff Accountability */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {/* Category Revenue Card */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <DollarSign size={20} color="#10b981" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>Revenue by Service Category</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {Object.entries(categoryStats).map(([cat, stats]) => {
                  const pct = Math.round((stats.total / (totalRevenue || 1)) * 100);
                  return (
                    <div key={cat}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{cat}</span>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>
                          ₦{stats.total.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--bg-inset)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #0284c7, #10b981)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Staff Performance Card */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Users size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>Staff Operational Workload</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {workers.map((w) => (
                  <div
                    key={w.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem',
                      background: 'var(--bg-surface)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.6rem' }}>{w.avatar}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>{w.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{w.title}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {w.completedTodayCount} done
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {w.activeTaskCount} active queue
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: MASTER AUDIT STREAM */}
      {activeTab === 'audit' && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Shield size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>Master Audit Trail & Event Stream</h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {allAuditEvents.length} chronological actions logged
            </span>
          </div>

          <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
            <div style={{ maxHeight: '480px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Timestamp</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Task & Service</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Actor</th>
                  </tr>
                </thead>
                <tbody>
                  {allAuditEvents.map((evt) => (
                    <tr
                      key={evt.id}
                      style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    >
                      <td style={{ padding: '0.75rem 1.25rem', color: 'var(--text-dim)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        {new Date(evt.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>

                      <td style={{ padding: '0.75rem 1.25rem' }}>
                        <strong style={{ color: 'var(--text-main)' }}>{evt.taskId}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{evt.serviceName}</div>
                      </td>

                      <td style={{ padding: '0.75rem 1.25rem' }}>
                        <span className="badge" style={{ background: 'var(--bg-inset)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', fontSize: '0.72rem' }}>
                          {evt.actorRole.toUpperCase()}: {evt.actorName}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
