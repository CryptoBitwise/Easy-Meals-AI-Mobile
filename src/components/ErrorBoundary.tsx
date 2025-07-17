import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} />;
        }

        return this.props.children;
    }
}

const ErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
    const { theme } = useTheme();

    const handleRetry = () => {
        // Reload the app or navigate to a safe screen
        window.location.reload();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.surface }]}>
                <Ionicons name="warning" size={48} color="#E91E63" />
            </View>

            <Text style={[styles.title, { color: theme.text }]}>
                Oops! Something went wrong
            </Text>

            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                We're sorry, but something unexpected happened. Please try again.
            </Text>

            {error && (
                <Text style={[styles.errorText, { color: theme.textSecondary }]}>
                    {error.message}
                </Text>
            )}

            <TouchableOpacity
                style={[styles.retryButton, { backgroundColor: theme.primary }]}
                onPress={handleRetry}
            >
                <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 32,
        fontFamily: 'monospace',
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ErrorBoundary; 