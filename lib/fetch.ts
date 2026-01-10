import { useCallback, useEffect, useState } from "react";

// Ambil URL Ngrok dari file .env
const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;

export const fetchAPI = async (url: string, options?: RequestInit) => {
  try {
    // Logic: Jika URL tidak diawali 'http', gabungkan dengan SERVER_URL
    const fullUrl = url.startsWith('http') 
        ? url 
        : `${SERVER_URL}${url.startsWith('/') ? '' : '/'}${url}`;

    // Debugging: Cek di terminal apakah URL sudah benar (ada ngrok-nya)
    console.log("Fetching URL:", fullUrl); 

    const response = await fetch(fullUrl, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const useFetch = <T>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAPI(url, options);
      setData(result.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};