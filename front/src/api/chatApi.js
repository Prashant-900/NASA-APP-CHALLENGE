import apiClient from './client';
import { API_ENDPOINTS } from '../constants';

// Input validation and sanitization
const validateInput = (input, maxLength = 1000) => {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input');
  }
  if (input.length > maxLength) {
    throw new Error(`Input too long (max ${maxLength} characters)`);
  }
  // Remove potentially dangerous characters
  return input.replace(/[<>"'&]/g, '');
};

const validateTable = (table) => {
  const allowedTables = ['k2', 'toi', 'cum'];
  if (!table || !allowedTables.includes(table)) {
    throw new Error('Invalid table name');
  }
  return table;
};

export const chatApi = {
  sendMessage: (message, table) => {
    const validMessage = validateInput(message);
    const validTable = validateTable(table);
    return apiClient.post('/chat', { message: validMessage, table: validTable });
  },
  
  executeDirectQuery: (table) => {
    const validTable = validateTable(table);
    return apiClient.post('/query/direct', { table: validTable });
  },
  
  sendMessageStream: async (message, table, queryId, onChunk) => {
    try {
      // Validate inputs
      const validMessage = validateInput(message);
      const validTable = validateTable(table);
      const validQueryId = Number.isInteger(queryId) ? queryId : 0;
      
      // Use the base URL from constants instead of hardcoded URL
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/plain',
        },
        body: JSON.stringify({ 
          message: validMessage, 
          table: validTable, 
          query_id: validQueryId 
        }),
        credentials: 'same-origin', // Enhanced security
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6);
              // Validate JSON before parsing
              if (jsonStr.trim()) {
                const data = JSON.parse(jsonStr);
                // Validate data structure
                if (typeof data === 'object' && data !== null) {
                  console.log('📡 Received stream data:', {
                    done: data.done,
                    hasChunk: !!data.chunk,
                    hasData: !!data.data,
                    hasPlot: !!data.plot,
                    openNewTab: data.open_new_tab,
                    plotLength: data.plot ? data.plot.length : 0,
                    plotPreview: data.plot ? data.plot.substring(0, 100) + '...' : 'No plot'
                  });
                  onChunk(data);
                }
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
              // Don't expose parsing errors to user
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error);
      onChunk({ 
        chunk: 'Connection error occurred', 
        done: true, 
        error: 'Network error' 
      });
    }
  },
}