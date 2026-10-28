import React from 'react';
import { Outlet } from 'react-router-dom';
import { StudentSideNav } from '../components/StudentSideNav';

/**
 * Protected Student Layout
 * - Exclusively wraps student dashboard routes (/student/*).
 * - Includes StudentSideNav (floating hover sidebar on the left & bottom pill on mobile).
 * - Renders <Outlet /> with left padding (e.g. lg:pl-72 / pl-20) so student content
 *   never hides behind the floating side navbar.
 */
export const StudentLayout = () => {
  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      {/* Floating Hover Side Navigation (Only for Student Dashboard) */}
      <StudentSideNav />

      {/* Main Student Page Content Area with Left Clearance */}
      <div className="w-full lg:pl-72 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;

