import React, { useState } from 'react';
import { Box, Paper, IconButton, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { chatApi } from '../../api';

function ChatArea({ isOpen, onClose, currentTable, onOpenNewTab }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [messageIdCounter, setMessageIdCounter] = useState(0);
  const [selectedTable, setSelectedTable] = useState(currentTable || 'k2');

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage = { id: messageIdCounter, text: inputMessage, sender: 'user' };
      setMessages([...messages, userMessage]);
      const currentInput = inputMessage;
      setInputMessage('');
      setMessageIdCounter(prev => prev + 1);
      
      // Create initial bot message
      const botMessageId = messageIdCounter + 1;
      const botMessage = { 
        id: botMessageId, 
        text: '', 
        sender: 'bot',
        streaming: true
      };
      setMessages(prev => [...prev, botMessage]);
      setMessageIdCounter(prev => prev + 2);
      
      // Stream response
      let fullResponse = '';
      await chatApi.sendMessageStream(currentInput, selectedTable, (chunk) => {
        if (chunk.chunk) {
          fullResponse += chunk.chunk;
          setMessages(prev => prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, text: fullResponse, streaming: !chunk.done, data: chunk.data }
              : msg
          ));
        }
        
        if (chunk.done && chunk.open_new_tab && chunk.data) {
          // Pass response type to determine how to handle the data
          onOpenNewTab?.(chunk.data, selectedTable, fullResponse);
        }
        
        if (chunk.error) {
          setMessages(prev => prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, text: `Error: ${chunk.error}`, streaming: false }
              : msg
          ));
        }
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '40%', opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ height: '100%', overflow: 'hidden', marginLeft: 10 }}
        >
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              height: '100%',
              borderLeft: '1px solid',
              borderColor: 'grey.300',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'background.paper',
            }}
          >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'grey.300',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'background.default',
        }}
      >
        <Typography variant="h6" color="text.primary">Research Assistant</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Paper>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          backgroundColor: 'background.paper',
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              p: 1,
              borderRadius: 1,
              backgroundColor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
              color: message.sender === 'user' ? (message.sender === 'user' ? 'background.paper' : 'text.primary') : 'background.paper',
            }}
          >
            {message.sender === 'bot' ? (
              <ReactMarkdown 
                components={{
                  p: ({ children }) => <Typography variant="body2" sx={{ mb: 1, color: 'inherit' }}>{children}</Typography>,
                  h1: ({ children }) => <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'inherit' }}>{children}</Typography>,
                  h2: ({ children }) => <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'inherit' }}>{children}</Typography>,
                  h3: ({ children }) => <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'inherit' }}>{children}</Typography>,
                  ul: ({ children }) => <Box component="ul" sx={{ pl: 2, mb: 1, color: 'inherit' }}>{children}</Box>,
                  ol: ({ children }) => <Box component="ol" sx={{ pl: 2, mb: 1, color: 'inherit' }}>{children}</Box>,
                  li: ({ children }) => <Typography component="li" variant="body2" sx={{ color: 'inherit' }}>{children}</Typography>,
                  code: ({ children }) => <Typography component="code" sx={{ bgcolor: 'background.default', color: 'text.primary', p: 0.5, borderRadius: 1, fontFamily: 'monospace', border: '1px solid', borderColor: 'grey.300' }}>{children}</Typography>,
                  pre: ({ children }) => <Box component="pre" sx={{ bgcolor: 'background.default', color: 'text.primary', p: 1, borderRadius: 1, overflow: 'auto', fontFamily: 'monospace', border: '1px solid', borderColor: 'grey.300' }}>{children}</Box>,
                  table: ({ children }) => <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 1 }}>{children}</Box>,
                  th: ({ children }) => <Typography component="th" sx={{ border: '1px solid', borderColor: 'grey.300', p: 0.5, bgcolor: 'grey.200', fontWeight: 'bold', color: 'text.primary' }}>{children}</Typography>,
                  td: ({ children }) => <Typography component="td" sx={{ border: '1px solid', borderColor: 'grey.300', p: 0.5, color: 'inherit' }}>{children}</Typography>,
                }}
              >
                {message.text || (message.streaming ? 'Thinking...' : '')}
              </ReactMarkdown>
            ) : (
              <Typography variant="body2">{message.text}</Typography>
            )}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'grey.300',
          backgroundColor: 'background.default',
        }}
      >
        <Box sx={{ mb: 1 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Research Dataset</InputLabel>
            <Select
              value={selectedTable}
              label="Research Dataset"
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              <MenuItem value="k2">K2 Mission Data</MenuItem>
              <MenuItem value="toi">TESS Objects of Interest</MenuItem>
              <MenuItem value="cum">Cumulative Exoplanet Data</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Ask about the research data..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <IconButton onClick={handleSendMessage} color="primary">
            <Send />
          </IconButton>
        </Box>
      </Box>
        </Paper>
      </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatArea;