'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CyberTask,
  TaskStatus,
  UserRole,
  CyberService,
  Worker,
  AppNotification,
  PaymentMethod,
  Priority,
  AttachedFile,
  DemoUser,
  UserProfile,
  SiteSettings
} from '../types';
import { INITIAL_TASKS } from '../data/mockTasks';
import { SERVICES_CATALOG } from '../data/services';
import { WORKERS } from '../data/staff';
import { DEMO_ACCOUNTS } from '../data/demoAccounts';
import { DEFAULT_SITE_SETTINGS } from '../data/defaultSiteSettings';
import { canTransition, STATUS_METADATA } from '../utils/stateMachine';
import { createClient, isSupabaseConfigured } from '../lib/supabase/client';

interface CyberContextType {
  tasks: CyberTask[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: DemoUser | null;
  setCurrentUser: (user: DemoUser | null) => void;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
  isLoggedIn: boolean;
  activeWorkerId: string;
  setActiveWorkerId: (workerId: string) => void;
  workers: Worker[];
  services: CyberService[];
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error', taskId?: string) => void;
  
  // Pipeline Actions
  createTask: (serviceId: string, customerData: { name: string; phone: string; email: string; isWalkIn?: boolean }, formData: Record<string, any>, files: AttachedFile[], priority: Priority) => CyberTask;
  transitionTaskStatus: (taskId: string, newStatus: TaskStatus, note?: string, extraData?: { workerId?: string; deliveryFile?: AttachedFile; responseNote?: string }) => { success: boolean; error?: string };
  verifyPayment: (taskId: string, method: PaymentMethod, reference: string, verifierName: string) => boolean;
  assignWorker: (taskId: string, workerId: string, adminName: string) => boolean;
  requestNeedsInfo: (taskId: string, reason: string, workerName: string) => boolean;
  resolveNeedsInfo: (taskId: string, responseNote: string, files?: AttachedFile[]) => boolean;
  completeTask: (taskId: string, workerName: string, deliveryFile: AttachedFile, notes?: string) => boolean;
  deliverTask: (taskId: string, actorName: string) => boolean;
  
  // Modals & UI States
  activeModal: 'order' | 'wifi' | 'walkin' | 'track' | 'notifications' | 'login' | null;
  setActiveModal: (modal: 'order' | 'wifi' | 'walkin' | 'track' | 'notifications' | 'login' | null) => void;
  selectedServiceForOrder: CyberService | null;
  setSelectedServiceForOrder: (service: CyberService | null) => void;
  activeTaskDetail: CyberTask | null;
  setActiveTaskDetail: (task: CyberTask | null) => void;
  
  // Toast
  toast: { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error' } | null;
  showToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  hideToast: () => void;


  // Search & Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Supabase Auth & RBAC
  supabaseConfigured: boolean;
  userProfiles: UserProfile[];
  fetchUserProfiles: () => Promise<UserProfile[]>;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<{ success: boolean; error?: string }>;

  // Service Catalog & Forms Management
  createService: (serviceData: Omit<CyberService, 'id'> & { id?: string }) => CyberService;
  updateService: (id: string, updates: Partial<CyberService>) => boolean;
  deleteService: (id: string) => boolean;
  resetServicesToDefault: () => void;

  // Master Admin Site Controls & Live Content
  siteSettings: SiteSettings;
  updateSiteSettings: (updates: Partial<SiteSettings>) => void;
  resetSiteSettings: () => void;
}

const CyberContext = createContext<CyberContextType | undefined>(undefined);

export function CyberProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<CyberTask[]>(INITIAL_TASKS);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [currentRole, setCurrentRoleState] = useState<UserRole>('customer');
  const [activeWorkerId, setActiveWorkerId] = useState<string>('worker-blessing');
  const [workers, setWorkers] = useState<Worker[]>(WORKERS);
  const [services, setServices] = useState<CyberService[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('bj_services_catalog');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Failed to parse stored services:', e);
      }
    }
    return SERVICES_CATALOG;
  });

  const saveServices = (newServices: CyberService[]) => {
    setServices(newServices);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('bj_services_catalog', JSON.stringify(newServices));
      } catch (e) {
        console.error('Failed to save services to localStorage:', e);
      }
    }
  };

  const createService = (newServiceData: Omit<CyberService, 'id'> & { id?: string }): CyberService => {
    const base = Number(newServiceData.basePrice) || 0;
    const fee = Number(newServiceData.serviceFee) || 0;
    const total = base + fee;

    const id = (newServiceData.id?.trim() ||
      newServiceData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4));

    const created: CyberService = {
      ...newServiceData,
      id,
      basePrice: base,
      serviceFee: fee,
      totalPrice: total,
      fields: newServiceData.fields || [],
      requiredDocTypes: newServiceData.requiredDocTypes || [],
      estimatedMinutes: Number(newServiceData.estimatedMinutes) || 20,
      iconName: newServiceData.iconName || 'FileText',
      category: newServiceData.category || 'Fees & Payments',
      popular: newServiceData.popular ?? false
    };

    const updated = [created, ...services];
    saveServices(updated);
    showToast('Service & Form Created', `"${created.name}" is now live in the active catalog.`, 'success');
    return created;
  };

  const updateService = (id: string, updates: Partial<CyberService>): boolean => {
    const existing = services.find((s) => s.id === id);
    if (!existing) return false;

    const base = updates.basePrice !== undefined ? Number(updates.basePrice) : existing.basePrice;
    const fee = updates.serviceFee !== undefined ? Number(updates.serviceFee) : existing.serviceFee;
    const total = base + fee;

    const updatedList = services.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          ...updates,
          basePrice: base,
          serviceFee: fee,
          totalPrice: total
        };
      }
      return s;
    });

    saveServices(updatedList);
    showToast('Service & Form Updated', `"${updates.name || existing.name}" has been updated successfully.`, 'success');
    return true;
  };

  const deleteService = (id: string): boolean => {
    const existing = services.find((s) => s.id === id);
    if (!existing) return false;

    const updatedList = services.filter((s) => s.id !== id);
    saveServices(updatedList);
    showToast('Service Removed', `"${existing.name}" was removed from the catalog.`, 'info');
    return true;
  };

  const resetServicesToDefault = () => {
    saveServices(SERVICES_CATALOG);
    showToast('Catalog Reset', 'Services catalog restored to system defaults.', 'info');
  };

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('bj_site_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            ...DEFAULT_SITE_SETTINGS,
            ...parsed,
            urgentBulletin: {
              ...DEFAULT_SITE_SETTINGS.urgentBulletin,
              ...(parsed.urgentBulletin || {})
            },
            bankDetails: {
              ...DEFAULT_SITE_SETTINGS.bankDetails,
              ...(parsed.bankDetails || {})
            },
            wifiRates: {
              ...DEFAULT_SITE_SETTINGS.wifiRates,
              ...(parsed.wifiRates || {})
            },
            contact: {
              ...DEFAULT_SITE_SETTINGS.contact,
              ...(parsed.contact || {})
            }
          };
        }
      } catch (e) {
        console.error('Failed to parse stored site settings:', e);
      }
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const updated: SiteSettings = {
        ...prev,
        ...updates,
        urgentBulletin: updates.urgentBulletin ? { ...prev.urgentBulletin, ...updates.urgentBulletin } : prev.urgentBulletin,
        bankDetails: updates.bankDetails ? { ...prev.bankDetails, ...updates.bankDetails } : prev.bankDetails,
        wifiRates: updates.wifiRates ? { ...prev.wifiRates, ...updates.wifiRates } : prev.wifiRates,
        contact: updates.contact ? { ...prev.contact, ...updates.contact } : prev.contact
      };

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('bj_site_settings', JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save site settings to localStorage:', e);
        }
      }
      return updated;
    });

    showToast('Site Settings Updated', 'Live site configuration and content have been saved successfully.', 'success');
  };

  const resetSiteSettings = () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('bj_site_settings');
      } catch (e) {
        console.error('Failed to reset site settings in localStorage:', e);
      }
    }
    showToast('Settings Reset', 'Live website content has been restored to factory defaults.', 'info');
  };
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Task Assigned',
      message: 'Acceptance Fee clearance for Victor Eze was assigned to Blessing Nwachukwu.',
      taskId: 'BJ-TASK-101',
      type: 'info',
      timestamp: '14:15',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Action Needed: JAMB CAPS Upload',
      message: 'Adanna Stephanie Nwosu needs to re-upload clear WAEC statement.',
      taskId: 'BJ-TASK-102',
      type: 'warning',
      timestamp: '11:42',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Plastic ID Card Ready',
      message: 'Kelechi Emmanuel Obi: NIMC Laminated Smart Card is ready for collection.',
      taskId: 'BJ-TASK-103',
      type: 'success',
      timestamp: '09:32',
      read: true
    }
  ]);

  const [activeModal, setActiveModal] = useState<'order' | 'wifi' | 'walkin' | 'track' | 'notifications' | 'login' | null>(null);
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<CyberService | null>(null);
  const [activeTaskDetail, setActiveTaskDetail] = useState<CyberTask | null>(null);
  const [toast, setToast] = useState<{ title: string; message: string; type: 'info' | 'success' | 'warning' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');

  const [supabaseConfigured, setSupabaseConfigured] = useState<boolean>(false);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);

  // Enforce Light Mode permanently
  useEffect(() => {
    try {
      localStorage.removeItem('bj_cyber_theme');
      document.documentElement.setAttribute('data-theme', 'light');
    } catch (e) {
      // ignore
    }
  }, []);

  // Sync Supabase Auth & Session
  useEffect(() => {
    const isReady = isSupabaseConfigured();
    setSupabaseConfigured(isReady);

    if (!isReady) return;

    try {
      const supabase = createClient();

      const syncUserFromSession = async (user: any) => {
        if (!user) return;
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (profile) {
            const role = (profile.role as UserRole) || 'customer';
            setCurrentUser({
              id: profile.id,
              name: profile.full_name || user.email?.split('@')[0] || 'User',
              email: profile.email || user.email || '',
              role,
              avatar: profile.avatar_url || '👤',
              title:
                role === 'super_admin'
                  ? 'Managing Director'
                  : role === 'admin'
                  ? 'Operations Admin'
                  : role === 'worker'
                  ? 'Operator'
                  : 'Student / Applicant',
              badge:
                profile.badge ||
                (role === 'super_admin'
                  ? 'Executive Suite'
                  : role === 'admin'
                  ? 'Operations Admin'
                  : role === 'worker'
                  ? 'Cyber Cafe Staff'
                  : 'Student Portal'),
              phone: profile.phone || '',
              matricNo: profile.matric_no || '',
              department: profile.department || ''
            });
            setCurrentRoleState(role);
          } else {
            // Auto-fallback to auth user metadata
            const meta = user.user_metadata || {};
            const fullName = meta.full_name || meta.name || user.email?.split('@')[0] || 'User';
            setCurrentUser({
              id: user.id,
              name: fullName,
              email: user.email || '',
              role: 'customer',
              avatar: meta.avatar_url || meta.picture || '👤',
              title: 'Student / Applicant',
              badge: 'Student Portal'
            });
            setCurrentRoleState('customer');
          }
        } catch (err) {
          console.warn('Error reading profile:', err);
        }
      };

      // Check current session on mount
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncUserFromSession(session.user);
        }
      });

      // Listen for auth changes (login, logout, token refresh, OAuth redirect)
      const {
        data: { subscription }
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await syncUserFromSession(session.user);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setCurrentRoleState('customer');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (e) {
      console.warn('Supabase auth listener initialization error:', e);
    }
  }, []);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    const matchedAccount = DEMO_ACCOUNTS.find((a) => a.role === role);
    if (matchedAccount) {
      setCurrentUser(matchedAccount);
      if (role === 'worker') {
        setActiveWorkerId('worker-blessing');
      }
    }
  };

  const loginAsDemo = (role: UserRole) => {
    const account = DEMO_ACCOUNTS.find((a) => a.role === role) || DEMO_ACCOUNTS[0];
    setCurrentUser(account);
    setCurrentRoleState(account.role);
    if (account.role === 'worker') {
      setActiveWorkerId('worker-blessing');
    }
    showToast(`Signed In as ${account.name}`, `Active Persona: ${account.badge} (${account.title})`, 'success');
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out error:', e);
      }
    }
    setCurrentUser(null);
    setCurrentRoleState('customer');
    showToast('Signed Out', 'You are now viewing the BJ Services public landing page.', 'info');
  };

  const fetchUserProfiles = async (): Promise<UserProfile[]> => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setUserProfiles(data as UserProfile[]);
          return data as UserProfile[];
        }
      } catch (err) {
        console.warn('Could not fetch Supabase profiles:', err);
      }
    }

    // Fallback demo profiles when offline or before DB seed
    const fallback: UserProfile[] = DEMO_ACCOUNTS.map((a, i) => ({
      id: a.id,
      email: a.email,
      full_name: a.name,
      avatar_url: a.avatar,
      role: a.role,
      badge: a.badge,
      created_at: new Date(Date.now() - (i + 1) * 86400000).toISOString()
    }));
    setUserProfiles(fallback);
    return fallback;
  };

  const updateUserRole = async (userId: string, newRole: UserRole): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('profiles')
          .update({ role: newRole, updated_at: new Date().toISOString() })
          .eq('id', userId);

        if (error) {
          showToast('Failed to Update Role', error.message, 'error');
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        const msg = err?.message || 'Failed to update role';
        showToast('Error', msg, 'error');
        return { success: false, error: msg };
      }
    }

    // Update in-memory user profiles list
    setUserProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
    );

    // If currently logged-in user is updated
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
      setCurrentRoleState(newRole);
    }

    showToast('Role Updated', `User permissions changed to "${newRole.toUpperCase()}".`, 'success');
    return { success: true };
  };

  // Sync active task count for workers
  useEffect(() => {
    setWorkers((prev) =>
      prev.map((w) => {
        const count = tasks.filter(
          (t) => t.assignedWorkerId === w.id && (t.status === 'assigned' || t.status === 'in_progress' || t.status === 'needs_info')
        ).length;
        return { ...w, activeTaskCount: count };
      })
    );
  }, [tasks]);

  const showToast = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast((cur) => (cur?.title === title ? null : cur));
    }, 4500);
  };

  const hideToast = () => setToast(null);

  const addNotification = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    taskId?: string
  ) => {
    const notif: AppNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      message,
      taskId,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(title, message, type);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Create new task
  const createTask = (
    serviceId: string,
    customerData: { name: string; phone: string; email: string; isWalkIn?: boolean },
    formData: Record<string, any>,
    files: AttachedFile[],
    priority: Priority
  ): CyberTask => {
    const srv = services.find((s) => s.id === serviceId) || services[0];
    const taskIdNum = Math.floor(100 + Math.random() * 900);
    const trackingNum = Math.floor(10000 + Math.random() * 90000);
    const taskId = `BJ-TASK-${taskIdNum}`;
    const trackingCode = `BJ-TRK-${trackingNum}`;
    const expressSurcharge = priority === 'express' ? 500 : 0;
    const totalAmount = srv.totalPrice + expressSurcharge;

    const newTask: CyberTask = {
      id: taskId,
      trackingCode,
      serviceId: srv.id,
      serviceName: srv.name,
      category: srv.category,
      customerName: customerData.name,
      customerPhone: customerData.phone,
      customerEmail: customerData.email,
      isWalkIn: !!customerData.isWalkIn,
      status: 'pending_payment',
      priority,
      basePrice: srv.basePrice,
      serviceFee: srv.serviceFee,
      expressSurcharge,
      totalAmount,
      payment: {
        method: customerData.isWalkIn ? 'cash' : 'paystack',
        status: 'pending_verification',
        reference: `REF_${Date.now()}`
      },
      formData,
      customerFiles: files,
      estimatedTurnaroundMinutes: srv.estimatedMinutes,
      slaDeadline: new Date(Date.now() + (srv.estimatedMinutes + (priority === 'express' ? 0 : 30)) * 60 * 1000).toISOString(),
      deliveryFiles: [],
      needsInfoRecords: [],
      auditTrail: [
        {
          id: `aud-${Date.now()}-1`,
          toStatus: 'draft',
          actorRole: currentRole,
          actorName: customerData.name || 'Walk-in Desk Staff',
          timestamp: new Date().toISOString(),
          note: `Task initiated for ${srv.name} (${priority.toUpperCase()} priority).`
        },
        {
          id: `aud-${Date.now()}-2`,
          fromStatus: 'draft',
          toStatus: 'pending_payment',
          actorRole: currentRole,
          actorName: customerData.name || 'Walk-in Desk Staff',
          timestamp: new Date().toISOString(),
          note: `Total ₦${totalAmount.toLocaleString()} pending payment.`
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks((prev) => [newTask, ...prev]);
    addNotification(
      'New Order Placed',
      `Order ${newTask.id} for "${srv.name}" placed. Total: ₦${totalAmount.toLocaleString()}`,
      'info',
      newTask.id
    );

    return newTask;
  };

  // State Transition Engine with Audit Logging
  const transitionTaskStatus = (
    taskId: string,
    newStatus: TaskStatus,
    note?: string,
    extraData?: { workerId?: string; deliveryFile?: AttachedFile; responseNote?: string }
  ): { success: boolean; error?: string } => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { success: false, error: 'Task not found' };

    const validation = canTransition(task.status, newStatus, currentRole);
    if (!validation.allowed) {
      showToast('Action Denied', validation.error || 'Transition not permitted', 'error');
      return { success: false, error: validation.error };
    }

    const currentWorkerObj = workers.find((w) => w.id === activeWorkerId);
    let actorName = 'System';
    if (currentRole === 'customer') actorName = task.customerName || 'Customer';
    else if (currentRole === 'worker') actorName = currentWorkerObj?.name || 'Operator';
    else if (currentRole === 'admin') actorName = 'Manager Benjamin (Admin)';
    else if (currentRole === 'super_admin') actorName = 'Chief Executive (Super Admin)';

    let assignedWorkerId = task.assignedWorkerId;
    let assignedWorkerName = task.assignedWorkerName;
    let assignedAt = task.assignedAt;

    if (newStatus === 'assigned' && extraData?.workerId) {
      const assignedWorker = workers.find((w) => w.id === extraData.workerId);
      if (assignedWorker) {
        assignedWorkerId = assignedWorker.id;
        assignedWorkerName = assignedWorker.name;
        assignedAt = new Date().toISOString();
      }
    }

    const updatedDeliveryFiles = [...task.deliveryFiles];
    if (extraData?.deliveryFile) {
      updatedDeliveryFiles.push(extraData.deliveryFile);
    }

    const updatedNeedsInfo = [...task.needsInfoRecords];
    if (newStatus === 'needs_info' && note) {
      updatedNeedsInfo.push({
        id: `info-${Date.now()}`,
        requestedAt: new Date().toISOString(),
        requestedBy: actorName,
        reason: note
      });
    } else if (task.status === 'needs_info' && newStatus === 'in_progress') {
      const lastRecord = updatedNeedsInfo[updatedNeedsInfo.length - 1];
      if (lastRecord) {
        lastRecord.resolvedAt = new Date().toISOString();
        lastRecord.resolvedBy = actorName;
        lastRecord.customerResponseNote = extraData?.responseNote || note;
      }
    }

    const auditEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fromStatus: task.status,
      toStatus: newStatus,
      actorRole: currentRole,
      actorName,
      timestamp: new Date().toISOString(),
      note: note || `Status advanced to ${STATUS_METADATA[newStatus]?.label || newStatus}`
    };

    const updatedTask: CyberTask = {
      ...task,
      status: newStatus,
      assignedWorkerId,
      assignedWorkerName,
      assignedAt,
      deliveryFiles: updatedDeliveryFiles,
      deliveryNotes: newStatus === 'completed' && note ? note : task.deliveryNotes,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : task.completedAt,
      deliveredAt: newStatus === 'delivered' ? new Date().toISOString() : task.deliveredAt,
      needsInfoRecords: updatedNeedsInfo,
      auditTrail: [...task.auditTrail, auditEntry],
      updatedAt: new Date().toISOString()
    };

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    if (activeTaskDetail?.id === taskId) {
      setActiveTaskDetail(updatedTask);
    }

    addNotification(
      `Task ${STATUS_METADATA[newStatus]?.label || newStatus}`,
      `${task.id} (${task.serviceName}) is now ${STATUS_METADATA[newStatus]?.label}.`,
      newStatus === 'completed' || newStatus === 'delivered' ? 'success' : newStatus === 'needs_info' ? 'warning' : 'info',
      task.id
    );

    return { success: true };
  };

  // Payment Verification
  const verifyPayment = (taskId: string, method: PaymentMethod, reference: string, verifierName: string): boolean => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return false;

    const auditEntry = {
      id: `aud-${Date.now()}`,
      fromStatus: task.status,
      toStatus: 'paid' as TaskStatus,
      actorRole: currentRole,
      actorName: verifierName,
      timestamp: new Date().toISOString(),
      note: `Payment verified via ${method.toUpperCase()}. Ref: ${reference}. Task approved.`
    };

    const updatedTask: CyberTask = {
      ...task,
      status: 'paid',
      payment: {
        method,
        status: 'verified',
        reference,
        paidAt: new Date().toISOString(),
        verifiedBy: verifierName,
        receiptNumber: `BJS-REC-${Date.now().toString().slice(-6)}`
      },
      auditTrail: [...task.auditTrail, auditEntry],
      updatedAt: new Date().toISOString()
    };

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    if (activeTaskDetail?.id === taskId) {
      setActiveTaskDetail(updatedTask);
    }

    addNotification(
      'Payment Confirmed',
      `Payment of ₦${task.totalAmount.toLocaleString()} for ${task.id} verified. Ready for operator assignment.`,
      'success',
      task.id
    );

    return true;
  };

  // Assign Worker
  const assignWorker = (taskId: string, workerId: string, adminName: string): boolean => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return false;
    const res = transitionTaskStatus(
      taskId,
      'assigned',
      `Assigned to ${worker.name} (${worker.title}) by ${adminName}.`,
      { workerId }
    );
    return res.success;
  };

  // Request Needs Info
  const requestNeedsInfo = (taskId: string, reason: string, workerName: string): boolean => {
    const res = transitionTaskStatus(taskId, 'needs_info', reason);
    return res.success;
  };

  // Resolve Needs Info
  const resolveNeedsInfo = (taskId: string, responseNote: string, files?: AttachedFile[]): boolean => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return false;

    if (files && files.length > 0) {
      task.customerFiles = [...task.customerFiles, ...files];
    }

    const res = transitionTaskStatus(
      taskId,
      'in_progress',
      `Customer supplied requested clarification: "${responseNote}"`,
      { responseNote }
    );
    return res.success;
  };

  // Complete Task
  const completeTask = (taskId: string, workerName: string, deliveryFile: AttachedFile, notes?: string): boolean => {
    const res = transitionTaskStatus(
      taskId,
      'completed',
      notes || 'Task processing finished. Result document generated & stamped.',
      { deliveryFile }
    );
    return res.success;
  };

  // Deliver Task
  const deliverTask = (taskId: string, actorName: string): boolean => {
    const res = transitionTaskStatus(taskId, 'delivered', `Delivered / Downloaded by ${actorName}.`);
    return res.success;
  };

  return (
    <CyberContext.Provider
      value={{
        tasks,
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        loginAsDemo,
        logout,
        isLoggedIn: !!currentUser,
        activeWorkerId,
        setActiveWorkerId,
        workers,
        services,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        clearAllNotifications,
        addNotification,
        createTask,
        transitionTaskStatus,
        verifyPayment,
        assignWorker,
        requestNeedsInfo,
        resolveNeedsInfo,
        completeTask,
        deliverTask,
        activeModal,
        setActiveModal,
        selectedServiceForOrder,
        setSelectedServiceForOrder,
        activeTaskDetail,
        setActiveTaskDetail,
        toast,
        showToast,
        hideToast,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        supabaseConfigured,
        userProfiles,
        fetchUserProfiles,
        updateUserRole,
        createService,
        updateService,
        deleteService,
        resetServicesToDefault,
        siteSettings,
        updateSiteSettings,
        resetSiteSettings
      }}
    >
      {children}
    </CyberContext.Provider>
  );
}

export function useCyber() {
  const context = useContext(CyberContext);
  if (!context) {
    throw new Error('useCyber must be used within a CyberProvider');
  }
  return context;
}
