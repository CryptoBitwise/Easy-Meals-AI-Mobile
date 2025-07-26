import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import preferencesService, { UserPreferences } from '../services/preferencesService';

const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free',
    'Low-Carb', 'Keto', 'Paleo', 'Mediterranean', 'Pescatarian'
];

const cuisineOptions = [
    'Italian', 'Asian', 'Mexican', 'Mediterranean', 'Indian',
    'American', 'French', 'Greek', 'Thai', 'Japanese', 'Chinese'
];

const allergyOptions = [
    'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Soy', 'Wheat',
    'Fish', 'Shellfish', 'Sesame', 'Mustard', 'Celery'
];

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const spiceLevels = ['Mild', 'Medium', 'Hot', 'Extra Hot'];

const PreferencesScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const [preferences, setPreferences] = useState<UserPreferences>({
        dietaryRestrictions: [],
        cookingSkill: 'Intermediate',
        favoriteCuisines: [],
        allergies: [],
        servingSize: 2,
        spiceLevel: 'Medium',
        mealPlanning: true,
        notifications: true,
    });

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const saved = await preferencesService.loadPreferences();
            setPreferences(saved);
        } catch (e) {
            console.log('Error loading preferences:', e);
        }
    };

    const savePreferences = async (newPreferences: Partial<UserPreferences>) => {
        try {
            await preferencesService.savePreferences(newPreferences);
            setPreferences(preferencesService.getPreferences());
        } catch (e) {
            console.log('Error saving preferences:', e);
        }
    };

    const toggleDietaryRestriction = (restriction: string) => {
        const updated = preferences.dietaryRestrictions.includes(restriction)
            ? preferences.dietaryRestrictions.filter(r => r !== restriction)
            : [...preferences.dietaryRestrictions, restriction];

        savePreferences({ ...preferences, dietaryRestrictions: updated });
    };

    const toggleFavoriteCuisine = (cuisine: string) => {
        const updated = preferences.favoriteCuisines.includes(cuisine)
            ? preferences.favoriteCuisines.filter(c => c !== cuisine)
            : [...preferences.favoriteCuisines, cuisine];

        savePreferences({ ...preferences, favoriteCuisines: updated });
    };

    const toggleAllergy = (allergy: string) => {
        const updated = preferences.allergies.includes(allergy)
            ? preferences.allergies.filter(a => a !== allergy)
            : [...preferences.allergies, allergy];

        savePreferences({ ...preferences, allergies: updated });
    };

    const renderOptionChip = (
        options: string[],
        selectedItems: string[],
        onToggle: (item: string) => void,
        title: string
    ) => (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.primary }]}>{title}</Text>
            <View style={styles.chipContainer}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.chip,
                            {
                                backgroundColor: selectedItems.includes(option) ? theme.primary : theme.surface,
                                borderColor: theme.border,
                            }
                        ]}
                        onPress={() => onToggle(option)}
                    >
                        <Text style={[
                            styles.chipText,
                            { color: selectedItems.includes(option) ? '#fff' : theme.text }
                        ]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderSingleChoice = (
        options: string[],
        selected: string,
        onSelect: (value: string) => void,
        title: string
    ) => (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.primary }]}>{title}</Text>
            <View style={styles.chipContainer}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.chip,
                            {
                                backgroundColor: selected === option ? theme.primary : theme.surface,
                                borderColor: theme.border,
                            }
                        ]}
                        onPress={() => onSelect(option)}
                    >
                        <Text style={[
                            styles.chipText,
                            { color: selected === option ? '#fff' : theme.text }
                        ]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Preferences</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Dietary Preferences Section */}
                <View style={styles.sectionGroup}>
                    <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>DIETARY PREFERENCES</Text>
                    {renderOptionChip(
                        dietaryOptions,
                        preferences.dietaryRestrictions,
                        toggleDietaryRestriction,
                        'Dietary Restrictions'
                    )}
                </View>

                {/* Cooking Preferences Section */}
                <View style={styles.sectionGroup}>
                    <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>COOKING PREFERENCES</Text>

                    {/* Cooking Skill Level */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Cooking Skill Level</Text>
                        <View style={styles.chipContainer}>
                            {skillLevels.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.chip,
                                        {
                                            backgroundColor: preferences.cookingSkill === option ? theme.primary : theme.surface,
                                            borderColor: theme.border,
                                        }
                                    ]}
                                    onPress={() => savePreferences({ ...preferences, cookingSkill: option })}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        { color: preferences.cookingSkill === option ? '#fff' : theme.text }
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Spice Level */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Preferred Spice Level</Text>
                        <View style={styles.chipContainer}>
                            {spiceLevels.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.chip,
                                        {
                                            backgroundColor: preferences.spiceLevel === option ? theme.primary : theme.surface,
                                            borderColor: theme.border,
                                        }
                                    ]}
                                    onPress={() => savePreferences({ ...preferences, spiceLevel: option })}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        { color: preferences.spiceLevel === option ? '#fff' : theme.text }
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Cuisine Preferences Section */}
                <View style={styles.sectionGroup}>
                    <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>CUISINE PREFERENCES</Text>
                    {renderOptionChip(
                        cuisineOptions,
                        preferences.favoriteCuisines,
                        toggleFavoriteCuisine,
                        'Favorite Cuisines'
                    )}
                </View>

                {/* Health & Safety Section */}
                <View style={styles.sectionGroup}>
                    <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>HEALTH & SAFETY</Text>
                    {renderOptionChip(
                        allergyOptions,
                        preferences.allergies,
                        toggleAllergy,
                        'Allergies & Intolerances'
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.primary }]}>Serving Size</Text>
                    <View style={styles.servingContainer}>
                        <TouchableOpacity
                            style={[styles.servingButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => savePreferences({ ...preferences, servingSize: Math.max(1, preferences.servingSize - 1) })}
                        >
                            <Ionicons name="remove" size={20} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={[styles.servingText, { color: theme.text }]}>{preferences.servingSize} people</Text>
                        <TouchableOpacity
                            style={[styles.servingButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => savePreferences({ ...preferences, servingSize: preferences.servingSize + 1 })}
                        >
                            <Ionicons name="add" size={20} color={theme.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.primary }]}>Settings</Text>
                    <TouchableOpacity
                        style={[styles.settingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={() => savePreferences({ ...preferences, mealPlanning: !preferences.mealPlanning })}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons name="calendar-outline" size={24} color={theme.primary} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Enable Meal Planning</Text>
                        </View>
                        <View style={[styles.toggle, { backgroundColor: preferences.mealPlanning ? theme.primary : theme.border }]}>
                            <View style={[styles.toggleThumb, { backgroundColor: '#fff' }]} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.settingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={() => savePreferences({ ...preferences, notifications: !preferences.notifications })}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons name="notifications-outline" size={24} color={theme.primary} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Push Notifications</Text>
                        </View>
                        <View style={[styles.toggle, { backgroundColor: preferences.notifications ? theme.primary : theme.border }]}>
                            <View style={[styles.toggleThumb, { backgroundColor: '#fff' }]} />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

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
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionGroup: {
        marginBottom: 32,
    },
    groupTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 16,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 8,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    servingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    servingButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    servingText: {
        fontSize: 16,
        fontWeight: '600',
        marginHorizontal: 20,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 8,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingText: {
        fontSize: 16,
        marginLeft: 12,
    },
    toggle: {
        width: 44,
        height: 24,
        borderRadius: 12,
        padding: 2,
    },
    toggleThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
});

export default PreferencesScreen; 