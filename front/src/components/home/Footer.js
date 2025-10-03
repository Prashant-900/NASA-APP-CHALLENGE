import React from 'react';
import { Box, Typography, Link, Divider } from '@mui/material';

function Footer() {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'auto',
        overflow: 'hidden',
        borderTop: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 2,
        paddingBottom: '40px',
      }}
    >
      {/* Marquee Section */}
      <Box
        sx={{
          py: 2.5,
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
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
                color: 'text.secondary',
                fontWeight: 400,
                letterSpacing: '2px',
                fontSize: '0.9rem',
                opacity: 0.7,
              }}
            >
              © Space Marshals
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Static Content Section */}
      <Box
        sx={{
          py: 5,
          px: 6,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          width: '100%',
        }}
      >
        {/* References Section */}
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            p: 3,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 2,
              letterSpacing: '1px',
              fontSize: '0.95rem',
              opacity: 0.9,
            }}
          >
            Data Sources & References
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Link
              href="https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=cumulative"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'text.secondary',
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'block',
                '&:hover': { 
                  color: 'primary.main',
                },
              }}
            >
              • NASA Exoplanet Archive - Kepler Cumulative Candidates Table
            </Link>
            <Link
              href="https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=k2pandc"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'text.secondary',
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'block',
                '&:hover': { 
                  color: 'primary.main',
                },
              }}
            >
              • NASA Exoplanet Archive - K2 Candidates and Confirmed Planets
            </Link>
            <Link
              href="https://academic.oup.com/mnras/article/513/4/5505/6472249"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'text.secondary',
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'block',
                '&:hover': { 
                  color: 'primary.main',
                },
              }}
            >
              • Research Paper: Exoplanet Detection Using Machine Learning (Malik et al., 2022)
            </Link>
          </Box>
        </Box>

        {/* Contact & Links Row */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 3,
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            p: 3,
          }}
        >
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', flex: 1 }}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  display: 'block',
                  mb: 1,
                  fontSize: '0.85rem',
                  opacity: 0.9,
                }}
              >
                Contact & Feedback
              </Typography>
              <Link
                href="mailto:b24206@students.iitmandi.ac.in"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                b24206@students.iitmandi.ac.in
              </Link>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  display: 'block',
                  mb: 1,
                  fontSize: '0.85rem',
                  opacity: 0.9,
                }}
              >
                Source Code
              </Typography>
              <Link
                href="https://github.com/Prashant-900/NASA-APP-CHALLENGE"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                GitHub Repository
              </Link>
            </Box>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.8rem',
              fontStyle: 'italic',
              opacity: 0.7,
            }}
          >
            For educational purposes only
          </Typography>
        </Box>

        {/* Acknowledgements */}
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            p: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.85rem',
              display: 'block',
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: 'text.primary' }}>Acknowledgements:</strong> We gratefully acknowledge NASA Exoplanet Archive (operated by Caltech/IPAC), 
            the Kepler and K2 missions, and the academic research community for providing valuable data and resources 
            that made this project possible.
          </Typography>
        </Box>

        {/* Quote Section */}
        <Box
          sx={{
            textAlign: 'center',
            mt: 3,
            pt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontStyle: 'italic',
              fontSize: '1rem',
              lineHeight: 1.6,
              opacity: 0.8,
            }}
          >
            "Somewhere, something incredible is waiting to be known"
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.85rem',
              mt: 1,
              opacity: 0.6,
            }}
          >
            — Carl Sagan
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
