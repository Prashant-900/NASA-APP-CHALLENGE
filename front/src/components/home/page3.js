import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

function Page3() {
  return (
    <Box sx={{ height: '100vh', p: 3, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h3" gutterBottom sx={{ color: 'primary.main', mb: 4, textAlign: 'center' }}>
          🌌 Data Sources
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', textAlign: 'center', maxWidth: '800px' }}>
          We analyze data from NASA's Kepler mission, TESS (Transiting Exoplanet Survey Satellite), and cumulative exoplanet archives to provide comprehensive planetary information.
        </Typography>
      </motion.div>
    </Box>
  );
}

export default Page3;