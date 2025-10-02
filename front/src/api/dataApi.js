import apiClient from './client';

export const getQueryData = async (queryId, page = 0) => {
  try {
    const response = await apiClient.get(`/query/data/${queryId}?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching query data:', error);
    throw error;
  }
};

export const getTables = async () => {
  try {
    const response = await apiClient.get('/tables');
    return response;
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
};

export const getTableColumns = async (tableName) => {
  try {
    const response = await apiClient.get(`/table/${tableName}/columns`);
    return response;
  } catch (error) {
    console.error('Error fetching table columns:', error);
    throw error;
  }
};

export const getTableData = async (tableName, params = {}) => {
  try {
    const response = await apiClient.get(`/table/${tableName}/data`, { params });
    return response;
  } catch (error) {
    console.error('Error fetching table data:', error);
    throw error;
  }
};

export const predict = async (formData) => {
  try {
    const response = await apiClient.post('/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
  } catch (error) {
    console.error('Error making prediction:', error);
    throw error;
  }
};

export const predictManual = async (data) => {
  try {
    const response = await apiClient.post('/predict/manual', data);
    return response;
  } catch (error) {
    console.error('Error making manual prediction:', error);
    throw error;
  }
};

export const searchPlanet = async (planetName) => {
  try {
    const response = await apiClient.get(`/search/planet?name=${encodeURIComponent(planetName)}`);
    return response;
  } catch (error) {
    console.error('Error searching planet:', error);
    throw error;
  }
};