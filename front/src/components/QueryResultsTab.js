import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, Chip, IconButton, Divider
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useQueryResponses } from '../hooks';
import { dataApi } from '../api';
import { safeArrayAccess, sanitizeText } from '../utils';
import MarkdownRenderer from './common/MarkdownRenderer';

const Plot = lazy(() => import('react-plotly.js'));

function QueryResultsTab({ scrollToMessage }) {
  const responses = useQueryResponses();
  const [tableData, setTableData] = useState({});
  const [currentPage, setCurrentPage] = useState({});
  const [hasMoreData, setHasMoreData] = useState({});
  const queryRefs = useRef({});
  
  const loadTableData = useCallback(async (queryId, table, page) => {
    try {
      const response = await dataApi.getQueryData(queryId, page);
      const data = response.data;
      
      setTableData(prev => ({
        ...prev,
        [queryId]: data
      }));
      setCurrentPage(prev => ({
        ...prev,
        [queryId]: page
      }));
      setHasMoreData(prev => ({
        ...prev,
        [queryId]: response.has_next
      }));
    } catch (error) {
      console.error('Error loading table data:', error);
      setTableData(prev => ({ ...prev, [queryId]: [] }));
    }
  }, []);
  
  useEffect(() => {
    responses.forEach(response => {
      if (response.data && !tableData[response.queryId]) {
        setTableData(prev => ({
          ...prev,
          [response.queryId]: response.data
        }));
        setCurrentPage(prev => ({
          ...prev,
          [response.queryId]: 0
        }));
        setHasMoreData(prev => ({
          ...prev,
          [response.queryId]: response.data && response.data.length === 10
        }));
      }
    });
  }, [responses]);
  
  const scrollToQuery = (queryId) => {
    queryRefs.current[queryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollToQuery = scrollToQuery;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.scrollToQuery;
      }
    };
  }, [scrollToQuery]);
  
  if (responses.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.default', height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Query Responses
        </Typography>
        <Typography color="text.secondary">
          No query responses yet. Ask questions in the chat to see results here.
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
          Query Responses
        </Typography>
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {responses.map((response, index) => (
          <Box 
            key={response.queryId}
            ref={el => queryRefs.current[response.queryId] = el}
            sx={{ mb: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}
          >
            <Box sx={{ p: 2, bgcolor: 'grey.50', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Query {response.queryId} - {response.table.toUpperCase()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {response.timestamp}
                </Typography>
              </Box>
              <Chip 
                label={`${response.messageId}`} 
                size="small" 
                color="secondary" 
                variant="outlined"
                onClick={() => scrollToMessage?.(response.messageId)}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
            
            {(response.data || response.plot) && (
              <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.300' }}>
                
                {response.plot && Object.keys(response.plot).length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>Visualization</Typography>
                    <Box sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 1, overflow: 'hidden' }}>
                      <Suspense fallback={<Box sx={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading plot...</Box>}>
                        <Plot
                          data={response.plot.data || []}
                          layout={{
                            ...response.plot.layout,
                            autosize: true,
                            margin: { l: 50, r: 50, t: 50, b: 50 }
                          }}
                          config={{ displayModeBar: false, responsive: true }}
                          style={{ width: '100%', height: '400px' }}
                        />
                      </Suspense>
                    </Box>
                  </Box>
                )}
                
                {response.data && (
                  <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">Data Results</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => loadTableData(response.queryId, response.table, Math.max(0, (currentPage[response.queryId] || 0) - 1))}
                      disabled={(currentPage[response.queryId] || 0) === 0}
                    >
                      <ArrowBack />
                    </IconButton>
                    <Typography variant="caption">
                      Page {(currentPage[response.queryId] || 0) + 1}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => loadTableData(response.queryId, response.table, (currentPage[response.queryId] || 0) + 1)}
                      disabled={!hasMoreData[response.queryId]}
                    >
                      <ArrowForward />
                    </IconButton>
                  </Box>
                </Box>
                
                <TableContainer sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid', borderColor: 'grey.300' }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        {(tableData[response.queryId] || response.data) && safeArrayAccess((tableData[response.queryId] || response.data), 0) && Object.keys(safeArrayAccess((tableData[response.queryId] || response.data), 0)).map((column) => (
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
                      {(tableData[response.queryId] || response.data || []).slice(0, 10).map((row, rowIndex) => (
                        <TableRow key={rowIndex} hover>
                          {Object.keys(row).map((column) => (
                            <TableCell 
                              key={column}
                              sx={{ whiteSpace: 'nowrap', minWidth: '120px' }}
                            >
                              {row[column] !== null && row[column] !== undefined 
                                ? sanitizeText(String(row[column]).substring(0, 200)) 
                                : 'N/A'
                              }
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                  </Box>
                )}
              </Box>
            )}
            
            {index < responses.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default QueryResultsTab;

// Expose scrollToQuery globally
QueryResultsTab.scrollToQuery = (queryId) => {
  if (window.scrollToQuery) {
    window.scrollToQuery(queryId);
  }
};