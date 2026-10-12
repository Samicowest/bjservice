'use client';

import Navbar from './Navbar';
import Footer from './Footer';
import OrderServiceModal from './OrderServiceModal';
import TaskDetailModal from './TaskDetailModal';
import WalkInModal from './WalkInModal';
import TrackModal from './TrackModal';
import NotificationDrawer from './NotificationDrawer';
import LoginModal from './LoginModal';
import WifiModal from './WifiModal';
import Toast from './Toast';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}
    >
      {/* Single Top Navigation with real links */}
      <Navbar />

      {/* Main Page Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      {/* Rich Multi-Column Website Footer */}
      <Footer />

      {/* Global Interactive Modals & Drawers */}
      <OrderServiceModal />
      <TaskDetailModal />
      <WalkInModal />
      <TrackModal />
      <WifiModal />
      <NotificationDrawer />
      <LoginModal />
      <Toast />
    </div>
  );
}
