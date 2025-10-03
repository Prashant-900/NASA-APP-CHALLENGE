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
          How Do We Find Exoplanets?
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', textAlign: 'center', maxWidth: '800px' }}>
          Scroll To See How
        </Typography>
      </motion.div>
    </Box>
  );
}

export default Page2;