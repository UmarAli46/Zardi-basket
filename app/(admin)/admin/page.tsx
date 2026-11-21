import React from 'react';
import Link from 'next/link';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import EggIcon from '@mui/icons-material/Egg';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getAdminStats } from '@/lib/db';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <Box>
      {/* Top Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E3A2F' }}>
            Farm Seller Overview
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Real-time harvest inventory, customer orders, and revenue metrics.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            href="/admin/products/new"
            sx={{ fontWeight: 800, borderRadius: 2.5 }}
          >
            + Add New Egg Variety
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            href="/admin/orders"
            sx={{ fontWeight: 700, borderRadius: 2.5 }}
          >
            Manage Orders
          </Button>
        </Box>
      </Box>

      {/* KPI Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Card 1: Revenue */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E5DFD5' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                Paid Farm Revenue
              </Typography>
              <Box sx={{ p: 1, borderRadius: 2, backgroundColor: 'rgba(46, 125, 50, 0.1)', color: '#2E7D32' }}>
                <TrendingUpIcon fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E3A2F', mb: 0.5 }}>
              Rs. {stats.totalRevenue.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ color: '#2E7D32', fontWeight: 700 }}>
              ✓ Verified Bank &amp; Safepay Receipts
            </Typography>
          </Card>
        </Grid>

        {/* Card 2: Orders */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E5DFD5' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                Total Orders
              </Typography>
              <Box sx={{ p: 1, borderRadius: 2, backgroundColor: 'rgba(232, 152, 26, 0.15)', color: '#E8981A' }}>
                <ShoppingBagIcon fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E3A2F', mb: 0.5 }}>
              {stats.totalOrders}
            </Typography>
            <Typography variant="caption" sx={{ color: '#E8981A', fontWeight: 700 }}>
              {stats.pendingOrders} pending dispatch
            </Typography>
          </Card>
        </Grid>

        {/* Card 3: Active Egg SKUs */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E5DFD5' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                Live Catalog SKUs
              </Typography>
              <Box sx={{ p: 1, borderRadius: 2, backgroundColor: 'rgba(30, 58, 47, 0.1)', color: '#1E3A2F' }}>
                <EggIcon fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E3A2F', mb: 0.5 }}>
              {stats.activeProducts} / {stats.totalProducts}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Active on customer storefront
            </Typography>
          </Card>
        </Grid>

        {/* Card 4: Low Stock Alerts */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E5DFD5' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                Low Stock Alerts
              </Typography>
              <Box sx={{ p: 1, borderRadius: 2, backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#D32F2F' }}>
                <WarningAmberIcon fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: stats.lowStockCount > 0 ? '#D32F2F' : '#2E7D32', mb: 0.5 }}>
              {stats.lowStockCount}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              &lt; 10 cartons remaining
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Tables Section */}
      <Grid container spacing={3}>
        {/* Left: Recent Customer Orders */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: 4, border: '1px solid #E5DFD5', backgroundColor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
                Recent Customer Orders
              </Typography>
              <Button component={Link} href="/admin/orders" endIcon={<ArrowForwardIcon />} size="small" sx={{ fontWeight: 700 }}>
                View All Orders
              </Button>
            </Box>

            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Order #</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Payment</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Fulfillment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentOrders.map((ord) => (
                    <TableRow key={ord.id} hover>
                      <TableCell sx={{ fontWeight: 800, color: '#1E3A2F' }}>{ord.orderNumber}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {ord.customerName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {ord.deliveryCity}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Rs. {ord.totalAmount}</TableCell>
                      <TableCell>
                        <Chip
                          label={ord.paymentStatus.toUpperCase()}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            backgroundColor: ord.paymentStatus === 'paid' ? 'rgba(46,125,50,0.1)' : 'rgba(232,152,26,0.15)',
                            color: ord.paymentStatus === 'paid' ? '#2E7D32' : '#B87208',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ord.orderStatus.toUpperCase()}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            backgroundColor: ord.orderStatus === 'delivered' ? '#1E3A2F' : '#FAF7F2',
                            color: ord.orderStatus === 'delivered' ? '#FFFFFF' : '#1E3A2F',
                            border: '1px solid #E5DFD5',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Card>
        </Grid>

        {/* Right: Low Stock Warnings */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 4, border: '1px solid #E5DFD5', backgroundColor: '#FFFFFF' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
              Inventory Health
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {stats.lowStockItems.slice(0, 5).map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    backgroundColor: item.stockQuantity < 10 ? 'rgba(211,47,47,0.06)' : '#FAF7F2',
                    border: '1px solid',
                    borderColor: item.stockQuantity < 10 ? 'rgba(211,47,47,0.2)' : '#E5DFD5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E3A2F', fontSize: '0.9rem' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: item.stockQuantity < 10 ? '#D32F2F' : 'text.secondary', fontWeight: 700 }}>
                      Stock: {item.stockQuantity} cartons left
                    </Typography>
                  </Box>
                  <Button
                    component={Link}
                    href={`/admin/products/${item.id}/edit`}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 2, fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    Restock
                  </Button>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
