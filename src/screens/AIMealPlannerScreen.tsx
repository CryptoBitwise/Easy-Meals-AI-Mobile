import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    FlatList,
    Alert,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface MealPlan {
    day: string;
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal[];
}

interface Meal {
    id: string;
    name: string;
    time: string;
    difficulty: string;
    image: string;
    calories: number;
    tags: string[];
}

export default function AIMealPlannerScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [isGenerating, setIsGenerating] = useState(false);
    const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
    const [preferences, setPreferences] = useState({
        dietaryRestrictions: ['None'],
        cuisinePreferences: ['All'],
        cookingSkill: 'Intermediate',
        calorieGoal: '2000',
        mealsPerDay: 3,
    });
    const [isListening, setIsListening] = useState(false);
    const [voiceTarget, setVoiceTarget] = useState<'dietary' | 'cuisine' | 'skill' | null>(null);



    const onSpeechStart = () => {
        setIsListening(true);
    };
    const onSpeechEnd = () => {
        setIsListening(false);
    };
    const onSpeechResults = (event: any) => {
        if (event.value && event.value.length > 0 && voiceTarget) {
            const spoken = event.value[0].toLowerCase();
            if (voiceTarget === 'dietary') {
                const found = dietaryOptions.filter(opt => spoken.includes(opt.toLowerCase()));
                setPreferences(p => ({ ...p, dietaryRestrictions: found.length ? found : [spoken] }));
            } else if (voiceTarget === 'cuisine') {
                const found = cuisineOptions.filter(opt => spoken.includes(opt.toLowerCase()));
                setPreferences(p => ({ ...p, cuisinePreferences: found.length ? found : [spoken] }));
            } else if (voiceTarget === 'skill') {
                const found = skillLevels.find(opt => spoken.includes(opt.toLowerCase()));
                setPreferences(p => ({ ...p, cookingSkill: found || spoken }));
            }
        }
        setIsListening(false);
        setVoiceTarget(null);
    };
    const onSpeechError = (event: any) => {
        setIsListening(false);
        setVoiceTarget(null);
        Alert.alert('Voice Error', event.error?.message || 'Could not recognize speech.');
    };

    const startListening = async (target: 'dietary' | 'cuisine' | 'skill') => {
        try {
            setVoiceTarget(target);
            setIsListening(true);
            // await Voice.start('en-US');
        } catch (e) {
            setIsListening(false);
            setVoiceTarget(null);
            Alert.alert('Voice Error', 'Could not start voice recognition.');
        }
    };
    const stopListening = async () => {
        try {
            // await Voice.stop();
            setIsListening(false);
            setVoiceTarget(null);
        } catch (e) {
            setIsListening(false);
            setVoiceTarget(null);
        }
    };

    const dietaryOptions = [
        'None', 'Vegetarian', 'Vegan', 'Gluten-Free',
        'Dairy-Free', 'Low-Carb', 'Keto', 'Paleo'
    ];

    const cuisineOptions = [
        'All', 'Italian', 'Asian', 'Mexican', 'Mediterranean',
        'American', 'Indian', 'French', 'Middle Eastern'
    ];

    const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];

    const generateMealPlan = async () => {
        setIsGenerating(true);

        // Simulate AI meal plan generation
        setTimeout(() => {
            const generatedPlan = createAIMealPlan();
            setMealPlan(generatedPlan);
            setIsGenerating(false);

            Alert.alert(
                'Meal Plan Generated!',
                'Your AI-powered meal plan is ready. Would you like to generate a shopping list?',
                [
                    { text: 'Later', style: 'cancel' },
                    { text: 'Generate Shopping List', onPress: () => navigation.navigate('ShoppingList') }
                ]
            );
        }, 3000);
    };

    const createAIMealPlan = (): MealPlan[] => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        return days.map((day, index) => ({
            day,
            breakfast: {
                id: `breakfast-${index}`,
                name: getBreakfastForDay(index),
                time: '8:00 AM',
                difficulty: 'Easy',
                image: '🥣',
                calories: 350,
                tags: ['Breakfast', 'Quick'],
            },
            lunch: {
                id: `lunch-${index}`,
                name: getLunchForDay(index),
                time: '12:30 PM',
                difficulty: 'Easy',
                image: '🥗',
                calories: 450,
                tags: ['Lunch', 'Healthy'],
            },
            dinner: {
                id: `dinner-${index}`,
                name: getDinnerForDay(index),
                time: '7:00 PM',
                difficulty: 'Medium',
                image: '🍽️',
                calories: 600,
                tags: ['Dinner', 'Main Course'],
            },
            snacks: [
                {
                    id: `snack1-${index}`,
                    name: 'Greek Yogurt with Berries',
                    time: '3:00 PM',
                    difficulty: 'Easy',
                    image: '🥛',
                    calories: 150,
                    tags: ['Snack', 'Protein'],
                },
                {
                    id: `snack2-${index}`,
                    name: 'Mixed Nuts',
                    time: '5:00 PM',
                    difficulty: 'Easy',
                    image: '🥜',
                    calories: 200,
                    tags: ['Snack', 'Healthy Fats'],
                },
            ],
        }));
    };

    const getBreakfastForDay = (dayIndex: number): string => {
        const breakfasts = [
            'Oatmeal with Berries and Nuts',
            'Greek Yogurt Parfait',
            'Avocado Toast with Eggs',
            'Smoothie Bowl',
            'Protein Pancakes',
            'Breakfast Burrito',
            'French Toast with Fruit',
        ];
        return breakfasts[dayIndex % breakfasts.length];
    };

    const getLunchForDay = (dayIndex: number): string => {
        const lunches = [
            'Mediterranean Quinoa Bowl',
            'Chicken Caesar Salad',
            'Turkey and Avocado Wrap',
            'Vegetable Soup with Bread',
            'Grilled Salmon with Rice',
            'Pasta Primavera',
            'Beef Tacos',
        ];
        return lunches[dayIndex % lunches.length];
    };

    const getDinnerForDay = (dayIndex: number): string => {
        const dinners = [
            'Grilled Chicken with Vegetables',
            'Salmon with Roasted Potatoes',
            'Vegetable Stir Fry',
            'Beef Tacos with Guacamole',
            'Pasta Carbonara',
            'Grilled Steak with Salad',
            'Homemade Pizza',
        ];
        return dinners[dayIndex % dinners.length];
    };

    const renderMealCard = (meal: Meal, mealType: string) => (
        <TouchableOpacity
            style={[styles.mealCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}
            onPress={() => navigation.navigate('RecipeDetail', { recipe: meal })}
        >
            <View style={styles.mealHeader}>
                <Text style={[styles.mealType, { color: theme.primary }]}>{mealType}</Text>
                <Text style={[styles.mealTime, { color: theme.textSecondary }]}>{meal.time}</Text>
            </View>
            <View style={styles.mealContent}>
                <Text style={styles.mealEmoji}>{meal.image}</Text>
                <View style={styles.mealInfo}>
                    <Text style={[styles.mealName, { color: theme.text }]}>{meal.name}</Text>
                    <Text style={[styles.mealCalories, { color: theme.textSecondary }]}>
                        {meal.calories} calories
                    </Text>
                </View>
            </View>
            <View style={styles.mealTags}>
                {meal.tags.map((tag, index) => (
                    <View key={tag + '-' + index} style={[styles.tag, { backgroundColor: theme.primary }]}>
                        <Text style={styles.tagText}>{tag}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );

    const renderDayPlan = ({ item }: { item: MealPlan }) => (
        <View style={styles.dayContainer}>
            <Text style={[styles.dayTitle, { color: theme.text }]}>{item.day}</Text>

            {renderMealCard(item.breakfast, 'Breakfast')}
            {renderMealCard(item.lunch, 'Lunch')}
            {renderMealCard(item.dinner, 'Dinner')}

            <View style={styles.snacksContainer}>
                <Text style={[styles.snacksTitle, { color: theme.textSecondary }]}>Snacks</Text>
                {item.snacks.map((snack) => (
                    <View key={snack.id} style={[styles.snackItem, { backgroundColor: theme.surface }]}>
                        <Text style={styles.snackEmoji}>{snack.image}</Text>
                        <View style={styles.snackInfo}>
                            <Text style={[styles.snackName, { color: theme.text }]}>{snack.name}</Text>
                            <Text style={[styles.snackTime, { color: theme.textSecondary }]}>{snack.time}</Text>
                        </View>
                        <Text style={[styles.snackCalories, { color: theme.textSecondary }]}>
                            {snack.calories} cal
                        </Text>
                    </View>
                ))}
            </View>
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
                    <Ionicons name="calendar-outline" size={24} color={theme.primary} />
                    <Text style={[styles.headerTitle, { color: theme.text }]}>AI Meal Planner</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="settings-outline" size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            {/* Preferences Section */}
            <ScrollView style={styles.preferencesContainer}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Preferences</Text>

                <View style={[styles.preferenceCard, { backgroundColor: theme.surface }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={[styles.preferenceLabel, { color: theme.text }]}>Dietary Restrictions</Text>
                        <TouchableOpacity
                            style={[styles.micButton, isListening && voiceTarget === 'dietary' ? styles.micButtonActive : null]}
                            onPress={isListening && voiceTarget === 'dietary' ? stopListening : () => startListening('dietary')}
                        >
                            <Ionicons name={isListening && voiceTarget === 'dietary' ? 'mic' : 'mic-outline'} size={20} color={isListening && voiceTarget === 'dietary' ? '#fff' : theme.primary} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {dietaryOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.preferenceChip,
                                    preferences.dietaryRestrictions.includes(option) && { backgroundColor: theme.primary }
                                ]}
                                onPress={() => {
                                    const current = preferences.dietaryRestrictions;
                                    const updated = current.includes(option)
                                        ? current.filter(item => item !== option)
                                        : [...current, option];
                                    setPreferences({ ...preferences, dietaryRestrictions: updated });
                                }}
                            >
                                <Text style={[
                                    styles.preferenceChipText,
                                    { color: preferences.dietaryRestrictions.includes(option) ? '#fff' : theme.text }
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={[styles.preferenceCard, { backgroundColor: theme.surface }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={[styles.preferenceLabel, { color: theme.text }]}>Cuisine Preferences</Text>
                        <TouchableOpacity
                            style={[styles.micButton, isListening && voiceTarget === 'cuisine' ? styles.micButtonActive : null]}
                            onPress={isListening && voiceTarget === 'cuisine' ? stopListening : () => startListening('cuisine')}
                        >
                            <Ionicons name={isListening && voiceTarget === 'cuisine' ? 'mic' : 'mic-outline'} size={20} color={isListening && voiceTarget === 'cuisine' ? '#fff' : theme.primary} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {cuisineOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.preferenceChip,
                                    preferences.cuisinePreferences.includes(option) && { backgroundColor: theme.primary }
                                ]}
                                onPress={() => {
                                    const current = preferences.cuisinePreferences;
                                    const updated = current.includes(option)
                                        ? current.filter(item => item !== option)
                                        : [...current, option];
                                    setPreferences({ ...preferences, cuisinePreferences: updated });
                                }}
                            >
                                <Text style={[
                                    styles.preferenceChipText,
                                    { color: preferences.cuisinePreferences.includes(option) ? '#fff' : theme.text }
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={[styles.preferenceCard, { backgroundColor: theme.surface }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={[styles.preferenceLabel, { color: theme.text }]}>Cooking Skill Level</Text>
                        <TouchableOpacity
                            style={[styles.micButton, isListening && voiceTarget === 'skill' ? styles.micButtonActive : null]}
                            onPress={isListening && voiceTarget === 'skill' ? stopListening : () => startListening('skill')}
                        >
                            <Ionicons name={isListening && voiceTarget === 'skill' ? 'mic' : 'mic-outline'} size={20} color={isListening && voiceTarget === 'skill' ? '#fff' : theme.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.skillLevelContainer}>
                        {skillLevels.map((level) => (
                            <TouchableOpacity
                                key={level}
                                style={[
                                    styles.skillLevelButton,
                                    preferences.cookingSkill === level && { backgroundColor: theme.primary }
                                ]}
                                onPress={() => setPreferences({ ...preferences, cookingSkill: level })}
                            >
                                <Text style={[
                                    styles.skillLevelText,
                                    { color: preferences.cookingSkill === level ? '#fff' : theme.text }
                                ]}>
                                    {level}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Generate Button */}
                <TouchableOpacity
                    style={[styles.generateButton, { backgroundColor: theme.primary }]}
                    onPress={generateMealPlan}
                    disabled={isGenerating}
                >
                    <Ionicons name="bulb-outline" size={24} color="#fff" />
                    <Text style={styles.generateButtonText}>
                        {isGenerating ? 'Generating Meal Plan...' : 'Generate AI Meal Plan'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Meal Plan Results */}
            {mealPlan.length > 0 && (
                <View style={styles.resultsContainer}>
                    <Text style={[styles.resultsTitle, { color: theme.text }]}>Your AI-Generated Meal Plan</Text>
                    <FlatList
                        data={mealPlan}
                        renderItem={renderDayPlan}
                        keyExtractor={(item) => item.day}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </SafeAreaView>
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
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    preferencesContainer: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    preferenceCard: {
        padding: 15,
        borderRadius: 12,
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
    preferenceLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    preferenceChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginRight: 10,
    },
    preferenceChipText: {
        fontSize: 14,
    },
    skillLevelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    skillLevelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    skillLevelText: {
        fontSize: 14,
        fontWeight: '600',
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 20,
    },
    generateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    resultsContainer: {
        flex: 1,
        padding: 20,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    dayContainer: {
        marginBottom: 25,
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    mealCard: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    mealType: {
        fontSize: 14,
        fontWeight: '600',
    },
    mealTime: {
        fontSize: 12,
    },
    mealContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    mealEmoji: {
        fontSize: 24,
        marginRight: 12,
    },
    mealInfo: {
        flex: 1,
    },
    mealName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    mealCalories: {
        fontSize: 12,
    },
    mealTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 4,
    },
    tagText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    snacksContainer: {
        marginTop: 10,
    },
    snacksTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    snackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        marginBottom: 5,
    },
    snackEmoji: {
        fontSize: 20,
        marginRight: 10,
    },
    snackInfo: {
        flex: 1,
    },
    snackName: {
        fontSize: 14,
        fontWeight: '500',
    },
    snackTime: {
        fontSize: 12,
    },
    snackCalories: {
        fontSize: 12,
        fontWeight: '600',
    },
    micButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        borderWidth: 2,
        borderColor: '#4CAF50',
        backgroundColor: '#fff',
    },
    micButtonActive: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
}); 