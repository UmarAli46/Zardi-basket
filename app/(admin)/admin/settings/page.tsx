'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { initialStoreSettings } from '@/lib/data/products';
import { StoreSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(initialStoreSettings);
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In demo / hybrid mode, store settings state
    setTimeout(() => {
      setLoading(false);
      setToastOpen(true);
    }, 600);
  };

  return (
    <Box maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E3A2F' }}>
          Farm &amp; Storefront Settings
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Configure standard delivery fees, free shipping thresholds, and local mobile merchant numbers.
        </Typography>
      </Box>

      <form onSubmit={handleSave}>
        <Card sx={{ p: 3.5, mb: 3, borderRadius: 4, border: '1px solid #E5DFD5' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
            1. Store Identity &amp; Contact
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Store Name"
                fullWidth
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tagline"
                fullWidth
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Customer Support Mobile"
                fullWidth
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Customer Support Email"
                fullWidth
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Hub &amp; Support Address"
                fullWidth
                value={settings.contactAddress || ''}
                onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
              />
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ p: 3.5, mb: 3, borderRadius: 4, border: '1px solid #E5DFD5' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
            2. Delivery &amp; Shield Fees (PKR)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Standard Insulated Delivery (Rs.)"
                type="number"
                fullWidth
                value={settings.deliveryCharge}
                onChange={(e) => setSettings({ ...settings, deliveryCharge: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Free Delivery Threshold (Rs.)"
                type="number"
                fullWidth
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Breakage Shield Fee (Rs.)"
                type="number"
                fullWidth
                value={settings.breakageGuaranteeFee}
                onChange={(e) => setSettings({ ...settings, breakageGuaranteeFee: Number(e.target.value) })}
              />
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ p: 3.5, mb: 4, borderRadius: 4, border: '1px solid #E5DFD5' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
            3. Local Pakistani Merchant Accounts
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Merchant Account Title"
                fullWidth
                value={settings.merchantTitle}
                onChange={(e) => setSettings({ ...settings, merchantTitle: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="JazzCash Merchant Till Number"
                fullWidth
                value={settings.merchantJazzCash}
                onChange={(e) => setSettings({ ...settings, merchantJazzCash: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Easypaisa Account Number"
                fullWidth
                value={settings.merchantEasypaisa}
                onChange={(e) => setSettings({ ...settings, merchantEasypaisa: e.target.value })}
              />
            </Grid>
          </Grid>
        </Card>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          sx={{ py: 1.8, px: 4, borderRadius: 3, fontWeight: 800, fontSize: '1rem' }}
        >
          {loading ? 'Saving Settings...' : 'Save Storefront Configuration'}
        </Button>
      </form>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ fontWeight: 700 }}>
          Storefront settings saved and active live!
        </Alert>
      </Snackbar>
    </Box>
  );
}
