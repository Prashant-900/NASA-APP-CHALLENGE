import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';

const NewsCard = ({ article, onClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'primary.main',
            boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}25`,
            transform: 'translateY(-5px)'
          }
        }}
        onClick={() => onClick(article)}
      >
        <Box sx={{ position: 'relative', height: 200, bgcolor: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="200"
            loading="lazy"
            image={`${article.image_url}?w=600&q=75`}
            alt={article.title}
            sx={{
              width: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.95)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                filter: 'brightness(1)'
              }
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 2.5, position: 'relative', zIndex: 1, background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(8px)' }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              mb: 1,
              fontWeight: 700,
              lineHeight: 1.4,
              letterSpacing: '-0.01em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {article.title}
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {article.summary}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
            <Chip
              label={article.news_site}
              size="small"
              sx={{
                background: 'rgba(25, 118, 210, 0.2)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'primary.main',
                fontWeight: 500,
                '& .MuiChip-label': {
                  color: 'inherit'
                },
                '&:hover': {
                  background: 'rgba(25, 118, 210, 0.3)'
                }
              }}
            />
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 500,
                backgroundColor: 'action.hover',
                px: 1,
                py: 0.5,
                borderRadius: 1
              }}
            >
              {formatDate(article.published_at)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NewsCard;