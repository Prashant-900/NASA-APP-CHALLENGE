import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, CircularProgress, Box,
  TablePagination
} from '@mui/material';
import axios from 'axios';

const API_BASE = "http://localhost:5000/api"

function DataTable({ tableName, searchTerm, searchColumn }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    if (!tableName) return;
    
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        search_column: searchColumn
      };

      const response = await axios.get(`${API_BASE}/table/${tableName}/data`, { params });
      const result = response.data;
      
      setData(result.data);
      setTotalCount(result.total);
      
      if (result.data.length > 0) {
        setColumns(Object.keys(result.data[0]));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [tableName, page, rowsPerPage, searchTerm, searchColumn]);

  useEffect(() => {
    setPage(0); // Reset to first page when search changes
  }, [searchTerm, searchColumn, tableName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    <Paper>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} hover>
                {columns.map((column) => (
                  <TableCell key={column}>
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
        rowsPerPageOptions={[25, 50, 100]}
      />
    </Paper>
  );
}

export default DataTable;