import { SiteSettings } from '../types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: 'BJ Services',
  tagline: 'Unlimited Grace & Mercy',
  location: 'Business Center Area, Beside PPRC Building, Old Registry Area, FUTO, Imo State.',
  heroBadge: 'BJ SERVICES (UNLIMITED GRACE & MERCY) • FUTO',
  heroBadgeMobile: 'BJ SERVICES • FUTO DIGITAL HUB',
  showTicker: true,
  announcementTicker: '🚨 FUTO 2024/2025 Supplementary & Direct Entry Screening Now Active • NIMC Smart Card Production In Progress Beside PPRC • 150 Mbps High-Speed Fibre Hotspot Available 24/7',
  bankDetails: {
    bankName: 'Moniepoint Microfinance Bank',
    accountNumber: '8166221330',
    accountName: 'BJ SERVICES ENTERPRISE',
    alternativeBank: 'Zenith Bank (1014829104 - BJ Services)',
    allowTransfer: true,
    allowCashAtCounter: true,
    paymentInstructions: 'Transfer exact total amount to the account below, then quote reference or show alert at counter.'
  },
  wifiRates: {
    oneHour: 300,
    fourHours: 600,
    twentyFourHours: 1000,
    hotspotSsid: 'BJ_SERVICES_5GHz_FIBRE',
    speed: '150 Mbps Symmetrical',
    generatorStatus: 'Lister Generator & Solar Inverter Active (24/7 Guaranteed Power)',
    isHotspotActive: true
  },
  contact: {
    primaryPhone: '08166221330',
    secondaryPhone: '08033892455',
    whatsapp: '+2348033892455',
    email: 'bjservicesoffice2022@gmail.com',
    address: 'Old Registry Area, Beside PPRC, FUTO Main Campus, Owerri, Imo State',
    openingHours: 'Monday – Saturday: 7:30 AM – 9:00 PM'
  }
};
