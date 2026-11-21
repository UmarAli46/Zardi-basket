'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { Order } from '@/lib/types';

function OrderTrackerContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderQuery, setOrderQuery] = useState(initialOrderId);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/track?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.order) {
        throw new Error(data.error || 'No order found with this reference number.');
      }
      setOrder(data.order);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to locate order.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const steps = ['Order Confirmed', 'Packed at Farm', 'Out for Delivery', 'Delivered'];
  let activeStep = 0;
  if (order) {
    if (order.orderStatus === 'packed') activeStep = 1;
    else if (order.orderStatus === 'shipped') activeStep = 2;
    else if (order.orderStatus === 'delivered') activeStep = 4;
  }

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Chip
          icon={<LocalShippingOutlinedIcon sx={{ color: '#E8981A !important' }} />}
          label="Live Dispatch Stepper"
          size="small"
          sx={{ backgroundColor: '#FFFFFF', fontWeight: 800, mb: 1.5, border: '1px solid #E5DFD5' }}
        />
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#1E3A2F', mb: 1 }}>
          Track Your Fresh Egg Delivery
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Enter your Order ID (e.g. <code>ZB-84920</code>) to view live packing and courier transit status.
        </Typography>
      </Box>

      {/* Search Bar */}
      <Card sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid #E5DFD5' }}>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            fetchOrder(orderQuery);
          }}
          sx={{ display: 'flex', gap: 2 }}
        >
          <TextField
            fullWidth
            placeholder="e.g. ZB-84920 or customer phone"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
            sx={{ px: 4, borderRadius: 3, fontWeight: 800 }}
          >
            Track
          </Button>
        </Box>
      </Card>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {/* Order Details Display */}
      {order && (
        <Card sx={{ p: 4, borderRadius: 4, border: '1px solid #E5DFD5', backgroundColor: '#FFFFFF' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
              mb: 4,
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                ORDER ID
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E3A2F' }}>
                {order.orderNumber}
              </Typography>
            </Box>
            <Chip
              label={`Status: ${order.orderStatus.toUpperCase()}`}
              sx={{
                backgroundColor: order.orderStatus === 'delivered' ? '#2E7D32' : '#1E3A2F',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.85rem',
              }}
            />
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
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

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                RECIPIENT &amp; PHONE:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
                {order.customerName} ({order.customerPhone})
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                DELIVERY ADDRESS:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
                {order.deliveryAddress}, {order.deliveryCity}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                FARM BATCH CODE:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#E8981A' }}>
                {order.batchTraceabilityCode}
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 1.5 }}>
            Items in this Shipment:
          </Typography>
          {order.items.map((it, idx) => (
            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {it.quantity}x {it.title} ({it.packagingLabel})
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                Rs. {it.lineTotal}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Total Order Amount
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#E8981A' }}>
              Rs. {order.totalAmount}
            </Typography>
          </Box>
        </Card>
      )}
    </Box>
  );
}

export default function TrackOrderPage() {
  return (
    <Box sx={{ py: 8, backgroundColor: '#FAF7F2', minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Suspense
          fallback={
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <CircularProgress color="primary" />
            </Box>
          }
        >
          <OrderTrackerContent />
        </Suspense>
      </Container>
    </Box>
  );
}
