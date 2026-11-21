'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  Grid,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  FormControlLabel,
  Switch,
  Slider,
  Chip,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { Product } from '@/lib/types';

interface ProductFormProps {
  initialProduct?: Product;
  isEditing?: boolean;
}

export default function ProductForm({ initialProduct, isEditing = false }: ProductFormProps) {
  const router = useRouter();

  // Form Fields
  const [title, setTitle] = useState(initialProduct?.title || '');
  const [subtitle, setSubtitle] = useState(initialProduct?.subtitle || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [eggType, setEggType] = useState(initialProduct?.eggType || 'white_farm');
  const [packagingSize, setPackagingSize] = useState<'6pack' | '12pack' | '30tray'>(
    initialProduct?.packagingSize || '12pack'
  );
  const [boxLabel, setBoxLabel] = useState(initialProduct?.boxLabel || '12-Pack Carton');
  const [qualityTier, setQualityTier] = useState(initialProduct?.qualityTier || 'A-Grade Fresh');
  const [breed, setBreed] = useState(initialProduct?.breed || 'Heritage Pasture Breed');
  const [coopOrigin, setCoopOrigin] = useState(initialProduct?.coopOrigin || 'Sunrise Valley, Coop #01');
  const [region, setRegion] = useState(initialProduct?.region || 'Sindh Agro Belt');
  const [dietInfo, setDietInfo] = useState(initialProduct?.dietInfo || '100% Non-GMO alfalfa, flaxseeds, wild greens');
  const [yolkScore, setYolkScore] = useState<number>(initialProduct?.yolkScore || 14);
  const [batchCode, setBatchCode] = useState(initialProduct?.batchCode || `ZB-SND-${Math.floor(100 + Math.random() * 900)}`);
  const [layDate, setLayDate] = useState(initialProduct?.layDate || 'Fresh Yesterday');

  // Pricing & Stock
  const [price6Pack, setPrice6Pack] = useState(initialProduct?.price6Pack ?? 450);
  const [price12Pack, setPrice12Pack] = useState(initialProduct?.price12Pack ?? 850);
  const [price30Tray, setPrice30Tray] = useState(initialProduct?.price30Tray ?? 1950);
  const [stockQuantity, setStockQuantity] = useState(initialProduct?.stockQuantity ?? 30);

  // Image & Toggles
  const [imageUrl, setImageUrl] = useState(
    initialProduct?.imageUrl ||
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=1000&q=80'
  );
  const [isActive, setIsActive] = useState(initialProduct?.isActive !== undefined ? initialProduct.isActive : true);
  const [featured, setFeatured] = useState(initialProduct?.featured !== undefined ? initialProduct.featured : false);
  const [badgesInput, setBadgesInput] = useState(initialProduct?.badges ? initialProduct.badges.join(', ') : 'Desi Heritage, Organic, Pasture-Raised');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  const sampleImages = [
    { label: 'Brown Pasture Eggs', url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Pastel Blue Eggs', url: 'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Duck Eggs', url: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Speckled Quail Eggs', url: 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Liquid Egg Whites', url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1000&q=80' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const badges = badgesInput
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean);

      const payload = {
        title,
        subtitle,
        description,
        eggType,
        packagingSize,
        boxLabel,
        qualityTier,
        breed,
        coopOrigin,
        region,
        dietInfo,
        yolkScore,
        batchCode,
        layDate,
        price6Pack: Number(price6Pack),
        price12Pack: Number(price12Pack),
        price30Tray: Number(price30Tray),
        stockQuantity: Number(stockQuantity),
        imageUrl,
        isActive,
        featured,
        badges,
      };

      const url = isEditing ? `/api/products/${initialProduct?.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save product.');
      }

      setSuccessToast(true);
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          href="/admin/products"
          startIcon={<ArrowBackIcon />}
          sx={{ fontWeight: 700, color: '#1E3A2F' }}
        >
          Back to Inventory Table
        </Button>
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E3A2F', mb: 1 }}>
        {isEditing ? `Edit: ${initialProduct?.title}` : 'Add New Egg Variety'}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Changes made here are instantly pushed live to production customer catalog pages.
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3.5}>
          {/* Left Column: Basic Info */}
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 3.5, mb: 3, borderRadius: 4, border: '1px solid #E5DFD5' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
                1. Variety Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Variety Name"
                    fullWidth
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Subtitle / Short Value Proposition"
                    fullWidth
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Egg Classification"
                    fullWidth
                    value={eggType}
                    onChange={(e) => setEggType(e.target.value as any)}
                  >
                    <MenuItem value="white_farm">White Farm Eggs</MenuItem>
                    <MenuItem value="desi_yellow">Yellow Desi Eggs</MenuItem>
                    <MenuItem value="hen">Heritage Hen Egg</MenuItem>
                    <MenuItem value="duck">Baker’s Duck Egg</MenuItem>
                    <MenuItem value="quail">Japanese Coturnix Quail</MenuItem>
                    <MenuItem value="liquid_whites">Pasteurized Liquid Whites</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hen/Bird Breed"
                    fullWidth
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    label="Box Packaging Format"
                    fullWidth
                    value={packagingSize}
                    onChange={(e) => setPackagingSize(e.target.value as any)}
                  >
                    <MenuItem value="6pack">6-Egg Box (Half Dozen)</MenuItem>
                    <MenuItem value="12pack">12-Egg Box (1 Dozen)</MenuItem>
                    <MenuItem value="30tray">30-Egg Tray (Flat)</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Box Display Label"
                    fullWidth
                    value={boxLabel}
                    onChange={(e) => setBoxLabel(e.target.value)}
                    helperText="e.g. 12-Egg Box, 30-Tray Box"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Quality Tier"
                    fullWidth
                    value={qualityTier}
                    onChange={(e) => setQualityTier(e.target.value)}
                    helperText="e.g. Classic White, Aseel Pure"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Detailed Description"
                    multiline
                    rows={4}
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Packaging & Pricing */}
            <Card sx={{ p: 3.5, borderRadius: 4, border: '1px solid #E5DFD5' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
                2. Packaging Sizes &amp; Live Pricing (PKR)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="6-Pack Price (PKR)"
                    type="number"
                    fullWidth
                    required
                    value={price6Pack}
                    onChange={(e) => setPrice6Pack(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="12-Pack Price (PKR)"
                    type="number"
                    fullWidth
                    required
                    value={price12Pack}
                    onChange={(e) => setPrice12Pack(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="30-Tray Price (PKR)"
                    type="number"
                    fullWidth
                    required
                    value={price30Tray}
                    onChange={(e) => setPrice30Tray(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Available Inventory (Cartons)"
                    type="number"
                    fullWidth
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Badges (comma separated)"
                    fullWidth
                    value={badgesInput}
                    onChange={(e) => setBadgesInput(e.target.value)}
                    helperText="e.g. Desi Heritage, Pasture-Raised, Omega-3"
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Right Column: Origin & Image */}
          <Grid item xs={12} md={5}>
            {/* Origin & Quality Score */}
            <Card sx={{ p: 3.5, mb: 3, borderRadius: 4, border: '1px solid #E5DFD5' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
                3. Coop Origin &amp; Quality
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Coop Origin Unit"
                    fullWidth
                    value={coopOrigin}
                    onChange={(e) => setCoopOrigin(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Farm Region"
                    fullWidth
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Batch Code Stamped"
                    fullWidth
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#1E3A2F', display: 'block', mb: 1 }}>
                    Roche Yolk Color Fan Grade: <strong>{yolkScore} / 15</strong>
                  </Typography>
                  <Slider
                    value={yolkScore}
                    min={1}
                    max={15}
                    step={1}
                    valueLabelDisplay="auto"
                    onChange={(_, val) => setYolkScore(val as number)}
                    sx={{ color: '#E8981A' }}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Image Preview & URL */}
            <Card sx={{ p: 3.5, mb: 3, borderRadius: 4, border: '1px solid #E5DFD5' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
                4. Image Source
              </Typography>
              <TextField
                label="Product Image URL"
                fullWidth
                size="small"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Sample presets */}
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                Quick Presets:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mb: 2 }}>
                {sampleImages.map((s, idx) => (
                  <Chip
                    key={idx}
                    label={s.label}
                    size="small"
                    onClick={() => setImageUrl(s.url)}
                    clickable
                    sx={{ fontSize: '0.72rem', fontWeight: 600 }}
                  />
                ))}
              </Box>

              {/* Live Preview Box */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 180,
                  borderRadius: 3,
                  overflow: 'hidden',
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #E5DFD5',
                }}
              >
                <Image src={imageUrl} alt="Preview" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </Box>
            </Card>

            {/* Visibility Toggles & Save Button */}
            <Card sx={{ p: 3.5, borderRadius: 4, border: '1px solid #E5DFD5' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    color="success"
                  />
                }
                label={
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    Active on Live Storefront (Visible to Customers)
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    color="secondary"
                  />
                }
                label={
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    Show in Homepage Featured Harvest
                  </Typography>
                }
              />

              {errorMsg && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {errorMsg}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{ mt: 3, py: 1.8, borderRadius: 3, fontWeight: 800, fontSize: '1.05rem' }}
              >
                {loading ? 'Saving Changes...' : isEditing ? 'Update Live Product' : 'Publish Product to Live Store'}
              </Button>
            </Card>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={successToast}
        autoHideDuration={3000}
        onClose={() => setSuccessToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', fontWeight: 700 }}>
          {isEditing ? 'Product updated successfully in live database!' : 'Product created and published live!'}
        </Alert>
      </Snackbar>
    </Box>
  );
}
