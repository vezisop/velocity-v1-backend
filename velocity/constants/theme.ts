import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
    background: '#0F172A', // Deep charcoal/midnight blue
    primary: '#C4F135', // Electric Lime
    secondary: '#2DD4BF', // Teal
    text: '#FFFFFF',
    textDim: '#94A3B8',
    card: '#1E293B',
    success: '#22C55E',
    danger: '#EF4444',
    overlay: 'rgba(15, 23, 42, 0.8)',
};

export const GRADIENTS = {
    primary: ['#C4F135', '#2DD4BF'] as const, // Electric Lime to Teal
    background: ['#0F172A', '#020617'] as const,
};

export const FONTS = {
    // Assuming Inter is loaded
    bold: 'Inter_700Bold',
    extraBold: 'Inter_800ExtraBold',
    black: 'Inter_900Black',
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
};

export const SIZES = {
    width,
    height,
    padding: 20,
    base: 16,
    radius: 12,
};
