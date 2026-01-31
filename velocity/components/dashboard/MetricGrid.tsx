import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart, Timer, Clock, Flame } from 'lucide-react-native';
import { COLORS, FONTS } from '../../constants/theme';

interface MetricGridProps {
    pace: string;
    time: string;
    calories: number;
}

export default function MetricGrid({ pace, time, calories }: MetricGridProps) {
    return (
        <View style={styles.grid}>
            <View style={styles.gridItem}>
                <View style={styles.iconLabel}>
                    <Timer size={20} color={COLORS.textDim} />
                    <Text style={styles.gridLabel}>AVG PACE</Text>
                </View>
                <Text style={styles.gridValue}>{pace}</Text>
                <Text style={styles.unit}>/km</Text>
            </View>

            <View style={[styles.gridItem, styles.gridItemRight]}>
                <View style={styles.iconLabel}>
                    <Clock size={20} color={COLORS.textDim} />
                    <Text style={styles.gridLabel}>TIME</Text>
                </View>
                <Text style={styles.gridValue}>{time}</Text>
            </View>

            <View style={styles.gridItem}>
                <View style={styles.iconLabel}>
                    <Flame size={20} color={COLORS.textDim} />
                    <Text style={styles.gridLabel}>CALORIES</Text>
                </View>
                <Text style={styles.gridValue}>{calories}</Text>
                <Text style={styles.unit}>KCAL</Text>
            </View>

            {/* Empty fourth slot */}
            <View style={[styles.gridItem, styles.gridItemRight]} />
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 40,
    },
    gridItem: {
        width: '50%',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    gridItemRight: {
        paddingLeft: 20,
        borderLeftWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    iconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4
    },
    gridLabel: {
        color: COLORS.textDim,
        fontSize: 12,
        fontFamily: FONTS.medium,
        letterSpacing: 1,
    },
    gridValue: {
        color: COLORS.text,
        fontSize: 42,
        fontFamily: FONTS.extraBold,
        letterSpacing: -1,
    },
    unit: {
        color: COLORS.textDim,
        fontSize: 14,
        fontFamily: FONTS.medium,
    },
});
