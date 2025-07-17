import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Animated, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getAIRecipeRecommendations } from '../services/aiService';
import recipeService, { Recipe } from '../services/recipeService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Ionicons } from '@expo/vector-icons';


interface Recommendation extends Recipe {
    liked: boolean;
    saved: boolean;
    why?: string;
}

interface Props {
    navigation: any;
}

const AIRecommendationsScreen: React.FC<Props> = ({ navigation }) => {
    const { theme } = useTheme();
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [likeAnims] = useState(new Map<string, Animated.Value>());
    const [saveAnims] = useState(new Map<string, Animated.Value>());

    useEffect(() => {
        loadRecommendations();
    }, []);

    const loadRecommendations = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get AI recommendations from aiService
            const aiRecs = await getAIRecipeRecommendations();

            // Fetch real recipe details for each recommendation
            const realRecipes = await Promise.all(
                aiRecs.map(async (rec: any) => {
                    try {
                        const detailedRecipe = await recipeService.getRecipeById(rec.id);
                        if (detailedRecipe) {
                            return {
                                ...detailedRecipe,
                                liked: false,
                                saved: false,
                                why: rec.why || 'Recommended based on your preferences',
                            };
                        }
                        return null;
                    } catch (e) {
                        console.log(`Error fetching recipe ${rec.id}:`, e);
                        return null;
                    }
                })
            );

            // Filter out null results and initialize animations
            const validRecipes = realRecipes.filter(recipe => recipe !== null);

            validRecipes.forEach(rec => {
                if (!likeAnims.has(rec.id)) {
                    likeAnims.set(rec.id, new Animated.Value(1));
                    saveAnims.set(rec.id, new Animated.Value(1));
                }
            });

            setRecommendations(validRecipes);
        } catch (e) {
            console.error('Error loading recommendations:', e);
            setError('Failed to load recommendations');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = (id: string) => {
        setRecommendations(prev =>
            prev.map(rec =>
                rec.id === id ? { ...rec, liked: !rec.liked } : rec
            )
        );

        // Animate like button
        const anim = likeAnims.get(id);
        if (anim) {
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: 0.8,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    const handleSave = (id: string) => {
        setRecommendations(prev =>
            prev.map(rec =>
                rec.id === id ? { ...rec, saved: !rec.saved } : rec
            )
        );

        // Animate save button
        const anim = saveAnims.get(id);
        if (anim) {
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: 0.8,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    const handleRefresh = async () => {
        await loadRecommendations();
    };

    const renderItem = ({ item, index }: { item: Recommendation; index: number }) => (
        <Animated.View style={[
            styles.recommendationCard,
            { backgroundColor: theme.surface, shadowColor: theme.shadow },
            { transform: [{ scale: likeAnims.get(item.id) || new Animated.Value(1) }] }
        ]}>
            <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                    <Text style={[styles.recommendationNumber, { color: theme.primary }]}>
                        #{index + 1}
                    </Text>
                    <Text style={[styles.recommendationTitle, { color: theme.text }]}>
                        {item.title}
                    </Text>
                </View>
                <View style={styles.cardHeaderRight}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleLike(item.id)}
                    >
                        <Animated.View style={{ transform: [{ scale: likeAnims.get(item.id) || new Animated.Value(1) }] }}>
                            <Ionicons
                                name={item.liked ? "heart" : "heart-outline"}
                                size={20}
                                color={item.liked ? '#E91E63' : theme.textSecondary}
                            />
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleSave(item.id)}
                    >
                        <Animated.View style={{ transform: [{ scale: saveAnims.get(item.id) || new Animated.Value(1) }] }}>
                            <Ionicons
                                name={item.saved ? "bookmark" : "bookmark-outline"}
                                size={20}
                                color={item.saved ? theme.primary : theme.textSecondary}
                            />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.cardContent}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.recommendationImage} />
                ) : (
                    <View style={[styles.imagePlaceholder, { backgroundColor: theme.background }]}>
                        <Ionicons name="restaurant-outline" size={32} color={theme.textSecondary} />
                    </View>
                )}

                <View style={styles.recommendationInfo}>
                    {item.description && (
                        <Text style={[styles.recommendationDescription, { color: theme.textSecondary }]} numberOfLines={3}>
                            {item.description}
                        </Text>
                    )}

                    <View style={styles.recommendationMeta}>
                        {item.cuisine && (
                            <View style={styles.metaItem}>
                                <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
                                <Text style={[styles.metaText, { color: theme.textSecondary }]}>{item.cuisine}</Text>
                            </View>
                        )}
                        {item.tags && item.tags.length > 0 && (
                            <View style={styles.metaItem}>
                                <Ionicons name="pricetag-outline" size={14} color={theme.textSecondary} />
                                <Text style={[styles.metaText, { color: theme.textSecondary }]}>{item.tags[0]}</Text>
                            </View>
                        )}
                    </View>

                    {item.why && (
                        <View style={[styles.whyContainer, { backgroundColor: theme.primary + '10' }]}>
                            <Ionicons name="bulb-outline" size={16} color={theme.primary} />
                            <Text style={[styles.whyText, { color: theme.primary }]}>{item.why}</Text>
                        </View>
                    )}
                </View>
            </View>

            <TouchableOpacity
                style={[styles.viewRecipeButton, { borderColor: theme.primary }]}
                onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
            >
                <Text style={[styles.viewRecipeText, { color: theme.primary }]}>View Recipe</Text>
                <Ionicons name="chevron-forward" size={16} color={theme.primary} />
            </TouchableOpacity>
        </Animated.View>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <LoadingSpinner fullScreen />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <EmptyState
                    icon="alert-circle-outline"
                    title="Error Loading Recommendations"
                    subtitle={error}
                    actionText="Try Again"
                    onAction={handleRefresh}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>AI Recommendations</Text>
                <TouchableOpacity onPress={handleRefresh}>
                    <Ionicons name="refresh" size={24} color={theme.primary} />
                </TouchableOpacity>
            </View>

            {recommendations.length === 0 ? (
                <EmptyState
                    icon="bulb-outline"
                    title="No Recommendations Yet"
                    subtitle="AI is learning your preferences. Try searching for recipes to get personalized recommendations!"
                    actionText="Explore Recipes"
                    onAction={() => navigation.navigate('Search')}
                />
            ) : (
                <FlatList
                    data={recommendations}
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
        paddingTop: 48,
        paddingHorizontal: 16,
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    listContainer: {
        paddingBottom: 32,
        paddingTop: 8,
    },
    recommendationCard: {
        borderRadius: 16,
        marginBottom: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingBottom: 12,
    },
    cardHeaderLeft: {
        flex: 1,
    },
    recommendationNumber: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    recommendationTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    cardHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 8,
        marginLeft: 8,
    },
    cardContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    recommendationImage: {
        width: '100%',
        height: 160,
        borderRadius: 12,
        marginBottom: 12,
    },
    imagePlaceholder: {
        width: '100%',
        height: 160,
        borderRadius: 12,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recommendationInfo: {
        marginBottom: 12,
    },
    recommendationDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    recommendationMeta: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    metaText: {
        fontSize: 12,
        marginLeft: 4,
    },
    whyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
    },
    whyText: {
        fontSize: 12,
        marginLeft: 6,
        fontStyle: 'italic',
    },
    viewRecipeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        marginHorizontal: 16,
    },
    viewRecipeText: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
    },
});

export default AIRecommendationsScreen; 