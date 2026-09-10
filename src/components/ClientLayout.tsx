'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import FloatingSocial from './FloatingSocial/FloatingSocial';
import { Toaster } from 'react-hot-toast';
import '@/lib/i18n';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const isDashboard = pathname.startsWith('/dashboard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {!isDashboard && <Navbar />}
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <span className="loading loading-spinner loading-lg text-amber-500"></span>
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
      {!isDashboard && <Footer />}
      {!isDashboard && <FloatingSocial />}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
