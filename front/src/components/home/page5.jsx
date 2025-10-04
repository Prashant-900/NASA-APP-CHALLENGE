import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Alert, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Fullscreen, FullscreenExit, OpenInNew } from '@mui/icons-material';

function Page5() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef(null);

  // Intersection Observer to load iframe only when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad) {
            setShouldLoad(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [shouldLoad]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleIframeError = () => {
    setIframeError(true);
  };

  const openInNewTab = () => {
    window.open('https://eyes.nasa.gov/apps/exo/', '_blank', 'noopener,noreferrer');
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        height: '100vh',
        width: '100%',
        p: { xs: 2, md: 3 },
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ width: '100%', maxWidth: '1000px' }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
            }}
          >
            Explore Exoplanets in 3D
          </Typography>
        </Box>

        {/* Error Alert */}
        {iframeError && (
          <Alert
            severity="warning"
            sx={{ mb: 2, maxWidth: '800px', mx: 'auto' }}
            action={
              <Button color="inherit" size="small" onClick={openInNewTab}>
                Open Directly
              </Button>
            }
          >
            Unable to load the interactive experience. Click "Open in New Tab" to view it directly on NASA's website.
          </Alert>
        )}

        {/* Iframe Container */}
        <Paper
          elevation={4}
          sx={{
            position: isFullscreen ? 'fixed' : 'relative',
            top: isFullscreen ? 0 : 'auto',
            left: isFullscreen ? 0 : 'auto',
            width: isFullscreen ? '100vw' : '100%',
            height: isFullscreen ? '100vh' : { xs: '50vh', md: '55vh' },
            maxWidth: isFullscreen ? 'none' : '1000px',
            zIndex: isFullscreen ? 9999 : 1,
            overflow: 'hidden',
            border: 'none',
            borderRadius: isFullscreen ? 0 : 2,
            backgroundColor: '#000',
            boxShadow: isFullscreen
              ? 'none'
              : '0 4px 16px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease-in-out',
            willChange: 'transform',
          }}
        >
          {/* Loading Overlay - only show when not loaded */}
          {!shouldLoad && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
                zIndex: 1,
              }}
            >
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Scroll to load...
              </Typography>
            </Box>
          )}

          {/* Iframe - only render when shouldLoad is true */}
          {shouldLoad && (
            <iframe
              src="https://eyes.nasa.gov/apps/exo/"
              title="NASA Eyes on Exoplanets"
              onError={handleIframeError}
              style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                height: '100%',
                border: 'none',
                outline: 'none',
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              loading="lazy"
            />
          )}

          {/* Control Buttons - Bottom Right Corner */}
          {!isFullscreen && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                zIndex: 3,
                display: 'flex',
                gap: 1,
              }}
            >
              <Paper
                onClick={toggleFullscreen}
                elevation={3}
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    transform: 'scale(1.1)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Fullscreen sx={{ color: 'primary.main', fontSize: 20 }} />
              </Paper>
              <Paper
                onClick={openInNewTab}
                elevation={3}
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    transform: 'scale(1.1)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <OpenInNew sx={{ color: 'primary.main', fontSize: 20 }} />
              </Paper>
            </Box>
          )}

          {/* Fullscreen Exit Button */}
          {isFullscreen && (
            <Paper
              onClick={toggleFullscreen}
              elevation={3}
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                zIndex: 3,
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  transform: 'scale(1.1)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <FullscreenExit sx={{ color: 'primary.main', fontSize: 20 }} />
            </Paper>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
}

export default Page5;
