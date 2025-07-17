import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface Category {
    id: string;
    title: string;
    icon: string;
    recipeCount: number;
    type: 'cuisine' | 'dietary' | 'time';
}

const categories: Category[] = [
    // Cuisine Types
    { id: 'italian', title: 'Italian', icon: 'pizza-outline', recipeCount: 24, type: 'cuisine' },
    { id: 'asian', title: 'Asian', icon: 'restaurant-outline', recipeCount: 31, type: 'cuisine' },
    { id: 'mexican', title: 'Mexican', icon: 'leaf-outline', recipeCount: 18, type: 'cuisine' },
    { id: 'mediterranean', title: 'Mediterranean', icon: 'fish-outline', recipeCount: 22, type: 'cuisine' },
    { id: 'indian', title: 'Indian', icon: 'flame-outline', recipeCount: 28, type: 'cuisine' },
    { id: 'american', title: 'American', icon: 'flag-outline', recipeCount: 35, type: 'cuisine' },

    // Dietary Restrictions
    { id: 'vegetarian', title: 'Vegetarian', icon: 'leaf-outline', recipeCount: 42, type: 'dietary' },
    { id: 'vegan', title: 'Vegan', icon: 'nutrition-outline', recipeCount: 29, type: 'dietary' },
    { id: 'gluten-free', title: 'Gluten-Free', icon: 'medical-outline', recipeCount: 16, type: 'dietary' },
    { id: 'low-carb', title: 'Low-Carb', icon: 'fitness-outline', recipeCount: 19, type: 'dietary' },
    { id: 'keto', title: 'Keto', icon: 'flame-outline', recipeCount: 14, type: 'dietary' },
    { id: 'pescatarian', title: 'Pescatarian', icon: 'fish-outline', recipeCount: 23, type: 'dietary' },

    // Cooking Time
    { id: 'quick', title: 'Quick (< 30 min)', icon: 'flash-outline', recipeCount: 47, type: 'time' },
    { id: 'medium', title: 'Medium (30-60 min)', icon: 'time-outline', recipeCount: 38, type: 'time' },
    { id: 'slow', title: 'Slow Cooker', icon: 'timer-outline', recipeCount: 12, type: 'time' },
];

const CategoriesScreen = ({ navigation }: any) => {
    const { theme } = useTheme();

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
    const timeCategories = categories.filter(c => c.type === 'time');

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.header, { color: theme.primary }]}>Recipe Categories</Text>

            <FlatList
                data={[]}
                renderItem={() => null}
                ListHeaderComponent={() => (
                    <View>
                        {renderSection('Cuisine Types', cuisineCategories)}
                        {renderSection('Dietary Preferences', dietaryCategories)}
                        {renderSection('Cooking Time', timeCategories)}
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 48,
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
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
});

export default CategoriesScreen; 