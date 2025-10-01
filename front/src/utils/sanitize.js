export const sanitizeText = (text) => {
  if (typeof text !== 'string') return String(text);
  return text
    .replace(/[<>"'&]/g, (match) => {
      const entities = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[match] || match;
    })
    .substring(0, 500); // Limit length
};

export const validateRowData = (row) => {
  return row && typeof row === 'object';
};

export const safeArrayAccess = (array, index) => {
  return array && Array.isArray(array) && array.length > index && index >= 0 ? array[index] : null;
};