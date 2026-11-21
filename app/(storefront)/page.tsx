import React from 'react';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedIcon from '@mui/icons-material/Verified';
import FlareIcon from '@mui/icons-material/Flare';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import EggOutlinedIcon from '@mui/icons-material/EggOutlined';
import HeroEggCanvas from '@/components/three/HeroEggCanvas';
import ProductCard from '@/components/storefront/ProductCard';
import { getProducts } from '@/lib/db';
import BatchTraceabilityWidget from '@/components/storefront/BatchTraceabilityWidget';

export const revalidate = 0; // Dynamic on-demand

export default async function HomePage() {
  const products = await getProducts({ onlyActive: true });
  const whiteFeatured = products.filter((p) => p.eggType === 'white_farm').slice(0, 3);
  const desiFeatured = products.filter((p) => p.eggType === 'desi_yellow').slice(0, 3);
  const featuredProducts = [...whiteFeatured, ...desiFeatured];

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* 1. HERO SECTION */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 4, md: 8 },
          pb: { xs: 6, md: 10 },
          background: 'linear-gradient(180deg, rgba(232, 152, 26, 0.08) 0%, rgba(250, 247, 242, 1) 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left Column: Headline & Action */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
                  lineHeight: 1.1,
                  fontWeight: 900,
                  color: '#1E3A2F',
                  letterSpacing: '-0.03em',
                  mb: 2.5,
                }}
              >
                Khalis Desi Anday,{' '}
                <Box component="span" sx={{ color: '#E8981A', display: 'inline' }}>
                  Farm se Dastarkhwan Tak.
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.18rem' },
                  color: '#5C6D65',
                  lineHeight: 1.6,
                  maxWidth: 580,
                  mb: 4,
                }}
              >
                Pasture-raised Yellow Desi and White Farm eggs from organic coops across Sindh (Karachi, Hyderabad, Thatta &amp; beyond). Thick shells, vibrant yolks, delivered to your doorstep in shockproof packaging within 24 to 48 hours.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={Link}
                  href="/shop"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 3.5,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    boxShadow: '0 8px 24px rgba(232, 152, 26, 0.35)',
                  }}
                >
                  Shop Fresh Harvest
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  component={Link}
                  href="#traceability"
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    borderColor: '#1E3A2F',
                    borderWidth: 2,
                    '&:hover': { borderWidth: 2, backgroundColor: 'rgba(30, 58, 47, 0.05)' },
                  }}
                >
                  Verify Batch Code
                </Button>
              </Box>

              {/* Trust Metrics Bar */}
              <Grid container spacing={2} sx={{ pt: 2, borderTop: '1px solid #E5DFD5' }}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#1E3A2F', lineHeight: 1 }}>
                    100%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Pasture Foraged
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#E8981A', lineHeight: 1 }}>
                    &lt; 48 Hrs
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Lay to Doorstep
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#1E3A2F', lineHeight: 1 }}>
                    Grade 14+
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Yolk Color Fan
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#2E7D32', lineHeight: 1 }}>
                    0 Crack
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Shield Policy
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* Right Column: Three.js Interactive 3D Egg Canvas */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 360, sm: 420, md: 470 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Dual Color Background Glow */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '85%',
                    height: '85%',
                    borderRadius: '50%',
                    background:
                      'radial-gradient(circle, rgba(232, 152, 26, 0.22) 0%, rgba(250, 247, 242, 0) 70%)',
                    filter: 'blur(35px)',
                  }}
                />

                {/* 3D WebGL Half-White & Half-Yellow/Brown Egg with Farmy and Desi Hens */}
                <HeroEggCanvas />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. CATEGORY HIGHLIGHT CARDS: WHITE FARM & YELLOW DESI */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto', mb: 4 }}>
          <Typography variant="caption" sx={{ color: '#E8981A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Exclusive Sindh Harvest
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#1E3A2F', mt: 0.5 }}>
            Our Two Primary Egg Lines
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Each egg line offers 3 distinct varieties available in 6-Egg, 12-Egg, and 30-Egg packaging boxes.
          </Typography>
        </Box>

        <Grid container spacing={3.5}>
          {[
            {
              title: 'White Farm Eggs',
              desc: '3 distinct commercial farm egg varieties: Classic Breakfast, Premium Leghorn, and Enriched Protein. Clean porcelain-white shells with firm albumen for daily meals and baking.',
              badge: '3 Varieties • 6, 12 & 30-Egg Boxes',
              starting: 'From Rs. 160 (6-Egg Box)',
              href: '/shop?category=white_farm',
              color: '#1E3A2F',
            },
            {
              title: 'Yellow Desi Eggs',
              desc: '3 distinct free-range desi varieties: Pure Aseel, Golden Misri, and Sindh Heritage. Open pasture foraged hens yielding rich golden-yellow and sunset-amber yolks.',
              badge: '3 Varieties • 6, 12 & 30-Egg Boxes',
              starting: 'From Rs. 230 (6-Egg Box)',
              href: '/shop?category=desi_yellow',
              color: '#E8981A',
            },
          ].map((cat, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Card
                component={Link}
                href={cat.href}
                sx={{
                  p: 4,
                  height: '100%',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  borderRadius: 0,
                  border: '2px solid #E5DFD5',
                  transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: '#E8981A',
                    boxShadow: '0 16px 32px rgba(30, 58, 47, 0.08)',
                  },
                }}
              >
                <Chip
                  label={cat.badge}
                  size="small"
                  sx={{
                    width: 'fit-content',
                    mb: 1.5,
                    backgroundColor: 'rgba(232, 152, 26, 0.12)',
                    color: '#B87208',
                    fontWeight: 800,
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E3A2F', mb: 1.5 }}>
                  {cat.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2.5, lineHeight: 1.6 }}>
                  {cat.desc}
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
                    {cat.starting}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 800, color: '#E8981A', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.85rem' }}
                  >
                    View 3 Varieties →
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 3. FEATURED PRODUCTS CATALOG */}
      <Box sx={{ py: 6, backgroundColor: '#FAF7F2' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#E8981A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Direct from our Coops
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#1E3A2F' }}>
                Featured Harvest
              </Typography>
            </Box>
            <Button
              component={Link}
              href="/shop"
              endIcon={<ArrowForwardIcon />}
              sx={{ fontWeight: 800, color: '#1E3A2F' }}
            >
              View Full Catalog ({products.length})
            </Button>
          </Box>

          <Grid container spacing={3.5}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 4. TRACEABILITY & FRESHNESS BATCH METER */}
      <Box id="traceability" sx={{ py: 8, backgroundColor: '#FFFFFF', borderTop: '1px solid #E5DFD5' }}>
        <Container maxWidth="lg">
          <BatchTraceabilityWidget />
        </Container>
      </Box>

      {/* 5. WHY ZARDI BASKET: PASTURE VS INDUSTRIAL */}
      <Box sx={{ py: 8, backgroundColor: '#FAF7F2' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 680, mx: 'auto', mb: 6 }}>
            <Typography variant="caption" sx={{ color: '#E8981A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              The Organic Difference
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#1E3A2F', mb: 2 }}>
              Zardi Basket vs. Standard Commercial Eggs
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Standard grocery eggs often spend weeks in commercial transit and cold storage with pale, runny yolks. Zardi Basket delivers harvest-fresh eggs directly from organic coops within 48 hours.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, height: '100%', border: '2px solid #E8981A', backgroundColor: '#FFFFFF', borderRadius: 0 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🥚</span> Zardi Basket Organic Pasture Eggs
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    'Delivered to your doorstep within 24 to 48 hours of coop harvest',
                    'Deep sunset-orange yolks naturally rich in lutein and Omega-3 fatty acids',
                    '100% pasture-foraged hens with zero antibiotics, growth hormones, or chemicals',
                    'Direct ethical sourcing from certified organic farms in Thatta, Malir, and Sindh corridors',
                    'Shockproof insulated carton packing with zero-breakage replacement guarantee across Sindh',
                  ].map((text, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <VerifiedIcon sx={{ color: '#2E7D32', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E3A2F' }}>
                        {text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, height: '100%', backgroundColor: '#F5F2EC', borderRadius: 0, border: '1px solid #E5DFD5' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#7E8B84', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🏭</span> Conventional Commercial Eggs
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    'Often 20 to 35 days old, sitting in wholesale markets and warehouse storage',
                    'Pale, runny yolks that quickly flatten and break in the cooking pan',
                    'Hens confined to cramped battery cages fed on artificial industrial grain',
                    'Synthetic dye additives frequently used in feed to simulate yolk coloration',
                    'Delivered in flimsy paper bags or open crates with high risk of cracking',
                  ].map((text, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#A3B4AC' }} />
                      <Typography variant="body2" sx={{ color: '#7E8B84' }}>
                        {text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
