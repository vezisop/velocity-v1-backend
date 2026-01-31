import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold, Inter_800ExtraBold, Inter_900Black } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import ActiveDashboard from '../components/ActiveDashboard';
import { COLORS } from '../constants/theme';

SplashScreen.preventAutoHideAsync();

export default function Page() {
    return <ActiveDashboard />;
}
