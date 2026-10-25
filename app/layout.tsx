import type { Metadata } from 'next';
import './globals.css';
import { PastelBackground } from '@/components/common/PastelBackground';
import { QueryProvider } from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'ReliefIQ - AI-Powered Community Resource Allocation & Crisis Prediction',
  description:
    'Predict crises. Allocate resources. Reach people first. A high-precision decision-support platform for district officers, disaster management authorities, and relief organizations.',
  keywords: [
    'disaster management',
    'crisis prediction',
    'resource allocation',
    'Andhra Pradesh DDMA',
    'flood management',
    'explainable AI',
  ],
  authors: [{ name: 'ReliefIQ Engineering Team' }],
  openGraph: {
    title: 'ReliefIQ - AI Crisis Prediction & Allocation',
    description: 'Predict crises. Allocate resources. Reach people first.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-slate-800 antialiased selection:bg-primary-100 selection:text-primary-900">
        <QueryProvider>
          <PastelBackground />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
