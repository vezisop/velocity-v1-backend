import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useWorkout } from '../hooks/useWorkout';

import LiveHeader from './dashboard/LiveHeader';
import MetricGrid from './dashboard/MetricGrid';
import SlideToFinish from './dashboard/SlideToFinish';

export default function ActiveDashboard() {
    const { isFinished, metrics, finishWorkout } = useWorkout();

    if (isFinished) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={[styles.metricValue, { fontSize: 40, lineHeight: 50 }]}>Workout Saved!</Text>
            </View>
        )
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <StatusBar style="light" />
                <LinearGradient
                    colors={[COLORS.background, '#020617']}
                    style={StyleSheet.absoluteFill}
                />

                <SafeAreaView style={styles.content}>
                    {/* Header */}
                    <LiveHeader />

                    {/* Main Metric - Distance */}
                    <View style={styles.mainMetric}>
                        <Text style={styles.mainValue}>{metrics.distance}</Text>
                        <Text style={styles.mainLabel}>KILOMETERS</Text>
                    </View>

                    {/* Secondary Metrics Grid */}
                    <MetricGrid
                        pace={metrics.pace}
                        heartRate={metrics.heartRate}
                        time={metrics.time}
                        calories={metrics.calories}
                    />

                    {/* Slide to Finish */}
                    <SlideToFinish onFinish={finishWorkout} />
                </SafeAreaView>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: SIZES.padding,
        justifyContent: 'space-between',
    },
    mainMetric: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 40,
    },
    mainValue: {
        fontSize: 120, // Massive
        color: COLORS.text,
        fontFamily: FONTS.black, // Condensed bold feel
        includeFontPadding: false,
        lineHeight: 120,
        letterSpacing: -4,
    },
    mainLabel: {
        color: COLORS.textDim,
        fontSize: 16,
        fontFamily: FONTS.medium,
        textTransform: 'uppercase',
        letterSpacing: 4,
        marginTop: -10,
    },
    metricValue: { // Re-added for the "Workout Saved" screen
        color: COLORS.text,
        fontFamily: FONTS.black,
    }
});
