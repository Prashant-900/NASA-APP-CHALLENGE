import React, { useRef, useEffect } from 'react';
import { Box, Typography, Paper, Grid, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Planet3D from '../planetinfo/Planet3D';

const PlanetResult = ({ result, isVisible, onClose }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isVisible || !result) return;

    const preventPropagation = (e) => {
      e.stopPropagation();
    };

    container.addEventListener('wheel', preventPropagation);
    container.addEventListener('touchmove', preventPropagation);
    
    return () => {
      container.removeEventListener('wheel', preventPropagation);
      container.removeEventListener('touchmove', preventPropagation);
    };
  }, [isVisible, result]);

  if (!result) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ width: '100%', height: '80vh' }}
        >
          {result.found ? (
            <Paper
              elevation={2}
              sx={{
                height: '100%',
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Header */}
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.300', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    {result.data.pl_name || result.data.hostname || result.data.toi || 'Unknown Planet'}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                    Dataset: {result.dataset.toUpperCase()}
                  </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
                  <Close />
                </IconButton>
              </Box>

              {/* Content */}
              <Grid container sx={{ flex: 1, height: 0 }}>
                {/* Planet Details */}
                <Grid item xs={12} md={6} sx={{ height: '100%' }}>
                  <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                      Planet Details
                    </Typography>
                    <Box sx={{ 
                      flex: 1, 
                      overflowY: 'auto', 
                      display: 'grid', 
                      gap: 1,
                      '&::-webkit-scrollbar': { width: '6px' },
                      '&::-webkit-scrollbar-thumb': { backgroundColor: 'grey.400', borderRadius: '3px' }
                    }}>
                      {Object.entries(result.data).map(([key, value]) => (
                        <Box 
                          key={key} 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            py: 0.5, 
                            borderBottom: '1px solid', 
                            borderColor: 'grey.200' 
                          }}
                        >
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'bold', minWidth: '40%' }}>
                            {key}:
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.primary', wordBreak: 'break-word' }}>
                            {value || 'N/A'}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Grid>

                {/* 3D View */}
                <Grid item xs={12} md={6} sx={{ height: '100%' }}>
                  <Box sx={{ 
                    height: '100%', 
                    borderLeft: { md: '1px solid' }, 
                    borderColor: 'grey.300',
                    borderTop: { xs: '1px solid', md: 'none' }
                  }}>
                    <Planet3D planetData={result.data} />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Paper
              elevation={2}
              sx={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                position: 'relative'
              }}
            >
              <IconButton 
                onClick={onClose} 
                size="small" 
                sx={{ position: 'absolute', top: 8, right: 8, color: 'text.secondary' }}
              >
                <Close />
              </IconButton>
              <Typography variant="h6" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                Planet not found in any dataset
              </Typography>
            </Paper>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlanetResult;