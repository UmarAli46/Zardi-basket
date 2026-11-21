'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import EggIcon from '@mui/icons-material/Egg';
import { useCartStore } from '@/lib/store/useCartStore';
import { initialProducts } from '@/lib/data/products';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const itemCount = useCartStore((state) => state.getItemCount());
  const toggleCartDrawer = useCartStore((state) => state.toggleDrawer);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop All Eggs', href: '/shop' },
    { label: 'Categories', href: '/categories' },
    { label: 'About Us', href: '/about' },
    { label: 'Track Order', href: '/track' },
  ];

  const filteredSearchResults = searchQuery.trim()
    ? initialProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.breed.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Top Banner */}
      <Box
        sx={{
          backgroundColor: '#13261F',
          color: '#E5DFD5',
          py: 0.8,
          fontSize: '0.82rem',
          textAlign: 'center',
          fontWeight: 500,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' }, color: '#FFAA29' }}>
              ⚡ 48-Hour Harvest Guarantee: Cracked Fresh from Organic Pastures
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, textAlign: { xs: 'center', sm: 'right' }, width: { xs: '100%', sm: 'auto' } }}>
              Free Cold-Pack Insulated Delivery on Orders Over Rs. 2,000 Across Sindh
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Navigation */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(250, 247, 242, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E5DFD5',
          color: '#1E3A2F',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 68, md: 76 } }}>
            {/* Mobile Hamburger */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Brand Logo */}
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 46, md: 52 },
                  height: { xs: 46, md: 52 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src="/images/zardi-logo.png"
                  alt="Zardi Basket Logo"
                  width={52}
                  height={52}
                  style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                  priority
                />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    color: '#1E3A2F',
                    fontSize: { xs: '1.25rem', md: '1.45rem' },
                  }}
                >
                  Zardi Basket
                </Typography>
                <Typography variant="caption" sx={{ color: '#E8981A', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block' }}>
                  Farm Direct • Organic
                </Typography>
              </Box>
            </Link>

            {/* Desktop Navigation Links */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                    <Button
                      sx={{
                        color: isActive ? '#E8981A' : '#1E3A2F',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '0.92rem',
                        px: 1.8,
                        position: 'relative',
                        '&:hover': { backgroundColor: 'rgba(30, 58, 47, 0.05)', color: '#E8981A' },
                        ...(isActive && {
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 6,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '40%',
                            height: 2,
                            borderRadius: 1,
                            backgroundColor: '#E8981A',
                          },
                        }),
                      }}
                    >
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </Box>

            {/* Actions (Search & Cart) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
              <IconButton
                onClick={() => setSearchOpen(true)}
                sx={{
                  color: '#1E3A2F',
                  backgroundColor: 'rgba(30, 58, 47, 0.05)',
                  '&:hover': { backgroundColor: 'rgba(30, 58, 47, 0.1)' },
                }}
                aria-label="search"
              >
                <SearchIcon fontSize="small" />
              </IconButton>

              <Button
                variant="contained"
                color="primary"
                onClick={toggleCartDrawer}
                startIcon={
                  <Badge badgeContent={itemCount} color="secondary" sx={{ '& .MuiBadge-badge': { fontWeight: 800 } }}>
                    <ShoppingBagOutlinedIcon />
                  </Badge>
                }
                sx={{
                  px: { xs: 1.8, md: 2.5 },
                  py: 1,
                  borderRadius: 10,
                  fontWeight: 700,
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Cart
                </Box>
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
              Zardi Basket 🥚
            </Typography>
            <IconButton onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <ListItem key={link.href} disablePadding sx={{ mb: 0.8 }}>
                  <ListItemButton
                    component={Link}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: isActive ? 'rgba(232, 152, 26, 0.12)' : 'transparent',
                    }}
                  >
                    <ListItemText
                      primary={link.label}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 800 : 600,
                        color: isActive ? '#E8981A' : '#1E3A2F',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Live Search Modal */}
      <Dialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, p: 2, backgroundColor: '#FAF7F2' },
        }}
      >
        <DialogContent sx={{ p: 1 }}>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search farm eggs, duck eggs, liquid whites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#1E3A2F' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <IconButton onClick={() => setSearchOpen(false)} size="small">
                  <CloseIcon />
                </IconButton>
              ),
              sx: { backgroundColor: '#FFFFFF', borderRadius: 3 },
            }}
          />

          {searchQuery && (
            <Box sx={{ mt: 2, maxHeight: 380, overflowY: 'auto' }}>
              {filteredSearchResults.length === 0 ? (
                <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  No egg varieties found matching &quot;{searchQuery}&quot;
                </Typography>
              ) : (
                filteredSearchResults.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/shop/${prod.slug}`}
                    onClick={() => setSearchOpen(false)}
                    style={{ textDecoration: 'none' }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        mb: 1,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid #E5DFD5',
                        '&:hover': { borderColor: '#E8981A', backgroundColor: 'rgba(232, 152, 26, 0.05)' },
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#1E3A2F', fontSize: '0.95rem' }}>
                          {prod.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {prod.region} • {prod.breed}
                        </Typography>
                      </Box>
                      <Chip
                        label={`From Rs. ${prod.price6Pack}`}
                        size="small"
                        sx={{ backgroundColor: '#1E3A2F', color: '#FFFFFF', fontWeight: 700 }}
                      />
                    </Box>
                  </Link>
                ))
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
