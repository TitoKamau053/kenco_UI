import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout components
import PublicLayout from './layouts/PublicLayout';
import LandlordLayout from './layouts/LandlordLayout';
import TenantLayout from './layouts/TenantLayout';

// Public pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PropertiesPage from './pages/public/PropertiesPage';
import PropertyDetailsPage from './pages/public/PropertyDetailsPage';

// Landlord pages
import LandlordDashboard from './pages/landlord/LandlordDashboard';
import ManageTenantsPage from './pages/landlord/ManageTenantsPage';
import ManagePropertiesPage from './pages/landlord/ManagePropertiesPage';
import ViewPaymentsPage from './pages/landlord/LandlordPaymentsPage';
import ComplaintsPage from './pages/landlord/LandlordsComplaintsPage';

// Tenant pages
import TenantDashboard from './pages/tenant/TenantDashboard';
import MakePaymentPage from './pages/tenant/MakePaymentPage';
import PaymentHistoryPage from './pages/tenant/PaymentHistoryPage';
import SubmitComplaintPage from './pages/tenant/SubmitComplaintPage';

// Auth and context
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          </Route>

          {/* Landlord routes */}
          <Route 
            element={
              <ProtectedRoute role="landlord">
                <LandlordLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
            <Route path="/landlord/tenants" element={<ManageTenantsPage />} />
            <Route path="/landlord/properties" element={<ManagePropertiesPage />} />
            <Route path="/landlord/payments" element={<ViewPaymentsPage />} />
            <Route path="/landlord/complaints" element={<ComplaintsPage />} />
          </Route>

          {/* Tenant routes */}
          <Route 
            element={
              <ProtectedRoute role="tenant">
                <TenantLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/tenant/dashboard" element={<TenantDashboard />} />
            <Route path="/tenant/pay" element={<MakePaymentPage />} />
            <Route path="/tenant/payments" element={<PaymentHistoryPage />} />
            <Route path="/tenant/complaints" element={<SubmitComplaintPage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;