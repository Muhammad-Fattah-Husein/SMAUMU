import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

/**
 * Global Root Layout
 * - TopNavbar is always visible on all pages (/, /login, /register, etc.).
 * - Top padding (pt-24 sm:pt-28) ensures child page content is never hidden behind the floating navbar.
 * - Footer stays at the bottom.
 */
export const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base text-gray-800 font-body antialiased selection:bg-primary selection:text-white">
      {/* Global Minimalist Top Navbar */}
      <TopNavbar />

      {/* Page Content with top clearance for fixed/floating Navbar */}
      <main className="flex-1 pt-24 sm:pt-28">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default RootLayout;

