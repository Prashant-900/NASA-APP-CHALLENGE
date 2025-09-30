import React, { useState } from 'react';
import { Box, Paper, IconButton, Typography, TextField } from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

function ChatArea({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
      setTimeout(() => {
        setMessages(prev => [...prev, { text: 'This is a sample response from the chatbot.', sender: 'bot' }]);
      }, 1000);
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
          style={{ height: '100%', overflow: 'hidden' , marginLeft: 10}}
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
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              p: 1,
              borderRadius: 1,
              backgroundColor: message.sender === 'user' ? '#007bff' : 'grey.200',
              color: message.sender === 'user' ? 'white' : 'text.primary',
            }}
          >
            <Typography variant="body2">{message.text}</Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'grey.300',
          display: 'flex',
          gap: 1,
          backgroundColor: 'background.default',
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Ask about the data..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <IconButton onClick={handleSendMessage} color="primary">
          <Send />
        </IconButton>
          </Box>
        </Paper>
      </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatArea;