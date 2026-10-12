'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.75rem 0',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        flexWrap: 'wrap'
      }}
    >
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          fontWeight: 600,
          transition: 'color 0.15s ease'
        }}
        className="hover:text-[var(--primary)]"
      >
        <Home size={13} />
        <span>Home</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight size={13} color="var(--border-strong)" style={{ flexShrink: 0 }} />
            {isLast || !item.href ? (
              <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                style={{
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'color 0.15s ease'
                }}
                className="hover:text-[var(--primary)]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
