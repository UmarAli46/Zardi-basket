'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MenuIcon from '@mui/icons-material/Menu';
import EggIcon from '@mui/icons-material/Egg';
import MuiProvider from '@/components/providers/MuiProvider';

const drawerWidth = 260;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: 'Overview Dashboard', href: '/admin', icon: <DashboardIcon /> },
    { label: 'Egg Products & Stock', href: '/admin/products', icon: <Inventory2Icon /> },
    { label: 'Add New Variety', href: '/admin/products/new', icon: <AddCircleOutlineIcon /> },
    { label: 'Customer Orders', href: '/admin/orders', icon: <ShoppingCartIcon /> },
    { label: 'Store Settings', href: '/admin/settings', icon: <SettingsIcon /> },
  ];

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#13261F', color: '#E5DFD5' }}>
      {/* Brand Header */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Box
          sx={{
            position: 'relative',
            width: 42,
            height: 42,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src="/images/zardi-logo.png"
            alt="Zardi Basket Logo"
            width={42}
            height={42}
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
            Zardi Basket
          </Typography>
          <Chip label="Seller Portal" size="small" sx={{ backgroundColor: '#E8981A', color: '#13261F', fontWeight: 800, height: 18, fontSize: '0.65rem' }} />
        </Box>
      </Box>

      {/* Nav List */}
      <List sx={{ px: 1.5, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.8 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2.5,
                  backgroundColor: isActive ? 'rgba(232, 152, 26, 0.18)' : 'transparent',
                  color: isActive ? '#FFAA29' : '#D2DDD7',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    color: '#FFAA29',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#FFAA29' : '#A3B4AC', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: isActive ? 800 : 600, fontSize: '0.9rem' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* View Live Store Shortcut */}
      <Box sx={{ px: 2, mt: 'auto', mb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          component={Link}
          href="/"
          target="_blank"
          startIcon={<StorefrontIcon />}
          sx={{
            color: '#FFFFFF',
            borderColor: 'rgba(255,255,255,0.2)',
            borderRadius: 2.5,
            py: 1,
            fontWeight: 700,
            '&:hover': { borderColor: '#FFAA29', color: '#FFAA29' },
          }}
        >
          View Live Store ↗
        </Button>
      </Box>

      {/* Logout */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Button
          fullWidth
          variant="text"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{ color: '#D32F2F', fontWeight: 700, justifyContent: 'flex-start' }}
        >
          Sign Out of Portal
        </Button>
      </Box>
    </Box>
  );

  return (
    <MuiProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF7F2' }}>
        {/* Top App Bar for Mobile */}
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            backgroundColor: '#FFFFFF',
            color: '#1E3A2F',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            borderBottom: '1px solid #E5DFD5',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Store Management
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label="● Live Production Sync"
                size="small"
                sx={{ backgroundColor: 'rgba(46, 125, 50, 0.1)', color: '#2E7D32', fontWeight: 800 }}
              />
              <Button
                variant="outlined"
                size="small"
                component={Link}
                href="/"
                target="_blank"
                startIcon={<StorefrontIcon />}
                sx={{ display: { xs: 'none', sm: 'flex' }, fontWeight: 700 }}
              >
                Open Storefront
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawers */}
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawerContent}
          </Drawer>

          {/* Desktop Permanent Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        </Box>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2.5, md: 4 },
            width: { md: `calc(100% - ${drawerWidth}px)` },
            mt: 8,
          }}
        >
          {children}
        </Box>
      </Box>
    </MuiProvider>
  );
}
