'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Grid,
  Typography,
  Divider,
} from '@mui/material';
import EggIcon from '@mui/icons-material/Egg';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ShopCatalogClientProps {
  initialProducts: Product[];
}

export default function ShopCatalogClient({ initialProducts }: ShopCatalogClientProps) {
  const searchParams = useSearchParams();
  const catParam = searchParams?.get('category');

  // Filter if user specifically navigated via header/footer category links
  let displayedProducts = initialProducts;
  if (catParam === 'white_farm' || catParam === 'farm') {
    displayedProducts = initialProducts.filter((p) => p.eggType === 'white_farm');
  } else if (catParam === 'desi_yellow' || catParam === 'desi' || catParam === 'hen') {
    displayedProducts = initialProducts.filter((p) => p.eggType === 'desi_yellow');
  }

  const whiteFarmProducts = displayedProducts.filter((p) => p.eggType === 'white_farm');
  const yellowDesiProducts = displayedProducts.filter((p) => p.eggType === 'desi_yellow');

  const showBothSections = whiteFarmProducts.length > 0 && yellowDesiProducts.length > 0;

  return (
    <Box>
      {/* 1. White Farm Eggs Section (3 Qualities × 3 Box Sizes = 9 Products) */}
      {whiteFarmProducts.length > 0 && (
        <Box sx={{ mb: showBothSections ? 8 : 4 }}>
          {showBothSections && (
            <Box sx={{ mb: 3.5, pb: 1.5, borderBottom: '2px solid #E5DFD5' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: '#1E3A2F',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                  fontSize: { xs: '1.4rem', sm: '1.8rem' },
                }}
              >
                <EggIcon sx={{ color: '#E8981A' }} />
                White Farm Eggs
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                9 Separate Options: 3 Qualities (Classic, Premium Leghorn, Enriched Protein) × 3 Packaging Sizes (6-Egg Box, 12-Egg Box, 30-Egg Tray)
              </Typography>
            </Box>
          )}

          <Grid container spacing={3.5}>
            {whiteFarmProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* 2. Yellow Desi Eggs Section (3 Qualities × 3 Box Sizes = 9 Products) */}
      {yellowDesiProducts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          {showBothSections && (
            <Box sx={{ mb: 3.5, pb: 1.5, borderBottom: '2px solid #E5DFD5' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: '#1E3A2F',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                  fontSize: { xs: '1.4rem', sm: '1.8rem' },
                }}
              >
                <EggIcon sx={{ color: '#E8981A' }} />
                Yellow Desi Eggs
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                9 Separate Options: 3 Qualities (Pure Aseel, Golden Misri, Organic Heritage) × 3 Packaging Sizes (6-Egg Box, 12-Egg Box, 30-Egg Tray)
              </Typography>
            </Box>
          )}

          <Grid container spacing={3.5}>
            {yellowDesiProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
