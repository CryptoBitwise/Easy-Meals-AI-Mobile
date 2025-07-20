import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    RefreshControl,
    Animated,
    Image,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import preferencesService from '../services/preferencesService';
import recipeService from '../services/recipeService';
import { Recipe } from '../services/recipeService';

export default function HomeScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [userPreferences, setUserPreferences] = useState<any>(null);
    const [skillBasedRecipes, setSkillBasedRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        // Simulate loading on mount
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }, 1000);
    }, []);

    useEffect(() => {
        loadUserData();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Reload profile image when screen comes into focus
            loadProfileImage();
        });

        return unsubscribe;
    }, [navigation]);

    const loadProfileImage = async () => {
        try {
            const savedImage = await AsyncStorage.getItem('profile_image');
            if (savedImage) {
                setProfileImage(savedImage);
            } else {
                setProfileImage(null);
            }
        } catch (error) {
            console.log('Error loading profile image:', error);
        }
    };

    const loadUserData = async () => {
        try {
            const prefs = preferencesService.getPreferences();
            setUserPreferences(prefs);

            // Load profile image
            const savedImage = await AsyncStorage.getItem('profile_image');
            if (savedImage) {
                setProfileImage(savedImage);
            }

            // Load skill-based recommendations
            await loadSkillBasedRecipes(prefs.cookingSkill);
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSkillBasedRecipes = async (skillLevel: string) => {
        try {
            // Get recipes and filter by skill level
            const allRecipes = await recipeService.fetchAllRecipes();

            // Filter recipes based on cooking skill
            const filteredRecipes = allRecipes.slice(0, 6); // Limit to 6 for performance

            setSkillBasedRecipes(filteredRecipes);
        } catch (error) {
            console.error('Error loading skill-based recipes:', error);
        }
    };

    const getSkillLevelDescription = (skillLevel: string) => {
        switch (skillLevel) {
            case 'Beginner':
                return 'Simple recipes perfect for getting started';
            case 'Intermediate':
                return 'Balanced recipes with moderate complexity';
            case 'Advanced':
                return 'Challenging recipes for experienced cooks';
            case 'Expert':
                return 'Complex recipes for culinary masters';
            default:
                return 'Recipes tailored to your skill level';
        }
    };

    const getSkillLevelIcon = (skillLevel: string) => {
        switch (skillLevel) {
            case 'Beginner':
                return 'school-outline';
            case 'Intermediate':
                return 'fitness-outline';
            case 'Advanced':
                return 'trophy-outline';
            case 'Expert':
                return 'star-outline';
            default:
                return 'restaurant-outline';
        }
    };

    const getCookingTips = (skillLevel: string) => {
        const tips = {
            Beginner: [
                'Always read the recipe completely before starting',
                'Keep your workspace clean and organized',
                'Use a timer to avoid overcooking',
                'Taste as you cook to adjust seasoning',
                'Start with simple recipes and build confidence'
            ],
            Intermediate: [
                'Experiment with ingredient substitutions',
                'Learn to balance flavors (sweet, sour, salty, bitter)',
                'Practice knife skills for faster prep',
                'Understand cooking temperatures and timing',
                'Try new cooking techniques regularly'
            ],
            Advanced: [
                'Master complex flavor combinations',
                'Perfect your plating and presentation',
                'Experiment with advanced cooking methods',
                'Create your own recipe variations',
                'Teach others to improve your skills'
            ],
            Expert: [
                'Develop your own signature dishes',
                'Master multiple cuisines and techniques',
                'Experiment with molecular gastronomy',
                'Create restaurant-quality presentations',
                'Innovate and create new recipes'
            ]
        };
        return tips[skillLevel as keyof typeof tips] || tips.Intermediate;
    };

    const renderCookingTips = () => {
        if (!userPreferences?.cookingSkill) {
            return null;
        }

        const tips = getCookingTips(userPreferences.cookingSkill);

        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons name="bulb-outline" size={20} color={theme.primary} />
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Cooking Tips for {userPreferences.cookingSkill}s
                        </Text>
                    </View>
                </View>
                <View style={[styles.tipsContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    {tips.slice(0, 3).map((tip, index) => (
                        <View key={index} style={styles.tipItem}>
                            <Ionicons name="checkmark-circle-outline" size={16} color={theme.primary} />
                            <Text style={[styles.tipText, { color: theme.text }]}>{tip}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const renderSkillBasedSection = () => {
        if (!userPreferences?.cookingSkill || skillBasedRecipes.length === 0) {
            return null;
        }

        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons
                            name={getSkillLevelIcon(userPreferences.cookingSkill) as any}
                            size={20}
                            color={theme.primary}
                        />
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            For {userPreferences.cookingSkill} Cooks
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                        <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                    {getSkillLevelDescription(userPreferences.cookingSkill)}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipeScroll}>
                    {skillBasedRecipes.map((recipe, index) => (
                        <TouchableOpacity
                            key={recipe.id || index}
                            style={[styles.recipeCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => navigation.navigate('RecipeDetail', { recipe })}
                        >
                            {recipe.image ? (
                                <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                            ) : (
                                <View style={[styles.recipeImagePlaceholder, { backgroundColor: theme.background }]}>
                                    <Ionicons name="restaurant-outline" size={24} color={theme.textSecondary} />
                                </View>
                            )}
                            <View style={styles.recipeInfo}>
                                <Text style={[styles.recipeTitle, { color: theme.text }]} numberOfLines={2}>
                                    {recipe.title}
                                </Text>
                                <Text style={[styles.recipeCuisine, { color: theme.textSecondary }]}>
                                    {recipe.cuisine}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };

    const onRefresh = async () => {
        setRefreshing(true);
        // Simulate refresh
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <ScrollView
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.primary}
                            colors={[theme.primary]}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>EasyMeal AI</Text>
                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => navigation.navigate('Profile')}
                            activeOpacity={0.7}
                        >
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={styles.profileImage} />
                            ) : (
                                <Ionicons name="person-circle-outline" size={24} color={theme.text} />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* AI Chat - Prominent Feature */}
                    <View style={styles.aiChatSection}>
                        <TouchableOpacity
                            style={[styles.aiChatCard, { backgroundColor: theme.primary, shadowColor: theme.shadow }]}
                            onPress={() => navigation.navigate('AIChat')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.aiChatContent}>
                                <Ionicons name="chatbubble-ellipses" size={32} color="#fff" />
                                <View style={styles.aiChatText}>
                                    <Text style={styles.aiChatTitle}>Chat with Clara</Text>
                                    <Text style={styles.aiChatSubtitle}>Get recipe ideas, meal plans & cooking tips</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#fff" />
                        </TouchableOpacity>

                    </View>

                    {/* Quick Actions */}
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={[styles.actionCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}
                            onPress={() => navigation.navigate('Search')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="search-outline" size={32} color="#4CAF50" />
                            <Text style={[styles.actionText, { color: theme.text }]}>Search Recipes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}
                            onPress={() => navigation.navigate('MealPlan')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="calendar-outline" size={32} color="#2196F3" />
                            <Text style={[styles.actionText, { color: theme.text }]}>Meal Plan</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}
                            onPress={() => navigation.navigate('ShoppingList')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="list-outline" size={32} color="#FF9800" />
                            <Text style={[styles.actionText, { color: theme.text }]}>Shopping List</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}
                            onPress={() => navigation.navigate('Categories')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="grid-outline" size={32} color="#9C27B0" />
                            <Text style={[styles.actionText, { color: theme.text }]}>Categories</Text>
                        </TouchableOpacity>

                    </View>

                    {/* Favorites Card */}
                    <TouchableOpacity
                        style={[styles.favoritesCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={() => navigation.navigate('Favorites')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.favoritesContent}>
                            <Ionicons name="heart" size={32} color={theme.primary} />
                            <View style={styles.favoritesText}>
                                <Text style={[styles.favoritesTitle, { color: theme.text }]}>My Favorites</Text>
                                <Text style={[styles.favoritesSubtitle, { color: theme.textSecondary }]}>View your saved recipes</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
                        </View>
                    </TouchableOpacity>

                    {/* Modern Card for AI Recommendations */}
                    <TouchableOpacity
                        style={[styles.aiCard, { backgroundColor: theme.primary }]}
                        onPress={() => navigation.navigate('AIRecommendations')}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.aiCardText, { color: '#fff' }]}>🍽️ Recommended for You</Text>
                        <Text style={[styles.aiCardSub, { color: '#fff' }]}>Personalized AI recipe picks</Text>
                    </TouchableOpacity>

                    {renderCookingTips()}
                    {renderSkillBasedSection()}
                </ScrollView>
            </Animated.View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileButton: {
        padding: 8,
    },
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 20,
        justifyContent: 'space-between',
    },
    actionCard: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    actionText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    section: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '600',
    },
    sectionSubtitle: {
        fontSize: 16,
        marginBottom: 15,
    },
    recipeScroll: {
        marginTop: 10,
    },
    recipeCard: {
        width: 180,
        height: 220,
        borderRadius: 16,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    recipeImage: {
        width: '100%',
        height: '70%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    recipeImagePlaceholder: {
        width: '100%',
        height: '70%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipeInfo: {
        padding: 10,
    },
    recipeTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    recipeCuisine: {
        fontSize: 14,
    },
    aiChatSection: {
        padding: 20,
    },
    aiChatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    aiChatContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    aiChatText: {
        marginLeft: 15,
        flex: 1,
    },
    aiChatTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    aiChatSubtitle: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.9,
    },
    aiCard: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        marginHorizontal: 20,
    },
    aiCardText: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    aiCardSub: {
        fontSize: 14,
        marginTop: 4,
        opacity: 0.85,
    },
    favoritesCard: {
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 20,
        padding: 16,
        marginHorizontal: 20,
    },
    favoritesContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    favoritesText: {
        flex: 1,
        marginLeft: 16,
    },
    favoritesTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    favoritesSubtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    categoriesCard: {
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 20,
        padding: 16,
        marginHorizontal: 20,
    },
    categoriesContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoriesText: {
        flex: 1,
        marginLeft: 16,
    },
    categoriesTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    categoriesSubtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    tipsContainer: {
        borderRadius: 16,
        padding: 16,
        marginTop: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    tipText: {
        marginLeft: 10,
        fontSize: 14,
        lineHeight: 20,
    },
    helpIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'transparent',
    },
}); 