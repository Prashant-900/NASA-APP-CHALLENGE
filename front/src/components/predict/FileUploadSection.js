import React from 'react';
import { Button, Box, FormControl, InputLabel, Select, MenuItem, Typography, CircularProgress } from '@mui/material';
import { CloudUpload, Download } from '@mui/icons-material';
import { TABLE_NAMES } from '../../constants';
import { PREDICTION_CONSTANTS } from '../../constants/predict';

const FileUploadSection = ({ 
  file, 
  modelType, 
  loading, 
  results, 
  onFileChange, 
  onModelTypeChange, 
  onUpload, 
  onDownload 
}) => {
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      if (!PREDICTION_CONSTANTS.ALLOWED_FILE_TYPES.includes(fileType)) {
        onFileChange(null, 'Please select a CSV or Excel file');
        return;
      }
      onFileChange(selectedFile, '');
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload your K2, TOI, or Kepler dataset (CSV/Excel) to get exoplanet predictions
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
            onChange={(e) => onModelTypeChange(e.target.value)}
          >
            <MenuItem value={TABLE_NAMES.K2}>{TABLE_NAMES.K2.toUpperCase()}</MenuItem>
            <MenuItem value={TABLE_NAMES.TOI}>{TABLE_NAMES.TOI.toUpperCase()}</MenuItem>
            <MenuItem value={TABLE_NAMES.KEPLER}>{TABLE_NAMES.KEPLER.toUpperCase()}</MenuItem>
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
        onClick={onUpload}
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
          onClick={onDownload}
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
  );
};

export default FileUploadSection;