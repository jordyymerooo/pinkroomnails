import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppButton from '../components/layout/WhatsAppButton';
import Sidebar from '../components/admin/Sidebar';
import HomePage from '../pages/public/HomePage';
import BookingPage from '../pages/public/BookingPage';
import LoginPage from '../pages/admin/LoginPage';
import DashboardPage from '../pages/admin/DashboardPage';
import AppointmentsPage from '../pages/admin/AppointmentsPage';
import ServicesPage from '../pages/admin/ServicesPage';
import GalleryPage from '../pages/admin/GalleryPage';
import SchedulePage from '../pages/admin/SchedulePage';
import TermsPage from '../pages/public/TermsPage';
import PrivacyPage from '../pages/public/PrivacyPage';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function AdminLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-dark-900 flex items-center justify-center"><div className="loader-nail" /></div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 pt-28 lg:pt-10 min-h-screen overflow-x-hidden bg-gray-950 w-full min-w-0">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Route>
          {/* Admin */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="schedule" element={<SchedulePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
