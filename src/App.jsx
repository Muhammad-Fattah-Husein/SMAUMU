import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RootLayout } from './layouts/RootLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicDashboard } from './PublicDashboard';
import { AdminDashboard } from './AdminDashboard';
import { StudentDashboard } from './StudentDashboard';
import { LoginStudent } from './LoginStudent';
import { LoginAdmin } from './LoginAdmin';
import { Register } from './Register';
import { SchoolDetailPage } from './pages/SchoolDetailPage';

/**
 * SMAUMU Application Routing Architecture
 * 
 * 1. GLOBAL ROOT LAYOUT (RootLayout):
 *    - Minimalist TopNavbar rendered globally across ALL pages (/, /login, /register, etc.).
 *    - Main content offset with top clearance (pt-24 sm:pt-28) to prevent navbar overlap.
 * 
 * 2. PROTECTED STUDENT LAYOUT (StudentLayout):
 *    - Nested inside RootLayout for authenticated student users.
 *    - Floating Hover Side Navbar (StudentSideNav) exclusively shown here.
 *    - Left offset padding ensures student views never hide behind the sidebar.
 * 
 * 3. ROUTE HIERARCHY:
 *    - Public: /, /schools/:id, /login, /register
 *    - Student Protected: /student/info, /student/register-school, /student/profile
 *    - Admin Protected: /admin
 */
export default function App() {
  return (
    <AuthProvider>
      {/* HashRouter guarantees seamless routing on GitHub Pages without 404 on refresh */}
      <Router>
        <Routes>
          {/* ========================================================= */}
          {/* 1. GLOBAL ROOT LAYOUT (Visible across ALL pages)          */}
          {/* ========================================================= */}
          <Route element={<RootLayout />}>
            
            {/* Public Unauthenticated Routes */}
            <Route path="/" element={<PublicDashboard />} />
            <Route path="/schools/:id" element={<SchoolDetailPage />} />

            {/* Public Authentication Routes (Top Navbar stays visible!) */}
            <Route path="/login" element={<LoginStudent />} />
            <Route path="/login-siswa" element={<LoginStudent />} />
            <Route path="/login-admin" element={<LoginAdmin />} />
            <Route path="/admin/login" element={<LoginAdmin />} />
            <Route path="/register" element={<Register />} />

            {/* ========================================================= */}
            {/* 2. PROTECTED ADMIN PORTAL                                */}
            {/* ========================================================= */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* ========================================================= */}
            {/* 3. PROTECTED STUDENT PORTAL (With Floating Hover SideNav) */}
            {/* ========================================================= */}
            <Route
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              {/* Default redirect for /student base route */}
              <Route path="/student" element={<Navigate to="/student/info" replace />} />

              {/* Explicit Student Sub-routes */}
              <Route path="/student/info" element={<StudentDashboard initialTab="status" />} />
              <Route path="/student/register-school" element={<StudentDashboard initialTab="pendaftaran" />} />
              <Route path="/student/profile" element={<StudentDashboard initialTab="akun" />} />

              {/* Backward compatibility aliases */}
              <Route path="/student/status" element={<Navigate to="/student/info" replace />} />
              <Route path="/student/pendaftaran" element={<Navigate to="/student/register-school" replace />} />
              <Route path="/pendaftaran" element={<Navigate to="/student/register-school" replace />} />
              <Route path="/student/akun" element={<Navigate to="/student/profile" replace />} />
            </Route>

            {/* Catch-all: Redirect unknown routes back to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
