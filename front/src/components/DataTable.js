import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, CircularProgress, Box,
  TablePagination
} from '@mui/material';
import { useTableData } from '../hooks';
import { validateRowData, sanitizeText } from '../utils';
import { PAGINATION } from '../constants';

function DataTable({ tableName, searchTerm, searchColumn, onRowClick }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGINATION.DEFAULT_ROWS_PER_PAGE);
  
  const { data, columns, loading, totalCount } = useTableData(
    tableName, searchTerm, searchColumn, page, rowsPerPage
  );

  useEffect(() => {
    setPage(0);
  }, [searchTerm, searchColumn, tableName]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper 
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid',
        borderColor: 'grey.300',
        backgroundColor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <TableContainer 
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          width: '100%',
          maxHeight: 'calc(100vh - 200px)',
        }}
      >
        <Table stickyHeader size="small" sx={{ minWidth: 'max-content' }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column} 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: 16,
                    backgroundColor: 'background.paper',
                    whiteSpace: 'nowrap',
                    minWidth: '120px',
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                key={index} 
                hover 
                onClick={() => validateRowData(row) && onRowClick?.(row)}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={column}
                    sx={{
                      whiteSpace: 'nowrap',
                      minWidth: '120px',
                    }}
                  >
                    {row[column] !== null && row[column] !== undefined 
                      ? sanitizeText(String(row[column])) 
                      : 'N/A'
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {loading && (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress size={24} />
        </Box>
      )}
      
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={PAGINATION.ROWS_PER_PAGE_OPTIONS}
      />
    </Paper>
  );
}

export default DataTable;
