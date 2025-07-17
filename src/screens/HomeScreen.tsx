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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomeScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

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

    const onRefresh = async () => {
        setRefreshing(true);
        // Simulate refresh
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen />;
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
                        <Text style={[styles.headerTitle, { color: theme.text }]}>EasyMeals AI</Text>
                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => navigation.navigate('Profile')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="person-circle-outline" size={24} color={theme.text} />
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
                                    <Text style={styles.aiChatTitle}>Chat with AI</Text>
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
                            onPress={() => navigation.navigate('Favorites')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="heart-outline" size={32} color="#E91E63" />
                            <Text style={[styles.actionText, { color: theme.text }]}>Favorites</Text>
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

                    {/* Categories Card */}
                    <TouchableOpacity
                        style={[styles.categoriesCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={() => navigation.navigate('Categories')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.categoriesContent}>
                            <Ionicons name="grid-outline" size={32} color={theme.primary} />
                            <View style={styles.categoriesText}>
                                <Text style={[styles.categoriesTitle, { color: theme.text }]}>Browse Categories</Text>
                                <Text style={[styles.categoriesSubtitle, { color: theme.textSecondary }]}>Find recipes by cuisine, diet & time</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
                        </View>
                    </TouchableOpacity>

                    {/* Today's Suggestions */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Suggestions</Text>
                        <View style={[styles.suggestionCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
                            <Text style={[styles.suggestionText, { color: theme.textSecondary }]}>
                                Try our AI-powered recipe recommendations based on your preferences!
                            </Text>
                            <TouchableOpacity
                                style={[styles.suggestionButton, { backgroundColor: theme.primary }]}
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('AIRecommendations')}
                            >
                                <Text style={styles.suggestionButtonText}>Get Recommendations</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Modern Card for AI Recommendations */}
                    <TouchableOpacity
                        style={[styles.aiCard, { backgroundColor: theme.primary }]}
                        onPress={() => navigation.navigate('AIRecommendations')}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.aiCardText, { color: '#fff' }]}>🍽️ Recommended for You</Text>
                        <Text style={[styles.aiCardSub, { color: '#fff' }]}>Personalized AI recipe picks</Text>
                    </TouchableOpacity>
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    suggestionCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    suggestionText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
        lineHeight: 24,
    },
    suggestionButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    suggestionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
}); 