import React from 'react';
import { 
  Box, Typography, Chip, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Alert 
} from '@mui/material';
import { Visibility } from '@mui/icons-material';

const ResultsSection = ({ results, inputData, modelType, onViewPlanetInfo }) => {
  if (!results) return null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Prediction Results
      </Typography>
      
      {results.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {results.error}
        </Alert>
      )}
      
      <Box sx={{ mb: 2 }}>
        <Chip label={`Model: ${results.model_type.toUpperCase()}`} sx={{ mr: 1 }} />
        <Chip label={`Rows: ${results.rows_processed}`} sx={{ mr: 1 }} />
        <Chip 
          label={`Exoplanets: ${Array.isArray(results.predictions) ? results.predictions.filter(p => typeof p === 'string' ? p !== 'FALSE POSITIVE' : p).length : (results.predictions && results.predictions !== 'FALSE POSITIVE' ? 1 : 0)}`} 
          color="success" 
        />
      </Box>

      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Row</TableCell>
              <TableCell>Prediction</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(results.predictions) ? (
              results.predictions.slice(0, 100).map((prediction, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {typeof prediction === 'string' ? prediction : (prediction ? 'Exoplanet' : 'Not Exoplanet')}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        const planetData = inputData ? {
                          ...inputData,
                          prediction: prediction,
                          model_type: modelType,
                          row_index: index
                        } : {
                          prediction: prediction,
                          model_type: modelType,
                          row_index: index
                        };
                        onViewPlanetInfo?.(planetData);
                      }}
                      sx={{ color: 'primary.main' }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>
                  {typeof results.predictions === 'string' ? results.predictions : (results.predictions ? 'Exoplanet' : 'Not Exoplanet')}
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => {
                      const planetData = inputData ? {
                        ...inputData,
                        prediction: results.predictions,
                        model_type: modelType,
                        row_index: 0
                      } : {
                        prediction: results.predictions,
                        model_type: modelType,
                        row_index: 0
                      };
                      onViewPlanetInfo?.(planetData);
                    }}
                    sx={{ color: 'primary.main' }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
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
  );
};

export default ResultsSection;