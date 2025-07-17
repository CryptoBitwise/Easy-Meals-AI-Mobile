import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    color,
    fullScreen = false
}) => {
    const { theme } = useTheme();
    const spinnerColor = color || theme.primary;

    if (fullScreen) {
        return (
            <View style={[styles.fullScreen, { backgroundColor: theme.background }]}>
                <ActivityIndicator size={size} color={spinnerColor} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={spinnerColor} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LoadingSpinner; 