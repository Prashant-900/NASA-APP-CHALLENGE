import React from 'react';
import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ content, color = 'inherit' }) => {
  const components = {
    p: ({ children }) => <Typography variant="body2" sx={{ mb: 1, color }}>{children}</Typography>,
    h1: ({ children }) => <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color }}>{children}</Typography>,
    h2: ({ children }) => <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color }}>{children}</Typography>,
    h3: ({ children }) => <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color }}>{children}</Typography>,
    ul: ({ children }) => <Box component="ul" sx={{ pl: 2, mb: 1, color }}>{children}</Box>,
    ol: ({ children }) => <Box component="ol" sx={{ pl: 2, mb: 1, color }}>{children}</Box>,
    li: ({ children }) => <Typography component="li" variant="body2" sx={{ color }}>{children}</Typography>,
    code: ({ children }) => (
      <Typography 
        component="code" 
        sx={{ 
          bgcolor: 'background.default', 
          color: 'text.primary', 
          p: 0.5, 
          borderRadius: 1, 
          fontFamily: 'monospace', 
          border: '1px solid', 
          borderColor: 'grey.300' 
        }}
      >
        {children}
      </Typography>
    ),
    pre: ({ children }) => (
      <Box 
        component="pre" 
        sx={{ 
          bgcolor: 'background.default', 
          color: 'text.primary', 
          p: 1, 
          borderRadius: 1, 
          overflow: 'auto', 
          fontFamily: 'monospace', 
          border: '1px solid', 
          borderColor: 'grey.300' 
        }}
      >
        {children}
      </Box>
    ),
    table: ({ children }) => <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 1 }}>{children}</Box>,
    th: ({ children }) => (
      <Typography 
        component="th" 
        sx={{ 
          border: '1px solid', 
          borderColor: 'grey.300', 
          p: 0.5, 
          bgcolor: 'grey.200', 
          fontWeight: 'bold', 
          color: 'text.primary' 
        }}
      >
        {children}
      </Typography>
    ),
    td: ({ children }) => (
      <Typography 
        component="td" 
        sx={{ 
          border: '1px solid', 
          borderColor: 'grey.300', 
          p: 0.5, 
          color 
        }}
      >
        {children}
      </Typography>
    ),
  };

  return (
    <ReactMarkdown components={components}>
      {content || ''}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;