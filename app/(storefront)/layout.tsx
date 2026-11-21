import React from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CartDrawer from '@/components/storefront/CartDrawer';
import WhatsAppChat from '@/components/storefront/WhatsAppChat';
import LenisProvider from '@/components/providers/LenisProvider';
import MuiProvider from '@/components/providers/MuiProvider';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MuiProvider>
      <LenisProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FAF7F2' }}>
          <Navbar />
          <main style={{ flexGrow: 1 }}>{children}</main>
          <CartDrawer />
          <WhatsAppChat />
          <Footer />
        </div>
      </LenisProvider>
    </MuiProvider>
  );
}
