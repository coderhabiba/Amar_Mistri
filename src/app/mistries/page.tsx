'use client';

import { Suspense } from 'react';
import MistryList from '@/views/MistryList/MistryList';

export default function MistriesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-500">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }
    >
      <MistryList />
    </Suspense>
  );
}
