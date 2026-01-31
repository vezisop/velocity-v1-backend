import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS, interpolate, Extrapolation } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Navigation } from 'lucide-react-native';
import { COLORS, FONTS, GRADIENTS, SIZES } from '../../constants/theme';

const SLIDER_WIDTH = SIZES.width - 40;
const SLIDER_HEIGHT = 70;
const KNOB_WIDTH = 60;
const MAX_RANGE = SLIDER_WIDTH - KNOB_WIDTH;

interface SlideToFinishProps {
    onFinish: () => void;
}

export default function SlideToFinish({ onFinish }: SlideToFinishProps) {
    const translateX = useSharedValue(0);
    const context = useSharedValue(0);

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = translateX.value;
        })
        .onUpdate((event) => {
            translateX.value = Math.min(Math.max(context.value + event.translationX, 0), MAX_RANGE);
        })
        .onEnd(() => {
            if (translateX.value > MAX_RANGE * 0.8) {
                translateX.value = withTiming(MAX_RANGE, {}, () => {
                    runOnJS(onFinish)();
                });
            } else {
                translateX.value = withSpring(0);
            }
        });

    const animatedKnobStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const animatedTextStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, MAX_RANGE / 2], [1, 0], Extrapolation.CLAMP),
    }));

    const animatedOverlayStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, MAX_RANGE], [0, 1]),
    }));

    // Reset slider exposedHandle or just internal logic
    // For now we assume if it finishes, the parent handles the state change (unmounting or navigating)

    return (
        <View style={styles.footer}>
            <View style={styles.sliderContainer}>
                <Animated.View style={[styles.sliderTextContainer, animatedTextStyle]}>
                    <Text style={styles.sliderText}>Slide to Finish</Text>
                    <View style={styles.chevrons}>
                        <Text style={[styles.chevron, { opacity: 0.5 }]}>{'>'}</Text>
                        <Text style={[styles.chevron, { opacity: 0.75 }]}>{'>'}</Text>
                        <Text style={styles.chevron}>{'>'}</Text>
                    </View>
                </Animated.View>

                {/* We need GestureHandlerRootView if this component is used in isolation, but usually it's in the app root. 
                    However, let's wrap just the detector to be safe or rely on parent. 
                    Actually, it's safer to rely on parent being wrapped, but let's check ActiveDashboard. 
                    ActiveDashboard wraps everything in GestureHandlerRootView. So we are good.
                */}
                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.sliderKnob, animatedKnobStyle]}>
                        <LinearGradient
                            colors={GRADIENTS.primary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.knobGradient}
                        >
                            <Navigation size={24} color={COLORS.background} fill={COLORS.background} style={{ transform: [{ rotate: '90deg' }] }} />
                        </LinearGradient>
                    </Animated.View>
                </GestureDetector>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        marginBottom: 20,
    },
    sliderContainer: {
        width: SLIDER_WIDTH,
        height: SLIDER_HEIGHT,
        backgroundColor: COLORS.card,
        borderRadius: SLIDER_HEIGHT / 2,
        justifyContent: 'center',
        padding: 5,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    sliderTextContainer: {
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    sliderText: {
        color: COLORS.text,
        fontSize: 16, // Assuming from ActiveDashboard
        fontFamily: FONTS.bold,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    chevrons: {
        flexDirection: 'row',
    },
    chevron: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
    sliderKnob: {
        width: KNOB_WIDTH,
        height: KNOB_WIDTH,
        borderRadius: KNOB_WIDTH / 2,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    knobGradient: {
        flex: 1,
        borderRadius: KNOB_WIDTH / 2,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
