'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import StarIcon from '@mui/icons-material/Star';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [toastOpen, setToastOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Authoritative packaging box size & exact price
  const boxSize = product.packagingSize || '12pack';
  const boxLabel = product.boxLabel || (boxSize === '6pack' ? '6-Egg Box' : boxSize === '30tray' ? '30-Tray Box' : '12-Egg Box');

  let exactPrice = product.price12Pack;
  if (boxSize === '6pack') {
    exactPrice = product.price6Pack;
  } else if (boxSize === '30tray') {
    exactPrice = product.price30Tray;
  }

  // Stock & Availability Calculations
  const stockCount = Number(product.stockQuantity) || 0;
  const isOutOfStock = !product.isActive || stockCount <= 0;
  const isLowStock = !isOutOfStock && stockCount <= 10;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, boxSize, 1);
    setToastOpen(true);
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          borderRadius: 0, // Crisp square corners
          border: '1.5px solid #E5DFD5',
          overflow: 'hidden',
          position: 'relative',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            borderColor: '#E8981A',
            boxShadow: '0 16px 36px rgba(30, 58, 47, 0.12)',
            '& .product-card-img': {
              transform: 'scale(1.05)',
            },
          },
        }}
      >
        {/* Top Image Container with Overlaid Badges */}
        <Box
          component={Link}
          href={`/shop/${product.slug}`}
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 240, sm: 260 },
            overflow: 'hidden',
            backgroundColor: '#FAF7F2',
            display: 'block',
            borderRadius: 0,
          }}
        >
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="product-card-img"
            style={{
              objectFit: 'cover',
              transition: 'transform 0.45s ease',
              filter: isOutOfStock ? 'grayscale(40%) opacity(0.85)' : 'none',
            }}
          />

          {/* Out of Stock Overlay Ribbon */}
          {isOutOfStock ? (
            <Chip
              label="OUT OF STOCK"
              size="small"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(211, 47, 47, 0.95)',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '0.8rem',
                letterSpacing: '0.05em',
                borderRadius: 0,
                px: 1.5,
                py: 2,
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                zIndex: 2,
              }}
            />
          ) : isLowStock ? (
            <Chip
              label={`⚡ ONLY ${stockCount} LEFT!`}
              size="small"
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '0.7rem',
                borderRadius: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                zIndex: 2,
              }}
            />
          ) : null}

          {/* Quality Tier Chip (Top Left) */}
          <Chip
            label={product.qualityTier || (product.eggType === 'white_farm' ? 'White Farm' : 'Yellow Desi')}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: isOutOfStock ? 'rgba(74, 85, 104, 0.92)' : 'rgba(30, 58, 47, 0.92)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.72rem',
              borderRadius: 0,
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Packaging Box Size Chip (Top Right) */}
          <Chip
            label={boxLabel}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: isOutOfStock ? '#A0AEC0' : '#E8981A',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '0.74rem',
              borderRadius: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          />
        </Box>

        {/* Content Body */}
        <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Farm Origin & Rating */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.78rem' }}>
              📍 {product.region}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <StarIcon sx={{ color: '#E8981A', fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#1E3A2F', fontSize: '0.78rem' }}>
                {product.rating} ({product.reviewCount})
              </Typography>
            </Box>
          </Box>

          {/* Title with Packaging Size */}
          <Typography
            component={Link}
            href={`/shop/${product.slug}`}
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: '1.05rem',
              color: '#1E3A2F',
              textDecoration: 'none',
              lineHeight: 1.35,
              mb: 2.5,
              minHeight: '2.7em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              '&:hover': { color: '#E8981A' },
            }}
          >
            {product.title}
          </Typography>

          {/* Bottom Bar: Exact Price + Add to Basket Button */}
          <Box
            sx={{
              mt: 'auto',
              pt: 2,
              borderTop: '1px solid #F0EAE1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  display: 'block',
                  fontSize: '0.72rem',
                  lineHeight: 1,
                  mb: 0.3,
                }}
              >
                {boxLabel} Price
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: isOutOfStock ? '#A0AEC0' : '#1E3A2F', lineHeight: 1.1 }}>
                Rs. {exactPrice}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 0.4,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: isOutOfStock ? '#D32F2F' : isLowStock ? '#D97706' : '#2E7D32',
                }}
              >
                {isOutOfStock ? '• Out of Stock' : isLowStock ? `• Only ${stockCount} left in stock` : `• In Stock (${stockCount} units)`}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color={isOutOfStock ? 'inherit' : 'secondary'}
              size="medium"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              startIcon={!isOutOfStock ? <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} /> : undefined}
              sx={{
                borderRadius: 0, // Sharp square corners
                fontWeight: 800,
                px: 2.2,
                py: 0.9,
                fontSize: '0.85rem',
                boxShadow: 'none',
                whiteSpace: 'nowrap',
                backgroundColor: isOutOfStock ? '#E2E8F0 !important' : undefined,
                color: isOutOfStock ? '#94A3B8 !important' : undefined,
                cursor: isOutOfStock ? 'not-allowed !important' : 'pointer',
                '&:hover': {
                  boxShadow: 'none',
                  backgroundColor: isOutOfStock ? '#E2E8F0' : '#1E3A2F',
                },
              }}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Basket'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={toastOpen}
        autoHideDuration={2200}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', fontWeight: 700, backgroundColor: '#1E3A2F', color: '#FFFFFF', borderRadius: 0 }}>
          Added {product.title} to basket! 🥚
        </Alert>
      </Snackbar>
    </>
  );
}
