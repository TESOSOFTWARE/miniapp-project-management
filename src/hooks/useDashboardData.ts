import { useEffect, useMemo } from 'react';
import { useDashboardStore } from '../store/useDashboardStore';
import { fetchAllSheets } from '../services/googleSheetService';
import { processDashboardData, filterData } from '../utils/dataProcessor';

export const useDashboardData = () => {
  const { 
    sheetId, 
    data, 
    setData, 
    isLoading, 
    setIsLoading, 
    error, 
    setError,
    filters 
  } = useDashboardStore();

  const fetchData = async () => {
    if (!sheetId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const sheets = await fetchAllSheets(sheetId);
      setData(sheets);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sheetId && !data) {
      fetchData();
    }
  }, [sheetId]);

  const processedData = useMemo(() => {
    if (!data) return null;
    return processDashboardData(data);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!processedData) return null;
    return filterData(processedData, filters);
  }, [processedData, filters]);

  return {
    data: filteredData,
    isLoading,
    error,
    refresh: fetchData
  };
};
