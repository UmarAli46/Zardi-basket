import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zardi Basket — Farm-Fresh Organic Eggs Across Sindh',
  description:
    'Sindh’s premier farm-direct egg delivery service. Fresh Yellow Desi and White Farm eggs delivered cold-chain across Karachi, Hyderabad, Sukkur, Thatta, and all of Sindh.',
  keywords: [
    'fresh eggs sindh',
    'desi eggs karachi',
    'aseel eggs hyderabad',
    'organic farm eggs',
    'white farm eggs thatta',
    'zardi basket',
  ],
  authors: [{ name: 'Zardi Basket Farms' }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png' },
    ],
    shortcut: ['/favicon.ico'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#FAF7F2', fontFamily: '"Inter", sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
