import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(({
    size = 'large',
    message = 'Loading...'
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ActivityIndicator size={size} color={theme.primary} />
            {message && (
                <View style={styles.messageContainer}>
                    <Text style={[styles.message, { color: theme.textSecondary }]}>
                        {message}
                    </Text>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageContainer: {
        marginTop: 16,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
    },
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner; 