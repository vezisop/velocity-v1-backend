import { Tabs } from 'expo-router';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold, Inter_800ExtraBold, Inter_900Black } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Activity, History } from 'lucide-react-native';
import { COLORS, FONTS } from '../constants/theme';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.background,
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(255,255,255,0.1)',
                    height: 85,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textDim,
                tabBarLabelStyle: {
                    fontFamily: FONTS.bold,
                    fontSize: 10,
                    marginTop: 4
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'RECORD',
                    tabBarIcon: ({ color }) => <Activity size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'HISTORY',
                    tabBarIcon: ({ color }) => <History size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
