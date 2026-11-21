import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  Chip,
  Button,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpaIcon from '@mui/icons-material/Spa';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import PlaceIcon from '@mui/icons-material/Place';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const metadata = {
  title: 'About Us • Zardi Basket — Pure Organic Pasture & Farm Eggs Sindh',
  description:
    'Learn about Zardi Basket, Sindh’s premier farm-direct egg service. Pasture-raised across Thatta, Malir, and the Indus Basin. Exclusively serving Karachi, Hyderabad, Sukkur, and all of Sindh within 24-48 hours.',
};

export default function AboutPage() {
  return (
    <Box sx={{ backgroundColor: '#FAF7F2', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', maxWidth: 760, mx: 'auto', mb: { xs: 6, md: 9 } }}>
          <Chip
            label="Our Story &amp; Heritage"
            size="small"
            sx={{
              backgroundColor: 'rgba(232, 152, 26, 0.15)',
              color: '#B87208',
              fontWeight: 800,
              mb: 2,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: '#1E3A2F',
              fontSize: { xs: '2.2rem', sm: '3rem', md: '3.6rem' },
              lineHeight: 1.15,
              mb: 2.5,
            }}
          >
            From Organic Pastures to{' '}
            <Box component="span" sx={{ color: '#E8981A' }}>
              Your Breakfast Table
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ color: '#5C6D65', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Zardi Basket was founded with a single mission: to deliver 100% wholesome, unadulterated, farm-fresh eggs to families and kitchens across Sindh — completely free from commercial cage confinement, steroids, and artificial chemicals.
          </Typography>
        </Box>

        {/* Story Grid */}
        <Grid container spacing={5} alignItems="center" sx={{ mb: 10 }}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 320, md: 460 },
                borderRadius: 5,
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(30, 58, 47, 0.1)',
                border: '1px solid #E5DFD5',
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=1200&q=80"
                alt="Zardi Basket Farm Pasture"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" sx={{ color: '#E8981A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Natural Forage &amp; Certified Non-GMO Feed
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E3A2F', mt: 0.5, mb: 2 }}>
              Free-Range Hens, Wholesome Nourishment
            </Typography>
            <Typography variant="body1" sx={{ color: '#5C6D65', lineHeight: 1.8, mb: 2 }}>
              Standard grocery eggs come from industrial hens confined to cramped battery wire cages and fed synthetic feed to force egg production.
            </Typography>
            <Typography variant="body1" sx={{ color: '#5C6D65', lineHeight: 1.8, mb: 3 }}>
              At Zardi Basket, our indigenous Aseel, Golden Misri, and Leghorn flocks roam and thrive across the lush agro corridors of Thatta, Malir Valley (Karachi), Mirpurkhas, and the Indus River Delta in Sindh. They feed on non-GMO golden corn, whole wheat, flaxseeds, wild pasture greens, and clean water — naturally yielding rich yolks and wholesome nutrition.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<VerifiedIcon sx={{ color: '#2E7D32 !important' }} />}
                label="100% Halal &amp; Natural"
                sx={{ backgroundColor: '#FFFFFF', fontWeight: 700, border: '1px solid #E5DFD5' }}
              />
              <Chip
                icon={<SpaIcon sx={{ color: '#2E7D32 !important' }} />}
                label="Zero Hormones or Injections"
                sx={{ backgroundColor: '#FFFFFF', fontWeight: 700, border: '1px solid #E5DFD5' }}
              />
              <Chip
                icon={<SecurityIcon sx={{ color: '#E8981A !important' }} />}
                label="Shockproof Cold Delivery"
                sx={{ backgroundColor: '#FFFFFF', fontWeight: 700, border: '1px solid #E5DFD5' }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* 4 Pillars of Zardi Basket */}
        <Box sx={{ mb: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="caption" sx={{ color: '#E8981A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Our Core Commitments
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#1E3A2F' }}>
              The 4 Guarantees of Zardi Basket
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                icon: <LocalShippingIcon sx={{ fontSize: 36, color: '#E8981A' }} />,
                title: '48-Hour Harvest Delivery',
                desc: 'Delivered directly to your door in sanitized, shockproof packaging within 24 to 48 hours of being laid at the coop.',
              },
              {
                icon: <VerifiedIcon sx={{ fontSize: 36, color: '#2E7D32' }} />,
                title: '100% Organic Diet',
                desc: 'Hens enjoy certified non-GMO corn, flaxseed, and fresh clover forage. Zero synthetic dyes, steroids, or animal by-products.',
              },
              {
                icon: <SecurityIcon sx={{ fontSize: 36, color: '#1E3A2F' }} />,
                title: 'Zero-Breakage Guarantee',
                desc: 'Every carton is shock-insulated. If an egg arrives cracked, we replace or refund it immediately with zero questions asked.',
              },
              {
                icon: <PlaceIcon sx={{ fontSize: 36, color: '#E8981A' }} />,
                title: 'Coop Traceability Passport',
                desc: 'Scan the unique batch code printed on your carton to view the exact coop origin, feed analysis, breed, and lay date.',
              },
            ].map((pillar, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  sx={{
                    p: 3.5,
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid #E5DFD5',
                    backgroundColor: '#FFFFFF',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ mb: 2 }}>{pillar.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 1 }}>
                    {pillar.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {pillar.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Farm Belts Section */}
        <Card sx={{ p: { xs: 4, md: 6 }, borderRadius: 5, border: '1px solid #E5DFD5', backgroundColor: '#FFFFFF', mb: 10 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="caption" sx={{ color: '#E8981A', fontWeight: 800, textTransform: 'uppercase' }}>
                Our Agricultural Corridors
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E3A2F', mt: 0.5, mb: 2 }}>
                Sindh’s Organic Pasture &amp; Aviary Corridors
              </Typography>
              <Typography variant="body2" sx={{ color: '#5C6D65', lineHeight: 1.8, mb: 3 }}>
                Our ethical coops and bio-secure aviaries are situated across the most fertile agricultural regions of Sindh:
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#E8981A' }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                    Thatta &amp; Indus Basin: <span>Pure Aseel Desi free-range pastures &amp; classic farm aviaries</span>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#2E7D32' }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                    Malir Agro Corridor (Karachi): <span>Organic Heritage Desi flocks &amp; purebred Leghorn white layers</span>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#1E3A2F' }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                    Mirpurkhas &amp; Hyderabad: <span>Golden Misri pastures &amp; enriched protein layer facilities</span>
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ p: 3, backgroundColor: '#FAF7F2', borderRadius: 4, border: '1px solid #E5DFD5' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 1 }}>
                  Contact Farm Support
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                  Address: <strong>IMCS Department ,University of Sindh.</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                  Direct helpline: <strong>0346-8463349</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Email: <strong><a href="mailto:ua46846@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>ua46846@gmail.com</a></strong>
                </Typography>
                <Typography variant="caption" sx={{ color: '#E8981A', fontWeight: 700, display: 'block' }}>
                  Daily Deliveries Across Sindh (Karachi, Hyderabad, Sukkur, Thatta &amp; Beyond)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* CTA Banner */}
        <Box
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 5,
            backgroundColor: '#1E3A2F',
            color: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            Bring Wholesome Farm Nutrition to Your Table
          </Typography>
          <Typography variant="body1" sx={{ color: '#D2DDD7', maxWidth: 600, mx: 'auto', mb: 3.5 }}>
            Order pure Aseel Desi, Golden Misri, and pristine White Farm eggs online across Sindh today.
          </Typography>
          <Button
            component={Link}
            href="/shop"
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: '1.05rem' }}
          >
            Order Fresh Harvest →
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
