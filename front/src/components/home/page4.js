import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import radialVeloGif from '../../assets/radialvelo.gif';

function Page4() {
  return (
    <Box sx={{ 
      height: '100vh', 
      p: 3, 
      position: 'relative', 
      zIndex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      gap: 6
    }}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            color: 'primary.main', 
            textAlign: 'center',
            fontWeight: 'bold',
            letterSpacing: '0.5px'
          }}
        >
          And This!
        </Typography>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '800px',
          width: '100%',
          gap: '16px'
        }}
      >
        <Box
          component="img"
          src={radialVeloGif}
          alt="Exoplanet Radial Velocity Method"
          sx={{
            width: '100%',
            maxWidth: '700px',
            height: 'auto',
            borderRadius: '12px',
            border: '2px solid',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: '0 12px 48px rgba(255, 255, 255, 0.15)',
            }
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            fontStyle: 'italic',
            letterSpacing: '0.5px'
          }}
        >
          Radial velocity method
        </Typography>
      </motion.div>
    </Box>
  );
}

export default Page4;