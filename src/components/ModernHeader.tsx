import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface ModernHeaderProps {
    title: string;
    onBack?: () => void;
    rightAction?: {
        icon: string;
        onPress: () => void;
    };
    showGradient?: boolean;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({
    title,
    onBack,
    rightAction,
    showGradient = false,
}) => {
    const { theme } = useTheme();

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: showGradient ? theme.surface + '80' : theme.surface,
                borderBottomColor: theme.border,
            }
        ]}>
            <View style={styles.content}>
                {onBack && (
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: theme.surfaceVariant }]}
                        onPress={onBack}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chevron-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                )}

                <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                </View>

                {rightAction && (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.surfaceVariant }]}
                        onPress={rightAction.onPress}
                        activeOpacity={0.7}
                    >
                        <Ionicons name={rightAction.icon as any} size={24} color={theme.text} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        paddingTop: 10,
        paddingBottom: 15,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default ModernHeader; 