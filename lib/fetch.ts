import { useCallback, useEffect, useState } from "react";

// ⚠️ PENTING: Ganti string di bawah ini dengan Link Vercel Anda yang asli!
// Jangan pakai akhiran "/" (slash)
const SERVER_URL = "https://shuttle-it-app.vercel.app"; 

export const fetchAPI = async (url: string, options?: RequestInit) => {
  try {
    // Logic: Jika URL belum ada http, tambahkan SERVER_URL di depannya
    const fullUrl = url.startsWith("http") ? url : `${SERVER_URL}${url}`;

    console.log("Fetching:", fullUrl); // Cek di log terminal untuk debugging

    const response = await fetch(fullUrl, options);
    
    if (!response.ok) {
      // Coba baca pesan error dari JSON response server (jika ada)
      const errorData = await response.json().catch(() => ({})); 
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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