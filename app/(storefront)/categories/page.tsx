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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EggIcon from '@mui/icons-material/Egg';
import VerifiedIcon from '@mui/icons-material/Verified';

export const metadata = {
  title: 'Egg Categories • Zardi Basket — Farm-Fresh Eggs Sindh',
  description:
    'Explore our 18 distinct egg options: 2 Varieties × 3 Qualities × 3 Packaging Sizes (6-Egg Box, 12-Egg Box, 30-Egg Tray). Delivered exclusively across Sindh.',
};

const eggCategories = [
  {
    id: 'white_farm',
    title: 'White Farm Eggs',
    description:
      '3 distinct commercial farm egg varieties produced in bio-secure, modern aviaries in Thatta and Malir, Sindh. Uniform porcelain-white shells, firm albumen, and balanced yolks — essential for daily family breakfasts, boiling, and pastry chef baking.',
    varieties: [
      'Classic White Farm Eggs (Daily Breakfast & Boiling)',
      'Premium Leghorn White Eggs (Extra Thick Shell & High Albumen)',
      'Enriched Protein White Eggs (Omega-3 & Vitamin D Fortified)',
    ],
    boxes: 'Available in: 6-Egg Box (Half Dozen), 12-Egg Box (1 Dozen), 30-Egg Family Tray',
    badges: ['Pristine White Shell', '3 Distinct Varieties', 'Daily Family Breakfast', 'Baking Essential'],
    startingPrice: 'Rs. 160 (6-Egg Box)',
    imageUrl:
      'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=1000&q=80',
    itemCount: '9 Products (3 Qualities × 3 Box Sizes)',
    href: '/shop?category=white_farm',
  },
  {
    id: 'desi_yellow',
    title: 'Yellow Desi Eggs',
    description:
      '3 distinct indigenous free-range desi egg varieties from open pasture corridors in Thatta, Mirpurkhas, and Malir, Sindh. Free-foraging hens on a 100% natural non-GMO diet yielding vibrant golden-yellow and deep sunset-amber yolks rich in traditional vitality.',
    varieties: [
      'Pure Aseel Desi Eggs (Indigenous Sindhi Aseel, Deep Sunset Yolk)',
      'Golden Misri Desi Eggs (Free-Range Foraged, Bright Golden Yolk)',
      'Sindh Organic Heritage Desi Eggs (Malir Valley, 100% Organic Grain)',
    ],
    boxes: 'Available in: 6-Egg Box (Half Dozen), 12-Egg Box (1 Dozen), 30-Egg Family Tray',
    badges: ['100% Pure Desi', '3 Distinct Varieties', 'Vibrant Yellow Yolk', 'Free Range Foraging'],
    startingPrice: 'Rs. 230 (6-Egg Box)',
    imageUrl:
      'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?auto=format&fit=crop&w=1000&q=80',
    itemCount: '9 Products (3 Qualities × 3 Box Sizes)',
    href: '/shop?category=desi_yellow',
  },
];

export default function CategoriesPage() {
  return (
    <Box sx={{ backgroundColor: '#FAF7F2', py: { xs: 6, md: 9 }, minHeight: '85vh' }}>
      <Container maxWidth="lg">
        {/* Header Title */}
        <Box sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto', mb: 6 }}>
          <Chip
            icon={<EggIcon sx={{ color: '#E8981A !important' }} />}
            label="Egg Varieties &amp; Categories"
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
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
              letterSpacing: '-0.02em',
              mb: 2,
            }}
          >
            Egg Categories &amp; Varieties
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.6,
            }}
          >
            Explore our two dedicated egg lines across Sindh: <strong>White Farm Eggs</strong> (3 varieties) and <strong>Yellow Desi Eggs</strong> (3 varieties). Each variety is available in 3 separate quantity boxes: 6-Egg Half Dozen, 12-Egg Dozen, and 30-Egg Family Tray.
          </Typography>
        </Box>

        {/* Categories Grid */}
        <Grid container spacing={4}>
          {eggCategories.map((cat) => (
            <Grid item xs={12} md={6} key={cat.id}>
              <Card
                sx={{
                  borderRadius: 0,
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5DFD5',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 20px 40px rgba(30, 58, 47, 0.12)',
                  },
                }}
              >
                {/* Image Header */}
                <Box sx={{ position: 'relative', width: '100%', height: 260, backgroundColor: '#FAF7F2' }}>
                  <Image
                    src={cat.imageUrl}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: 'rgba(30, 58, 47, 0.88)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFFFFF',
                      px: 2,
                      py: 0.6,
                      borderRadius: 20,
                      fontWeight: 800,
                      fontSize: '0.78rem',
                    }}
                  >
                    {cat.itemCount}
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      backgroundColor: '#E8981A',
                      color: '#FFFFFF',
                      px: 2,
                      py: 0.6,
                      borderRadius: 20,
                      fontWeight: 800,
                      fontSize: '0.82rem',
                    }}
                  >
                    From {cat.startingPrice}
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E3A2F', mb: 2, fontSize: '1.6rem' }}>
                    {cat.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#5C6D65', lineHeight: 1.7, mb: 2.5 }}>
                    {cat.description}
                  </Typography>

                  {/* Varieties List */}
                  <Box sx={{ mb: 2.5, p: 2, backgroundColor: '#FAF7F2', borderRadius: 2.5, border: '1px solid #E5DFD5' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#1E3A2F', display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      3 Available Varieties:
                    </Typography>
                    {cat.varieties.map((v, idx) => (
                      <Typography key={idx} variant="body2" sx={{ color: '#1E3A2F', fontSize: '0.84rem', py: 0.3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ color: '#E8981A', fontWeight: 900 }}>•</span> {v}
                      </Typography>
                    ))}
                    <Typography variant="caption" sx={{ color: '#5C6D65', display: 'block', mt: 1.5, fontWeight: 700 }}>
                      📦 {cat.boxes}
                    </Typography>
                  </Box>

                  {/* Badges */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    {cat.badges.map((b, i) => (
                      <Chip
                        key={i}
                        label={b}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(30, 58, 47, 0.06)',
                          color: '#1E3A2F',
                          fontWeight: 700,
                          fontSize: '0.74rem',
                        }}
                      />
                    ))}
                  </Box>

                  {/* Action Button */}
                  <Box sx={{ mt: 'auto' }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      size="large"
                      component={Link}
                      href={cat.href}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        py: 1.4,
                        borderRadius: 3,
                        fontWeight: 800,
                        fontSize: '0.98rem',
                      }}
                    >
                      Shop {cat.id === 'white_farm' ? 'White Farm Eggs' : 'Yellow Desi Eggs'}
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
