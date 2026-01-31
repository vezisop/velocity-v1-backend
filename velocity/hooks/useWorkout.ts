import { useState, useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { uploadActivity } from '../services/api';
import { calculateDistance } from '../utils/geo';

export const useWorkout = () => {
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Workout State
    const [duration, setDuration] = useState(0);
    const [distance, setDistance] = useState(0);
    const [route, setRoute] = useState<any[]>([]);

    // Refs for intervals and subscriptions
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

    useEffect(() => {
        // Request permissions on mount
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Permission to access location was denied');
            }
        })();

        return () => {
            stopTracking(); // Cleanup on unmount
        };
    }, []);

    const startWorkout = async () => {
        setIsActive(true);
        setIsFinished(false);
        setDuration(0);
        setDistance(0);
        setRoute([]);

        // Start Timer
        timerRef.current = setInterval(() => {
            setDuration(d => d + 1);
        }, 1000);

        // Start GPS Tracking
        try {
            locationSubscriptionRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 1000,
                    distanceInterval: 1, // Update every meter
                },
                (newLocation) => {
                    const { latitude, longitude } = newLocation.coords;
                    const timestamp = new Date(newLocation.timestamp).toISOString();

                    setRoute(currentRoute => {
                        const newPoint = { lat: latitude, lon: longitude, timestamp };

                        // Calculate distance from last point
                        if (currentRoute.length > 0) {
                            const lastPoint = currentRoute[currentRoute.length - 1];
                            const dist = calculateDistance(
                                lastPoint.lat, lastPoint.lon,
                                latitude, longitude
                            );
                            setDistance(d => d + dist);
                        }

                        return [...currentRoute, newPoint];
                    });
                }
            );
        } catch (err: any) {
            setError("Could not start GPS tracking: " + err.message);
        }
    };

    const stopTracking = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (locationSubscriptionRef.current) locationSubscriptionRef.current.remove();
        timerRef.current = null;
        locationSubscriptionRef.current = null;
    };

    const finishWorkout = async () => {
        stopTracking();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsActive(false);
        setIsLoading(true);
        setError(null);

        try {
            // Only upload if we have data (or at least 2 points)
            if (route.length < 2) {
                // Fallback for testing/indoor where GPS might not move much
                // We'll just warn but try to upload anyway if > 0, actually 2 is min for LineString
                if (route.length === 0) throw new Error("No GPS data recorded. Try moving around!");
            }

            console.log('Uploading activity with ' + route.length + ' points');
            await uploadActivity({
                title: "Velocity Run",
                description: `Run on ${new Date().toLocaleDateString()}`,
                user_id: 1,
                points: route
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

    // Format helpers
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate pace (min/km)
    const calculatePace = () => {
        if (distance === 0) return "0:00";
        const paceDec = (duration / 60) / distance;
        const pMin = Math.floor(paceDec);
        const pSec = Math.round((paceDec - pMin) * 60);
        return `${pMin}:${pSec.toString().padStart(2, '0')}`;
    }

    const metrics = {
        distance: distance.toFixed(2),
        pace: calculatePace(),
        time: formatTime(duration),
        calories: Math.floor(distance * 60) // Rough Kcal estimate based on distance
    };

    return {
        isActive,
        isFinished,
        isLoading,
        error,
        metrics,
        startWorkout,
        finishWorkout
    };
};
