import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { uploadActivity } from '../services/api';

// Mock Data
const MOCK_ROUTE = [
    { lat: 37.7749, lon: -122.4194, timestamp: new Date(Date.now() - 3600000).toISOString() },
    { lat: 37.7849, lon: -122.4094, timestamp: new Date(Date.now() - 3000000).toISOString() },
    { lat: 37.7949, lon: -122.3994, timestamp: new Date(Date.now() - 2400000).toISOString() },
    { lat: 37.8049, lon: -122.3894, timestamp: new Date(Date.now() - 1800000).toISOString() },
];

export const useWorkout = () => {
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // In a real app, these would be state variables updated by GPS
    const metrics = {
        distance: "5.42",
        pace: "5:30",
        heartRate: 142,
        time: "00:32:15",
        calories: 320
    };

    const finishWorkout = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsLoading(true);
        setError(null);

        try {
            console.log('Uploading activity...');
            await uploadActivity({
                title: "Velocity Morning Run",
                description: "Test run from React Native",
                user_id: 1,
                points: MOCK_ROUTE
            });
            console.log('Upload Success!');
            setIsFinished(true);
        } catch (e: any) {
            console.error(e);
            setError(e.message);
            alert(`Failed: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isFinished,
        isLoading,
        error,
        metrics,
        finishWorkout
    };
};
