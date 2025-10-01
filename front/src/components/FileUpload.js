import React, { useState } from 'react';
import {
  Paper, Typography, Button, Box, Select, MenuItem, FormControl, InputLabel,
  Alert, CircularProgress, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, TextField, Grid, Divider
} from '@mui/material';
import { CloudUpload, Download, Calculate } from '@mui/icons-material';
import { dataApi } from '../api';
import { TABLE_NAMES, TABLE_LABELS } from '../constants';

const FileUpload = ({ persistentState = {}, onStateChange }) => {
  const {
    file = null,
    modelType = TABLE_NAMES.K2,
    loading = false,
    results = null,
    error = '',
    manualFeatures = {
      pl_orbper: '',
      pl_rade: '',
      st_teff: '',
      st_rad: '',
      st_mass: '',
      st_logg: '',
      sy_dist: '',
      sy_vmag: '',
      sy_kmag: '',
      sy_gaiamag: ''
    }
  } = persistentState;
  
  const updateState = (updates) => {
    onStateChange?.(updates);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      if (!['csv', 'xlsx', 'xls'].includes(fileType)) {
        updateState({ error: 'Please select a CSV or Excel file' });
        return;
      }
      updateState({ file: selectedFile, error: '' });
    }
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

      updateState({ results: response.data });
    } catch (err) {
      updateState({ error: err.message });
    } finally {
      updateState({ loading: false });
    }
  };

  const handleManualPredict = async () => {
    const requiredFields = ['pl_orbper', 'pl_rade', 'st_teff', 'st_rad', 'st_mass', 'st_logg', 'sy_dist', 'sy_vmag', 'sy_kmag', 'sy_gaiamag'];
    const emptyFields = requiredFields.filter(field => !manualFeatures[field] || manualFeatures[field].toString().trim() === '');
    
    if (emptyFields.length > 0) {
      updateState({ error: `Please fill all required fields: ${emptyFields.join(', ')}` });
      return;
    }

    updateState({ loading: true, error: '' });

    try {
      const response = await dataApi.predictManual({
        features: manualFeatures,
        type: modelType
      });

      updateState({ results: response.data });
    } catch (err) {
      updateState({ error: err.message });
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
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Upload your K2, TOI, or CUM dataset (CSV/Excel) to get exoplanet predictions
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
            sx={{ 
              minWidth: 200,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            Choose File
            <input
              type="file"
              hidden
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
            />
          </Button>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Model Type</InputLabel>
            <Select
              value={modelType}
              label="Model Type"
              onChange={(e) => updateState({ modelType: e.target.value })}
            >
              <MenuItem value={TABLE_NAMES.K2}>{TABLE_NAMES.K2.toUpperCase()}</MenuItem>
              <MenuItem value={TABLE_NAMES.TOI}>{TABLE_NAMES.TOI.toUpperCase()}</MenuItem>
              <MenuItem value={TABLE_NAMES.CUM}>{TABLE_NAMES.CUM.toUpperCase()}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {file && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || loading}
          sx={{ 
            mr: 2,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            }
          }}
        >
          {loading ? <CircularProgress size={20} /> : 'Predict'}
        </Button>

        {results && results.download_url && (
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={downloadResults}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            Download CSV with Predictions
          </Button>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Manual Feature Input
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter the required feature values manually for single prediction
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Orbital Period (pl_orbper)"
              type="number"
              value={manualFeatures.pl_orbper}
              onChange={(e) => handleFeatureChange('pl_orbper', e.target.value)}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Planet Radius (pl_rade)"
              type="number"
              value={manualFeatures.pl_rade}
              onChange={(e) => handleFeatureChange('pl_rade', e.target.value)}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Stellar Temperature (st_teff)"
              type="number"
              value={manualFeatures.st_teff}
              onChange={(e) => handleFeatureChange('st_teff', e.target.value)}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Stellar Radius (st_rad)"
              type="number"
              value={manualFeatures.st_rad}
              onChange={(e) => handleFeatureChange('st_rad', e.target.value)}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Stellar Mass (st_mass)"
              type="number"
              value={manualFeatures.st_mass}
              onChange={(e) => handleFeatureChange('st_mass', e.target.value)}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Stellar Log g (st_logg)"
              type="number"
              value={manualFeatures.st_logg}
              onChange={(e) => handleFeatureChange('st_logg', e.target.value)}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="System Distance (sy_dist)"
              type="number"
              value={manualFeatures.sy_dist}
              onChange={(e) => handleFeatureChange('sy_dist', e.target.value)}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="V Magnitude (sy_vmag)"
              type="number"
              value={manualFeatures.sy_vmag}
              onChange={(e) => handleFeatureChange('sy_vmag', e.target.value)}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="K Magnitude (sy_kmag)"
              type="number"
              value={manualFeatures.sy_kmag}
              onChange={(e) => handleFeatureChange('sy_kmag', e.target.value)}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Gaia Magnitude (sy_gaiamag)"
              type="number"
              value={manualFeatures.sy_gaiamag}
              onChange={(e) => handleFeatureChange('sy_gaiamag', e.target.value)}
              size="small"
              required
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={handleManualPredict}
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Prediction Results
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Chip label={`Model: ${results.model_type.toUpperCase()}`} sx={{ mr: 1 }} />
            <Chip label={`Rows: ${results.rows_processed}`} sx={{ mr: 1 }} />
            <Chip 
              label={`Exoplanets: ${Array.isArray(results.predictions) ? results.predictions.filter(p => p).length : (results.predictions ? 1 : 0)}`} 
              color="success" 
            />
          </Box>

          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Row</TableCell>
                  <TableCell>Prediction</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(results.predictions) ? (
                  results.predictions.slice(0, 100).map((prediction, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{prediction ? 'Exoplanet' : 'Not Exoplanet'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={prediction ? 'Positive' : 'Negative'}
                          color={prediction ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>{results.predictions ? 'Exoplanet' : 'Not Exoplanet'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={results.predictions ? 'Positive' : 'Negative'}
                        color={results.predictions ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {Array.isArray(results.predictions) && results.predictions.length > 100 && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              Showing first 100 results. Download CSV for complete results.
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default FileUpload;