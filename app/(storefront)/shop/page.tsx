import React, { Suspense } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import { getProducts } from '@/lib/db';
import ShopCatalogClient from '@/components/storefront/ShopCatalogClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ShopPage() {
  const products = await getProducts({ onlyActive: true });

  return (
    <Box sx={{ py: 6, backgroundColor: '#FAF7F2', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        {/* Header Title */}
        <Box sx={{ mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            variant="caption"
            sx={{ color: '#E8981A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}
          >
            Sindh Province Fresh Harvest
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontWeight: 900, color: '#1E3A2F', fontSize: { xs: '2rem', md: '2.8rem' } }}
          >
            Shop All Eggs
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 680, mt: 1 }}>
            Browse all 18 fresh harvest options: 2 Varieties × 3 Qualities × 3 Packaging Sizes (6-Egg Box, 12-Egg Box, and 30-Egg Tray Box). Delivered cold-chain across Karachi, Hyderabad, and all of Sindh.
          </Typography>
        </Box>

        {/* Client-Side Interactive Filter and Grid */}
        <Suspense fallback={<Box sx={{ py: 8, textAlign: 'center' }}><CircularProgress color="secondary" /></Box>}>
          <ShopCatalogClient initialProducts={products} />
        </Suspense>
      </Container>
    </Box>
  );
}
