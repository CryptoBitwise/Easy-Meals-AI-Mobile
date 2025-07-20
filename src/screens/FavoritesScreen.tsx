import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import recipeService, { Recipe } from '../services/recipeService';

interface FavoriteRecipe extends Recipe {  // Extended with any additional fields we might need
}

const FavoritesScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRecipes, setLoadingRecipes] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            const saved = await AsyncStorage.getItem('favorite_recipes');
            if (saved) {
                const savedFavorites = JSON.parse(saved);

                // Fetch detailed recipe data for each favorite
                const detailedFavorites = await Promise.all(
                    savedFavorites.map(async (fav: any) => {
                        try {
                            const detailedRecipe = await recipeService.getRecipeById(fav.id);
                            return detailedRecipe || fav; // Fallback to saved data if API fails
                        } catch (e) {
                            console.log(`Error fetching recipe ${fav.id}:`, e);
                            return fav; // Use saved data as fallback
                        }
                    })
                );

                setFavorites(detailedFavorites);
            }
        } catch (e) {
            console.log('Error loading favorites:', e);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (recipeId: string) => {
        Alert.alert(
            'Remove from Favorites',
            'Are you sure you want to remove this recipe from your favorites?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        const updatedFavorites = favorites.filter(fav => fav.id !== recipeId);
                        setFavorites(updatedFavorites);
                        try {
                            await AsyncStorage.setItem('favorite_recipes', JSON.stringify(updatedFavorites));
                        } catch (e) {
                            console.log('Error saving favorites:', e);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: FavoriteRecipe }) => (
        <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: theme.background }]}>
                    <Ionicons name="restaurant-outline" size={48} color={theme.textSecondary} />
                </View>
            )}
            <View style={styles.cardContent}>
                <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                <View style={styles.details}>
                    {item.cuisine && (
                        <Text style={[styles.detail, { color: theme.textSecondary }]}>{item.cuisine}</Text>
                    )}
                    {item.tags && item.tags.length > 0 && (
                        <Text style={[styles.detail, { color: theme.textSecondary }]}>{item.tags[0]}</Text>
                    )}
                </View>
                {item.description && (
                    <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
                        {item.description}
                    </Text>
                )}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.viewBtn, { backgroundColor: theme.primary }]}
                        onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
                        activeOpacity={0.8}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>View Recipe</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.removeBtn, { borderColor: theme.border }]}
                        onPress={() => removeFavorite(item.id)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="heart-dislike-outline" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <LoadingSpinner />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>My Favorites</Text>
                <View style={{ width: 24 }} />
            </View>

            {favorites.length === 0 ? (
                <EmptyState
                    icon="heart-outline"
                    title="No Favorites Yet"
                    message="Start exploring recipes and add your favorites here! You'll find all your saved recipes in this section."
                    actionText="Explore Recipes"
                    onAction={() => navigation.navigate('Search')}
                />
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    card: {
        borderRadius: 16,
        marginBottom: 20,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 180,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    imagePlaceholder: {
        width: '100%',
        height: 180,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    details: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detail: {
        fontSize: 14,
        marginRight: 16,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    viewBtn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },
    removeBtn: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 32,
    },
});

export default FavoritesScreen; 