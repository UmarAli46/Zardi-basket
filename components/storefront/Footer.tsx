'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Grid, Typography, Divider, Chip } from '@mui/material';
import EggIcon from '@mui/icons-material/Egg';
import VerifiedIcon from '@mui/icons-material/Verified';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#13261F',
        color: '#E5DFD5',
        pt: 8,
        pb: 5,
        borderTop: '4px solid #E8981A',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Col 1: Brand Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src="/images/zardi-logo.png"
                  alt="Zardi Basket Logo"
                  width={44}
                  height={44}
                  style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Zardi Basket
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#A3B4AC', lineHeight: 1.7, mb: 2.5 }}>
              Sindh’s premier farm-direct egg delivery service. Fresh Yellow Desi and White Farm eggs harvested daily from Thatta, Malir, and Indus Basin coops and delivered cold-chain across Karachi, Hyderabad, Sukkur, and all of Sindh.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<VerifiedIcon sx={{ fontSize: 16, color: '#FFAA29 !important' }} />}
                label="100% Fresh &amp; Pure"
                size="small"
                sx={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', fontSize: '0.72rem' }}
              />
              <Chip
                icon={<VerifiedIcon sx={{ fontSize: 16, color: '#FFAA29 !important' }} />}
                label="Zero Hormones"
                size="small"
                sx={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', fontSize: '0.72rem' }}
              />
              <Chip
                icon={<VerifiedIcon sx={{ fontSize: 16, color: '#FFAA29 !important' }} />}
                label="Sindh Exclusive Delivery"
                size="small"
                sx={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', fontSize: '0.72rem' }}
              />
            </Box>
          </Grid>

          {/* Col 2: Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFAA29', textTransform: 'uppercase', mb: 2, letterSpacing: '0.05em' }}>
              Egg Varieties
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <Link href="/shop" style={{ color: '#D2DDD7', textDecoration: 'none', fontSize: '0.88rem' }}>
                All Eggs
              </Link>
              <Link href="/shop?category=white_farm" style={{ color: '#D2DDD7', textDecoration: 'none', fontSize: '0.88rem' }}>
                White Farm Eggs
              </Link>
              <Link href="/shop/classic-white-farm-eggs-12pack" style={{ color: '#D2DDD7', textDecoration: 'none', fontSize: '0.88rem' }}>
                Classic White (Thatta)
              </Link>
              <Link href="/shop?category=desi_yellow" style={{ color: '#D2DDD7', textDecoration: 'none', fontSize: '0.88rem' }}>
                Yellow Desi Eggs
              </Link>
              <Link href="/shop/pure-aseel-desi-eggs-12pack" style={{ color: '#D2DDD7', textDecoration: 'none', fontSize: '0.88rem' }}>
                Pure Aseel Desi Eggs
              </Link>
              <Link href="/shop/golden-misri-desi-eggs-12pack" style={{ color: '#D2DDD7', textDecoration: 'none', fontSize: '0.88rem' }}>
                Golden Misri Desi
              </Link>
            </Box>
          </Grid>

          {/* Col 3: Customer Care & Tracking */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFAA29', textTransform: 'uppercase', mb: 2, letterSpacing: '0.05em' }}>
              Customer Care
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <Link href="/track" style={{ color: '#D2DDD7', textDecoration: 'none', fontSize: '0.88rem' }}>
                Live Order Tracker
              </Link>
              <Link href="/cart" style={{ color: '#D2DDD7', textDecoration: 'none', fontSize: '0.88rem' }}>
                Review Basket
              </Link>
              <Link href="/checkout" style={{ color: '#D2DDD7', textDecoration: 'none', fontSize: '0.88rem' }}>
                Checkout
              </Link>
            </Box>
          </Grid>

          {/* Col 4: Farm Belts & Contact */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFAA29', textTransform: 'uppercase', mb: 2, letterSpacing: '0.05em' }}>
              Farm Belts & Hub
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOnIcon sx={{ color: '#E8981A', fontSize: 20, mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: '#A3B4AC', fontSize: '0.85rem' }}>
                  <strong>Address:</strong> IMCS Department ,University of Sindh.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WhatsAppIcon sx={{ color: '#25D366', fontSize: 19 }} />
                <Typography
                  component="a"
                  href="https://wa.me/923468463349?text=Assalam-o-Alaikum%20Zardi%20Basket!%20I%20have%20an%20inquiry%20about%20farm-fresh%20eggs."
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  sx={{ color: '#25D366', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  WhatsApp: 0346-8463349 (Instant Help)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: '#E8981A', fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: '#A3B4AC', fontSize: '0.85rem' }}>
                  0346-8463349 (Mon-Sun: 7am - 10pm)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#E8981A', fontSize: 18 }} />
                <Typography
                  component="a"
                  href="mailto:ua46846@gmail.com"
                  variant="body2"
                  sx={{ color: '#A3B4AC', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#FFAA29' } }}
                >
                  ua46846@gmail.com
                </Typography>
              </Box>
            </Box>

            {/* Payment Methods Accepted */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography variant="caption" sx={{ color: '#FFAA29', fontWeight: 700, display: 'block', mb: 1 }}>
                SECURE CHECKOUT ACCEPTED:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Safepay Sandbox (Cards)" size="small" sx={{ backgroundColor: '#FFFFFF', color: '#1E3A2F', fontWeight: 700 }} />
                <Chip label="JazzCash" size="small" sx={{ backgroundColor: '#DF1B25', color: '#FFFFFF', fontWeight: 700 }} />
                <Chip label="Easypaisa" size="small" sx={{ backgroundColor: '#00A651', color: '#FFFFFF', fontWeight: 700 }} />
                <Chip label="Cash on Delivery" size="small" sx={{ backgroundColor: '#1E3A2F', color: '#FFAA29', fontWeight: 700 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="caption" sx={{ color: '#A3B4AC' }}>
            © {new Date().getFullYear()} Zardi Basket Farms Pvt. Ltd. All rights reserved. Built with Next.js, Three.js & Supabase.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
