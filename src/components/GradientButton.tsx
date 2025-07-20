import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'surface';
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    pill?: boolean;
    ripple?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({
    title,
    onPress,
    icon,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    style,
    textStyle,
    pill = false,
    ripple = false,
}) => {
    const { theme } = useTheme();
    const [scaleAnim] = useState(new Animated.Value(1));

    const getGradientColors = (): string[] => {
        switch (variant) {
            case 'primary':
                return theme.gradient.primary;
            case 'secondary':
                return theme.gradient.secondary;
            case 'surface':
                return theme.gradient.surface;
            default:
                return theme.gradient.primary;
        }
    };

    const getButtonStyle = () => {
        const baseStyle = [styles.button, styles[size]];

        if (disabled) {
            return [...baseStyle, { opacity: 0.5 }];
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        const baseTextStyle = [styles.text, styles[`${size}Text`]];
        return [...baseTextStyle, textStyle];
    };

    const handlePressIn = () => {
        if (ripple && !disabled) {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 0.95,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    const handlePressOut = () => {
        if (ripple && !disabled) {
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                style={[
                    getButtonStyle(),
                    pill && styles.pill,
                    style
                ]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                activeOpacity={ripple ? 1 : 0.8}
            >
                <LinearGradient
                    colors={getGradientColors() as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    {icon && (
                        <Ionicons
                            name={icon as any}
                            size={size === 'xlarge' ? 24 : size === 'large' ? 20 : size === 'medium' ? 18 : 16}
                            color="#fff"
                            style={styles.icon}
                        />
                    )}
                    <Text style={getTextStyle()}>{title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    pill: {
        borderRadius: 50,
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    icon: {
        marginRight: 8,
    },
    text: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
    // Size variants
    small: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    medium: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    large: {
        paddingVertical: 18,
        paddingHorizontal: 24,
    },
    xlarge: {
        paddingVertical: 22,
        paddingHorizontal: 32,
    },
    smallText: {
        fontSize: 14,
    },
    mediumText: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 18,
    },
    xlargeText: {
        fontSize: 20,
    },
});

export default GradientButton; 