import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getAIIngredientSubstitutions } from '../services/aiService';

export default function AIIngredientSubScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [ingredient, setIngredient] = useState('');
    const [substitutions, setSubstitutions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const commonIngredients = [
        'Chickpeas', 'Quinoa', 'Spinach', 'Tahini', 'Lemon', 'Olive Oil',
        'Paprika', 'Cucumber', 'Tomato', 'Garlic', 'Onion', 'Basil'
    ];

    const handleSearch = async () => {
        if (!ingredient.trim()) return;

        setIsLoading(true);
        try {
            const subs = await getAIIngredientSubstitutions(ingredient);
            setSubstitutions(subs);
        } catch (error) {
            console.error('Error getting substitutions:', error);
            setSubstitutions(['No substitutions found']);
        } finally {
            setIsLoading(false);
        }
    };

    const renderSubstitution = ({ item }: { item: string }) => (
        <View style={[styles.substitutionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="swap-horizontal-outline" size={24} color={theme.primary} />
            <Text style={[styles.substitutionText, { color: theme.text }]}>{item}</Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Ionicons name="swap-horizontal-outline" size={24} color={theme.primary} />
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Ingredient Substitutions</Text>
                </View>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                {/* Search Input */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={[styles.searchInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                        placeholder="Enter an ingredient..."
                        placeholderTextColor={theme.textSecondary}
                        value={ingredient}
                        onChangeText={setIngredient}
                    />
                    <TouchableOpacity
                        style={[styles.searchButton, { backgroundColor: theme.primary }]}
                        onPress={handleSearch}
                        disabled={!ingredient.trim() || isLoading}
                    >
                        <Ionicons name="search" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Common Ingredients */}
                <View style={styles.commonIngredientsContainer}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                        Common Ingredients
                    </Text>
                    <View style={styles.ingredientsGrid}>
                        {commonIngredients.map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={[styles.ingredientChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                onPress={() => {
                                    setIngredient(item);
                                    handleSearch();
                                }}
                            >
                                <Text style={[styles.ingredientText, { color: theme.text }]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Results */}
                {substitutions.length > 0 && (
                    <View style={styles.resultsContainer}>
                        <Text style={[styles.resultsTitle, { color: theme.text }]}>
                            Substitutions for "{ingredient}"
                        </Text>
                        <FlatList
                            data={substitutions}
                            renderItem={renderSubstitution}
                            keyExtractor={(item) => item}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginRight: 10,
    },
    searchButton: {
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    commonIngredientsContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    ingredientsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    ingredientChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 8,
    },
    ingredientText: {
        fontSize: 14,
    },
    resultsContainer: {
        flex: 1,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    substitutionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 8,
    },
    substitutionText: {
        fontSize: 16,
        marginLeft: 12,
        flex: 1,
    },
}); 