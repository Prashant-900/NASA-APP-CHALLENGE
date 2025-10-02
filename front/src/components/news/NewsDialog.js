import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  IconButton,
  Chip,
  Button,
  Divider
} from '@mui/material';
import { Close, OpenInNew } from '@mui/icons-material';

const NewsDialog = ({ article, open, onClose }) => {
  if (!article) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.02) 0%, rgba(156, 39, 176, 0.02) 100%)',
          backdropFilter: 'blur(10px)'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, pr: 2 }}>
          {article.title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 0 }}>
        <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip
            label={article.news_site}
            sx={{
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 500,
              '& .MuiChip-label': {
                color: 'primary.contrastText'
              }
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Published: {formatDate(article.published_at)}
          </Typography>
        </Box>

        <Box
          component="img"
          src={article.image_url}
          alt={article.title}
          sx={{
            width: '100%',
            height: 300,
            objectFit: 'cover',
            borderRadius: 1,
            mb: 3
          }}
        />

        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
          {article.summary}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<OpenInNew />}
            onClick={() => window.open(article.url, '_blank')}
            sx={{
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            Read Full Article
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewsDialog;