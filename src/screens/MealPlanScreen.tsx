import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Keyboard,
    TouchableWithoutFeedback,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import recipeService, { Recipe } from '../services/recipeService';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STORAGE_KEY = '@easymealsai:mealPlan';

const defaultMeal = { name: '', time: '', recipeId: null };
const defaultDayPlan = {
    breakfast: { ...defaultMeal },
    lunch: { ...defaultMeal },
    dinner: { ...defaultMeal },
};

function getToday() {
    const todayIdx = new Date().getDay(); // 0 (Sun) - 6 (Sat)
    return daysOfWeek[(todayIdx + 6) % 7]; // shift so Monday is 0
}

export default function MealPlanScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [selectedDay, setSelectedDay] = useState(getToday());
    const [mealPlan, setMealPlan] = useState<{ [day: string]: any }>({});
    const [modalVisible, setModalVisible] = useState(false);
    const [recipePickerVisible, setRecipePickerVisible] = useState(false);
    const [editingSlot, setEditingSlot] = useState<{ day: string; mealType: string } | null>(null);
    const [mealName, setMealName] = useState('');
    const [mealTime, setMealTime] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [pickerRecipes, setPickerRecipes] = useState<Recipe[]>([]);
    const [pickerLoading, setPickerLoading] = useState(false);
    const [pickerError, setPickerError] = useState<string | null>(null);

    useEffect(() => {
        loadMealPlan();
    }, []);

    useEffect(() => {
        saveMealPlan();
    }, [mealPlan]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, [selectedDay, mealPlan]);

    const loadMealPlan = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setMealPlan(JSON.parse(stored));
            } else {
                // Initialize all days
                const initialPlan: any = {};
                daysOfWeek.forEach(day => {
                    initialPlan[day] = { ...defaultDayPlan };
                });
                setMealPlan(initialPlan);
            }
        } catch (e) {
            // fallback
            const initialPlan: any = {};
            daysOfWeek.forEach(day => {
                initialPlan[day] = { ...defaultDayPlan };
            });
            setMealPlan(initialPlan);
        }
    };

    const saveMealPlan = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mealPlan));
        } catch (e) { }
    };

    const openEditModal = (day: string, mealType: string) => {
        setEditingSlot({ day, mealType });
        setMealName(mealPlan[day]?.[mealType]?.name || '');
        setMealTime(mealPlan[day]?.[mealType]?.time || '');
        setSelectedRecipe(mealPlan[day]?.[mealType]?.recipeId ? pickerRecipes.find(r => r.id === mealPlan[day]?.[mealType]?.recipeId) : null);
        setModalVisible(true);
    };

    const openRecipePicker = async () => {
        setRecipePickerVisible(true);
        setSearchQuery('');
        setPickerLoading(true);
        setPickerError(null);
        try {
            const results = await recipeService.fetchAllRecipes();
            setPickerRecipes(results);
        } catch (e) {
            setPickerError('Failed to load recipes.');
            setPickerRecipes([]);
        } finally {
            setPickerLoading(false);
        }
    };

    const handlePickerSearch = async (query: string) => {
        setSearchQuery(query);
        setPickerLoading(true);
        setPickerError(null);
        try {
            const results = await recipeService.searchRecipes(query);
            setPickerRecipes(results);
        } catch (e) {
            setPickerError('Failed to search recipes.');
            setPickerRecipes([]);
        } finally {
            setPickerLoading(false);
        }
    };

    const handleSaveMeal = () => {
        if (!editingSlot) return;
        setMealPlan(prev => ({
            ...prev,
            [editingSlot.day]: {
                ...prev[editingSlot.day],
                [editingSlot.mealType]: {
                    name: mealName,
                    time: mealTime,
                    recipeId: selectedRecipe?.id || null,
                },
            },
        }));
        setModalVisible(false);
        setEditingSlot(null);
        setMealName('');
        setMealTime('');
        setSelectedRecipe(null);
    };

    const handleRecipeSelect = (recipe: any) => {
        setSelectedRecipe(recipe);
        setMealName(recipe.title);
        setRecipePickerVisible(false);
    };

    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            style={styles.recipeItem}
            onPress={() => handleRecipeSelect(item)}
        >
            {item.image ? <Text style={styles.recipeEmoji}>{item.image}</Text> : null}
            <View style={styles.recipeInfo}>
                <Text style={[styles.recipeTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.recipeCuisine, { color: theme.textSecondary }]}>{item.cuisine}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
    );

    const renderMealCard = (mealType: string, meal: any, day: string) => (
        <Animated.View style={[
            styles.mealCard,
            {
                backgroundColor: theme.surface,
                shadowColor: theme.shadow,
                borderColor: theme.border,
                opacity: fadeAnim,
            },
        ]}>
            <View style={styles.mealHeader}>
                <Text style={[styles.mealType, { color: theme.primary }]}>{mealType}</Text>
                <Text style={[styles.mealTime, { color: theme.textSecondary }]}>{meal.time}</Text>
            </View>
            <Text style={[styles.mealName, { color: theme.text }]}>{meal.name}</Text>
            {meal.recipeId && (
                <View style={[styles.recipeBadge, { backgroundColor: theme.primary + '20' }]}>
                    <Ionicons name="restaurant-outline" size={12} color={theme.primary} />
                    <Text style={[styles.recipeBadgeText, { color: theme.primary }]}>Recipe</Text>
                </View>
            )}
            <TouchableOpacity
                style={[styles.viewRecipeButton, { borderColor: theme.primary }]}
                onPress={() => openEditModal(day, mealType.toLowerCase())}
                accessibilityLabel={meal.name ? `Edit ${mealType}` : `Add ${mealType}`}
            >
                <Text style={[styles.viewRecipeText, { color: theme.primary }]}>{meal.name ? 'Edit' : 'Add'} Meal</Text>
                <Ionicons name={meal.name ? 'pencil' : 'add'} size={16} color={theme.primary} />
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={{ flex: 1 }}>
                    {/* Header */}
                    <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Go back">
                            <Ionicons name="arrow-back" size={24} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>Meal Plan</Text>
                        <TouchableOpacity onPress={() => openEditModal(selectedDay, 'breakfast')} accessibilityLabel="Add meal">
                            <Ionicons name="add" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Day Selector */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={[styles.daySelector, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
                        contentContainerStyle={styles.daySelectorContent}
                    >
                        {daysOfWeek.map((day) => {
                            const isToday = day === getToday();
                            const isSelected = selectedDay === day;
                            return (
                                <TouchableOpacity
                                    key={day}
                                    style={[
                                        styles.dayButton,
                                        { backgroundColor: isSelected ? theme.primary : theme.background, borderColor: isToday ? theme.primary : theme.border },
                                        isToday && styles.todayButton,
                                    ]}
                                    onPress={() => setSelectedDay(day)}
                                    accessibilityLabel={isToday ? `${day} (Today)` : day}
                                >
                                    <Text style={[
                                        styles.dayText,
                                        { color: isSelected ? '#fff' : isToday ? theme.primary : theme.textSecondary },
                                        isSelected && styles.selectedDayText,
                                    ]}>
                                        {day.slice(0, 3)}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Meal Plan Content */}
                    <ScrollView style={styles.content}>
                        <View style={styles.mealSection}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Meals</Text>

                            {mealPlan[selectedDay] ? (
                                <>
                                    {renderMealCard('Breakfast', mealPlan[selectedDay].breakfast, selectedDay)}
                                    {renderMealCard('Lunch', mealPlan[selectedDay].lunch, selectedDay)}
                                    {renderMealCard('Dinner', mealPlan[selectedDay].dinner, selectedDay)}
                                </>
                            ) : (
                                <View style={styles.emptyState}>
                                    <Ionicons name="calendar-outline" size={48} color={theme.textSecondary} />
                                    <Text style={[styles.emptyText, { color: theme.text }]}>No meals planned</Text>
                                    <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>Tap the + button to add meals</Text>
                                </View>
                            )}
                        </View>

                        {/* Quick Actions */}
                        <View style={styles.quickActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: theme.surface, borderColor: theme.primary }]}
                                onPress={() => navigation.navigate('AIMealPlanner')}
                                accessibilityLabel="Go to AI Meal Planner"
                            >
                                <Ionicons name="bulb-outline" size={24} color={theme.primary} />
                                <Text style={[styles.actionButtonText, { color: theme.primary }]}>AI Meal Planner</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: theme.surface, borderColor: theme.primary }]}
                                onPress={() => navigation.navigate('ShoppingList')}
                                accessibilityLabel="Go to Shopping List"
                            >
                                <Ionicons name="list-outline" size={24} color={theme.primary} />
                                <Text style={[styles.actionButtonText, { color: theme.primary }]}>Shopping List</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    {/* Add/Edit Meal Modal */}
                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                            style={styles.modalContainer}
                        >
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                                <View style={[styles.modalContent, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
                                    <Text style={[styles.modalTitle, { color: theme.text }]}>{editingSlot?.mealType ? `Edit ${editingSlot.mealType.charAt(0).toUpperCase() + editingSlot.mealType.slice(1)}` : 'Edit Meal'}</Text>

                                    <TouchableOpacity
                                        style={[styles.recipePickerButton, { backgroundColor: theme.primary, borderColor: theme.primary }]}
                                        onPress={openRecipePicker}
                                    >
                                        <Ionicons name="restaurant-outline" size={20} color="#fff" />
                                        <Text style={styles.recipePickerText}>Pick a Recipe</Text>
                                    </TouchableOpacity>

                                    {selectedRecipe && (
                                        <View style={[styles.selectedRecipeCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
                                            <Text style={styles.recipeEmoji}>{selectedRecipe.image}</Text>
                                            <View style={styles.recipeInfo}>
                                                <Text style={[styles.recipeTitle, { color: theme.text }]}>{selectedRecipe.title}</Text>
                                                <Text style={[styles.recipeCuisine, { color: theme.textSecondary }]}>{selectedRecipe.cuisine}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => setSelectedRecipe(null)}>
                                                <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    <TextInput
                                        style={[styles.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                                        placeholder="Meal Name"
                                        value={mealName}
                                        onChangeText={setMealName}
                                        placeholderTextColor={theme.textSecondary}
                                        accessibilityLabel="Meal name"
                                    />
                                    <TextInput
                                        style={[styles.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                                        placeholder="Time (e.g. 8:00 AM)"
                                        value={mealTime}
                                        onChangeText={setMealTime}
                                        placeholderTextColor={theme.textSecondary}
                                        accessibilityLabel="Meal time"
                                    />
                                    <View style={styles.modalActions}>
                                        <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)} accessibilityLabel="Cancel">
                                            <Text style={styles.modalButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.saveButton, { backgroundColor: (mealName.trim() && mealTime.trim()) ? theme.primary : theme.border }]}
                                            onPress={handleSaveMeal}
                                            disabled={!(mealName.trim() && mealTime.trim())}
                                            accessibilityLabel="Save meal"
                                        >
                                            <Text style={[styles.modalButtonText, { color: (mealName.trim() && mealTime.trim()) ? '#fff' : theme.textSecondary }]}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </KeyboardAvoidingView>
                    </Modal>

                    {/* Recipe Picker Modal */}
                    <Modal
                        visible={recipePickerVisible}
                        animationType="slide"
                        transparent
                        onRequestClose={() => setRecipePickerVisible(false)}
                    >
                        <SafeAreaView style={[styles.recipePickerContainer, { backgroundColor: theme.background }]}>
                            <View style={[styles.recipePickerHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                                <TouchableOpacity onPress={() => setRecipePickerVisible(false)}>
                                    <Ionicons name="close" size={24} color={theme.text} />
                                </TouchableOpacity>
                                <Text style={[styles.recipePickerTitle, { color: theme.text }]}>Choose Recipe</Text>
                                <View style={{ width: 24 }} />
                            </View>
                            <TextInput
                                style={[styles.recipeSearchInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
                                placeholder="Search recipes..."
                                value={searchQuery}
                                onChangeText={handlePickerSearch}
                                placeholderTextColor={theme.textSecondary}
                            />
                            {pickerLoading ? (
                                <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 32 }} />
                            ) : pickerError ? (
                                <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 32 }}>{pickerError}</Text>
                            ) : pickerRecipes.length === 0 ? (
                                <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 32 }}>No recipes found.</Text>
                            ) : (
                                <FlatList
                                    data={pickerRecipes}
                                    renderItem={renderRecipeItem}
                                    keyExtractor={(item) => item.id}
                                    style={styles.recipeList}
                                    showsVerticalScrollIndicator={false}
                                />
                            )}
                        </SafeAreaView>
                    </Modal>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    daySelector: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    daySelectorContent: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    dayButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    selectedDayButton: {
        backgroundColor: '#4CAF50',
    },
    dayText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    selectedDayText: {
        color: '#fff',
    },
    content: {
        flex: 1,
    },
    mealSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    mealCard: {
        backgroundColor: '#fff',
        padding: 20,
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
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    mealType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    mealTime: {
        fontSize: 14,
        color: '#666',
    },
    mealName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    viewRecipeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    viewRecipeText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '600',
        marginRight: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 15,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
    },
    quickActions: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: 320,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
    },
    modalButton: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#eee',
        marginLeft: 10,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    todayButton: {
        borderWidth: 2,
    },
    recipePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    recipePickerText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    selectedRecipeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 16,
    },
    recipeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    recipeBadgeText: {
        fontSize: 12,
        fontWeight: 600,
        marginLeft: 4,
    },
    recipePickerContainer: {
        flex: 1,
    },
    recipePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
    },
    recipePickerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    recipeSearchInput: {
        margin: 20,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
    },
    recipeList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    recipeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 8,
    },
    recipeEmoji: {
        fontSize: 24,
        marginRight: 12,
    },
    recipeInfo: {
        flex: 1,
    },
    recipeTitle: {
        fontSize: 16,
        fontWeight: 600,
        marginBottom: 4,
    },
    recipeCuisine: {
        fontSize: 14,
        marginBottom: 2,
    },
    recipeTime: {
        fontSize: 12,
    },
}); 