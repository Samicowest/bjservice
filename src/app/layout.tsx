import type { Metadata } from 'next';
import './globals.css';
import { CyberProvider } from '../context/CyberContext';
import AppShell from '../components/AppShell';

export const metadata: Metadata = {
  title: 'BJ Services | Cybercafe Task Pipeline & FUTO Digital Hub',
  description:
    'Trackable cybercafe pipeline for FUTO students & public: Acceptance fees, Remita, JAMB CAPS O-level upload, NYSC mobilization, NIMC smart plastic ID printing & 24hr WiFi access.',
  keywords: [
    'BJ Services',
    'FUTO Cybercafe',
    'Remita Payment',
    'Acceptance Fee',
    'School Fees',
    'JAMB CAPS Upload',
    'NYSC Registration',
    'NIMC Plastic Card',
    'WiFi Hotspot FUTO'
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <CyberProvider>
          <AppShell>
            {children}
          </AppShell>
        </CyberProvider>
      </body>
    </html>
  );
}
