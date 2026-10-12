import { CyberService } from '../types';

export const SERVICES_CATALOG: CyberService[] = [
  {
    id: 'futo-acceptance-fee',
    name: 'Acceptance & Development Fees Payment',
    category: 'Fees & Payments',
    shortDesc: 'Instant Remita invoice generation, acceptance fee payment & clearance slip.',
    description: 'Complete FUTO acceptance fee portal clearance. We generate the official Remita Retrieval Reference (RRR), process payment through banking switch, and print your verified acceptance slip.',
    basePrice: 40000,
    serviceFee: 1500,
    totalPrice: 41500,
    estimatedMinutes: 25,
    iconName: 'CreditCard',
    image: '/images/hub_remita_payment.jpg',
    popular: true,
    fields: [
      { id: 'jambRegNo', label: 'JAMB Registration Number', type: 'text', placeholder: 'e.g. 202610483921FA', required: true },
      { id: 'department', label: 'Admitted Department / Programme', type: 'text', placeholder: 'e.g. Electrical & Electronic Engineering', required: true },
      { id: 'remitaRrr', label: 'Remita RRR (Leave blank if you want us to generate)', type: 'text', placeholder: 'e.g. 3302-8819-0021', required: false },
      { id: 'entryMode', label: 'Mode of Entry', type: 'select', required: true, options: ['UTME (100L)', 'Direct Entry (200L)', 'Pre-Degree Conversion', 'Postgraduate'] }
    ],
    requiredDocTypes: ['JAMB Admission Letter or Screening Slip']
  },
  {
    id: 'futo-school-fees',
    name: 'School Fees Payment & E-Receipt Portal',
    category: 'Fees & Payments',
    shortDesc: 'Portal invoice generation, Remita payment and student receipt clearance.',
    description: 'Fast, secure FUTO school fees payment for new and returning students (Undergraduate & Postgraduate). Avoid bank queues and get your official portal stamp.',
    basePrice: 52000,
    serviceFee: 2000,
    totalPrice: 54000,
    estimatedMinutes: 30,
    iconName: 'GraduationCap',
    image: '/images/hub_remita_payment.jpg',
    popular: true,
    officialFormId: 'school-fees',
    fields: [
      { id: 'regNo', label: 'FUTO Matric / Reg Number', type: 'text', placeholder: 'e.g. 2023/104928', required: true },
      { id: 'schoolFaculty', label: 'School / Faculty', type: 'select', required: true, options: ['SEET (Engineering)', 'SICT (Computing)', 'SOES (Environmental)', 'SOPS (Physical Sciences)', 'SAAT (Agriculture)', 'SBMS (Basic Medical)'] },
      { id: 'level', label: 'Current Level', type: 'select', required: true, options: ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level', 'Spillover / DGS'] },
      { id: 'academicSession', label: 'Academic Session', type: 'select', required: true, options: ['2025/2026', '2026/2027'] }
    ],
    requiredDocTypes: ['Previous Session Receipt or Clearance Form']
  },
  {
    id: 'remita-transcript',
    name: 'FUTO Transcript Processing Form',
    category: 'Remita',
    shortDesc: 'Official transcript dispatch, Destination Address, TPS Code & Remita clearance.',
    description: 'Direct registry transcript application processing. We verify your matric number, graduation date, TPS code, Remita RRR, and institution destination address for academic dispatch.',
    basePrice: 1500,
    serviceFee: 2000,
    totalPrice: 17000,
    estimatedMinutes: 25,
    iconName: 'FileText',
    image: '/images/hub_thesis_binding.jpg',
    popular: true,
    officialFormId: 'transcript',
    fields: [
      { id: 'matricNumber', label: 'Matriculation Number', type: 'text', placeholder: 'e.g. 2018/109482', required: true },
      { id: 'institutionName', label: 'Destination Institution Name', type: 'text', placeholder: 'e.g. University of Manchester', required: true },
      { id: 'tpsCode', label: 'TPS Code', type: 'text', placeholder: 'TPS Code (if assigned)', required: false },
      { id: 'rrr', label: 'Remita RRR', type: 'text', placeholder: '12-digit RRR', required: false }
    ],
    requiredDocTypes: ['Degree Certificate / Statement of Result']
  },
  {
    id: 'supplementary-admission',
    name: 'FUTO Supplementary Admission Form',
    category: 'Admissions & Portals',
    shortDesc: 'Supplementary course selection, 10-digit JAMB reg number and portal invoice.',
    description: 'Accredited supplementary admission portal processing. File your choice supplementary course, verify 10-digit JAMB number, generate Remita invoice and get official office verification.',
    basePrice: 12000,
    serviceFee: 1500,
    totalPrice: 13500,
    estimatedMinutes: 20,
    iconName: 'FileCheck',
    image: '/images/hub_biometrics_registration.jpg',
    popular: true,
    officialFormId: 'supplementary',
    fields: [
      { id: 'jambRegNumber', label: 'JAMB Registration Number (10 digits)', type: 'text', placeholder: 'Enter 10-digit JAMB Number', required: true },
      { id: 'supplementaryCourse', label: 'Chosen Supplementary Course', type: 'text', placeholder: 'e.g. Mechatronics Engineering', required: true },
      { id: 'amount', label: 'Official Amount (₦)', type: 'number', placeholder: '12000', required: true }
    ],
    requiredDocTypes: ['JAMB Result Slip', "O'Level Result"]
  },
  {
    id: 'student-bio-data',
    name: "Student's Profile (Bio Data) Registration",
    category: 'Fees & Payments',
    shortDesc: 'Comprehensive personal bio-data, sponsor details, next of kin & programme profile.',
    description: 'Complete registration of student bio-data profile on the FUTO university portal. Enters personal, medical (blood group/genotype), sponsor, next of kin, and academic entry mode details.',
    basePrice: 2000,
    serviceFee: 500,
    totalPrice: 2500,
    estimatedMinutes: 25,
    iconName: 'UserCheck',
    image: '/images/hub_biometrics_registration.jpg',
    popular: true,
    officialFormId: 'bio-data',
    fields: [
      { id: 'jambRegNo', label: 'JAMB Reg No / Matric No', type: 'text', placeholder: 'e.g. 2026...', required: true },
      { id: 'department', label: 'Department', type: 'text', placeholder: 'e.g. Civil Engineering', required: true },
      { id: 'modeOfEntry', label: 'Mode of Entry', type: 'text', placeholder: 'UTME / DE / OTHERS', required: true }
    ],
    requiredDocTypes: ['Passport Photo', 'Birth Certificate / Declaration of Age']
  },
  {
    id: 'remita-all-forms',
    name: 'All Forms of Remita Payment (RRR)',
    category: 'Remita',
    shortDesc: 'Instant RRR generation, Remita portal payment & stamped e-receipt for any MDA.',
    description: 'Hassle-free Remita processing for all ministries, parastatals, university invoices, and federal institutions. Fast turnaround with instant audit receipt.',
    basePrice: 5000,
    serviceFee: 1000,
    totalPrice: 6000,
    estimatedMinutes: 15,
    iconName: 'Receipt',
    image: '/images/hub_remita_payment.jpg',
    popular: true,
    fields: [
      { id: 'mdaName', label: 'Name of Beneficiary / MDA / Organization', type: 'text', placeholder: 'e.g. Federal University of Technology Owerri', required: true },
      { id: 'serviceType', label: 'Service / Purpose of Payment', type: 'text', placeholder: 'e.g. Transcript Application, Tender Fee, Fine', required: true },
      { id: 'rrrNumber', label: 'Existing RRR (if already generated)', type: 'text', placeholder: '12-digit RRR', required: false },
      { id: 'principalAmount', label: 'Actual Amount to Pay (₦)', type: 'number', placeholder: 'e.g. 5000', required: true }
    ],
    requiredDocTypes: ['Invoice Advice / Notice (Optional)']
  },
  {
    id: 'jamb-caps-olevel-upload',
    name: "O'Level Upload to JAMB CAPS",
    category: 'Admissions & Portals',
    shortDesc: "Accredited JAMB CAPS upload of WAEC, NECO, or NABTEB results.",
    description: "Don't lose your admission due to missing O'Level credentials on JAMB CAPS. We verify and directly upload your statement of results to the central admissions processing system with official verification receipt.",
    basePrice: 1500,
    serviceFee: 500,
    totalPrice: 2000,
    estimatedMinutes: 20,
    iconName: 'UploadCloud',
    image: '/images/hub_biometrics_registration.jpg',
    popular: true,
    fields: [
      { id: 'jambProfileCode', label: 'JAMB Profile Code / Reg No', type: 'text', placeholder: 'e.g. 5928190382 or 2026...', required: true },
      { id: 'examType', label: 'Examination Body', type: 'select', required: true, options: ['WAEC May/June', 'WAEC GCE (Nov/Dec)', 'NECO SSCE (June/July)', 'NECO External', 'NABTEB'] },
      { id: 'examYear', label: 'Exam Year', type: 'text', placeholder: 'e.g. 2024 or 2025', required: true },
      { id: 'examNumber', label: 'Candidate Examination Number', type: 'text', placeholder: 'e.g. 4291829012', required: true }
    ],
    requiredDocTypes: ["O'Level Statement of Result / Certificate", 'Scratch Card Token Slip (if available)']
  },
  {
    id: 'online-app-post-utme',
    name: 'Online Post-UTME & Application Registration',
    category: 'Admissions & Portals',
    shortDesc: 'Full Post-UTME registration, screening form filing and slip printing.',
    description: 'Accredited application portal registration for FUTO, JUPEB, Pre-Degree, and all tertiary institutions. We verify course eligibility, upload passport, and print confirmation slips.',
    basePrice: 2500,
    serviceFee: 1000,
    totalPrice: 3500,
    estimatedMinutes: 30,
    iconName: 'FileText',
    image: '/images/slide_cybercafe_1791618919524.jpg',
    popular: true,
    officialFormId: 'post-utme',
    fields: [
      { id: 'targetSchool', label: 'Institution / Application Type', type: 'select', required: true, options: ['FUTO Post-UTME Screening', 'JUPEB Application Form', 'Online Pre-degree Form', 'JAMB Direct Entry / UTME', 'Nerd Tech Registration'] },
      { id: 'jambScore', label: 'JAMB UTME Score (if applicable)', type: 'number', placeholder: 'e.g. 248', required: false },
      { id: 'firstChoiceCourse', label: 'First Choice Course', type: 'text', placeholder: 'e.g. Computer Science', required: true },
      { id: 'nextOfKinPhone', label: 'Next of Kin Contact Phone', type: 'text', placeholder: 'e.g. 08031234567', required: true }
    ],
    requiredDocTypes: ['Passport Photograph', "JAMB Result Slip", "O'Level Result"]
  },
  {
    id: 'nysc-registration-center',
    name: 'Accredited NYSC Registration & Mobilization',
    category: 'Admissions & Portals',
    shortDesc: 'Biometric capture, green card processing, state selection and call-up letter.',
    description: 'BJ Services is an Accredited NYSC Registration Center. Fast, error-free profile setup, medical fitness upload, senate list verification, and kit size selection.',
    basePrice: 3000,
    serviceFee: 1000,
    totalPrice: 4000,
    estimatedMinutes: 35,
    iconName: 'Award',
    image: '/images/hub_biometrics_registration.jpg',
    popular: true,
    fields: [
      { id: 'callUpName', label: 'Full Legal Name on Senate List', type: 'text', placeholder: 'SURNAME Firstname Middlename', required: true },
      { id: 'futoMatric', label: 'Graduating Matric / Reg No', type: 'text', placeholder: 'e.g. 2019/108392', required: true },
      { id: 'bloodGroup', label: 'Blood Group & Genotype', type: 'text', placeholder: 'e.g. O+, AA', required: true },
      { id: 'shirtSize', label: 'Kit Kit Sizes (Shirt & Shoes)', type: 'text', placeholder: 'e.g. Shirt: L, Shoe: 43', required: true }
    ],
    requiredDocTypes: ['Graduation Clearance / Statement of Result', 'Passport Photograph (White background)']
  },
  {
    id: 'nimc-id-card-printing',
    name: 'NIMC / NIN Smart Plastic ID-Card Printing',
    category: 'Printing & IDs',
    shortDesc: 'High-definition color printing and plastic lamination of verified NIN slips.',
    description: 'Convert your digital NIN paper slip into a durable, waterproof PVC/smart plastic ID card. Printed on high-grade Fargo card printers with QR code verification.',
    basePrice: 1500,
    serviceFee: 500,
    totalPrice: 2000,
    estimatedMinutes: 20,
    iconName: 'IdCard',
    image: '/images/hub_pvc_smartcard.jpg',
    popular: true,
    fields: [
      { id: 'ninNumber', label: 'National Identification Number (NIN)', type: 'text', placeholder: '11-digit NIN', required: true },
      { id: 'trackingId', label: 'NIMC Tracking ID (Optional)', type: 'text', placeholder: 'Found on slip', required: false },
      { id: 'cardFinish', label: 'Card Finish Type', type: 'select', required: true, options: ['Standard Laminated PVC (Heavy Duty)', 'Dual-sided Smart QR Plastic', 'Pocket Matte Finish'] }
    ],
    requiredDocTypes: ['NIN Slip PDF or Clear Photo']
  },
  {
    id: 'jamb-original-result-printing',
    name: 'Original JAMB Result Slip & Admission Letter',
    category: 'Printing & IDs',
    shortDesc: 'Direct JAMB portal print with verified QR code, official stamps & colors.',
    description: 'Full color, genuine original JAMB Result Slip with passport photograph and official JAMB Admission Letter for university clearance, NYSC mobilization, or job screening.',
    basePrice: 2000,
    serviceFee: 500,
    totalPrice: 2500,
    estimatedMinutes: 15,
    iconName: 'Printer',
    image: '/images/slide_printer_1791618905733.jpg',
    popular: true,
    fields: [
      { id: 'jambRegNo', label: 'JAMB Registration Number', type: 'text', placeholder: 'e.g. 202510294821EF', required: true },
      { id: 'documentType', label: 'Document Needed', type: 'select', required: true, options: ['Original JAMB Result Slip (Color)', 'Original JAMB Admission Letter (Institution + Candidate copies)', 'Both Result & Admission Letter (Combo)'] },
      { id: 'examYear', label: 'Year of Examination', type: 'text', placeholder: 'e.g. 2025', required: true }
    ],
    requiredDocTypes: []
  },
  {
    id: 'futo-admission-forms-print',
    name: 'FUTO Admission Letter, Form 18 & 19 Printing',
    category: 'Printing & IDs',
    shortDesc: 'Essential freshman registration documents printed in full color.',
    description: 'Print all mandatory FUTO registry clearance documents including Form 18, Form 19, Student Verification Slip, and Departmental Screening clearance docket.',
    basePrice: 1200,
    serviceFee: 300,
    totalPrice: 1500,
    estimatedMinutes: 15,
    iconName: 'FileCheck',
    image: '/images/photocopier.png',
    fields: [
      { id: 'futoAppNo', label: 'FUTO Application / Reg Number', type: 'text', placeholder: 'e.g. FUTO/2026/09214', required: true },
      { id: 'department', label: 'Admitted Department', type: 'text', placeholder: 'e.g. Civil Engineering', required: true }
    ],
    requiredDocTypes: []
  },
  {
    id: 'waec-neco-scratch-cards',
    name: 'WAEC, NECO & NABTEB Scratch Cards / Tokens',
    category: 'Printing & IDs',
    shortDesc: 'Instant digital delivery or physical card token for online checking.',
    description: 'Original exam checking tokens with instant SMS/Email pin delivery or printed laminated card at BJ Services front desk.',
    basePrice: 2500,
    serviceFee: 500,
    totalPrice: 3000,
    estimatedMinutes: 10,
    iconName: 'KeyRound',
    image: '/images/hub_pvc_smartcard.jpg',
    fields: [
      { id: 'cardType', label: 'Token Type', type: 'select', required: true, options: ['WAEC e-PIN Checker', 'NECO Token (5-uses)', 'NABTEB e-PIN'] },
      { id: 'deliveryMode', label: 'Delivery Preference', type: 'select', required: true, options: ['Instant Digital Token via SMS & Dashboard', 'Physical Scratch Card at Counter'] },
      { id: 'recipientPhone', label: 'Recipient Mobile Number', type: 'text', placeholder: '080...', required: true }
    ],
    requiredDocTypes: []
  },
  {
    id: 'wifi-24hr-pass',
    name: '24-Hours High-Speed Cyber WiFi Voucher',
    category: 'WiFi & Internet',
    shortDesc: 'Unlimited high-speed WiFi hotspot access at BJ Services Business Center.',
    description: 'Connect your laptop or mobile phone to our high-speed Mikrotik optical fibre hotspot. Work smoothly 24/7 with zero buffering and generator backup.',
    basePrice: 1000,
    serviceFee: 0,
    totalPrice: 1000,
    estimatedMinutes: 5,
    iconName: 'Wifi',
    image: '/images/slide_wifi_1791618932400.jpg',
    popular: true,
    fields: [
      { id: 'deviceCount', label: 'Number of Devices', type: 'select', required: true, options: ['1 Device (24hr access)', '2 Devices Combo (24hr access)', 'Weekly Unlimited Pass (7 Days)'] },
      { id: 'preferredUsername', label: 'Preferred WiFi Username or Nickname', type: 'text', placeholder: 'e.g. sammy_tech', required: true }
    ],
    requiredDocTypes: []
  }
];

export const CATEGORIES = [
  'All Services',
  'Fees & Payments',
  'Remita',
  'Admissions & Portals',
  'Printing & IDs',
  'WiFi & Internet'
];
