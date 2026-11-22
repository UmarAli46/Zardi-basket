'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Switch,
  IconButton,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Product } from '@/lib/types';

interface ProductManagementTableProps {
  initialProducts: Product[];
}

export default function ProductManagementTable({ initialProducts }: ProductManagementTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMsg, setToastMsg] = useState<{ open: boolean; text: string; severity: 'success' | 'error' }>({
    open: false,
    text: '',
    severity: 'success',
  });

  // Toggle Active State (Instant Optimistic UI + Live Server Sync)
  const handleToggleActive = async (product: Product) => {
    const previousState = product.isActive;
    const updatedState = !previousState;

    // 1. Optimistic Update: Switch moves immediately!
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isActive: updatedState } : p))
    );

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedState }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Revert on error
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isActive: previousState } : p))
        );

        if (res.status === 401) {
          setToastMsg({
            open: true,
            text: 'Your Admin session expired. Please log in at /login.',
            severity: 'error',
          });
          window.location.href = '/login?redirect=/admin/products';
          return;
        }

        throw new Error(data.error || 'Failed to update live visibility.');
      }

      setToastMsg({
        open: true,
        text: `"${product.title}" is now ${updatedState ? 'LIVE on Store' : 'HIDDEN from Store'}!`,
        severity: 'success',
      });
      router.refresh();
    } catch (err: any) {
      // Revert on error
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isActive: previousState } : p))
      );
      setToastMsg({ open: true, text: err.message, severity: 'error' });
    }
  };

  // Quick Stock Adjustment (Instant Optimistic UI + Live Server Sync)
  const handleStockChange = async (productId: string, newStock: number) => {
    if (newStock < 0) return;

    const originalProduct = products.find((p) => p.id === productId);
    const originalStock = originalProduct?.stockQuantity ?? 0;

    // 1. Optimistic Update: Number & Stock Badge change immediately!
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockQuantity: newStock } : p))
    );

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQuantity: newStock }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Revert on error
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stockQuantity: originalStock } : p))
        );

        if (res.status === 401) {
          setToastMsg({
            open: true,
            text: 'Your Admin session expired. Please log in at /login.',
            severity: 'error',
          });
          window.location.href = '/login?redirect=/admin/products';
          return;
        }

        throw new Error(data.error || 'Failed to update stock count.');
      }

      setToastMsg({
        open: true,
        text: `Inventory updated to ${newStock} units in live database!`,
        severity: 'success',
      });
      router.refresh();
    } catch (err: any) {
      // Revert on error
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stockQuantity: originalStock } : p))
      );
      setToastMsg({ open: true, text: err.message, severity: 'error' });
    }
  };

  // Quick Price Adjustment
  const handlePriceChange = async (
    productId: string,
    field: 'price6Pack' | 'price12Pack' | 'price30Tray',
    newPrice: number
  ) => {
    if (newPrice < 0) return;

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, [field]: newPrice } : p))
    );

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: newPrice }),
      });

      if (!res.ok) {
        throw new Error('Failed to update price.');
      }

      setToastMsg({
        open: true,
        text: 'Price updated live across store!',
        severity: 'success',
      });
      router.refresh();
    } catch (err: any) {
      setToastMsg({ open: true, text: err.message, severity: 'error' });
    }
  };

  // Confirm Delete
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to remove product.');

      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setDeleteDialogOpen(false);
      setSelectedProduct(null);

      setToastMsg({
        open: true,
        text: 'Product removed from catalog and live production.',
        severity: 'success',
      });
    } catch (err: any) {
      setToastMsg({ open: true, text: err.message, severity: 'error' });
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Card sx={{ p: 3, borderRadius: 4, border: '1px solid #E5DFD5', backgroundColor: '#FFFFFF' }}>
        {/* Search Bar */}
        <Box sx={{ mb: 3, maxWidth: 360 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search egg varieties or regions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: '#5C6D65' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2.5, backgroundColor: '#FAF7F2' },
            }}
          />
        </Box>

        {/* Data Table */}
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Egg Item</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Type / Breed</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>6-Pack Price</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>12-Pack Price</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>30-Tray Price</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Stock (Cartons)</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Live Visibility</TableCell>
                <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((prod) => (
                <TableRow key={prod.id} hover>
                  {/* Item Image & Title */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          position: 'relative',
                          borderRadius: 2,
                          overflow: 'hidden',
                          flexShrink: 0,
                          backgroundColor: '#FAF7F2',
                        }}
                      >
                        <Image
                          src={prod.imageUrl}
                          alt={prod.title}
                          fill
                          sizes="52px"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
                          {prod.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {prod.coopOrigin}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Breed */}
                  <TableCell>
                    <Chip
                      label={prod.eggType.toUpperCase()}
                      size="small"
                      sx={{ fontWeight: 700, backgroundColor: 'rgba(30, 58, 47, 0.08)', color: '#1E3A2F', mb: 0.5 }}
                    />
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                      {prod.breed}
                    </Typography>
                  </TableCell>

                  {/* 6-Pack Price */}
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={prod.price6Pack}
                      onChange={(e) => handlePriceChange(prod.id, 'price6Pack', Number(e.target.value))}
                      inputProps={{ min: 0, style: { width: 72, fontWeight: 700, padding: '6px 8px' } }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, backgroundColor: '#FAF7F2' } }}
                    />
                  </TableCell>

                  {/* 12-Pack Price */}
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={prod.price12Pack}
                      onChange={(e) => handlePriceChange(prod.id, 'price12Pack', Number(e.target.value))}
                      inputProps={{ min: 0, style: { width: 72, fontWeight: 800, color: '#E8981A', padding: '6px 8px' } }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, backgroundColor: '#FAF7F2' } }}
                    />
                  </TableCell>

                  {/* 30-Tray Price */}
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={prod.price30Tray}
                      onChange={(e) => handlePriceChange(prod.id, 'price30Tray', Number(e.target.value))}
                      inputProps={{ min: 0, style: { width: 72, fontWeight: 700, padding: '6px 8px' } }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, backgroundColor: '#FAF7F2' } }}
                    />
                  </TableCell>

                  {/* Stock Counter & Availability Controls */}
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          type="number"
                          size="small"
                          value={prod.stockQuantity}
                          onChange={(e) => handleStockChange(prod.id, Number(e.target.value))}
                          inputProps={{ min: 0, max: 9999, style: { width: 62, fontWeight: 800, textAlign: 'center' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: prod.stockQuantity <= 0 ? '#FFEBEE' : prod.stockQuantity < 10 ? '#FFF8E1' : '#FAF7F2',
                            },
                          }}
                        />
                        <Chip
                          label={prod.stockQuantity <= 0 ? 'Out of Stock' : prod.stockQuantity < 10 ? 'Low Stock' : 'In Stock'}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.68rem',
                            backgroundColor: prod.stockQuantity <= 0 ? '#FFCDD2' : prod.stockQuantity < 10 ? '#FFE082' : '#C8E6C9',
                            color: prod.stockQuantity <= 0 ? '#B71C1C' : prod.stockQuantity < 10 ? '#B45309' : '#1B5E20',
                          }}
                        />
                      </Box>
                      {/* Quick 1-Click Availability Buttons */}
                      <Box sx={{ display: 'flex', gap: 0.8 }}>
                        {prod.stockQuantity > 0 ? (
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => handleStockChange(prod.id, 0)}
                            sx={{ fontSize: '0.68rem', color: '#D32F2F', p: 0, minWidth: 'auto', fontWeight: 700 }}
                          >
                            Mark Out of Stock
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => handleStockChange(prod.id, 30)}
                            sx={{ fontSize: '0.68rem', color: '#2E7D32', p: 0, minWidth: 'auto', fontWeight: 700 }}
                          >
                            +30 Restock
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Active Switch */}
                  <TableCell>
                    <Switch
                      checked={prod.isActive}
                      onChange={() => handleToggleActive(prod)}
                      color="success"
                    />
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', fontWeight: 700, color: prod.isActive ? '#2E7D32' : 'text.secondary' }}
                    >
                      {prod.isActive ? 'Live' : 'Hidden'}
                    </Typography>
                  </TableCell>

                  {/* Actions */}
                  <TableCell sx={{ textAlign: 'right' }}>
                    <IconButton
                      component={Link}
                      href={`/shop/${prod.slug}`}
                      target="_blank"
                      size="small"
                      title="View on Customer Site"
                      sx={{ color: '#5C6D65' }}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      component={Link}
                      href={`/admin/products/${prod.id}/edit`}
                      size="small"
                      title="Edit Product"
                      sx={{ color: '#1E3A2F' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedProduct(prod);
                        setDeleteDialogOpen(true);
                      }}
                      size="small"
                      title="Delete Product"
                      sx={{ color: '#D32F2F' }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to remove <strong>{selectedProduct?.title}</strong>? This will permanently delete it from the database and remove it from the live production site.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteProduct} color="error" variant="contained" sx={{ fontWeight: 700 }}>
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Alert */}
      <Snackbar
        open={toastMsg.open}
        autoHideDuration={3000}
        onClose={() => setToastMsg((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toastMsg.severity} sx={{ fontWeight: 700 }}>
          {toastMsg.text}
        </Alert>
      </Snackbar>
    </>
  );
}
