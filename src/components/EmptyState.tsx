import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface EmptyStateProps {
    icon: string;
    title: string;
    message: string;
    actionText?: string;
    onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = React.memo(({
    icon,
    title,
    message,
    actionText,
    onAction
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.surface }]}>
                <Ionicons name={icon as any} size={48} color={theme.primary} />
            </View>

            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>

            {actionText && onAction && (
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.primary }]}
                    onPress={onAction}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.actionText, { color: '#fff' }]}>{actionText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    actionButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 120,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

EmptyState.displayName = 'EmptyState';

export default EmptyState; 