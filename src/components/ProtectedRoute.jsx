import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500 font-body">Memverifikasi sesi pengguna...</p>
      </div>
    );
  }

  // If not logged in, redirect to the matching login portal
  if (!isAuthenticated) {
    const isTargetingAdmin = location.pathname.startsWith('/admin');
    const loginTarget = isTargetingAdmin ? '/login-admin' : '/login';
    return <Navigate to={loginTarget} state={{ from: location }} replace />;
  }

  // Cross-role protection: Student cannot access admin portal
  const userRole = user?.user_metadata?.role;
  if (location.pathname.startsWith('/admin') && userRole === 'student') {
    return <Navigate to="/student/info" replace />;
  }

  if (requiredRole === 'admin' && userRole === 'student') {
    return <Navigate to="/student/info" replace />;
  }

  return children ? children : <Outlet />;
};

