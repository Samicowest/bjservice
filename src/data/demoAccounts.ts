import { DemoUser } from '../types';

export const DEMO_ACCOUNTS: DemoUser[] = [
  {
    id: 'demo-customer',
    name: 'Chibuike Victor Eze',
    email: 'chibuike.eze@futo.edu.ng',
    role: 'customer',
    avatar: '👨‍🎓',
    title: '300L Undergraduate Student',
    badge: 'Student Portal',
    phone: '08149204812',
    matricNo: '2021/109482',
    department: 'Electrical & Electronic Engineering',
    desk: 'FUTO Campus Student'
  },
  {
    id: 'demo-worker',
    name: 'Blessing Nwachukwu',
    email: 'blessing@bjservices.com',
    role: 'worker',
    avatar: '👩‍💻',
    title: 'Senior Cybercafe Operator',
    badge: 'Staff Desk 1',
    phone: '08166221330',
    desk: 'Desk 1 - Remita & Admissions'
  },
  {
    id: 'demo-admin',
    name: 'Engr. BJ (Supervisor)',
    email: 'admin@bjservices.com',
    role: 'admin',
    avatar: '🛡️',
    title: 'Operations Manager & Verifier',
    badge: 'Manager Hub',
    phone: '08033892455',
    desk: 'Central Admin Office'
  },
  {
    id: 'demo-owner',
    name: 'Amos Ayinla',
    email: 'bjservicesworkspace@gmail.com',
    role: 'super_admin',
    avatar: '👑',
    title: 'Managing Director & Super Admin',
    badge: 'Executive Suite',
    phone: '08033892455',
    desk: 'Executive Suite'
  }
];
