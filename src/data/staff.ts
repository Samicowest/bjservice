import { Worker } from '../types';

export const WORKERS: Worker[] = [
  {
    id: 'worker-emeka',
    name: 'Emeka Okafor',
    role: 'worker',
    title: 'Senior Portal & JAMB Specialist',
    avatar: '👨‍💻',
    specialties: ['JAMB CAPS', 'NYSC Mobilization', 'Post-UTME'],
    activeTaskCount: 2,
    completedTodayCount: 9,
    isOnline: true
  },
  {
    id: 'worker-blessing',
    name: 'Blessing Nwachukwu',
    role: 'worker',
    title: 'Remita & Fees Billing Lead',
    avatar: '👩‍💼',
    specialties: ['Remita RRR', 'FUTO School Fees', 'Acceptance Clearance'],
    activeTaskCount: 3,
    completedTodayCount: 14,
    isOnline: true
  },
  {
    id: 'worker-chidi',
    name: 'Chidi Amadi',
    role: 'worker',
    title: 'Digital Card & High-Res Print Tech',
    avatar: '👨‍🎨',
    specialties: ['NIMC Plastic Cards', 'Original JAMB Slips', 'Formatting & Binding'],
    activeTaskCount: 1,
    completedTodayCount: 7,
    isOnline: true
  }
];

export const CAFE_INFO = {
  name: 'BJ Services',
  tagline: 'Unlimited Grace & Mercy',
  description: 'Premium cybercafe & digital administrative center located in FUTO, providing top-notch digital, Remita, portal admissions, and printing services.',
  location: 'Business Center Area, Beside PPRC Building, Old Registry Area, FUTO, Imo State.',
  phones: ['08166221330', '08033892455'],
  whatsapp: '+2348033892455',
  email: 'bjservicesoffice2022@gmail.com',
  bankDetails: {
    bankName: 'Moniepoint Microfinance Bank',
    accountNumber: '8166221330',
    accountName: 'BJ SERVICES ENTERPRISE',
    alternativeBank: 'Zenith Bank (1014829104 - BJ Services)'
  }
};
