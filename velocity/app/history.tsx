import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ActivityResponse, fetchMyActivities } from '../services/api';
import { Calendar, MapPin, Clock } from 'lucide-react-native';

export default function HistoryScreen() {
    const [activities, setActivities] = useState<ActivityResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            // Hardcoded User ID 1 for V1
            const data = await fetchMyActivities(1);
            setActivities(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: ActivityResponse }) => (
        <View style={styles.card}>
            <LinearGradient
                colors={[COLORS.card, '#1e293b']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            {/* Header */}
            <View style={styles.cardHeader}>
                <View style={styles.iconBg}>
                    <MapPin size={16} color={COLORS.primary} />
                </View>
                <View>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardDate}>Today</Text>
                </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                <View>
                    <Text style={styles.statLabel}>DISTANCE</Text>
                    <Text style={styles.statValue}>{item.distance_km} <Text style={styles.statUnit}>km</Text></Text>
                </View>
                <View>
                    <Text style={styles.statLabel}>TIME</Text>
                    <Text style={styles.statValue}>
                        {Math.floor(item.moving_time_seconds / 60)} <Text style={styles.statUnit}>min</Text>
                    </Text>
                </View>
                <View>
                    <Text style={styles.statLabel}>PACE</Text>
                    <Text style={styles.statValue}>5:30 <Text style={styles.statUnit}>/km</Text></Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="light" />

            <SafeAreaView style={styles.content}>
                <Text style={styles.headerTitle}>My Activities</Text>

                {loading ? (
                    <ActivityIndicator color={COLORS.primary} size="large" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={activities}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No activities yet. Go run!</Text>
                        }
                    />
                )}
            </SafeAreaView>
        </View>
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
    },
    headerTitle: {
        fontSize: 32,
        color: COLORS.text,
        fontFamily: FONTS.bold,
        marginBottom: 20,
    },
    list: {
        gap: 16,
        paddingBottom: 40,
    },
    emptyText: {
        color: COLORS.textDim,
        textAlign: 'center',
        marginTop: 50,
        fontFamily: FONTS.medium
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    iconBg: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(196, 241, 53, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
    cardDate: {
        color: COLORS.textDim,
        fontSize: 12,
        fontFamily: FONTS.regular,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    statLabel: {
        color: COLORS.textDim,
        fontSize: 10,
        fontFamily: FONTS.medium,
        marginBottom: 4,
    },
    statValue: {
        color: COLORS.text,
        fontSize: 18,
        fontFamily: FONTS.bold,
    },
    statUnit: {
        fontSize: 12,
        color: COLORS.textDim,
        fontFamily: FONTS.medium,
    }
});
