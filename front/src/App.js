import React, { useState, useEffect, useRef, useCallback } from "react";
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
import Predict from "./components/predict/Predict";
import ChatArea from "./components/chatbot/ChatArea";
import QueryResultsTab from "./components/QueryResultsTab";
import Home from "./components/home/Home";
import About from "./components/about/About";
import News from "./components/news/News";
import PlanetInfo from "./components/planetinfo/PlanetInfo";
import StarfieldBackground from "./components/common/StarfieldBackground";
import { lightTheme, darkTheme } from "./theme";
import { dataApi } from "./api";
import { TABLE_NAMES } from "./constants";
import { sanitizeInput, validateTableName } from "./utils/sanitize";

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [tables, setTables] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [planetInfoData, setPlanetInfoData] = useState(null);
  const [previousTab, setPreviousTab] = useState(0);

  // Tab-specific state persistence
  const [tabStates, setTabStates] = useState({
    1: { // Data Explorer
      selectedTable: TABLE_NAMES.K2,
      dataExplorerTab: `table-${TABLE_NAMES.K2}`, // sub-tab
      columns: [],
      searchTerm: "",
      searchColumn: "",
      chatOpen: false,
    },
    2: { // Predict
      file: null,
      modelType: TABLE_NAMES.K2,
      loading: false,
      results: null,
      error: ''
    }
  });

  // Store AI responses
  const [aiResponses, setAiResponses] = useState([]);
  const chatAreaRef = useRef(null);
  const queryTabRef = useRef(null);

  const currentTabState = tabStates[selectedTab] || {};
  const { selectedTable, dataExplorerTab, columns, searchTerm, searchColumn, chatOpen } = currentTabState;

  const theme = darkMode ? darkTheme : lightTheme;

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedTable) fetchColumns(selectedTable);
  }, [selectedTable]);

  useEffect(() => {
    const handleSwitchToQueryTab = () => {
      updateTabState(1, { dataExplorerTab: 'query-response' });
    };
    window.addEventListener('switchToQueryTab', handleSwitchToQueryTab);
    return () => window.removeEventListener('switchToQueryTab', handleSwitchToQueryTab);
  }, []);

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
      updateTabState(1, { 
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
    const sanitizedValue = sanitizeInput(newValue, 50);
    const newTable = sanitizedValue.startsWith("table-") ? sanitizedValue.replace("table-", "") : selectedTable;
    const validTable = validateTableName(newTable) || selectedTable;
    
    updateTabState(1, {
      dataExplorerTab: sanitizedValue,
      selectedTable: validTable,
      searchTerm: sanitizedValue.startsWith("table-") ? "" : searchTerm
    });
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleChat = () => updateTabState(1, { chatOpen: !chatOpen });

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
    updateTabState(1, { dataExplorerTab: 'query-response' });
  };
  
  const scrollToMessage = useCallback((messageId) => {
    if (chatAreaRef.current?.scrollToMessage) {
      chatAreaRef.current.scrollToMessage(messageId);
    }
  }, []);
  
  const scrollToQuery = useCallback((queryId) => {
    if (queryTabRef.current?.scrollToQuery) {
      queryTabRef.current.scrollToQuery(queryId);
    }
  }, []);

  const handleRowClick = (rowData) => {
    setPreviousTab(selectedTab);
    setPlanetInfoData(rowData);
    setSelectedTab(5); // Hidden tab index
  };

  const handleBackFromPlanetInfo = () => {
    setSelectedTab(previousTab);
    setPlanetInfoData(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ backgroundColor: 'background.default', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'grey.300', zIndex:1 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: 'background.default' }}>
            <Typography variant="h6" sx={{ color: 'primary.main' }}>Exoplanet Detection Dashboard</Typography>
            <Tabs value={selectedTab} onChange={handleTabChange} TabIndicatorProps={{ sx: { backgroundColor: 'primary.main' } }}>
              <Tab label="Home" />
              <Tab label="Data Explorer" />
              <Tab label="Predict" />
              <Tab label="News" />
              <Tab label="About" />
            </Tabs>
            <IconButton onClick={toggleDarkMode} color="primary">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth={false} sx={{ px: 2, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {selectedTab === 0 && (
            <Home />
          )}

          {selectedTab === 1 && (
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
                      <TextField label="Search" variant="outlined" size="small" value={searchTerm || ""} onChange={(e) => updateTabState(1, { searchTerm: sanitizeInput(e.target.value, 200) })} sx={{ minWidth: 200 }} />
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Search Column</InputLabel>
                        <Select value={searchColumn || ""} label="Search Column" onChange={(e) => updateTabState(1, { searchColumn: e.target.value })}>
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
                    <QueryResultsTab ref={queryTabRef} scrollToMessage={scrollToMessage} />
                  ) : (
                    <DataTable tableName={selectedTable} searchTerm={searchTerm} searchColumn={searchColumn} onRowClick={handleRowClick} />
                  )}
                </motion.div>
                <ChatArea ref={chatAreaRef} isOpen={chatOpen} onClose={() => updateTabState(1, { chatOpen: false })} currentTable={selectedTable} onOpenNewTab={handleOpenNewTab} scrollToQuery={scrollToQuery} />
              </Box>
            </>
          )}

          {selectedTab === 2 && (
            <Predict 
              persistentState={tabStates[2] || {}} 
              onStateChange={(updates) => updateTabState(2, updates)} 
              onViewPlanetInfo={handleRowClick}
            />
          )}

          {selectedTab === 3 && (
            <Box sx={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <StarfieldBackground />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1, height: '100%', overflow: 'auto' }}>
                <News />
              </Box>
            </Box>
          )}

          {selectedTab === 4 && (
            <Box sx={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
              <StarfieldBackground />
              <Box sx={{ position: 'relative', zIndex: 2, height: '100%', overflow: 'auto' }}>
                <About />
              </Box>
            </Box>
          )}

          {selectedTab === 5 && (
            <PlanetInfo planetData={planetInfoData} onBack={handleBackFromPlanetInfo} />
          )}

          {selectedTab === 6 && (
            <PlanetInfo planetData={planetInfoData} onBack={handleBackFromPlanetInfo} />
          )}
          

        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
