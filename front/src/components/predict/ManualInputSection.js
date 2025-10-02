import React from 'react';
import { Box, Typography, TextField, Grid, Button, CircularProgress } from '@mui/material';
import { Calculate } from '@mui/icons-material';
import { PREDICTION_CONSTANTS } from '../../constants/predict';

const ManualInputSection = ({ 
  manualFeatures, 
  loading, 
  onFeatureChange, 
  onPredict 
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Manual Feature Input
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Enter the required feature values manually for single prediction
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {PREDICTION_CONSTANTS.REQUIRED_FEATURES.map((field) => (
          <Grid item xs={12} sm={6} md={4} key={field}>
            <TextField
              fullWidth
              label={PREDICTION_CONSTANTS.FEATURE_LABELS[field]}
              type="number"
              value={manualFeatures[field]}
              onChange={(e) => onFeatureChange(field, e.target.value)}
              size="small"
              required
            />
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        onClick={onPredict}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : <Calculate />}
        sx={{ 
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.dark',
          }
        }}
      >
        {loading ? 'Predicting...' : 'Predict'}
      </Button>
    </Box>
  );
};

export default ManualInputSection;