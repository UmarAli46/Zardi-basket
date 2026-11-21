'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  Button,
  IconButton,
  Divider,
  LinearProgress,
  Switch,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useCartStore } from '@/lib/store/useCartStore';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const breakageGuarantee = useCartStore((state) => state.breakageGuarantee);
  const toggleBreakageGuarantee = useCartStore((state) => state.toggleBreakageGuarantee);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDeliveryFee = useCartStore((state) => state.getDeliveryFee);
  const getTotalAmount = useCartStore((state) => state.getTotalAmount);
  const freeThreshold = useCartStore((state) => state.freeDeliveryThreshold);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const totalAmount = getTotalAmount();
  const remainingForFree = Math.max(0, freeThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  if (items.length === 0) {
    return (
      <Box sx={{ py: 12, backgroundColor: '#FAF7F2', minHeight: '75vh', textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography sx={{ fontSize: '4rem', mb: 2 }}>🥚</Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E3A2F', mb: 1.5 }}>
            Your Egg Basket is Empty
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            You haven’t added any fresh farm harvest cartons to your basket yet.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            href="/shop"
            sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 800 }}
          >
            Explore Fresh Harvest Catalog →
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, backgroundColor: '#FAF7F2', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#1E3A2F', mb: 1 }}>
          Your Egg Basket
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
          Review your fresh harvest selection before proceeding to cold-chain delivery checkout.
        </Typography>

        <Grid container spacing={4}>
          {/* Left Column: Cart Items List */}
          <Grid item xs={12} md={8}>
            {/* Free Delivery Bar Card */}
            <Card sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #E5DFD5' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocalShippingOutlinedIcon sx={{ color: remainingForFree === 0 ? '#2E7D32' : '#E8981A' }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                  {remainingForFree === 0
                    ? '🎉 You have unlocked FREE Insulated Cold-Pack Delivery!'
                    : `Add Rs. ${remainingForFree} more to qualify for FREE Cold-Pack Delivery`}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#FAF7F2',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: remainingForFree === 0 ? '#2E7D32' : '#E8981A',
                    borderRadius: 4,
                  },
                }}
              />
            </Card>

            {/* Items Card */}
            <Card sx={{ borderRadius: 4, border: '1px solid #E5DFD5', p: 3 }}>
              {items.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <Divider sx={{ my: 2.5 }} />}
                  <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                    {/* Thumbnail */}
                    <Box
                      sx={{
                        width: 90,
                        height: 90,
                        position: 'relative',
                        borderRadius: 3,
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundColor: '#FAF7F2',
                      }}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="90px"
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>

                    {/* Info */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', fontSize: '1.05rem' }}>
                        {item.title}
                      </Typography>
                      <Chip
                        label={item.packagingLabel}
                        size="small"
                        sx={{
                          my: 0.5,
                          backgroundColor: 'rgba(232, 152, 26, 0.15)',
                          color: '#B87208',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        Unit Price: Rs. {item.unitPrice}
                      </Typography>
                    </Box>

                    {/* Stepper */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #E5DFD5',
                        borderRadius: 2.5,
                        backgroundColor: '#FAF7F2',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        sx={{ p: 0.6 }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ px: 2, fontWeight: 800, minWidth: 36, textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        sx={{ p: 0.6 }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Line Total */}
                    <Box sx={{ minWidth: 90, textAlign: 'right' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#1E3A2F' }}>
                        Rs. {item.unitPrice * item.quantity}
                      </Typography>
                    </Box>

                    {/* Remove */}
                    <IconButton
                      onClick={() => removeItem(item.id)}
                      sx={{ color: '#D32F2F' }}
                      title="Remove item"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                </React.Fragment>
              ))}
            </Card>
          </Grid>

          {/* Right Column: Order Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3.5, borderRadius: 4, border: '1px solid #E5DFD5', backgroundColor: '#FFFFFF' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2.5 }}>
                Summary
              </Typography>

              {/* Breakage Insurance Toggle */}
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  backgroundColor: 'rgba(46, 125, 50, 0.08)',
                  borderRadius: 3,
                  border: '1px solid rgba(46, 125, 50, 0.2)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedUserOutlinedIcon sx={{ color: '#2E7D32', fontSize: 22 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
                      Zero-Breakage Shield
                    </Typography>
                  </Box>
                  <Switch
                    checked={breakageGuarantee}
                    onChange={toggleBreakageGuarantee}
                    color="success"
                  />
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.4 }}>
                  Adds Rs. 80. If any egg arrives cracked or damaged, we replace it instantly with zero hassle.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                  Rs. {subtotal}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Insulated Cold Delivery
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: deliveryFee === 0 ? '#2E7D32' : '#1E3A2F' }}
                >
                  {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                </Typography>
              </Box>

              {breakageGuarantee && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Breakage Shield
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                    Rs. 80
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#1E3A2F' }}>
                  Total (PKR)
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#E8981A' }}>
                  Rs. {totalAmount}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                component={Link}
                href="/checkout"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1.8,
                  borderRadius: 3,
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  backgroundColor: '#1E3A2F',
                  '&:hover': { backgroundColor: '#13261F' },
                }}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
