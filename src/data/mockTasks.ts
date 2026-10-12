import { CyberTask } from '../types';

export const INITIAL_TASKS: CyberTask[] = [
  {
    id: 'BJ-TASK-101',
    trackingCode: 'BJ-TRK-78401',
    serviceId: 'futo-acceptance-fee',
    serviceName: 'Acceptance & Development Fees Payment',
    category: 'Fees & Payments',
    customerName: 'Chibuike Victor Eze',
    customerPhone: '08149204812',
    customerEmail: 'chibuike.eze@futo.edu.ng',
    isWalkIn: false,
    status: 'in_progress',
    priority: 'express',
    basePrice: 40000,
    serviceFee: 1500,
    expressSurcharge: 500,
    totalAmount: 42000,
    payment: {
      method: 'paystack',
      status: 'verified',
      reference: 'PSTK_9918239014',
      paidAt: '2026-09-25T14:10:00Z',
      verifiedBy: 'Paystack Automated Webhook',
      receiptNumber: 'BJS-REC-2026-8812'
    },
    formData: {
      jambRegNo: '202610948201AB',
      department: 'Electrical & Electronic Engineering',
      entryMode: 'UTME (100L)',
      remitaRrr: '2901-4402-1920'
    },
    customerFiles: [
      {
        id: 'file-1',
        name: 'JAMB_Admission_Letter_Victor.pdf',
        size: 342000,
        type: 'application/pdf',
        uploadedAt: '2026-09-25T14:05:00Z',
        uploadedBy: 'Customer',
        url: '#'
      }
    ],
    assignedWorkerId: 'worker-blessing',
    assignedWorkerName: 'Blessing Nwachukwu',
    assignedAt: '2026-09-25T14:15:00Z',
    estimatedTurnaroundMinutes: 25,
    slaDeadline: new Date(Date.now() + 18 * 60 * 1000).toISOString(), // 18 mins left
    deliveryFiles: [],
    needsInfoRecords: [],
    auditTrail: [
      {
        id: 'aud-101-1',
        toStatus: 'draft',
        actorRole: 'customer',
        actorName: 'Chibuike Victor Eze',
        timestamp: '2026-09-25T14:05:00Z',
        note: 'Customer filled online application form and uploaded JAMB admission letter.'
      },
      {
        id: 'aud-101-2',
        fromStatus: 'draft',
        toStatus: 'pending_payment',
        actorRole: 'customer',
        actorName: 'Chibuike Victor Eze',
        timestamp: '2026-09-25T14:07:00Z',
        note: 'Selected Paystack online checkout with Express Processing.'
      },
      {
        id: 'aud-101-3',
        fromStatus: 'pending_payment',
        toStatus: 'paid',
        actorRole: 'admin',
        actorName: 'Paystack System Webhook',
        timestamp: '2026-09-25T14:10:00Z',
        note: 'Payment of ₦42,000 confirmed successfully. Reference PSTK_9918239014.'
      },
      {
        id: 'aud-101-4',
        fromStatus: 'paid',
        toStatus: 'assigned',
        actorRole: 'admin',
        actorName: 'Manager Benjamin',
        timestamp: '2026-09-25T14:15:00Z',
        note: 'Assigned to Blessing Nwachukwu (Remita & Fees Specialist).'
      },
      {
        id: 'aud-101-5',
        fromStatus: 'assigned',
        toStatus: 'in_progress',
        actorRole: 'worker',
        actorName: 'Blessing Nwachukwu',
        timestamp: '2026-09-25T14:18:00Z',
        note: 'Generating Remita portal payment receipt and logging into FUTO Acceptance portal.'
      }
    ],
    createdAt: '2026-09-25T14:05:00Z',
    updatedAt: '2026-09-25T14:18:00Z'
  },
  {
    id: 'BJ-TASK-102',
    trackingCode: 'BJ-TRK-90412',
    serviceId: 'jamb-caps-olevel-upload',
    serviceName: "O'Level Upload to JAMB CAPS",
    category: 'Admissions & Portals',
    customerName: 'Adanna Stephanie Nwosu',
    customerPhone: '08038192044',
    customerEmail: 'adanna.nwosu@gmail.com',
    isWalkIn: false,
    status: 'needs_info',
    priority: 'normal',
    basePrice: 1500,
    serviceFee: 500,
    expressSurcharge: 0,
    totalAmount: 2000,
    payment: {
      method: 'flutterwave',
      status: 'verified',
      reference: 'FLW_MOCK_4491028',
      paidAt: '2026-09-25T11:30:00Z',
      verifiedBy: 'Flutterwave Switch'
    },
    formData: {
      jambProfileCode: '6019284019',
      examType: 'WAEC May/June',
      examYear: '2024',
      examNumber: '4291048201'
    },
    customerFiles: [
      {
        id: 'file-2a',
        name: 'WAEC_Statement_blurry.jpg',
        size: 198000,
        type: 'image/jpeg',
        uploadedAt: '2026-09-25T11:28:00Z',
        uploadedBy: 'Customer',
        url: '#'
      }
    ],
    assignedWorkerId: 'worker-emeka',
    assignedWorkerName: 'Emeka Okafor',
    assignedAt: '2026-09-25T11:35:00Z',
    estimatedTurnaroundMinutes: 20,
    slaDeadline: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    deliveryFiles: [],
    needsInfoRecords: [
      {
        id: 'info-1',
        requestedAt: '2026-09-25T11:42:00Z',
        requestedBy: 'Emeka Okafor',
        reason: 'The WAEC statement photo uploaded is blurry and the examination center number cannot be verified on the JAMB CAPS portal. Please upload a clear flat scan or photo.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-102-1',
        toStatus: 'draft',
        actorRole: 'customer',
        actorName: 'Adanna Stephanie Nwosu',
        timestamp: '2026-09-25T11:28:00Z'
      },
      {
        id: 'aud-102-2',
        fromStatus: 'draft',
        toStatus: 'pending_payment',
        actorRole: 'customer',
        actorName: 'Adanna Stephanie Nwosu',
        timestamp: '2026-09-25T11:29:00Z'
      },
      {
        id: 'aud-102-3',
        fromStatus: 'pending_payment',
        toStatus: 'paid',
        actorRole: 'admin',
        actorName: 'Flutterwave System',
        timestamp: '2026-09-25T11:30:00Z',
        note: 'Payment of ₦2,000 received.'
      },
      {
        id: 'aud-102-4',
        fromStatus: 'paid',
        toStatus: 'assigned',
        actorRole: 'admin',
        actorName: 'Manager Benjamin',
        timestamp: '2026-09-25T11:35:00Z',
        note: 'Assigned to Emeka Okafor.'
      },
      {
        id: 'aud-102-5',
        fromStatus: 'assigned',
        toStatus: 'needs_info',
        actorRole: 'worker',
        actorName: 'Emeka Okafor',
        timestamp: '2026-09-25T11:42:00Z',
        note: 'Flagged: Result photo illegible. Paused SLA timer until student re-uploads.'
      }
    ],
    createdAt: '2026-09-25T11:28:00Z',
    updatedAt: '2026-09-25T11:42:00Z'
  },
  {
    id: 'BJ-TASK-103',
    trackingCode: 'BJ-TRK-66103',
    serviceId: 'nimc-id-card-printing',
    serviceName: 'NIMC / NIN Smart Plastic ID-Card Printing',
    category: 'Printing & IDs',
    customerName: 'Kelechi Emmanuel Obi',
    customerPhone: '07065910284',
    customerEmail: 'kelechi.obi@gmail.com',
    isWalkIn: true,
    staffCreatedId: 'worker-chidi',
    status: 'completed',
    priority: 'normal',
    basePrice: 1500,
    serviceFee: 500,
    expressSurcharge: 0,
    totalAmount: 2000,
    payment: {
      method: 'pos',
      status: 'verified',
      reference: 'POS_BJS_8829104',
      paidAt: '2026-09-25T09:15:00Z',
      verifiedBy: 'Chidi Amadi (Front Desk POS)'
    },
    formData: {
      ninNumber: '89102948192',
      cardFinish: 'Standard Laminated PVC (Heavy Duty)'
    },
    customerFiles: [
      {
        id: 'file-3a',
        name: 'Kelechi_NIN_Slip.pdf',
        size: 512000,
        type: 'application/pdf',
        uploadedAt: '2026-09-25T09:12:00Z',
        uploadedBy: 'Walk-in Counter Desk',
        url: '#'
      }
    ],
    assignedWorkerId: 'worker-chidi',
    assignedWorkerName: 'Chidi Amadi',
    assignedAt: '2026-09-25T09:16:00Z',
    estimatedTurnaroundMinutes: 20,
    slaDeadline: '2026-09-25T09:36:00Z',
    completedAt: '2026-09-25T09:32:00Z',
    deliveryFiles: [
      {
        id: 'res-3a',
        name: 'BJ_NIMC_Card_Proof_Obi.pdf',
        size: 1420000,
        type: 'application/pdf',
        uploadedAt: '2026-09-25T09:32:00Z',
        uploadedBy: 'Chidi Amadi',
        isResult: true,
        url: '#'
      }
    ],
    deliveryNotes: 'Card laminated, encoded with Fargo C50 printer, ready for pickup at front desk or digital download.',
    needsInfoRecords: [],
    auditTrail: [
      {
        id: 'aud-103-1',
        toStatus: 'paid',
        actorRole: 'worker',
        actorName: 'Chidi Amadi',
        timestamp: '2026-09-25T09:15:00Z',
        note: 'Walk-in customer order created at counter desk. POS payment ₦2,000 collected.'
      },
      {
        id: 'aud-103-2',
        fromStatus: 'paid',
        toStatus: 'assigned',
        actorRole: 'admin',
        actorName: 'Manager Benjamin',
        timestamp: '2026-09-25T09:16:00Z',
        note: 'Auto-assigned to Chidi Amadi.'
      },
      {
        id: 'aud-103-3',
        fromStatus: 'assigned',
        toStatus: 'in_progress',
        actorRole: 'worker',
        actorName: 'Chidi Amadi',
        timestamp: '2026-09-25T09:18:00Z',
        note: 'Started printing front & back layout.'
      },
      {
        id: 'aud-103-4',
        fromStatus: 'in_progress',
        toStatus: 'completed',
        actorRole: 'worker',
        actorName: 'Chidi Amadi',
        timestamp: '2026-09-25T09:32:00Z',
        note: 'Lamination complete. SMS notification sent to customer.'
      }
    ],
    createdAt: '2026-09-25T09:12:00Z',
    updatedAt: '2026-09-25T09:32:00Z'
  },
  {
    id: 'BJ-TASK-104',
    trackingCode: 'BJ-TRK-44219',
    serviceId: 'nysc-registration-center',
    serviceName: 'Accredited NYSC Registration & Mobilization',
    category: 'Admissions & Portals',
    customerName: 'Chiamaka MaryJane Ugwu',
    customerPhone: '08169018492',
    customerEmail: 'chiamaka.ugwu@futo.edu.ng',
    isWalkIn: false,
    status: 'paid',
    priority: 'normal',
    basePrice: 3000,
    serviceFee: 1000,
    expressSurcharge: 0,
    totalAmount: 4000,
    payment: {
      method: 'bank_transfer',
      status: 'verified',
      reference: 'TRF_ZENITH_88291',
      paidAt: '2026-09-25T15:20:00Z',
      verifiedBy: 'Manager Benjamin (Admin)'
    },
    formData: {
      callUpName: 'UGWU CHIAMAKA MARYJANE',
      futoMatric: '2019/119402',
      bloodGroup: 'B+, AA',
      shirtSize: 'Shirt: M, Shoe: 39'
    },
    customerFiles: [
      {
        id: 'file-4a',
        name: 'Senate_List_Statement.pdf',
        size: 420000,
        type: 'application/pdf',
        uploadedAt: '2026-09-25T15:10:00Z',
        uploadedBy: 'Customer',
        url: '#'
      },
      {
        id: 'file-4b',
        name: 'Passport_White_Bg.jpg',
        size: 154000,
        type: 'image/jpeg',
        uploadedAt: '2026-09-25T15:11:00Z',
        uploadedBy: 'Customer',
        url: '#'
      }
    ],
    estimatedTurnaroundMinutes: 35,
    slaDeadline: new Date(Date.now() + 120 * 60 * 1000).toISOString(),
    deliveryFiles: [],
    needsInfoRecords: [],
    auditTrail: [
      {
        id: 'aud-104-1',
        toStatus: 'draft',
        actorRole: 'customer',
        actorName: 'Chiamaka MaryJane Ugwu',
        timestamp: '2026-09-25T15:10:00Z'
      },
      {
        id: 'aud-104-2',
        fromStatus: 'draft',
        toStatus: 'pending_payment',
        actorRole: 'customer',
        actorName: 'Chiamaka MaryJane Ugwu',
        timestamp: '2026-09-25T15:12:00Z',
        note: 'Customer transferred ₦4,000 to Moniepoint account.'
      },
      {
        id: 'aud-104-3',
        fromStatus: 'pending_payment',
        toStatus: 'paid',
        actorRole: 'admin',
        actorName: 'Manager Benjamin',
        timestamp: '2026-09-25T15:20:00Z',
        note: 'Bank credit alert confirmed for ₦4,000 from Chiamaka Ugwu. Task ready for assignment.'
      }
    ],
    createdAt: '2026-09-25T15:10:00Z',
    updatedAt: '2026-09-25T15:20:00Z'
  },
  {
    id: 'BJ-TASK-105',
    trackingCode: 'BJ-TRK-22891',
    serviceId: 'remita-all-forms',
    serviceName: 'All Forms of Remita Payment (RRR)',
    category: 'Remita',
    customerName: 'Engr. Daniel Alvan',
    customerPhone: '08034567890',
    customerEmail: 'daniel.alvan@yahoo.com',
    isWalkIn: true,
    status: 'pending_payment',
    priority: 'normal',
    basePrice: 5000,
    serviceFee: 1000,
    expressSurcharge: 0,
    totalAmount: 6000,
    payment: {
      method: 'cash',
      status: 'pending_verification',
      reference: 'CASH_WAITING_092',
    },
    formData: {
      mdaName: 'Federal University of Technology Owerri',
      serviceType: 'Transcript & Academic Records Processing',
      principalAmount: 5000
    },
    customerFiles: [],
    estimatedTurnaroundMinutes: 15,
    slaDeadline: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    deliveryFiles: [],
    needsInfoRecords: [],
    auditTrail: [
      {
        id: 'aud-105-1',
        toStatus: 'pending_payment',
        actorRole: 'admin',
        actorName: 'Counter Cashier',
        timestamp: '2026-09-25T16:00:00Z',
        note: 'Order initiated at counter. Customer paying cash at cashier desk.'
      }
    ],
    createdAt: '2026-09-25T16:00:00Z',
    updatedAt: '2026-09-25T16:00:00Z'
  },
  {
    id: 'BJ-TASK-106',
    trackingCode: 'BJ-TRK-11094',
    serviceId: 'jamb-original-result-printing',
    serviceName: 'Original JAMB Result Slip & Admission Letter',
    category: 'Printing & IDs',
    customerName: 'Somtochukwu Precious Igwe',
    customerPhone: '08123456789',
    customerEmail: 'somto.igwe@outlook.com',
    isWalkIn: false,
    status: 'delivered',
    priority: 'express',
    basePrice: 2000,
    serviceFee: 500,
    expressSurcharge: 500,
    totalAmount: 3000,
    payment: {
      method: 'paystack',
      status: 'verified',
      reference: 'PSTK_77192048',
      paidAt: '2026-09-24T10:00:00Z',
      verifiedBy: 'Paystack Automated'
    },
    formData: {
      jambRegNo: '202510394819CD',
      documentType: 'Both Result & Admission Letter (Combo)',
      examYear: '2025'
    },
    customerFiles: [],
    assignedWorkerId: 'worker-chidi',
    assignedWorkerName: 'Chidi Amadi',
    assignedAt: '2026-09-24T10:05:00Z',
    estimatedTurnaroundMinutes: 15,
    slaDeadline: '2026-09-24T10:20:00Z',
    completedAt: '2026-09-24T10:18:00Z',
    deliveredAt: '2026-09-24T10:25:00Z',
    deliveryFiles: [
      {
        id: 'res-6a',
        name: 'Original_JAMB_Result_Somtochukwu.pdf',
        size: 890000,
        type: 'application/pdf',
        uploadedAt: '2026-09-24T10:18:00Z',
        uploadedBy: 'Chidi Amadi',
        isResult: true,
        url: '#'
      }
    ],
    deliveryNotes: 'Direct print extracted with barcode verified. Stamped and released.',
    needsInfoRecords: [],
    auditTrail: [
      {
        id: 'aud-106-1',
        toStatus: 'paid',
        actorRole: 'customer',
        actorName: 'Somtochukwu Precious Igwe',
        timestamp: '2026-09-24T10:00:00Z'
      },
      {
        id: 'aud-106-2',
        fromStatus: 'paid',
        toStatus: 'assigned',
        actorRole: 'admin',
        actorName: 'Manager Benjamin',
        timestamp: '2026-09-24T10:05:00Z'
      },
      {
        id: 'aud-106-3',
        fromStatus: 'assigned',
        toStatus: 'in_progress',
        actorRole: 'worker',
        actorName: 'Chidi Amadi',
        timestamp: '2026-09-24T10:08:00Z'
      },
      {
        id: 'aud-106-4',
        fromStatus: 'in_progress',
        toStatus: 'completed',
        actorRole: 'worker',
        actorName: 'Chidi Amadi',
        timestamp: '2026-09-24T10:18:00Z'
      },
      {
        id: 'aud-106-5',
        fromStatus: 'completed',
        toStatus: 'delivered',
        actorRole: 'customer',
        actorName: 'Somtochukwu Precious Igwe',
        timestamp: '2026-09-24T10:25:00Z',
        note: 'Customer downloaded official documents.'
      }
    ],
    createdAt: '2026-09-24T09:55:00Z',
    updatedAt: '2026-09-24T10:25:00Z'
  }
];
