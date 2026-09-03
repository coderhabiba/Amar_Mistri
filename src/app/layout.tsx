import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: 'Amar Mistri - Professional Mechanic & Technician Service',
  description:
    'Find trusted electricians, plumbers, AC technicians, mechanics, and industrial experts across Bangladesh.',
  icons: {
    icon: '/assets/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" data-theme="mytheme" suppressHydrationWarning>
      <body className="bg-slate-950 text-white antialiased min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
