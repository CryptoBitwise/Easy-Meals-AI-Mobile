import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ModernCardProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'glass';
    style?: ViewStyle;
}

const ModernCard: React.FC<ModernCardProps> = ({
    children,
    variant = 'default',
    style,
}) => {
    const { theme } = useTheme();

    const getCardStyle = () => {
        const baseStyle = [styles.card, styles[variant]];

        switch (variant) {
            case 'elevated':
                return [
                    baseStyle,
                    {
                        backgroundColor: theme.surface,
                        shadowColor: theme.shadow,
                        borderColor: theme.border,
                    },
                    style,
                ];
            case 'glass':
                return [
                    baseStyle,
                    {
                        backgroundColor: theme.surface + '80', // 50% opacity
                        borderColor: theme.border + '40',
                    },
                    style,
                ];
            default:
                return [
                    baseStyle,
                    {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                    },
                    style,
                ];
        }
    };

    return <View style={getCardStyle()}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 20,
        marginVertical: 8,
    },
    default: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    elevated: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 12,
    },
    glass: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
});

export default ModernCard; 