import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        minHeight: '60px',
        overflow: 'hidden',
        borderTop: '2px solid',
        borderColor: 'rgba(255, 255, 255, 0.4)',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        py: 2,
        zIndex: 9999,
        display: 'block',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: 'marquee 20s linear infinite',
          '@keyframes marquee': {
            '0%': { transform: 'translateX(0%)' },
            '100%': { transform: 'translateX(-50%)' }
          }
        }}
      >
        {[...Array(20)].map((_, i) => (
          <Typography
            key={i}
            variant="body1"
            sx={{
              display: 'inline-block',
              px: 4,
              color: 'primary.main',
              fontWeight: 500,
              letterSpacing: '2px',
              fontSize: '0.95rem',
              opacity: 0.8,
            }}
          >
            © Space Marshals
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

export default Footer;
