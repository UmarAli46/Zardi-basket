'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E3A2F', // Deep Forest Organic Green
      dark: '#13261F',
      light: '#2E5A49',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E8981A', // Rich Yolk Amber
      dark: '#B87208',
      light: '#FFAA29',
      contrastText: '#1A201C',
    },
    background: {
      default: '#FAF7F2', // Soft Warm Eggshell
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A231F',
      secondary: '#5C6D65',
    },
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
    },
    warning: {
      main: '#ED6C02',
    },
    error: {
      main: '#D32F2F',
    },
    divider: '#E5DFD5',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
      color: '#1E3A2F',
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: '#1E3A2F',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#1E3A2F',
    },
    h4: {
      fontWeight: 700,
      color: '#1E3A2F',
    },
    h5: {
      fontWeight: 600,
      color: '#1E3A2F',
    },
    h6: {
      fontWeight: 600,
      color: '#1E3A2F',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 22px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 14px rgba(30, 58, 47, 0.15)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#14271F',
          },
        },
        containedSecondary: {
          color: '#1E3A2F',
          fontWeight: 700,
          '&:hover': {
            backgroundColor: '#D98912',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(30, 58, 47, 0.06)',
          border: '1px solid rgba(229, 223, 213, 0.6)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          '&:hover': {
            boxShadow: '0 10px 30px rgba(30, 58, 47, 0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});
