import apiClient from './client';

export const dataApi = {
  getTables: () => apiClient.get('/tables'),
  
  getTableColumns: (tableName) => apiClient.get(`/table/${tableName}/columns`),
  
  getTableData: (tableName, params) => apiClient.get(`/table/${tableName}/data`, { params }),
  
  predict: (formData) => apiClient.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};