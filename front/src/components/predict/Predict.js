import React from 'react';
import { Paper, Typography, Alert, Divider } from '@mui/material';
import { dataApi } from '../../api';
import { TABLE_NAMES } from '../../constants';
import { PREDICTION_CONSTANTS } from '../../constants/predict';
import FileUploadSection from './FileUploadSection';
import ManualInputSection from './ManualInputSection';
import ResultsSection from './ResultsSection';

const Predict = ({ persistentState = {}, onStateChange, onViewPlanetInfo }) => {
  const {
    file = null,
    modelType = TABLE_NAMES.K2,
    loading = false,
    results = null,
    error = '',
    manualFeatures = PREDICTION_CONSTANTS.DEFAULT_MANUAL_FEATURES
  } = persistentState;
  
  const getDefaultFeaturesForModel = (model) => {
    if (model === TABLE_NAMES.KEPLER) {
      return PREDICTION_CONSTANTS.DEFAULT_KEPLER_FEATURES;
    }
    return PREDICTION_CONSTANTS.DEFAULT_K2_FEATURES;
  };
  
  const updateState = (updates) => {
    onStateChange?.(updates);
  };

  const handleFileChange = (selectedFile, errorMsg) => {
    updateState({ file: selectedFile, error: errorMsg });
  };

  const handleModelTypeChange = (newModelType) => {
    updateState({ 
      modelType: newModelType,
      manualFeatures: getDefaultFeaturesForModel(newModelType),
      results: null,
      error: ''
    });
  };

  const handleUpload = async () => {
    if (!file) {
      updateState({ error: 'Please select a file first' });
      return;
    }

    updateState({ loading: true, error: '' });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', modelType);

    try {
      const response = await dataApi.predict(formData);
      updateState({ 
        results: {
          ...response.data,
          inputData: null, // File upload doesn't have individual row data
          modelType
        }
      });
    } catch (err) {
      updateState({ error: err.message });
    } finally {
      updateState({ loading: false });
    }
  };

  const handleManualPredict = async (optionalFeatures = null) => {
    const requiredFeatures = modelType === TABLE_NAMES.KEPLER 
      ? PREDICTION_CONSTANTS.KEPLER_TOP_FEATURES
      : PREDICTION_CONSTANTS.K2_REQUIRED_FEATURES;
      
    const emptyFields = requiredFeatures.filter(
      field => !manualFeatures[field] || manualFeatures[field].toString().trim() === ''
    );
    
    if (emptyFields.length > 0) {
      updateState({ error: `Please fill all required fields: ${emptyFields.join(', ')}` });
      return;
    }

    updateState({ loading: true, error: '' });

    try {
      const requestData = {
        features: manualFeatures,
        type: modelType
      };
      
      // Add optional features for Kepler
      if (modelType === TABLE_NAMES.KEPLER && optionalFeatures) {
        requestData.features = {
          ...manualFeatures,
          optional_features: optionalFeatures
        };
      }
      
      const response = await dataApi.predictManual(requestData);
      updateState({ 
        results: {
          ...response.data,
          inputData: manualFeatures,
          modelType
        }
      });
    } catch (err) {
      console.error('Manual prediction error:', err);
      updateState({ error: err.response?.data?.error || err.message });
    } finally {
      updateState({ loading: false });
    }
  };

  const handleFeatureChange = (field, value) => {
    updateState({
      manualFeatures: {
        ...manualFeatures,
        [field]: value
      }
    });
  };

  const downloadResults = () => {
    if (!results || !results.download_url) return;
    
    const link = document.createElement('a');
    link.href = `${("http://localhost:5000/api").replace('/api', '')}${results.download_url}`;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3,
        backgroundColor: 'background.default',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Exoplanet Prediction
      </Typography>
      
      <FileUploadSection
        file={file}
        modelType={modelType}
        loading={loading}
        results={results}
        onFileChange={handleFileChange}
        onModelTypeChange={handleModelTypeChange}
        onUpload={handleUpload}
        onDownload={downloadResults}
      />

      <Divider sx={{ my: 3 }} />

      <ManualInputSection
        manualFeatures={manualFeatures}
        loading={loading}
        modelType={modelType}
        onFeatureChange={handleFeatureChange}
        onPredict={(optionalFeatures) => handleManualPredict(optionalFeatures)}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <ResultsSection 
        results={results} 
        inputData={results?.inputData}
        modelType={results?.modelType}
        onViewPlanetInfo={onViewPlanetInfo}
      />
    </Paper>
  );
};

export default Predict;