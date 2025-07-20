import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import recipeService, { Recipe, Category } from '../services/recipeService';
import EmptyState from '../components/EmptyState';

const CategoryRecipesScreen = ({ route, navigation }: any) => {
    const { theme } = useTheme();
    const { category } = route.params;
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadRecipes();
    }, [category]);

    const loadRecipes = async () => {
        setLoading(true);
        setError(null);
        try {
            // Use the new API method to get recipes by category
            const results = await recipeService.getRecipesByCategory(category);
            setRecipes(results);
        } catch (e) {
            setError('Failed to load recipes');
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    const renderRecipe = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            style={[styles.recipeCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}
            onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
            accessibilityLabel={`${item.title} recipe`}
        >
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.recipeImage} />
            ) : (
                <View style={[styles.recipeImage, { backgroundColor: theme.background }]}>
                    <Ionicons name="restaurant-outline" size={32} color={theme.textSecondary} />
                </View>
            )}
            <View style={styles.recipeContent}>
                <Text style={[styles.recipeTitle, { color: theme.text }]}>{item.title}</Text>
                <View style={styles.recipeMeta}>
                    <View style={styles.metaItem}>
                        <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
                        <Text style={[styles.metaText, { color: theme.textSecondary }]}>{item.cuisine}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 100 }} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <EmptyState
                    icon="alert-circle-outline"
                    title="Error Loading Recipes"
                    message={error}
                    actionText="Try Again"
                    onAction={loadRecipes}
                />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>{category.title}</Text>
                <View style={{ width: 24 }} />
            </View>

            {recipes.length === 0 ? (
                <EmptyState
                    icon="restaurant-outline"
                    title="No Recipes Found"
                    message={`No recipes found for ${category.title}. Try searching for something else.`}
                    actionText="Go Back"
                    onAction={() => navigation.goBack()}
                />
            ) : (
                <FlatList
                    data={recipes}
                    renderItem={renderRecipe}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.recipeList}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 8, // Larger touch target
        marginLeft: -8, // Compensate for padding
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    recipeList: {
        padding: 20,
    },
    recipeCard: {
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 12,
        padding: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    recipeImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipeContent: {
        flex: 1,
        justifyContent: 'center',
    },
    recipeTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    recipeMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    metaText: {
        fontSize: 14,
        marginLeft: 4,
    },
});

export default CategoryRecipesScreen; 