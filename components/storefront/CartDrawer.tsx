'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  LinearProgress,
  FormControlLabel,
  Switch,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useCartStore } from '@/lib/store/useCartStore';

export default function CartDrawer() {
  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
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
  const remainingForFreeShipping = Math.max(0, freeThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  return (
    <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
      <Box
        sx={{
          width: { xs: '100vw', sm: 420 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FAF7F2',
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #E5DFD5',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingBagOutlinedIcon sx={{ color: '#1E3A2F' }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
              Your Egg Basket
            </Typography>
            <Chip
              label={`${items.length} item${items.length === 1 ? '' : 's'}`}
              size="small"
              sx={{ backgroundColor: 'rgba(232, 152, 26, 0.15)', color: '#B87208', fontWeight: 700 }}
            />
          </Box>
          <IconButton onClick={closeDrawer} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Free Delivery Bar */}
        <Box sx={{ p: 2, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5DFD5' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LocalShippingOutlinedIcon sx={{ color: remainingForFreeShipping === 0 ? '#2E7D32' : '#E8981A', fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E3A2F', fontSize: '0.82rem' }}>
              {remainingForFreeShipping === 0
                ? '🎉 Congratulations! You unlocked FREE Insulated Delivery!'
                : `Add Rs. ${remainingForFreeShipping} more for FREE Cold-Pack Delivery`}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: '#E5DFD5',
              '& .MuiLinearProgress-bar': {
                backgroundColor: remainingForFreeShipping === 0 ? '#2E7D32' : '#E8981A',
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Cart Items List */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2.5 }}>
          {items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ fontSize: '3rem', mb: 1 }}>🥚</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E3A2F', mb: 1 }}>
                Your basket is empty
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Explore our fresh daily harvest and pasture-raised eggs.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={closeDrawer}
                component={Link}
                href="/shop"
                sx={{ borderRadius: 8, fontWeight: 700 }}
              >
                Browse Fresh Harvest
              </Button>
            </Box>
          ) : (
            items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  gap: 2,
                  p: 1.8,
                  mb: 1.5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 3,
                  border: '1px solid #E5DFD5',
                }}
              >
                {/* Product Thumbnail */}
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: '#FAF7F2',
                  }}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="72px"
                    style={{ objectFit: 'cover' }}
                  />
                </Box>

                {/* Details */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E3A2F', lineHeight: 1.2 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#E8981A', fontWeight: 700, display: 'block', mt: 0.3 }}>
                    {item.packagingLabel}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F', mt: 0.5 }}>
                    Rs. {item.unitPrice * item.quantity}
                  </Typography>

                  {/* Quantity Stepper */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #E5DFD5',
                        borderRadius: 2,
                        backgroundColor: '#FAF7F2',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        sx={{ p: 0.5 }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ px: 1.5, fontSize: '0.85rem', fontWeight: 700 }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        sx={{ p: 0.5 }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={() => removeItem(item.id)}
                      sx={{ color: '#D32F2F' }}
                      title="Remove item"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <Box
            sx={{
              p: 2.5,
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #E5DFD5',
              boxShadow: '0 -4px 16px rgba(0,0,0,0.04)',
            }}
          >
            {/* Breakage Insurance Toggle */}
            <Box
              sx={{
                p: 1.2,
                mb: 2,
                backgroundColor: 'rgba(46, 125, 50, 0.08)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VerifiedUserOutlinedIcon sx={{ color: '#2E7D32', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#1E3A2F', display: 'block' }}>
                    Zero-Breakage Guarantee (+Rs. 80)
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                    100% instant refund/replacement if any egg arrives cracked
                  </Typography>
                </Box>
              </Box>
              <Switch
                size="small"
                checked={breakageGuarantee}
                onChange={toggleBreakageGuarantee}
                color="success"
              />
            </Box>

            {/* Calculations */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
              <Typography variant="body2" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                Rs. {subtotal}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
              <Typography variant="body2" color="text.secondary">
                Insulated Cold-Pack Delivery
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: deliveryFee === 0 ? '#2E7D32' : '#1E3A2F' }}
              >
                {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
              </Typography>
            </Box>
            {breakageGuarantee && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                <Typography variant="body2" color="text.secondary">
                  Crack Replacement Shield
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                  Rs. 80
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#E8981A' }}>
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
              onClick={closeDrawer}
              sx={{
                py: 1.5,
                borderRadius: 3,
                fontWeight: 800,
                fontSize: '1rem',
                backgroundColor: '#1E3A2F',
                '&:hover': { backgroundColor: '#13261F' },
              }}
            >
              Proceed to Checkout →
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
