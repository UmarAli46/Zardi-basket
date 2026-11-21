'use client';
import React, { useState } from 'react';
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Chip,
  Select,
  MenuItem,
  Button,
  TextField,
  Collapse,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Order, OrderStatus, PaymentStatus } from '@/lib/types';

interface OrdersManagementTableProps {
  initialOrders: Order[];
}

export default function OrdersManagementTable({ initialOrders }: OrdersManagementTableProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ open: boolean; text: string; severity: 'success' | 'error' }>({
    open: false,
    text: '',
    severity: 'success',
  });

  const handleUpdateStatus = async (orderId: string, newOrderStatus: OrderStatus, newPaymentStatus?: PaymentStatus) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          orderStatus: newOrderStatus,
          paymentStatus: newPaymentStatus,
        }),
      });

      if (!res.ok) throw new Error('Failed to update order state.');

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, orderStatus: newOrderStatus, ...(newPaymentStatus ? { paymentStatus: newPaymentStatus } : {}) }
            : o
        )
      );

      setToastMsg({
        open: true,
        text: `Order status updated to ${newOrderStatus.toUpperCase()}!`,
        severity: 'success',
      });
    } catch (err: any) {
      setToastMsg({ open: true, text: err.message, severity: 'error' });
    }
  };

  return (
    <>
      <Card sx={{ p: 3, borderRadius: 4, border: '1px solid #E5DFD5', backgroundColor: '#FFFFFF' }}>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell sx={{ fontWeight: 800 }}>Order #</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Customer Name &amp; Phone</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Items Count</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Total (PKR)</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Payment Method &amp; Ref</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Payment Status</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Fulfillment Stepper</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((ord) => {
                const isExpanded = expandedRow === ord.id;
                return (
                  <React.Fragment key={ord.id}>
                    <TableRow hover>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => setExpandedRow(isExpanded ? null : ord.id)}
                        >
                          {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>

                      <TableCell sx={{ fontWeight: 800, color: '#1E3A2F' }}>
                        {ord.orderNumber}
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {ord.customerName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {ord.customerPhone} • {ord.deliveryCity}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ fontWeight: 700 }}>
                        {ord.items.reduce((sum, it) => sum + it.quantity, 0)} cartons
                      </TableCell>

                      <TableCell sx={{ fontWeight: 900, color: '#E8981A' }}>
                        Rs. {ord.totalAmount}
                      </TableCell>

                      <TableCell>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                          {ord.paymentMethod.replace('_', ' ')}
                        </Typography>
                        {ord.paymentReference && (
                          <Chip
                            label={`Ref: ${ord.paymentReference}`}
                            size="small"
                            sx={{ fontSize: '0.68rem', fontWeight: 700, height: 20 }}
                          />
                        )}
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={ord.paymentStatus.toUpperCase()}
                            size="small"
                            sx={{
                              fontWeight: 800,
                              backgroundColor: ord.paymentStatus === 'paid' ? 'rgba(46,125,50,0.1)' : 'rgba(232,152,26,0.15)',
                              color: ord.paymentStatus === 'paid' ? '#2E7D32' : '#B87208',
                            }}
                          />
                          {ord.paymentStatus !== 'paid' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() => handleUpdateStatus(ord.id, ord.orderStatus, 'paid')}
                              startIcon={<CheckCircleOutlineIcon />}
                              sx={{ fontSize: '0.7rem', py: 0.2, px: 1, minWidth: 'auto', fontWeight: 700 }}
                            >
                              Approve
                            </Button>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Select
                          size="small"
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            borderRadius: 2,
                            backgroundColor: '#FAF7F2',
                          }}
                        >
                          <MenuItem value="confirmed">Confirmed</MenuItem>
                          <MenuItem value="packed">Packed at Farm</MenuItem>
                          <MenuItem value="shipped">Out for Delivery</MenuItem>
                          <MenuItem value="delivered">Delivered</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </TableCell>
                    </TableRow>

                    {/* Expandable Order Details Row */}
                    <TableRow>
                      <TableCell colSpan={8} sx={{ py: 0, borderBottom: isExpanded ? '1px solid #E5DFD5' : 'none' }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2.5, backgroundColor: '#FAF7F2', borderRadius: 2, my: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 1 }}>
                              Delivery Destination &amp; Order Breakdown:
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1.5 }}>
                              <strong>Address:</strong> {ord.deliveryAddress}, {ord.deliveryCity}
                              {ord.deliveryNotes && (
                                <Box component="span" sx={{ display: 'block', color: '#E8981A', fontWeight: 600 }}>
                                  Instructions: &quot;{ord.deliveryNotes}&quot;
                                </Box>
                              )}
                            </Typography>

                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                              CARTONS:
                            </Typography>
                            {ord.items.map((it, idx) => (
                              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, maxWidth: 450 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                  • {it.quantity}x {it.title} ({it.packagingLabel})
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 800 }}>
                                  Rs. {it.lineTotal}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Card>

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
