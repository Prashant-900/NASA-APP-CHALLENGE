import React, { useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, Chip, TextField, FormControl, InputLabel, Select, MenuItem, Tabs, Tab
} from '@mui/material';
import ReactMarkdown from 'react-markdown';

function QueryResultsTab({ responses }) {
  const [selectedResponse, setSelectedResponse] = useState(0);
  const [subTab, setSubTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('');
  
  const currentResponse = responses?.[selectedResponse] || {};
  const data = currentResponse?.data || [];
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  
  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.filter(row => {
      if (!searchTerm || !searchColumn) return true;
      const value = row[searchColumn];
      return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, searchColumn]);
  
  if (!responses || responses.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.default', height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          AI Query Responses
        </Typography>
        <Typography color="text.secondary">
          No responses yet. Ask questions in the chat to see results here.
        </Typography>
      </Paper>
    );
  }

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
          AI Query Responses
        </Typography>
        <Box sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select Response</InputLabel>
            <Select
              value={responses.length > 0 ? selectedResponse : ''}
              label="Select Response"
              onChange={(e) => setSelectedResponse(e.target.value)}
            >
              {responses.map((response, index) => (
                <MenuItem key={response.id} value={index}>
                  {response.table.toUpperCase()} - {response.timestamp}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Tabs 
          value={subTab} 
          onChange={(e, newValue) => setSubTab(newValue)}
          TabIndicatorProps={{ sx: { backgroundColor: 'primary.main' } }}
        >
          <Tab label="Response" sx={{ color: 'text.secondary', '&.Mui-selected': { color: 'primary.main' } }} />
          <Tab label="Data" sx={{ color: 'text.secondary', '&.Mui-selected': { color: 'primary.main' } }} />
        </Tabs>
      </Box>
      
      {subTab === 0 && (
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <ReactMarkdown>{currentResponse?.response || 'No response available'}</ReactMarkdown>
        </Box>
      )}
      
      {subTab === 1 && (
        <>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.300' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Chip label={`${filteredData.length} / ${data.length} records`} color="primary" size="small" />
              <Chip label={`${columns.length} fields`} variant="outlined" size="small" />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 200 }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Search Column</InputLabel>
                <Select
                  value={searchColumn}
                  label="Search Column"
                  onChange={(e) => setSearchColumn(e.target.value)}
                >
                  {columns.map((column) => (
                    <MenuItem key={column} value={column}>
                      {column}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                {filteredData.map((row, index) => (
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
        </>
      )}
    </Paper>
  );
}

export default QueryResultsTab;