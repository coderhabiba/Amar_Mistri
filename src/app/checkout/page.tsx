'use client';

import { Suspense } from 'react';
import Checkout from '@/views/Checkout/Checkout';

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-500">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }
    >
      <Checkout />
    </Suspense>
  );
}
