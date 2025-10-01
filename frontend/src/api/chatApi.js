import apiClient from './client';

export const chatApi = {
  sendMessage: (message, table) => apiClient.post('/chat', { message, table }),
  
  executeDirectQuery: (table) => apiClient.post('/query/direct', { table }),
  
  sendMessageStream: async (message, table, queryId, onChunk) => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, table, query_id: queryId }),
      });
      
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
              const data = JSON.parse(line.slice(6));
              onChunk(data);
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      onChunk({ chunk: `Error: ${error.message}`, done: true, error: error.message });
    }
  },
}