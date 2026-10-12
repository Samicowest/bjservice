'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCyber } from '../context/CyberContext';
import { DEMO_ACCOUNTS } from '../data/demoAccounts';
import { UserRole } from '../types';
import { Sparkles, Globe, LogOut } from 'lucide-react';

export default function DemoToolbar() {
  const router = useRouter();
  const { currentRole, loginAsDemo, logout, isLoggedIn } = useCyber();

  const handleRoleClick = (role: UserRole) => {
    loginAsDemo(role);
    if (role === 'customer') {
      router.push('/portal');
    } else if (role === 'worker') {
      router.push('/operator');
    } else if (role === 'admin' || role === 'super_admin') {
      router.push('/admin');
    }
  };

  const handlePublicClick = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-4 py-2 flex items-center justify-between flex-wrap gap-3 text-xs relative z-[101] shadow-sm">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 bg-[var(--primary-light)] text-[var(--primary)] px-2 py-0.5 rounded-md font-extrabold tracking-wide text-[0.72rem] border border-[var(--primary-glow)]">
          <Sparkles size={11} className="text-[var(--accent-orange)]" />
          <span>DEMO ROLE SWITCHER:</span>
        </span>
        <span className="text-[var(--text-muted)] text-xs">
          Click any role to navigate to its workspace:
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {DEMO_ACCOUNTS.map((acc) => {
          const isActive = isLoggedIn && currentRole === acc.role;
          const roleColors = {
            customer: { activeBg: 'bg-[var(--primary)]', activeText: 'text-white', border: 'border-[var(--primary)]' },
            worker: { activeBg: 'bg-[var(--purple)]', activeText: 'text-white', border: 'border-[var(--purple)]' },
            admin: { activeBg: 'bg-[var(--accent-orange)]', activeText: 'text-white', border: 'border-[var(--accent-orange)]' },
            super_admin: { activeBg: 'bg-[var(--success)]', activeText: 'text-white', border: 'border-[var(--success)]' }
          }[acc.role];

          return (
            <button
              key={acc.id}
              onClick={() => handleRoleClick(acc.role)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[0.74rem] transition-all duration-150 cursor-pointer
                ${isActive 
                  ? `${roleColors.border} ${roleColors.activeBg} ${roleColors.activeText} font-bold` 
                  : 'border-[var(--border-subtle)] bg-[var(--bg-inset)] text-[var(--text-muted)] font-medium hover:bg-[var(--bg-subtle)]'
                }`}
              title={`Switch to ${acc.name} (${acc.badge}) and view workspace`}
            >
              <span>{acc.avatar}</span>
              <span>{acc.badge}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5" />
              )}
            </button>
          );
        })}

        {/* Public Portal Button */}
        <button
          onClick={handlePublicClick}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[0.74rem] cursor-pointer transition-all
            ${!isLoggedIn 
              ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] font-bold' 
              : 'border-[var(--border-subtle)] bg-[var(--bg-inset)] text-[var(--text-muted)] font-medium hover:bg-[var(--bg-subtle)]'
            }`}
          title="Return to Public Homepage"
        >
          <Globe size={12} />
          <span>Public View (Home)</span>
        </button>

        {isLoggedIn && (
          <button
            onClick={handlePublicClick}
            title="Sign out of current account and go to Home"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger)] cursor-pointer text-[0.72rem] font-semibold ml-1 hover:opacity-80 transition-opacity"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
}
