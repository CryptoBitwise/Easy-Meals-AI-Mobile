import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import recipeService, { Recipe } from '../services/recipeService';
import EmptyState from '../components/EmptyState';

interface RecipeDetail extends Recipe {
    ingredients?: string[];
    instructions?: string[];
    nutrition?: {
        calories?: number;
        protein?: string;
        carbs?: string;
        fat?: string;
    };
}

export default function RecipeDetailScreen({ route, navigation }: any) {
    const { theme } = useTheme();
    const { recipe, id } = route.params;
    const [recipeDetail, setRecipeDetail] = useState<RecipeDetail | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadRecipeDetail();
        checkFavoriteStatus();
    }, []);

    const loadRecipeDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            // If we have a recipe object, use it; otherwise fetch by ID
            if (recipe) {
                const detailedRecipe = await recipeService.getRecipeById(recipe.id);
                if (detailedRecipe) {
                    setRecipeDetail(detailedRecipe);
                } else {
                    setError('Recipe not found');
                }
            } else if (id) {
                const detailedRecipe = await recipeService.getRecipeById(id);
                if (detailedRecipe) {
                    setRecipeDetail(detailedRecipe);
                } else {
                    setError('Recipe not found');
                }
            } else {
                setError('No recipe information provided');
            }
        } catch (e) {
            setError('Failed to load recipe details');
        } finally {
            setLoading(false);
        }
    };

    const checkFavoriteStatus = async () => {
        try {
            const saved = await AsyncStorage.getItem('favorite_recipes');
            if (saved) {
                const favorites = JSON.parse(saved);
                const recipeId = recipe?.id || id;
                const isFav = favorites.some((fav: any) => fav.id === recipeId);
                setIsFavorite(isFav);
            }
        } catch (e) {
            console.log('Error checking favorite status:', e);
        }
    };

    const toggleFavorite = async () => {
        if (!recipeDetail) return;

        try {
            const saved = await AsyncStorage.getItem('favorite_recipes');
            let favorites = saved ? JSON.parse(saved) : [];

            if (isFavorite) {
                // Remove from favorites
                favorites = favorites.filter((fav: any) => fav.id !== recipeDetail.id);
            } else {
                // Add to favorites
                const newFavorite = {
                    id: recipeDetail.id,
                    title: recipeDetail.title,
                    image: recipeDetail.image,
                    cuisine: recipeDetail.cuisine,
                };
                favorites.push(newFavorite);
            }

            await AsyncStorage.setItem('favorite_recipes', JSON.stringify(favorites));
            setIsFavorite(!isFavorite);
        } catch (e) {
            console.log('Error updating favorites:', e);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={[styles.loadingText, { color: theme.text }]}>Loading recipe...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !recipeDetail) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <EmptyState
                    icon="alert-circle-outline"
                    title="Recipe Not Found"
                    message={error || "Could not load recipe details"}
                    actionText="Go Back"
                    onAction={() => navigation.goBack()}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        accessibilityLabel="Go back"
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Recipe</Text>
                    <TouchableOpacity onPress={toggleFavorite}>
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={isFavorite ? "#E91E63" : "#333"}
                        />
                    </TouchableOpacity>
                </View>

                {/* Recipe Image */}
                <View style={styles.imageContainer}>
                    {recipeDetail.image ? (
                        <Image source={{ uri: recipeDetail.image }} style={styles.recipeImage} />
                    ) : (
                        <View style={[styles.recipeImagePlaceholder, { backgroundColor: theme.surface }]}>
                            <Ionicons name="restaurant-outline" size={48} color={theme.textSecondary} />
                        </View>
                    )}
                </View>

                {/* Recipe Info */}
                <View style={styles.recipeInfo}>
                    <Text style={[styles.recipeTitle, { color: theme.text }]}>{recipeDetail.title}</Text>
                    <View style={styles.recipeMeta}>
                        {recipeDetail.cuisine && (
                            <View style={styles.metaItem}>
                                <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
                                <Text style={[styles.metaText, { color: theme.textSecondary }]}>{recipeDetail.cuisine}</Text>
                            </View>
                        )}
                        <View style={styles.metaItem}>
                            <Ionicons name="fitness-outline" size={16} color={theme.textSecondary} />
                            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                                {recipeDetail.difficulty || 'Intermediate'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                {recipeDetail.description && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
                        <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
                            {recipeDetail.description}
                        </Text>
                    </View>
                )}

                {/* Tags */}
                {recipeDetail.tags && recipeDetail.tags.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Tags</Text>
                        <View style={styles.tagsContainer}>
                            {recipeDetail.tags.map((tag, index) => (
                                <View key={`${tag}-${index}`} style={[styles.tag, { backgroundColor: theme.primary }]}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={[styles.addToListButton, { backgroundColor: theme.primary }]}>
                        <Ionicons name="list-outline" size={20} color="#fff" />
                        <Text style={styles.addToListText}>Add to Shopping List</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
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
    imageContainer: {
        alignItems: 'center',
        padding: 20,
    },
    recipeImage: {
        width: 200,
        height: 200,
        borderRadius: 12,
    },
    recipeImagePlaceholder: {
        width: 200,
        height: 200,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipeInfo: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    recipeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    recipeMeta: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    metaText: {
        marginLeft: 4,
        fontSize: 14,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    actionButtons: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    addToListButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    addToListText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
}); 