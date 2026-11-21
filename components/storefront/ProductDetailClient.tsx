'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Divider,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import VerifiedIcon from '@mui/icons-material/Verified';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store/useCartStore';
import ProductCard from './ProductCard';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState<'6pack' | '12pack' | '30tray'>('12pack');
  const [quantity, setQuantity] = useState(1);
  const [toastOpen, setToastOpen] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  // Stock & Availability Calculations
  const stockCount = Number(product.stockQuantity) || 0;
  const isOutOfStock = !product.isActive || stockCount <= 0;
  const isLowStock = !isOutOfStock && stockCount <= 10;

  // Compute pricing
  let currentPrice = product.price12Pack;
  let packLabel = '12-Egg Box';

  if (selectedPack === '6pack') {
    currentPrice = product.price6Pack;
    packLabel = '6-Egg Box';
  } else if (selectedPack === '30tray') {
    currentPrice = product.price30Tray;
    packLabel = '30-Egg Tray Box';
  }

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, selectedPack, quantity);
    setToastOpen(true);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, selectedPack, quantity);
    router.push('/checkout');
  };

  return (
    <>
      {/* Back button */}
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          href="/shop"
          startIcon={<ArrowBackIcon />}
          sx={{ color: '#1E3A2F', fontWeight: 700 }}
        >
          Back to Egg Catalog
        </Button>
      </Box>

      {/* Main PDP Grid */}
      <Grid container spacing={5}>
        {/* Left: Product Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: 360, sm: 460, md: 540 },
              borderRadius: 0,
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5DFD5',
              boxShadow: '0 12px 36px rgba(30, 58, 47, 0.08)',
            }}
          >
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </Box>
        </Grid>

        {/* Right: Product Details & Controls */}
        <Grid item xs={12} md={6}>
          {/* Breadcrumb / Category */}
          <Typography variant="caption" sx={{ color: '#E8981A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {product.region} • {product.breed}
          </Typography>

          <Typography variant="h3" sx={{ fontWeight: 900, color: '#1E3A2F', mt: 0.5, mb: 1, lineHeight: 1.15 }}>
            {product.title}
          </Typography>

          {/* Rating & Reviews */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Box sx={{ display: 'flex', color: '#E8981A' }}>
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} sx={{ fontSize: 18 }} />
              ))}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
              {product.rating} ({product.reviewCount} verified farm reviews)
            </Typography>
          </Box>

          {/* Price Display */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: isOutOfStock ? '#A0AEC0' : '#1E3A2F' }}>
              Rs. {currentPrice}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              / {packLabel}
            </Typography>
          </Box>

          {/* Real-time Inventory Calculation Badge */}
          {isOutOfStock ? (
            <Alert severity="error" sx={{ mb: 3, fontWeight: 700, borderRadius: 0, backgroundColor: '#FFEBEE', color: '#C62828' }}>
              🚫 OUT OF STOCK — All batches from today are sold out. Fresh harvest arrives tomorrow!
            </Alert>
          ) : isLowStock ? (
            <Alert severity="warning" sx={{ mb: 3, fontWeight: 700, borderRadius: 0, backgroundColor: '#FFF8E1', color: '#B45309' }}>
              ⚡ LIMITED DAILY HARVEST: Only <strong>{stockCount} boxes</strong> remaining in farm inventory!
            </Alert>
          ) : (
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={`✓ IN STOCK: ${stockCount} Boxes Available From Today's Harvest`}
                size="small"
                sx={{ fontWeight: 800, backgroundColor: '#E8F5E9', color: '#2E7D32', borderRadius: 0 }}
              />
            </Box>
          )}

          <Typography variant="body1" sx={{ color: '#5C6D65', lineHeight: 1.7, mb: 3 }}>
            {product.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Packaging Selector */}
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 1 }}>
            Select Packaging Size:
          </Typography>
          <ToggleButtonGroup
            value={selectedPack}
            exclusive
            onChange={(_, val) => val && setSelectedPack(val)}
            fullWidth
            sx={{
              mb: 3,
              backgroundColor: '#FFFFFF',
              borderRadius: 0,
              p: 0.5,
              border: '1px solid #E5DFD5',
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: '0px !important',
                fontWeight: 700,
                py: 1.2,
                color: '#5C6D65',
                '&.Mui-selected': {
                  backgroundColor: '#1E3A2F',
                  color: '#FFFFFF',
                },
              },
            }}
          >
            <ToggleButton value="6pack">
              6-Egg Box (Rs. {product.price6Pack})
            </ToggleButton>
            <ToggleButton value="12pack">
              12-Egg Box (Rs. {product.price12Pack})
            </ToggleButton>
            <ToggleButton value="30tray">
              30-Tray Box (Rs. {product.price30Tray})
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Quantity & Actions */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
            {/* Quantity Stepper */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #E5DFD5',
                borderRadius: 0,
                backgroundColor: '#FFFFFF',
                p: 0.5,
              }}
            >
              <IconButton
                size="small"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isOutOfStock}
              >
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ px: 2, fontWeight: 800, minWidth: 40, textAlign: 'center' }}>
                {isOutOfStock ? 0 : quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= stockCount || isOutOfStock}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {/* Add to Cart */}
            <Button
              variant="contained"
              color={isOutOfStock ? 'inherit' : 'primary'}
              size="large"
              onClick={handleAddToCart}
              startIcon={!isOutOfStock ? <ShoppingBagOutlinedIcon /> : undefined}
              disabled={isOutOfStock}
              sx={{
                flexGrow: 1,
                py: 1.5,
                borderRadius: 0,
                fontWeight: 800,
                fontSize: '1rem',
                backgroundColor: isOutOfStock ? '#E2E8F0 !important' : undefined,
                color: isOutOfStock ? '#94A3B8 !important' : undefined,
                cursor: isOutOfStock ? 'not-allowed !important' : 'pointer',
              }}
            >
              {isOutOfStock ? 'Out of Stock' : `Add ${quantity} to Basket • Rs. ${currentPrice * quantity}`}
            </Button>

            {/* Buy Now */}
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: 0,
                fontWeight: 800,
                fontSize: '1rem',
                backgroundColor: isOutOfStock ? '#CBD5E1 !important' : undefined,
                color: isOutOfStock ? '#94A3B8 !important' : undefined,
                cursor: isOutOfStock ? 'not-allowed !important' : 'pointer',
              }}
            >
              {isOutOfStock ? 'Unavailable' : 'Buy Now'}
            </Button>
          </Box>

          {/* Value Props Box */}
          <Box
            sx={{
              p: 2.5,
              backgroundColor: '#FFFFFF',
              borderRadius: 0,
              border: '1px solid #E5DFD5',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LocalShippingOutlinedIcon sx={{ color: '#2E7D32', fontSize: 22 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E3A2F' }}>
                Cold-Pack Insulated Delivery within 48 Hours of Harvest
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ShieldOutlinedIcon sx={{ color: '#E8981A', fontSize: 22 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E3A2F' }}>
                Zero-Breakage Guarantee: Instant replacement if any egg arrives cracked
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <VerifiedIcon sx={{ color: '#1E3A2F', fontSize: 22 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E3A2F' }}>
                Batch Stamped: <strong>{product.batchCode}</strong> ({product.layDate})
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Nutritional Facts & Traceability Accordion */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 3 }}>
          Farm Traceability &amp; Nutritional Facts
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 0, border: '1px solid #E5DFD5', height: '100%', backgroundColor: '#FFFFFF' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
                🔬 Lab Nutritional Profile
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#FAF7F2', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Protein per Serving
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
                      {product.nutritionalFacts.proteinPerEgg}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#FAF7F2', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Calories
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
                      {product.nutritionalFacts.calories}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#FAF7F2', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Natural Omega-3
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#E8981A' }}>
                      {product.nutritionalFacts.omega3}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#FAF7F2', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Dietary Cholesterol
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
                      {product.nutritionalFacts.cholesterol}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 0, border: '1px solid #E5DFD5', height: '100%', backgroundColor: '#FFFFFF' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
                🌾 Flock Habitat &amp; Coop
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                    Coop Origin:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E3A2F' }}>
                    {product.coopOrigin} ({product.region})
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                    Flock Forage &amp; Diet:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E3A2F' }}>
                    {product.dietInfo}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                    Shelf Life &amp; Storage:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E3A2F' }}>
                    Best consumed within {product.expiryDays} days of lay date. Store at 4°C - 12°C in carton.
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 3 }}>
            You May Also Enjoy
          </Typography>
          <Grid container spacing={3.5}>
            {relatedProducts.map((rel) => (
              <Grid item xs={12} sm={6} md={4} key={rel.id}>
                <ProductCard product={rel} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', fontWeight: 700, backgroundColor: '#1E3A2F', color: '#FFFFFF' }}>
          Added {quantity}x {product.title} ({packLabel}) to your basket! 🥚
        </Alert>
      </Snackbar>
    </>
  );
}
