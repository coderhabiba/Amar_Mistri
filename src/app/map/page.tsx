'use client';

import dynamic from 'next/dynamic';

const MistryMap = dynamic(() => import('@/views/MistryMap/MistryMap'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-500">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4 text-sm font-medium">মানচিত্র লোড হচ্ছে...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return <MistryMap />;
}
