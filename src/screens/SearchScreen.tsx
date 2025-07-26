import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    ScrollView,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import recipeService, { Recipe } from '../services/recipeService';

interface Filter {
    id: string;
    label: string;
    type: string;
    selected: boolean;
}

const filters: Filter[] = [
    // Cuisine filters
    { id: 'italian', label: 'Italian', type: 'cuisine', selected: false },
    { id: 'asian', label: 'Asian', type: 'cuisine', selected: false },
    { id: 'mediterranean', label: 'Mediterranean', type: 'cuisine', selected: false },
    { id: 'indian', label: 'Indian', type: 'cuisine', selected: false },

    // Dietary filters
    { id: 'vegetarian', label: 'Vegetarian', type: 'dietary', selected: false },
    { id: 'vegan', label: 'Vegan', type: 'dietary', selected: false },
    { id: 'gluten-free', label: 'Gluten-Free', type: 'dietary', selected: false },
    { id: 'high-protein', label: 'High Protein', type: 'dietary', selected: false },
    { id: 'low-carb', label: 'Low-Carb', type: 'dietary', selected: false },

    // Time filters
    { id: 'quick', label: 'Quick (< 30 min)', type: 'time', selected: false },
    { id: 'medium', label: 'Medium (30-60 min)', type: 'time', selected: false },

    // Difficulty filters
    { id: 'easy', label: 'Easy', type: 'difficulty', selected: false },
    { id: 'medium', label: 'Medium', type: 'difficulty', selected: false },
    { id: 'hard', label: 'Hard', type: 'difficulty', selected: false },
];

export default function SearchScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
    const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
    const [activeFilters, setActiveFilters] = useState<Filter[]>(filters);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);

    useEffect(() => {
        loadSearchHistory();
        loadFeaturedRecipes();
    }, []);

    const loadFeaturedRecipes = async () => {
        try {
            setIsLoadingFeatured(true);
            // Load a variety of popular recipes for discovery
            const recipes = await recipeService.fetchAllRecipes();
            // Shuffle and take first 12 for featured section
            const shuffled = recipes.sort(() => 0.5 - Math.random());
            setFeaturedRecipes(shuffled.slice(0, 12));
        } catch (error) {
            console.log('Error loading featured recipes:', error);
        } finally {
            setIsLoadingFeatured(false);
        }
    };

    const loadSearchHistory = async () => {
        try {
            const saved = await AsyncStorage.getItem('search_history');
            if (saved) {
                setSearchHistory(JSON.parse(saved));
            }
        } catch (e) {
            console.log('Error loading search history:', e);
        }
    };

    const saveSearchHistory = async (query: string) => {
        if (query.trim() === '') return;

        try {
            const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
            setSearchHistory(newHistory);
            await AsyncStorage.setItem('search_history', JSON.stringify(newHistory));
        } catch (e) {
            console.log('Error saving search history:', e);
        }
    };

    const handleSearch = async (text: string) => {
        setSearchQuery(text);
        setIsSearching(true);
        setIsLoading(true);
        try {
            if (text.trim() === '') {
                setFilteredRecipes([]);
            } else {
                const apiResults = await recipeService.searchRecipes(text);
                // Optionally filter by activeFilters here if needed
                setFilteredRecipes(apiResults);
                saveSearchHistory(text);
            }
        } catch (e) {
            setFilteredRecipes([]);
        } finally {
            setIsSearching(false);
            setIsLoading(false);
        }
    };

    const toggleFilter = (filterId: string) => {
        setActiveFilters(prev =>
            prev.map(filter =>
                filter.id === filterId
                    ? { ...filter, selected: !filter.selected }
                    : filter
            )
        );
    };

    const clearFilters = () => {
        setActiveFilters(prev => prev.map(filter => ({ ...filter, selected: false })));
    };

    const clearSearchHistory = async () => {
        try {
            setSearchHistory([]);
            await AsyncStorage.removeItem('search_history');
            Alert.alert('Success', 'Recent searches cleared!');
        } catch (error) {
            Alert.alert('Error', 'Failed to clear search history');
        }
    };

    const handleVoiceSearch = () => {
        Alert.alert('Voice Search', 'Voice search coming soon!');
    };

    const renderFilterChip = ({ item }: { item: Filter }) => (
        <TouchableOpacity
            style={[
                styles.filterChip,
                {
                    backgroundColor: item.selected ? theme.primary : theme.surface,
                    borderColor: theme.border,
                }
            ]}
            onPress={() => toggleFilter(item.id)}
            activeOpacity={0.7}
        >
            <Text style={[
                styles.filterChipText,
                { color: item.selected ? '#fff' : theme.text }
            ]}>
                {item.label}
            </Text>
        </TouchableOpacity>
    );

    const renderSearchHistory = () => (
        <View style={styles.historySection}>
            <Text style={[styles.historyTitle, { color: theme.text }]}>Recent Searches</Text>
            {searchHistory.map((query, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.historyItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    onPress={() => handleSearch(query)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
                    <Text style={[styles.historyText, { color: theme.text }]}>{query}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            style={[styles.recipeCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}
            onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
            activeOpacity={0.8}
        >
            {item.image ? (
                <Image
                    source={{ uri: item.image }}
                    style={styles.recipeImage}
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.recipeImagePlaceholder, { backgroundColor: theme.background }]}>
                    <Ionicons name="restaurant-outline" size={24} color={theme.textSecondary} />
                </View>
            )}
            <View style={styles.recipeInfo}>
                <Text style={[styles.recipeTitle, { color: theme.text }]}>{item.title}</Text>
                <View style={styles.recipeMeta}>
                    <Text style={[styles.recipeCuisine, { color: theme.textSecondary }]}>{item.cuisine}</Text>
                </View>
                {item.tags && (
                    <View style={styles.dietaryTags}>
                        {item.tags.map((tag, index) => (
                            <View key={tag + '-' + index} style={[styles.dietaryTag, { backgroundColor: theme.primary }]}>
                                <Text style={styles.dietaryTagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Explore Recipes</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={[styles.searchInput, {
                        color: theme.text,
                        borderColor: theme.border,
                        backgroundColor: theme.surface
                    }]}
                    placeholder="Search for recipes, ingredients, or cuisines..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholderTextColor={theme.textSecondary}
                />
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {searchQuery.trim() !== '' ? (
                    <View style={styles.resultsSection}>
                        <View style={styles.resultsHeader}>
                            <Text style={[styles.resultsTitle, { color: theme.text }]}>
                                {isSearching ? 'Searching...' : `Results (${filteredRecipes.length})`}
                            </Text>
                            {isSearching && <ActivityIndicator size="small" color={theme.primary} />}
                        </View>
                        {!isSearching && filteredRecipes.length === 0 ? (
                            <EmptyState
                                icon="search-outline"
                                title="No Recipes Found"
                                message="Try adjusting your search terms or filters to find more recipes."
                                actionText="Clear Search"
                                onAction={() => setSearchQuery('')}
                            />
                        ) : (
                            <FlatList
                                data={filteredRecipes}
                                renderItem={renderRecipeItem}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.recipeList}
                                scrollEnabled={false}
                            />
                        )}
                    </View>
                ) : (
                    <>
                        {/* Featured Recipes Section */}
                        <View style={styles.featuredSection}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                                Featured Recipes
                            </Text>
                            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                                Discover delicious recipes to try
                            </Text>

                            {isLoadingFeatured ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color={theme.primary} />
                                    <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                                        Loading recipes...
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.featuredGrid}>
                                    {featuredRecipes.map((recipe) => (
                                        <TouchableOpacity
                                            key={recipe.id}
                                            style={[styles.featuredCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}
                                            onPress={() => navigation.navigate('RecipeDetail', { id: recipe.id })}
                                            activeOpacity={0.8}
                                        >
                                            {recipe.image ? (
                                                <Image
                                                    source={{ uri: recipe.image }}
                                                    style={styles.featuredImage}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View style={[styles.featuredImagePlaceholder, { backgroundColor: theme.background }]}>
                                                    <Ionicons name="restaurant-outline" size={24} color={theme.textSecondary} />
                                                </View>
                                            )}
                                            <View style={styles.featuredInfo}>
                                                <Text style={[styles.featuredTitle, { color: theme.text }]} numberOfLines={2}>
                                                    {recipe.title}
                                                </Text>
                                                <Text style={[styles.featuredCuisine, { color: theme.textSecondary }]}>
                                                    {recipe.cuisine}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Search History Section */}
                        <View style={styles.historySection}>
                            <View style={styles.historyHeader}>
                                <Text style={[styles.historyTitle, { color: theme.text }]}>Recent Searches</Text>
                                {searchHistory.length > 0 && (
                                    <TouchableOpacity
                                        style={styles.clearButton}
                                        onPress={clearSearchHistory}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.clearButtonText, { color: theme.primary }]}>
                                            Clear
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            {searchHistory.length === 0 ? (
                                <Text style={[styles.emptyHistoryText, { color: theme.textSecondary }]}>
                                    No recent searches
                                </Text>
                            ) : (
                                searchHistory.map((query, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.historyItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                        onPress={() => handleSearch(query)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
                                        <Text style={[styles.historyText, { color: theme.text }]}>{query}</Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10, // Extra padding for status bar
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50, // Extra padding for camera lens/notch
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 8, // Larger touch target
        marginLeft: -8, // Compensate for padding
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchContainer: {
        padding: 20,
        paddingBottom: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    historySection: {
        marginTop: 20,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    historyText: {
        marginLeft: 8,
        fontSize: 16,
    },
    recipeList: {
        paddingBottom: 20,
    },
    recipeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    recipeImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    recipeImagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    recipeEmoji: {
        fontSize: 24,
    },
    recipeInfo: {
        flex: 1,
    },
    recipeTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    recipeMeta: {
        flexDirection: 'row',
    },
    recipeTime: {
        fontSize: 12,
        marginRight: 8,
    },
    recipeDifficulty: {
        fontSize: 12,
        marginRight: 8,
    },
    recipeCuisine: {
        fontSize: 12,
    },
    dietaryTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    dietaryTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 6,
    },
    dietaryTagText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    resultsSection: {
        flex: 1,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    clearButton: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    clearButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    voiceButton: {
        padding: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.8,
    },
    filtersSection: {
        marginBottom: 20,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        marginRight: 8,
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    featuredSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        marginBottom: 16,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    featuredGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featuredCard: {
        width: '48%',
        borderRadius: 12,
        marginBottom: 12,
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    featuredImage: {
        width: '100%',
        height: 120,
    },
    featuredImagePlaceholder: {
        width: '100%',
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featuredInfo: {
        padding: 12,
    },
    featuredTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        lineHeight: 18,
    },
    featuredCuisine: {
        fontSize: 12,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    emptyHistoryText: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 20,
    },
}); 