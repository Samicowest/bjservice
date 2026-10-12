import { TaskStatus, UserRole } from '../types';

export interface TransitionRule {
  from: TaskStatus;
  to: TaskStatus;
  allowedRoles: UserRole[];
  requiresNote?: boolean;
  requiresWorker?: boolean;
  requiresFile?: boolean;
  label: string;
}

export const ALLOWED_TRANSITIONS: TransitionRule[] = [
  // Draft -> Pending Payment
  {
    from: 'draft',
    to: 'pending_payment',
    allowedRoles: ['customer', 'admin', 'super_admin'],
    label: 'Proceed to Payment'
  },
  {
    from: 'draft',
    to: 'cancelled',
    allowedRoles: ['customer', 'admin', 'super_admin'],
    label: 'Cancel Draft'
  },

  // Pending Payment -> Paid
  {
    from: 'pending_payment',
    to: 'paid',
    allowedRoles: ['admin', 'super_admin'], // Online gateway webhook acts as system/admin
    label: 'Confirm & Approve Payment'
  },
  {
    from: 'pending_payment',
    to: 'cancelled',
    allowedRoles: ['customer', 'admin', 'super_admin'],
    label: 'Cancel Order'
  },
  {
    from: 'pending_payment',
    to: 'rejected',
    allowedRoles: ['admin', 'super_admin'],
    requiresNote: true,
    label: 'Reject Order'
  },

  // Paid -> Assigned
  {
    from: 'paid',
    to: 'assigned',
    allowedRoles: ['admin', 'super_admin'],
    requiresWorker: true,
    label: 'Assign to Operator'
  },
  {
    from: 'paid',
    to: 'rejected',
    allowedRoles: ['admin', 'super_admin'],
    requiresNote: true,
    label: 'Issue Refund & Reject'
  },

  // Assigned -> In Progress or Reassign
  {
    from: 'assigned',
    to: 'in_progress',
    allowedRoles: ['worker', 'admin', 'super_admin'],
    label: 'Start Work (In Progress)'
  },
  {
    from: 'assigned',
    to: 'assigned',
    allowedRoles: ['admin', 'super_admin'],
    requiresWorker: true,
    label: 'Reassign Operator'
  },
  {
    from: 'assigned',
    to: 'needs_info',
    allowedRoles: ['worker', 'admin', 'super_admin'],
    requiresNote: true,
    label: 'Request Clarification / Documents'
  },

  // In Progress -> Completed or Needs Info
  {
    from: 'in_progress',
    to: 'completed',
    allowedRoles: ['worker', 'admin', 'super_admin'],
    requiresFile: true,
    label: 'Upload Result & Mark Completed'
  },
  {
    from: 'in_progress',
    to: 'needs_info',
    allowedRoles: ['worker', 'admin', 'super_admin'],
    requiresNote: true,
    label: 'Request Missing Info (Needs Info)'
  },
  {
    from: 'in_progress',
    to: 'rejected',
    allowedRoles: ['worker', 'admin', 'super_admin'],
    requiresNote: true,
    label: 'Cancel & Mark Unresolvable'
  },

  // Needs Info -> In Progress (Customer resolved)
  {
    from: 'needs_info',
    to: 'in_progress',
    allowedRoles: ['customer', 'worker', 'admin', 'super_admin'],
    requiresNote: true,
    label: 'Provide Requested Info & Resume Work'
  },
  {
    from: 'needs_info',
    to: 'cancelled',
    allowedRoles: ['customer', 'admin', 'super_admin'],
    label: 'Cancel Request'
  },

  // Completed -> Delivered
  {
    from: 'completed',
    to: 'delivered',
    allowedRoles: ['customer', 'worker', 'admin', 'super_admin'],
    label: 'Confirm Delivery / Download Completed'
  }
];

export const STATUS_METADATA: Record<
  TaskStatus,
  {
    label: string;
    description: string;
    badgeBg: string;
    badgeText: string;
    borderColor: string;
    glowColor: string;
    stepIndex: number; // For the linear progression bar
    isTerminal?: boolean;
    isPaused?: boolean;
  }
> = {
  draft: {
    label: 'Draft',
    description: 'Order created, awaiting completion of details',
    badgeBg: 'rgba(148, 163, 184, 0.15)',
    badgeText: '#94a3b8',
    borderColor: '#475569',
    glowColor: 'rgba(148, 163, 184, 0.3)',
    stepIndex: 0
  },
  pending_payment: {
    label: 'Pending Payment',
    description: 'Awaiting online checkout or counter cashier confirmation',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeText: '#f59e0b',
    borderColor: '#b45309',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    stepIndex: 1
  },
  paid: {
    label: 'Payment Approved',
    description: 'Payment verified. Queued for desk assignment.',
    badgeBg: 'rgba(14, 165, 233, 0.15)',
    badgeText: '#38bdf8',
    borderColor: '#0284c7',
    glowColor: 'rgba(14, 165, 233, 0.4)',
    stepIndex: 2
  },
  assigned: {
    label: 'Assigned to Staff',
    description: 'Allocated to specialized cafe operator',
    badgeBg: 'rgba(139, 92, 246, 0.15)',
    badgeText: '#a78bfa',
    borderColor: '#7c3aed',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    stepIndex: 3
  },
  in_progress: {
    label: 'In Progress',
    description: 'Worker is actively processing on portal / printer',
    badgeBg: 'rgba(6, 182, 212, 0.18)',
    badgeText: '#22d3ee',
    borderColor: '#0891b2',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    stepIndex: 4
  },
  needs_info: {
    label: 'Needs Info',
    description: 'Paused: Worker requires clear document or correction',
    badgeBg: 'rgba(244, 63, 94, 0.15)',
    badgeText: '#fb7185',
    borderColor: '#e11d48',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    stepIndex: 4,
    isPaused: true
  },
  completed: {
    label: 'Completed',
    description: 'Job finished. Final document uploaded & ready',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeText: '#34d399',
    borderColor: '#059669',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    stepIndex: 5
  },
  delivered: {
    label: 'Delivered',
    description: 'Document downloaded or picked up at front desk',
    badgeBg: 'rgba(34, 197, 94, 0.2)',
    badgeText: '#4ade80',
    borderColor: '#16a34a',
    glowColor: 'rgba(34, 197, 94, 0.5)',
    stepIndex: 6,
    isTerminal: true
  },
  rejected: {
    label: 'Rejected / Refunded',
    description: 'Cannot be fulfilled; refund processed',
    badgeBg: 'rgba(239, 68, 68, 0.15)',
    badgeText: '#f87171',
    borderColor: '#dc2626',
    glowColor: 'rgba(239, 68, 68, 0.3)',
    stepIndex: -1,
    isTerminal: true
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Order cancelled by customer or admin',
    badgeBg: 'rgba(100, 116, 139, 0.15)',
    badgeText: '#94a3b8',
    borderColor: '#475569',
    glowColor: 'rgba(100, 116, 139, 0.2)',
    stepIndex: -1,
    isTerminal: true
  }
};

export const MAIN_PIPELINE_STEPS: TaskStatus[] = [
  'draft',
  'pending_payment',
  'paid',
  'assigned',
  'in_progress',
  'completed',
  'delivered'
];

export function canTransition(
  fromStatus: TaskStatus,
  toStatus: TaskStatus,
  role: UserRole
): { allowed: boolean; rule?: TransitionRule; error?: string } {
  // Super admin can override except when already delivered or invalid
  const rule = ALLOWED_TRANSITIONS.find(
    (t) => t.from === fromStatus && t.to === toStatus
  );

  if (!rule) {
    return {
      allowed: false,
      error: `Transition from "${STATUS_METADATA[fromStatus]?.label || fromStatus}" to "${STATUS_METADATA[toStatus]?.label || toStatus}" is not permitted by pipeline rules.`
    };
  }

  if (role !== 'super_admin' && !rule.allowedRoles.includes(role)) {
    return {
      allowed: false,
      error: `Your role (${role}) is not authorized to move task to "${STATUS_METADATA[toStatus]?.label}". Authorized roles: ${rule.allowedRoles.join(', ')}.`
    };
  }

  return { allowed: true, rule };
}
