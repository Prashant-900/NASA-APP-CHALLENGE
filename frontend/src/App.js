import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  IconButton,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { Brightness4, Brightness7, Search } from "@mui/icons-material";
import { motion } from 'framer-motion';
import DataTable from "./components/DataTable";
import FileUpload from "./components/FileUpload";
import ChatArea from "./components/chatbot/ChatArea";
import { lightTheme, darkTheme } from "./theme";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedTable, setSelectedTable] = useState("k2");
  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const theme = darkMode ? darkTheme : lightTheme;

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
      console.error("Error fetching tables:", error);
    }
  };

  const fetchColumns = async (tableName) => {
    try {
      const response = await axios.get(
        `${API_BASE}/table/${tableName}/columns`
      );
      setColumns(response.data);
      setSearchColumn(response.data[0] || "");
    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleTableChange = (event, newValue) => {
    setSelectedTable(newValue);
    setSearchTerm("");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ backgroundColor: 'background.default', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'grey.300' }}>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" component="div">
              Exoplanet Detection Dashboard
            </Typography>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              TabIndicatorProps={{ sx: { backgroundColor: '#007bff' } }}
            >
              <Tab
                label="Data Explorer"
                sx={{
                  color: 'text.secondary',
                  '&.Mui-selected': { color: '#007bff' },
                }}
              />
              <Tab
                label="Predict"
                sx={{
                  color: 'text.secondary',
                  '&.Mui-selected': { color: '#007bff' },
                }}
              />
            </Tabs>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container 
          maxWidth={false} 
          sx={{ 
            px: 2, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
          }}
        >
          {selectedTab === 0 && (
            <>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: '1px solid',
                  borderColor: 'grey.300',
                  backgroundColor: 'background.default',
                }}
              >
                <Tabs 
                  value={selectedTable} 
                  onChange={handleTableChange}
                  TabIndicatorProps={{ sx: { backgroundColor: '#007bff' } }}
                >
                  {tables.map((table) => (
                    <Tab 
                      key={table} 
                      label={table.toUpperCase()} 
                      value={table}
                      sx={{
                        color: 'text.secondary',
                        '&.Mui-selected': { color: '#007bff' },
                      }}
                    />
                  ))}
                </Tabs>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
                  <IconButton onClick={toggleChat} color="primary">
                    <Search />
                  </IconButton>
                </Box>
              </Paper>

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: chatOpen ? '60%' : '100%' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <DataTable
                    tableName={selectedTable}
                    searchTerm={searchTerm}
                    searchColumn={searchColumn}
                  />
                </motion.div>
                <ChatArea isOpen={chatOpen} onClose={() => setChatOpen(false)} />
              </Box>
            </>
          )}

          {selectedTab === 1 && <FileUpload />}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
