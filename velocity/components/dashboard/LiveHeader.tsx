import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Navigation } from 'lucide-react-native';
import { COLORS, FONTS } from '../../constants/theme';

export default function LiveHeader() {
    return (
        <View style={styles.header}>
            <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE TRACKING</Text>
            </View>
            <View style={styles.gpsSignal}>
                <Navigation size={16} color={COLORS.primary} />
                <Text style={styles.gpsText}>GPS</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(196, 241, 53, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
        marginRight: 6,
    },
    liveText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '700',
        fontFamily: FONTS.bold,
        letterSpacing: 1,
    },
    gpsSignal: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    gpsText: {
        color: COLORS.primary,
        fontSize: 12,
        fontFamily: FONTS.bold,
    },
});
