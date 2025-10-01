import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { Explore, Analytics, Psychology } from '@mui/icons-material';
import StarfieldBackground from '../common/StarfieldBackground';

function Home() {
  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Background */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <StarfieldBackground />
      </Box>

      {/* Foreground content */}
      <Box sx={{ p: 3, height: '100%', overflow: 'auto', position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
          Welcome to Exoplanet Detection Dashboard
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Explore exoplanet data from multiple missions and make predictions using advanced machine learning models.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Explore sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Data Explorer
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse and search through K2, TOI, and CUM datasets with interactive tables and AI-powered queries.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Psychology sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Prediction Models
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload your data and get exoplanet predictions using trained models for different mission datasets.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Analytics sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  AI Research Assistant
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ask questions about the data and get intelligent responses with automated analysis and insights.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper elevation={1} sx={{ mt: 4, p: 3, backgroundColor: 'background.paper' }}>
          <Typography variant="h6" gutterBottom>
            Available Datasets
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" color="primary.main">K2 Mission Data</Typography>
              <Typography variant="body2" color="text.secondary">
                Kepler K2 mission exoplanet candidates and confirmed planets
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" color="primary.main">TESS Objects of Interest</Typography>
              <Typography variant="body2" color="text.secondary">
                Transiting Exoplanet Survey Satellite candidate objects
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" color="primary.main">Cumulative Data</Typography>
              <Typography variant="body2" color="text.secondary">
                Combined exoplanet data from multiple missions and surveys
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}

export default Home;
