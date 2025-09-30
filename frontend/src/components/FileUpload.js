import React, { useState } from 'react';
import {
  Paper, Typography, Button, Box, Select, MenuItem, FormControl, InputLabel,
  Alert, CircularProgress, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip
} from '@mui/material';
import { CloudUpload, Download } from '@mui/icons-material';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [modelType, setModelType] = useState('k2');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      if (!['csv', 'xlsx', 'xls'].includes(fileType)) {
        setError('Please select a CSV or Excel file');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', modelType);

    try {
      const response = await fetch(`http://localhost:5000/api/predict`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Prediction failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
    <Paper sx={{ p: 3 }}>
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
            sx={{ minWidth: 200 }}
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
              onChange={(e) => setModelType(e.target.value)}
            >
              <MenuItem value="k2">K2</MenuItem>
              <MenuItem value="toi">TOI</MenuItem>
              <MenuItem value="cum">CUM</MenuItem>
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
          sx={{ mr: 2 }}
        >
          {loading ? <CircularProgress size={20} /> : 'Predict'}
        </Button>

        {results && results.download_url && (
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={downloadResults}
          >
            Download CSV with Predictions
          </Button>
        )}
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
              label={`Exoplanets: ${results.predictions.filter(p => p).length}`} 
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
                {results.predictions.slice(0, 100).map((prediction, index) => (
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {results.predictions.length > 100 && (
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