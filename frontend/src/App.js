import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Container, Tabs, Tab, Box,
  TextField, Select, MenuItem, FormControl, InputLabel, Paper
} from '@mui/material';
import DataTable from './components/DataTable';
import FileUpload from './components/FileUpload';
import axios from 'axios';

const API_BASE = "http://localhost:5000/api"

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedTable, setSelectedTable] = useState('k2');
  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('');

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      fetchColumns(selectedTable);
    }
  }, [selectedTable]);

  const fetchTables = async () => {
    try {
      const response = await axios.get(`${API_BASE}/tables`);
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const fetchColumns = async (tableName) => {
    try {
      const response = await axios.get(`${API_BASE}/table/${tableName}/columns`);
      setColumns(response.data);
      setSearchColumn(response.data[0] || '');
    } catch (error) {
      console.error('Error fetching columns:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleTableChange = (event, newValue) => {
    setSelectedTable(newValue);
    setSearchTerm('');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Exoplanet Detection Model - Data Explorer
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Data Explorer" />
            <Tab label="Predict" />
          </Tabs>
        </Paper>

        {selectedTab === 0 && (
          <>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Tabs value={selectedTable} onChange={handleTableChange}>
                {tables.map((table) => (
                  <Tab key={table} label={table.toUpperCase()} value={table} />
                ))}
              </Tabs>
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
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
            </Paper>

            <DataTable 
              tableName={selectedTable}
              searchTerm={searchTerm}
              searchColumn={searchColumn}
            />
          </>
        )}

        {selectedTab === 1 && <FileUpload />}
      </Container>
    </div>
  );
}

export default App;