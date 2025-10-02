import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Container
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { motion } from 'framer-motion';
import NewsCard from './NewsCard';
import NewsDialog from './NewsDialog';
import { newsApi } from '../../api/newsApi';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await newsApi.getArticles(12);
      setArticles(data.results);
    } catch (err) {
      setError('Failed to fetch space news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (article) => {
    setSelectedArticle(article);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedArticle(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={fetchNews} startIcon={<Refresh />}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Space News
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Latest updates from the cosmos
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchNews}
          sx={{ borderRadius: 2 }}
        >
          Refresh News
        </Button>
      </Box>

      <Grid container spacing={3}>
        {articles.map((article, index) => (
          <Grid item xs={12} sm={6} md={4} key={article.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <NewsCard article={article} onClick={handleCardClick} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <NewsDialog
        article={selectedArticle}
        open={dialogOpen}
        onClose={handleDialogClose}
      />
    </Box>
  );
};

export default News;