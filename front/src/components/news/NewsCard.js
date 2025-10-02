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
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)'
          }
        }}
        onClick={() => onClick(article)}
      >
        <CardMedia
          component="img"
          height="200"
          image={article.image_url}
          alt={article.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              mb: 1,
              fontWeight: 600,
              lineHeight: 1.3,
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
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 500,
                '& .MuiChip-label': {
                  color: 'primary.contrastText'
                }
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {formatDate(article.published_at)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NewsCard;