import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

function Page2() {
  return (
    <Box sx={{ height: '100vh', p: 3, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h3" gutterBottom sx={{ color: 'primary.main', mb: 4, textAlign: 'center' }}>
          About Exoplanet Detection
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', textAlign: 'center', maxWidth: '800px' }}>
          Our platform uses advanced machine learning models to analyze data from multiple space missions including Kepler K2, TESS Objects of Interest (TOI), and Cumulative datasets.
        </Typography>
      </motion.div>
    </Box>
  );
}

export default Page2;