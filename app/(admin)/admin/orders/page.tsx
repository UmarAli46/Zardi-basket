import React from 'react';
import { Box, Typography } from '@mui/material';
import { getOrders } from '@/lib/db';
import OrdersManagementTable from '@/components/admin/OrdersManagementTable';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E3A2F' }}>
          Customer Orders &amp; Fulfillment
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Verify incoming payments, verify manual JazzCash/Easypaisa Transaction IDs, and update live courier delivery states.
        </Typography>
      </Box>

      <OrdersManagementTable initialOrders={orders} />
    </Box>
  );
}
