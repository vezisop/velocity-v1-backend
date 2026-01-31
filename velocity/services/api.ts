import { Platform } from 'react-native';

// Use localhost for iOS/Web, 10.0.2.2 for Android Emulator, or Env Var for Prod
const DEV_API_URL = Platform.select({
    android: 'http://10.0.2.2:8000',
    ios: 'http://127.0.0.1:8000',
    default: 'http://127.0.0.1:8000',
});

// Hardcoded for V1 Release stability
export const API_URL = 'https://velocity-api-x1m0.onrender.com';

interface GpsPoint {
    lat: number;
    lon: number;
    timestamp?: string;
}

interface ActivityUpload {
    title: string;
    description?: string;
    points: GpsPoint[];
    user_id: number;
}

export interface ActivityResponse {
    id: number;
    name: string;
    distance_km: number;
    moving_time_seconds: number;
    elevation_gain_meters: number;
}



export const uploadActivity = async (data: ActivityUpload) => {
    try {
        console.log(`Attempting upload to: ${API_URL}/activities/upload`);

        // Add 5 second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${API_URL}/activities/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error('API Upload Error Detail:', {
            message: error.message,
            url: API_URL,
            isNetworkError: error.message.includes('Network request failed')
        });

        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Check backend URL.');
        }
        throw error;
    }
};


export const checkHealth = async () => {
    try {
        const response = await fetch(`${API_URL}/`);
        return await response.json();
    } catch (error) {
        console.error('API Health Check Error:', error);
        return null;
    }
};

export const fetchMyActivities = async (userId: number): Promise<ActivityResponse[]> => {
    try {
        const response = await fetch(`${API_URL}/activities/me/${userId}`);
        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
};
