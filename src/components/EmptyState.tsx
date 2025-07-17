import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface EmptyStateProps {
    icon: string;
    title: string;
    subtitle: string;
    actionText?: string;
    onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    subtitle,
    actionText,
    onAction,
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.surface }]}>
                <Ionicons name={icon as any} size={48} color={theme.primary} />
            </View>

            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {subtitle}
            </Text>

            {actionText && onAction && (
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.primary }]}
                    onPress={onAction}
                >
                    <Text style={styles.actionText}>{actionText}</Text>
                </TouchableOpacity>
            )}
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
        marginBottom: 32,
    },
    actionButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    actionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default EmptyState; 