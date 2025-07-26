import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import recipeService, { Category } from '../services/recipeService';

const CategoriesScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedCategories = await recipeService.fetchCategories();
            setCategories(fetchedCategories);
        } catch (err) {
            setError('Failed to load categories');
            console.error('Error loading categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderCategory = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={[styles.categoryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => navigation.navigate('CategoryRecipes', { category: item })}
            accessibilityLabel={`${item.title} category with ${item.recipeCount} recipes`}
        >
            <View style={styles.categoryContent}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                    <Ionicons name={item.icon as any} size={24} color={theme.primary} />
                </View>
                <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryTitle, { color: theme.text }]}>{item.title}</Text>
                    <Text style={[styles.recipeCount, { color: theme.textSecondary }]}>
                        {item.recipeCount} recipes
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </View>
        </TouchableOpacity>
    );

    const renderSection = (title: string, data: Category[]) => (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.primary }]}>{title}</Text>
            {data.map((item) => (
                <View key={item.id}>
                    {renderCategory({ item })}
                </View>
            ))}
        </View>
    );

    const cuisineCategories = categories.filter(c => c.type === 'cuisine');
    const dietaryCategories = categories.filter(c => c.type === 'dietary');

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                {/* Header with back arrow */}
                <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        accessibilityLabel="Go back"
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Recipe Categories</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading categories...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                {/* Header with back arrow */}
                <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        accessibilityLabel="Go back"
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Recipe Categories</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.errorContainer}>
                    <Ionicons name="cloud-offline-outline" size={48} color={theme.textSecondary} />
                    <Text style={[styles.errorText, { color: theme.text }]}>{error}</Text>
                    <TouchableOpacity
                        style={[styles.retryButton, { backgroundColor: theme.primary }]}
                        onPress={loadCategories}
                    >
                        <Text style={[styles.retryButtonText, { color: '#fff' }]}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header with back arrow */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Recipe Categories</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={[]}
                renderItem={() => null}
                ListHeaderComponent={() => (
                    <View>
                        {cuisineCategories.length > 0 && renderSection('Cuisine Types', cuisineCategories)}
                        {dietaryCategories.length > 0 && renderSection('Dietary Preferences', dietaryCategories)}
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10, // Extra padding for status bar
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        paddingTop: 50, // Extra padding for camera lens/notch
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 8, // Larger touch target
        marginLeft: -8, // Compensate for padding
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
    },
    categoryCard: {
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 8,
        padding: 16,
    },
    categoryContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    recipeCount: {
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CategoriesScreen; 