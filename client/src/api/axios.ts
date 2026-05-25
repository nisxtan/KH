import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getPersistedAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('persist:root');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const auth = JSON.parse(parsed.auth);
    return auth.token || null;
  } catch {
    return null;
  }
}

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = getPersistedAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    if (!process.env.NEXT_PUBLIC_API_URL || API_URL.includes('localhost')) {
        console.error(
            '[Kiran Handicraft] NEXT_PUBLIC_API_URL is missing or points to localhost. ' +
            'Set it in Vercel to your Render API URL (e.g. https://your-app.onrender.com/api) and redeploy.'
        );
    }
}

export default axiosInstance;
