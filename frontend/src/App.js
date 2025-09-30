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
import { Brightness4, Brightness7, Chat } from "@mui/icons-material";
import { motion } from "framer-motion";

import DataTable from "./components/DataTable";
import FileUpload from "./components/FileUpload";
import ChatArea from "./components/chatbot/ChatArea";
import QueryResultsTab from "./components/QueryResultsTab";
import { lightTheme, darkTheme } from "./theme";
import { dataApi } from "./api";

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [tables, setTables] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Tab-specific state persistence
  const [tabStates, setTabStates] = useState({
    0: { // Data Explorer
      selectedTable: "k2",
      dataExplorerTab: "table-k2", // sub-tab
      columns: [],
      searchTerm: "",
      searchColumn: "",
      chatOpen: false,
    },
    1: { // Predict
      file: null,
      modelType: 'k2',
      loading: false,
      results: null,
      error: ''
    }
  });

  // Store AI responses
  const [aiResponses, setAiResponses] = useState([]);

  const currentTabState = tabStates[selectedTab] || {};
  const { selectedTable, dataExplorerTab, columns, searchTerm, searchColumn, chatOpen } = currentTabState;

  const theme = darkMode ? darkTheme : lightTheme;

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedTable) fetchColumns(selectedTable);
  }, [selectedTable]);

  const fetchTables = async () => {
    try {
      const response = await dataApi.getTables();
      setTables(response.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const fetchColumns = async (tableName) => {
    try {
      const response = await dataApi.getTableColumns(tableName);
      updateTabState(0, { 
        columns: response.data,
        searchColumn: response.data[0] || ""
      });
    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  };

  const updateTabState = (tabIndex, updates) => {
    setTabStates(prev => ({
      ...prev,
      [tabIndex]: { ...prev[tabIndex], ...updates }
    }));
  };

  const handleTabChange = (event, newValue) => setSelectedTab(newValue);

  const handleTableSubTabChange = (event, newValue) => {
    updateTabState(0, {
      dataExplorerTab: newValue,
      selectedTable: newValue.startsWith("table-") ? newValue.replace("table-", "") : selectedTable,
      searchTerm: newValue.startsWith("table-") ? "" : searchTerm
    });
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleChat = () => updateTabState(0, { chatOpen: !chatOpen });

  const handleOpenNewTab = (data, table, response) => {
    const newResponse = {
      id: Date.now(),
      data,
      table,
      response,
      timestamp: new Date().toLocaleString()
    };
    setAiResponses(prev => [...prev, newResponse]);
    
    // Auto-switch to Query Response tab when new data is added
    updateTabState(0, { dataExplorerTab: 'query-response' });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ backgroundColor: 'background.default', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'grey.300' }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: 'background.default' }}>
            <Typography variant="h6" sx={{ color: 'primary.main' }}>Exoplanet Detection Dashboard</Typography>
            <Tabs value={selectedTab} onChange={handleTabChange} TabIndicatorProps={{ sx: { backgroundColor: 'primary.main' } }}>
              <Tab label="Data Explorer" />
              <Tab label="Predict" />
            </Tabs>
            <IconButton onClick={toggleDarkMode} color="primary">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth={false} sx={{ px: 2, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {selectedTab === 0 && (
            <>
              <Paper elevation={0} sx={{ p: 2, mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid', borderColor: 'grey.300', backgroundColor: 'background.default' }}>
                <Tabs
                  value={dataExplorerTab}
                  onChange={handleTableSubTabChange}
                  TabIndicatorProps={{ sx: { backgroundColor: 'primary.main' } }}
                >
                  {tables.map(table => (
                    <Tab key={table} label={table.toUpperCase()} value={`table-${table}`} sx={{ color: 'text.secondary', '&.Mui-selected': { color: 'primary.main' } }} />
                  ))}
                  <Tab label="Query Response" value="query-response" sx={{ color: 'text.secondary', '&.Mui-selected': { color: 'primary.main' } }} />
                </Tabs>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  {dataExplorerTab.startsWith("table-") && (
                    <>
                      <TextField label="Search" variant="outlined" size="small" value={searchTerm || ""} onChange={(e) => updateTabState(0, { searchTerm: e.target.value })} sx={{ minWidth: 200 }} />
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Search Column</InputLabel>
                        <Select value={searchColumn || ""} label="Search Column" onChange={(e) => updateTabState(0, { searchColumn: e.target.value })}>
                          {columns.map(column => <MenuItem key={column} value={column}>{column}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </>
                  )}
                  <IconButton onClick={toggleChat} color="primary"><Chat /></IconButton>
                </Box>
              </Paper>

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
                <motion.div animate={{ width: chatOpen ? '60%' : '100%' }} transition={{ duration: 0.3, ease: 'easeInOut' }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {dataExplorerTab === "query-response" ? (
                    <QueryResultsTab responses={aiResponses} />
                  ) : (
                    <DataTable tableName={selectedTable} searchTerm={searchTerm} searchColumn={searchColumn} />
                  )}
                </motion.div>
                <ChatArea isOpen={chatOpen} onClose={() => updateTabState(0, { chatOpen: false })} currentTable={selectedTable} onOpenNewTab={handleOpenNewTab} />
              </Box>
            </>
          )}

          {selectedTab === 1 && (
            <FileUpload persistentState={tabStates[1] || {}} onStateChange={(updates) => updateTabState(1, updates)} />
          )}


        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
