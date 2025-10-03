import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import transitGif from '../../assets/transit.gif';

function Page3() {
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

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
          Like This!
        </Typography>
      </motion.div>
      
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          maxWidth: '1200px',
          width: '100%',
          px: 4,
          minHeight: '400px',
        }}
      >
        {/* GIF with slide-left animation */}
        <motion.div
          initial={{ x: 0, opacity: 0 }}
          animate={isInView ? { x: -200, opacity: 1 } : { x: 0, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          style={{
            position: 'absolute',
            left: '50%',
            marginLeft: '-300px',
            zIndex: 2,
          }}
        >
          <Box
            component="img"
            src={transitGif}
            alt="Exoplanet Transit Method"
            sx={{
              width: '600px',
              height: 'auto',
              borderRadius: '16px',
              border: '2px solid',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(100, 181, 246, 0.1)',
            }}
          />
        </motion.div>

        {/* Text description slides from behind the GIF */}
        <motion.div
          initial={{ x: 0, opacity: 0 }}
          animate={isInView ? { x: 500, opacity: 1 } : { x: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
          style={{
            position: 'absolute',
            left: '50%',
            marginLeft: '-300px',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              p: 4,
              width: '450px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                mb: 2,
                letterSpacing: '0.5px',
              }}
            >
              Transit Method
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.7,
                fontSize: '1.05rem',
              }}
            >
              Detects exoplanets by measuring the slight dimming of a star's light when a planet passes in front of it.
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}

export default Page3;