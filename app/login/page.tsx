'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EggIcon from '@mui/icons-material/Egg';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MuiProvider from '@/components/providers/MuiProvider';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('ua46846@gmail.com');
    setPassword('ZardiAdmin2026!');
  };

  return (
    <MuiProvider>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF7F2',
          p: 2,
        }}
      >
        <Container maxWidth="xs">
          <Box sx={{ mb: 3 }}>
            <Button component={Link} href="/" startIcon={<ArrowBackIcon />} sx={{ color: '#1E3A2F', fontWeight: 700 }}>
              Return to Customer Store
            </Button>
          </Box>

          <Card
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid #E5DFD5',
              boxShadow: '0 12px 36px rgba(30, 58, 47, 0.08)',
              backgroundColor: '#FFFFFF',
              textAlign: 'center',
            }}
          >
            {/* Logo Emblem */}
            <Box
              sx={{
                width: 68,
                height: 68,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Image
                src="/images/zardi-logo.png"
                alt="Zardi Basket Logo"
                width={68}
                height={68}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                priority
              />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E3A2F', mb: 0.5 }}>
              Seller Admin Portal
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Sign in to manage live inventory, pricing tiers, and fulfillment.
            </Typography>

            {errorMsg && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, textAlign: 'left' }}>
                {errorMsg}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <TextField
                label="Admin Email Address"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockOutlinedIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 800,
                  fontSize: '1rem',
                  backgroundColor: '#1E3A2F',
                  '&:hover': { backgroundColor: '#13261F' },
                  mb: 2,
                }}
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </Button>

              {/* Demo Helper Button */}
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleFillDemo}
                sx={{ borderRadius: 2.5, fontWeight: 700, fontSize: '0.85rem' }}
              >
                Auto-Fill Demo Credentials
              </Button>
            </form>

            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #E5DFD5' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Protected with Rate Limiting &amp; Secure Session Cookies
              </Typography>
            </Box>
          </Card>
        </Container>
      </Box>
    </MuiProvider>
  );
}
