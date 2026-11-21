'use client';
import React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WHATSAPP_NUMBER = '923468463349';
const DEFAULT_MESSAGE = 'Assalam-o-Alaikum Zardi Basket! I have an inquiry about farm-fresh eggs and delivery in Sindh.';

export default function WhatsAppChat() {
  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 20, md: 28 },
        right: { xs: 20, md: 28 },
        zIndex: 1300,
      }}
    >
      <Tooltip title="Chat on WhatsApp (0346-8463349)" placement="left" arrow>
        <IconButton
          onClick={handleOpenWhatsApp}
          aria-label="Chat on WhatsApp"
          sx={{
            width: { xs: 54, sm: 60 },
            height: { xs: 54, sm: 60 },
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
            border: '2.5px solid #FFFFFF',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            '&:hover': {
              backgroundColor: '#1EBE5D',
              transform: 'scale(1.1) translateY(-3px)',
              boxShadow: '0 12px 30px rgba(37, 211, 102, 0.65)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <WhatsAppIcon sx={{ fontSize: { xs: 32, sm: 36 } }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
