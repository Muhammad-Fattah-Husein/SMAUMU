import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicDashboard } from './PublicDashboard';
import { AdminDashboard } from './AdminDashboard';
import { Login } from './Login';
import { SchoolDetailPage } from './pages/SchoolDetailPage';

export default function App() {
  return (
    <AuthProvider>
      {/* HashRouter guarantees seamless routing on GitHub Pages without 404 on refresh */}
      <Router>
        <div className="min-h-screen flex flex-col bg-base text-gray-800 font-body antialiased selection:bg-primary selection:text-white">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Public Unauthenticated Route: Real-Time SMAN Quota Grid */}
              <Route path="/" element={<PublicDashboard />} />

              {/* Public School Detail View */}
              <Route path="/schools/:id" element={<SchoolDetailPage />} />

              {/* Admin Login Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Route: Admin School Quota Management */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all: Redirect unknown routes back to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
