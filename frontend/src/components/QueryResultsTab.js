import React from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, Chip
} from '@mui/material';

function QueryResultsTab({ data, table }) {
  if (!data || data.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.default', height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          {table?.toUpperCase()} Query Results
        </Typography>
        <Typography color="text.secondary">
          No data found for this query.
        </Typography>
      </Paper>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <Paper 
      elevation={0}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.300' }}>
        <Typography variant="h6" gutterBottom>
          {table?.toUpperCase()} Research Results
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip label={`${data.length} records`} color="primary" size="small" />
          <Chip label={`${columns.length} fields`} variant="outlined" size="small" />
        </Box>
      </Box>
      
      <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column}
                  sx={{ 
                    fontWeight: 'bold',
                    backgroundColor: 'background.paper',
                    whiteSpace: 'nowrap',
                    minWidth: '120px'
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} hover>
                {columns.map((column) => (
                  <TableCell 
                    key={column}
                    sx={{ whiteSpace: 'nowrap', minWidth: '120px' }}
                  >
                    {row[column] !== null && row[column] !== undefined 
                      ? String(row[column]) 
                      : 'N/A'
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default QueryResultsTab;