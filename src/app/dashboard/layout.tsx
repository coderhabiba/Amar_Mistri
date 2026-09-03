'use client';

import ProtectedRoute from '@/router/ProtectedRoute';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
