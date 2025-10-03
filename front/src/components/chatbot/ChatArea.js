import React, { useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Box, Paper, IconButton, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { chatApi } from '../../api';
import { addMessage, updateMessage, addQueryResponse, getNextMessageId } from '../../store/chatStore';
import { useChatMessages } from '../../hooks';
import MarkdownRenderer from '../common/MarkdownRenderer';
import { TABLE_NAMES, TABLE_LABELS } from '../../constants';
import { sanitizeInput, validateTableName } from '../../utils/sanitize';

const ChatArea = forwardRef(({ isOpen, onClose, currentTable, onOpenNewTab, scrollToQuery }, ref) => {
  const messages = useChatMessages();
  const [inputMessage, setInputMessage] = useState('');
  const [selectedTable, setSelectedTable] = useState(currentTable || TABLE_NAMES.K2);
  const messageRefs = useRef({});
  
  const scrollToMessage = useCallback((messageId) => {
    messageRefs.current[messageId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);
  
  useImperativeHandle(ref, () => ({ scrollToMessage }), [scrollToMessage]);

  const handleSendMessage = async () => {
    const trimmedMessage = inputMessage.trim();
    if (trimmedMessage) {
      try {
        // Sanitize and validate inputs
        const sanitizedMessage = sanitizeInput(trimmedMessage, 1000);
        const validTable = validateTableName(selectedTable);
        
        if (!sanitizedMessage) {
          console.error('Invalid message input');
          return;
        }
        
        if (!validTable) {
          console.error('Invalid table selection');
          return;
        }
        
        const userMessage = { id: getNextMessageId(), text: sanitizedMessage, sender: 'user' };
        addMessage(userMessage);
        setInputMessage('');
        
        // Create initial bot message
        const botMessageId = getNextMessageId();
        const botMessage = { 
          id: botMessageId, 
          text: '', 
          sender: 'bot',
          streaming: true
        };
        addMessage(botMessage);
        
        // Stream response
        let fullResponse = '';
        await chatApi.sendMessageStream(sanitizedMessage, validTable, botMessageId, (chunk) => {
          console.log('📥 Received chunk:', chunk);
          
          if (chunk.chunk) {
            fullResponse += chunk.chunk;
            updateMessage(botMessageId, { text: fullResponse, streaming: !chunk.done, data: chunk.data });
          }
          
          if (chunk.done && chunk.open_new_tab) {
            console.log('🎯 Adding query response:', {
              hasData: !!chunk.data,
              hasPlot: !!chunk.plot,
              plotLength: chunk.plot ? chunk.plot.length : 0,
              plotPreview: chunk.plot ? chunk.plot.substring(0, 200) + '...' : 'No plot'
            });
            
            const queryId = addQueryResponse({
              response: fullResponse,
              data: chunk.data,
              plot: chunk.plot,
              table: validTable,
              messageId: botMessageId
            });
            updateMessage(botMessageId, { queryId });
            // Open new tab if there's data OR plot
            if (chunk.data || chunk.plot) {
              console.log('🔄 Opening new tab with:', { queryId, hasData: !!chunk.data, hasPlot: !!chunk.plot });
              onOpenNewTab?.(chunk.data, validTable, fullResponse);
            }
          }
          
          if (chunk.error) {
            updateMessage(botMessageId, { text: `Error: ${chunk.error}`, streaming: false });
          }
        });
      } catch (error) {
        console.error('Message send error:', error);
      }
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
            ref={el => {
              if (el) messageRefs.current[message.id] = el;
            }}
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
              <Box>
                <MarkdownRenderer 
                  content={message.text || (message.streaming ? 'Thinking...' : '')}
                  color="inherit"
                />
                {message.queryId !== undefined && (
                  <Chip 
                    label={`Query ${message.queryId}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    onClick={() => {
                      // Switch to query response tab first
                      const event = new CustomEvent('switchToQueryTab');
                      window.dispatchEvent(event);
                      
                      // Try multiple methods to ensure scroll works
                      const tryScroll = () => {
                        // Method 1: Use prop function
                        if (scrollToQuery) {
                          scrollToQuery(message.queryId);
                        }
                        // Method 2: Use global function as backup
                        if (window.scrollToQuery) {
                          window.scrollToQuery(message.queryId);
                        }
                      };
                      
                      // Try immediately
                      tryScroll();
                      
                      // Try again after tab switch
                      setTimeout(tryScroll, 150);
                    }}
                    sx={{ 
                      mt: 1, 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white'
                      }
                    }}
                  />
                )}
              </Box>
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
              onChange={(e) => {
              const validTable = validateTableName(e.target.value);
              if (validTable) {
                setSelectedTable(validTable);
              }
            }}
            >
              <MenuItem value={TABLE_NAMES.K2}>{TABLE_LABELS[TABLE_NAMES.K2]}</MenuItem>
              <MenuItem value={TABLE_NAMES.TOI}>{TABLE_LABELS[TABLE_NAMES.TOI]}</MenuItem>
              <MenuItem value={TABLE_NAMES.CUM}>{TABLE_LABELS[TABLE_NAMES.CUM]}</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Ask about the research data..."
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value.substring(0, 1000));
            }}
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
});

export default ChatArea;