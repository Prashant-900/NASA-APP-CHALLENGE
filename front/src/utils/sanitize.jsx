// Enhanced HTML sanitization
export const sanitizeHtml = (html) => {
  if (!html || typeof html !== 'string') return '';
  
  // Create a temporary div to safely extract text content
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

// Comprehensive input sanitization
export const sanitizeInput = (input, maxLength = 1000) => {
  if (!input || typeof input !== 'string') return '';
  
  // Limit length
  let sanitized = input.substring(0, maxLength);
  
  // Remove potentially dangerous characters and patterns
  sanitized = sanitized.replace(/[<>"'&\\]/g, (match) => {
    const entities = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;',
      '\\': ''
    };
    return entities[match] || '';
  });
  
  // Remove script-like patterns
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+=/gi, '');
  sanitized = sanitized.replace(/data:/gi, '');
  
  return sanitized.trim();
};

// Legacy function for backward compatibility
export const sanitizeText = (text) => {
  return sanitizeInput(text, 500);
};

// Sanitize object properties
export const sanitizeObject = (obj, maxDepth = 3) => {
  if (maxDepth <= 0 || !obj || typeof obj !== 'object') {
    return obj;
  }
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Sanitize key
    const safeKey = sanitizeInput(key, 50);
    
    if (typeof value === 'string') {
      sanitized[safeKey] = sanitizeInput(value);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[safeKey] = value;
    } else if (value === null || value === undefined) {
      sanitized[safeKey] = value;
    } else if (typeof value === 'object') {
      sanitized[safeKey] = sanitizeObject(value, maxDepth - 1);
    }
  }
  
  return sanitized;
};

// Validate table names
export const validateTableName = (tableName) => {
  const allowedTables = ['k2', 'toi', 'kepler'];
  return allowedTables.includes(tableName) ? tableName : null;
};

// Validate and sanitize search queries
export const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return '';
  
  // Remove SQL injection patterns
  let sanitized = query.replace(/[';"\\]/g, '');
  
  // Remove common SQL keywords that shouldn't be in search
  const sqlKeywords = ['drop', 'delete', 'update', 'insert', 'alter', 'create', 'exec', 'union'];
  const regex = new RegExp(`\\b(${sqlKeywords.join('|')})\\b`, 'gi');
  sanitized = sanitized.replace(regex, '');
  
  // Limit length and clean up
  return sanitized.substring(0, 200).trim();
};

export const validateRowData = (row) => {
  return row && typeof row === 'object';
};

export const safeArrayAccess = (array, index) => {
  return array && Array.isArray(array) && array.length > index && index >= 0 ? array[index] : null;
};