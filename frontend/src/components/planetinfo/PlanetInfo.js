import React from 'react';
import { Box, Typography, IconButton, Paper, Grid } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Planet3D from './Planet3D';

function PlanetInfo({ planetData, onBack }) {
  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ color: 'primary.main' }}>
          Planet Information
        </Typography>
      </Box>
      
      <Grid container spacing={3} sx={{ height: 'calc(100% - 80px)', overflow: 'hidden' }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.300' }}>
              <Typography variant="h6" gutterBottom>
                Planet Details
              </Typography>
            </Box>
            <Box sx={{ p: 3, pb: 6, flex: 1, overflowY: 'auto', maxHeight: '70vh' }}>
              {planetData && Object.entries(planetData).map(([key, value]) => (
                <Box key={key} sx={{ mb: 1 }}>
                  <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                    {key}: 
                  </Typography>
                  <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                    {value !== null && value !== undefined ? String(value) : 'N/A'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ height: '100%', overflow: 'hidden' }}>
            <Planet3D planetData={planetData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PlanetInfo;