import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getOrderById } from '@/lib/db';

export const revalidate = 0;

interface OrderSuccessPageProps {
  searchParams: Promise<{ id?: string; tracker?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const { id, tracker } = await searchParams;
  let order = id ? await getOrderById(id) : null;

  // If returning from Safepay with a successful payment tracker
  if (order && tracker && order.paymentStatus !== 'paid') {
    const { updateOrderStatus } = await import('@/lib/db');
    await updateOrderStatus(order.id, order.orderStatus, 'paid');
    order.paymentStatus = 'paid';
    order.paymentReference = tracker;
  }

  if (!order) {
    return (
      <Box sx={{ py: 12, textAlign: 'center', backgroundColor: '#FAF7F2', minHeight: '75vh' }}>
        <Container maxWidth="sm">
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
            Order Not Found
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            We could not locate this order reference. Please check your order ID or contact customer care.
          </Typography>
          <Button component={Link} href="/" variant="contained" color="secondary" sx={{ fontWeight: 700 }}>
            Return to Home
          </Button>
        </Container>
      </Box>
    );
  }

  const steps = ['Order Confirmed', 'Packed at Farm', 'Out for Delivery', 'Delivered'];
  let activeStep = 0;
  if (order.orderStatus === 'packed') activeStep = 1;
  else if (order.orderStatus === 'shipped') activeStep = 2;
  else if (order.orderStatus === 'delivered') activeStep = 4;

  return (
    <Box sx={{ py: 8, backgroundColor: '#FAF7F2', minHeight: '85vh' }}>
      <Container maxWidth="md">
        {/* Celebration Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <CheckCircleIcon sx={{ fontSize: 72, color: '#2E7D32', mb: 1.5 }} />
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#1E3A2F', mb: 1 }}>
            Your Farm Harvest is Confirmed!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 520, mx: 'auto' }}>
            Thank you, <strong>{order.customerName}</strong>. Your fresh pasture eggs are being prepared at the coop for cold-pack delivery.
          </Typography>
        </Box>

        {/* Live Stepper Status */}
        <Card sx={{ p: 4, mb: 4, borderRadius: 4, border: '1px solid #E5DFD5', backgroundColor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                ORDER REFERENCE
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E3A2F' }}>
                {order.orderNumber}
              </Typography>
            </Box>
            <Chip
              label={`Status: ${order.orderStatus.toUpperCase()}`}
              color="primary"
              sx={{ fontWeight: 800, backgroundColor: '#1E3A2F' }}
            />
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '&.Mui-active': { color: '#E8981A' },
                      '&.Mui-completed': { color: '#2E7D32' },
                    },
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Card>

        {/* Receipt & Details Grid */}
        <Card sx={{ p: 4, borderRadius: 4, border: '1px solid #E5DFD5', backgroundColor: '#FFFFFF', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 3 }}>
            Receipt &amp; Cold-Chain Details
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                CUSTOMER NAME &amp; PHONE:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                {order.customerName} ({order.customerPhone})
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {order.customerEmail}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                DELIVERY DESTINATION:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                {order.deliveryAddress}, {order.deliveryCity}
              </Typography>
              {order.deliveryNotes && (
                <Typography variant="caption" sx={{ color: '#E8981A', display: 'block' }}>
                  Note: &quot;{order.deliveryNotes}&quot;
                </Typography>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 2.5 }} />

          {/* Items Table */}
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
            Harvest Cartons Ordered:
          </Typography>
          {order.items.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#E8981A', fontWeight: 700 }}>
                  {item.quantity}x {item.packagingLabel}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
                Rs. {item.lineTotal}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Subtotal
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Rs. {order.subtotal}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Insulated Delivery
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: order.deliveryFee === 0 ? '#2E7D32' : 'inherit' }}>
              {order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee}`}
            </Typography>
          </Box>
          {order.breakageGuarantee && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Breakage Shield
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Rs. 80
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#1E3A2F' }}>
              Total Paid / Due
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#E8981A' }}>
              Rs. {order.totalAmount}
            </Typography>
          </Box>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href={`/track?orderId=${order.orderNumber}`}
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 800 }}
          >
            Track Order Live
          </Button>
          <Button
            component={Link}
            href="/shop"
            variant="outlined"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 700 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
