import React, { useState } from 'react';
import { Box, Typography, TextField, Grid, Button, CircularProgress, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Calculate, ExpandMore } from '@mui/icons-material';
import { PREDICTION_CONSTANTS } from '../../constants/predict.jsx';
import { TABLE_NAMES } from '../../constants';

const ManualInputSection = ({ 
  manualFeatures, 
  loading, 
  modelType,
  onFeatureChange, 
  onPredict 
}) => {
  const [optionalFeatures, setOptionalFeatures] = useState({});
  
  const getRequiredFeatures = () => {
    if (modelType === TABLE_NAMES.KEPLER) {
      return PREDICTION_CONSTANTS.KEPLER_TOP_FEATURES;
    }
    if (modelType === TABLE_NAMES.TOI) {
      return PREDICTION_CONSTANTS.TOI_REQUIRED_FEATURES;
    }
    return PREDICTION_CONSTANTS.K2_REQUIRED_FEATURES;
  };
  
  const getDefaultFeatures = () => {
    if (modelType === TABLE_NAMES.KEPLER) {
      return PREDICTION_CONSTANTS.DEFAULT_KEPLER_FEATURES;
    }
    if (modelType === TABLE_NAMES.TOI) {
      return PREDICTION_CONSTANTS.DEFAULT_TOI_FEATURES;
    }
    return PREDICTION_CONSTANTS.DEFAULT_K2_FEATURES;
  };
  
  const handleOptionalFeatureChange = (field, value) => {
    setOptionalFeatures(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handlePredict = () => {
    // Pass optional features for Kepler and TOI models
    const shouldPassOptional = modelType === TABLE_NAMES.KEPLER || modelType === TABLE_NAMES.TOI;
    onPredict(shouldPassOptional ? optionalFeatures : null);
  };
  
  const requiredFeatures = getRequiredFeatures();
  const currentFeatures = manualFeatures || getDefaultFeatures();
  
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Manual Feature Input
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Enter the required feature values manually for single prediction
      </Typography>
      
      {/* Required Features */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        Required Features
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {requiredFeatures.map((field) => (
          <Grid item xs={12} sm={6} md={4} key={field}>
            <TextField
              fullWidth
              label={PREDICTION_CONSTANTS.FEATURE_LABELS[field]}
              type="number"
              value={currentFeatures[field] || ''}
              onChange={(e) => onFeatureChange(field, e.target.value)}
              size="small"
              required
            />
          </Grid>
        ))}
      </Grid>
      
      {/* Optional Features for Kepler */}
      {modelType === TABLE_NAMES.KEPLER && (
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">
              Optional Features (Improve Accuracy)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {PREDICTION_CONSTANTS.KEPLER_OPTIONAL_FEATURES.map((field) => (
                <Grid item xs={12} sm={6} md={4} key={field}>
                  <TextField
                    fullWidth
                    label={PREDICTION_CONSTANTS.FEATURE_LABELS[field] || field}
                    type="number"
                    value={optionalFeatures[field] || ''}
                    onChange={(e) => handleOptionalFeatureChange(field, e.target.value)}
                    size="small"
                    placeholder="Optional"
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
      
      {/* Optional Features for TOI */}
      {modelType === TABLE_NAMES.TOI && (
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">
              Optional Features (Improve Accuracy)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {PREDICTION_CONSTANTS.TOI_OPTIONAL_FEATURES.map((field) => (
                <Grid item xs={12} sm={6} md={4} key={field}>
                  <TextField
                    fullWidth
                    label={PREDICTION_CONSTANTS.FEATURE_LABELS[field] || field}
                    type="number"
                    value={optionalFeatures[field] || ''}
                    onChange={(e) => handleOptionalFeatureChange(field, e.target.value)}
                    size="small"
                    placeholder="Optional"
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      <Button
        variant="contained"
        onClick={handlePredict}
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