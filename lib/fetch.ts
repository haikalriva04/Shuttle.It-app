import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Helper untuk mendapatkan Base URL server Expo secara otomatis.
 * * Logic:
 * 1. Web: Menggunakan relative path ("")
 * 2. Development (Expo Go): Mengambil IP Address komputer dari hostUri agar HP fisik bisa connect.
 * 3. Production (APK): Menggunakan URL server Vercel.
 */
export const getBaseUrl = () => {
  if (Platform.OS === 'web') return '';

  // 1. Jika sedang dalam mode Development (npx expo start)
  if (__DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri;
    const localhost = debuggerHost?.split(":")[0];

    if (!localhost) {
      // Fallback jika IP tidak terdeteksi (biasanya di simulator)
      return Platform.OS === "android" ? "http://10.0.2.2:8081" : "http://localhost:8081";
    }

    // Mengembalikan IP Address LAN Komputer Anda
    return `http://${localhost}:8081`;
  }

  // 2. Jika Production (APK yang sudah di-build)
  // Menggunakan URL Vercel yang Anda berikan (tanpa slash di akhir agar aman)
  return "https://shuttle-it-app.vercel.app"; 
};

/**
 * Wrapper fetch untuk menangani Base URL otomatis dan Error Handling
 */
export const fetchAPI = async (url: string, options?: RequestInit) => {
  const baseUrl = getBaseUrl();
  // Pastikan tidak ada double slash //
  const fullUrl = `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;

  console.log(`[API] Requesting: ${fullUrl}`); // Debugging Log

  try {
    const response = await fetch(fullUrl, options);
    
    // Cek status HTTP (200-299)
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `API Error ${response.status}`;
        try {
            // Coba parse jika errornya JSON
            const errorJson = JSON.parse(errorText);
            if (errorJson.error) errorMessage = errorJson.error;
        } catch {
            // Abaikan jika bukan JSON, gunakan text mentah
            if(errorText) errorMessage = errorText;
        }
        throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`[API] Failed: ${fullUrl}`, error);
    throw error;
  }
};