import { useState, useEffect, useCallback } from 'react';
import { dataApi } from '../api';

export const useTableData = (tableName, searchTerm, searchColumn, page = 0, rowsPerPage = 50) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    if (!tableName) return;
    
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        search_column: searchColumn
      };

      const response = await dataApi.getTableData(tableName, params);
      const result = response.data;
      
      setData(result.data);
      setTotalCount(result.total);
      
      if (result.data.length > 0) {
        setColumns(Object.keys(result.data[0]));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [tableName, page, rowsPerPage, searchTerm, searchColumn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, columns, loading, totalCount, refetch: fetchData };
};