// hooks/useSharedEndpoint.js
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/axios';

export function useSharedEndpoint(endpoint) {
  const { tokenVersion } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(endpoint);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, tokenVersion]); // Re-fetch when endpoint or tokenVersion changes

  return { data, loading, error };
}