export type TaskStatus =
  | 'draft'
  | 'pending_payment'
  | 'paid'
  | 'assigned'
  | 'in_progress'
  | 'needs_info'
  | 'completed'
  | 'delivered'
  | 'rejected'
  | 'cancelled';

export type UserRole = 'customer' | 'worker' | 'admin' | 'super_admin';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  badge: string;
  phone?: string;
  matricNo?: string;
  department?: string;
  desk?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  badge?: string | null;
  phone?: string | null;
  matric_no?: string | null;
  department?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type PaymentMethod = 'paystack' | 'flutterwave' | 'bank_transfer' | 'cash' | 'pos';

export type PaymentStatus = 'unpaid' | 'pending_verification' | 'verified' | 'failed' | 'refunded';

export type Priority = 'normal' | 'express';

export interface AuditLog {
  id: string;
  fromStatus?: TaskStatus;
  toStatus: TaskStatus;
  actorRole: UserRole;
  actorName: string;
  timestamp: string;
  note?: string;
}

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  url?: string;
  previewUrl?: string;
  uploadedBy: string;
  isResult?: boolean;
}

export interface NeedsInfoRecord {
  id: string;
  requestedAt: string;
  requestedBy: string;
  reason: string;
  resolvedAt?: string;
  resolvedBy?: string;
  customerResponseNote?: string;
}

export interface ServiceField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'file';
  placeholder?: string;
  required: boolean;
  options?: string[];
  helperText?: string;
}

export interface CyberService {
  id: string;
  name: string;
  category: 'Fees & Payments' | 'Remita' | 'Admissions & Portals' | 'Printing & IDs' | 'WiFi & Internet';
  shortDesc: string;
  description: string;
  basePrice: number;
  serviceFee: number;
  totalPrice: number;
  estimatedMinutes: number;
  iconName: string;
  popular?: boolean;
  officialFormId?: 'transcript' | 'supplementary' | 'school-fees' | 'bio-data' | 'post-utme';
  fields: ServiceField[];
  requiredDocTypes: string[];
  image?: string;
}

export interface Worker {
  id: string;
  name: string;
  role: 'worker';
  title: string;
  avatar: string;
  specialties: string[];
  activeTaskCount: number;
  completedTodayCount: number;
  isOnline: boolean;
}

export interface CyberTask {
  id: string;
  trackingCode: string;
  serviceId: string;
  serviceName: string;
  category: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  isWalkIn: boolean;
  staffCreatedId?: string;
  status: TaskStatus;
  priority: Priority;
  basePrice: number;
  serviceFee: number;
  expressSurcharge: number;
  totalAmount: number;
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    reference: string;
    paidAt?: string;
    verifiedBy?: string;
    receiptNumber?: string;
  };
  formData: Record<string, any>;
  customerFiles: AttachedFile[];
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  assignedAt?: string;
  estimatedTurnaroundMinutes: number;
  slaDeadline: string;
  completedAt?: string;
  deliveredAt?: string;
  deliveryFiles: AttachedFile[];
  deliveryNotes?: string;
  needsInfoRecords: NeedsInfoRecord[];
  auditTrail: AuditLog[];
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  taskId?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  targetRole?: UserRole;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  location: string;
  heroBadge: string;
  heroBadgeMobile: string;
  showTicker: boolean;
  announcementTicker: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    alternativeBank: string;
    allowTransfer: boolean;
    allowCashAtCounter: boolean;
    paymentInstructions: string;
  };
  wifiRates: {
    oneHour: number;
    fourHours: number;
    twentyFourHours: number;
    hotspotSsid: string;
    speed: string;
    generatorStatus: string;
    isHotspotActive: boolean;
  };
  contact: {
    primaryPhone: string;
    secondaryPhone: string;
    whatsapp: string;
    email: string;
    address: string;
    openingHours: string;
  };
}
