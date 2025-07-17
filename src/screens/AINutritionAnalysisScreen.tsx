import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getAINutritionAnalysis } from '../services/aiService';

const mockNutrition = {
    calories: 520,
    protein: 22,
    carbs: 65,
    fat: 18,
    fiber: 9,
    sugar: 8,
    sodium: 620,
    vitamins: {
        A: '30%',
        C: '45%',
        D: '10%',
        B12: '12%',
    },
    minerals: {
        Calcium: '18%',
        Iron: '22%',
        Potassium: '15%',
    },
};

const mockRecipe = {
    title: 'Spicy Chickpea Buddha Bowl',
};

export default function AINutritionAnalysisScreen({ navigation }: any) {
    const { theme } = useTheme();
    const recipe = mockRecipe;
    const [nutrition, setNutrition] = useState(mockNutrition);

    useEffect(() => {
        loadNutrition();
    }, []);

    const loadNutrition = async () => {
        const nutritionData = await getAINutritionAnalysis(recipe);
        setNutrition(nutritionData);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Ionicons name="analytics-outline" size={24} color={theme.primary} />
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Nutrition Analysis</Text>
                </View>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 32 }}>
                <Text style={[styles.recipeTitle, { color: theme.text }]}>{recipe.title}</Text>
                {/* Placeholder for chart */}
                <View style={[styles.chartPlaceholder, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>
                        [Pie/Bar Chart Coming Soon]
                    </Text>
                </View>
                <View style={styles.rowGroup}>
                    <View style={styles.row}><Text style={[styles.label, { color: theme.textSecondary }]}>Calories</Text><Text style={[styles.value, { color: theme.text }]}>{nutrition.calories} kcal</Text></View>
                    <View style={styles.row}><Text style={[styles.label, { color: theme.textSecondary }]}>Protein</Text><Text style={[styles.value, { color: theme.text }]}>{nutrition.protein}g</Text></View>
                    <View style={styles.row}><Text style={[styles.label, { color: theme.textSecondary }]}>Carbs</Text><Text style={[styles.value, { color: theme.text }]}>{nutrition.carbs}g</Text></View>
                    <View style={styles.row}><Text style={[styles.label, { color: theme.textSecondary }]}>Fat</Text><Text style={[styles.value, { color: theme.text }]}>{nutrition.fat}g</Text></View>
                    <View style={styles.row}><Text style={[styles.label, { color: theme.textSecondary }]}>Fiber</Text><Text style={[styles.value, { color: theme.text }]}>{nutrition.fiber}g</Text></View>
                    <View style={styles.row}><Text style={[styles.label, { color: theme.textSecondary }]}>Sugar</Text><Text style={[styles.value, { color: theme.text }]}>{nutrition.sugar}g</Text></View>
                    <View style={styles.row}><Text style={[styles.label, { color: theme.textSecondary }]}>Sodium</Text><Text style={[styles.value, { color: theme.text }]}>{nutrition.sodium}mg</Text></View>
                </View>
                <Text style={[styles.sectionHeader, { color: theme.primary }]}>Vitamins</Text>
                {(Object.entries(nutrition.vitamins) as [string, string][]).map(([k, v]) => (
                    <View style={styles.row} key={k}><Text style={[styles.label, { color: theme.textSecondary }]}>{k}</Text><Text style={[styles.value, { color: theme.text }]}>{v}</Text></View>
                ))}
                <Text style={[styles.sectionHeader, { color: theme.primary }]}>Minerals</Text>
                {(Object.entries(nutrition.minerals) as [string, string][]).map(([k, v]) => (
                    <View style={styles.row} key={k}><Text style={[styles.label, { color: theme.textSecondary }]}>{k}</Text><Text style={[styles.value, { color: theme.text }]}>{v}</Text></View>
                ))}
            </ScrollView>
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
        paddingHorizontal: 18,
        paddingTop: 20,
    },
    recipeTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 18,
    },
    chartPlaceholder: {
        height: 160,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowGroup: {
        marginBottom: 18,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    label: {
        fontSize: 16,
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 6,
    },
}); 