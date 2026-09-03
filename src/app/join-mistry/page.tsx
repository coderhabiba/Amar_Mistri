'use client';

import dynamic from 'next/dynamic';

const JoinAsMistri = dynamic(
  () => import('@/views/JoinAsMistri/JoinAsMistri'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-500">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    ),
  }
);

export default function JoinMistryPage() {
  return <JoinAsMistri />;
}
