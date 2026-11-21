import React from 'react';
import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getProducts } from '@/lib/db';
import ProductManagementTable from '@/components/admin/ProductManagementTable';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await getProducts({ onlyActive: false }); // get all including inactive

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E3A2F' }}>
            Egg Varieties &amp; Inventory
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage pricing, packaging tiers, available stock, and live storefront visibility.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          href="/admin/products/new"
          startIcon={<AddIcon />}
          sx={{ fontWeight: 800, borderRadius: 2.5, px: 2.5, py: 1 }}
        >
          Add New Variety
        </Button>
      </Box>

      {/* Interactive Client Table */}
      <ProductManagementTable initialProducts={products} />
    </Box>
  );
}
