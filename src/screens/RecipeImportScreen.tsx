import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ImportedRecipe {
    id: string;
    title: string;
    ingredients: string[];
    instructions: string[];
    cuisine?: string;
    time?: string;
    difficulty?: string;
    description?: string;
    tags?: string[];
    isUserGenerated: boolean;
    createdAt: string;
}

export default function RecipeImportScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [time, setTime] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);

    const difficultyOptions = ['Easy', 'Medium', 'Hard'];
    const cuisineOptions = [
        'American', 'Italian', 'Mexican', 'Asian', 'Mediterranean',
        'Indian', 'French', 'Greek', 'Japanese', 'Thai', 'Other'
    ];

    const validateForm = (): boolean => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a recipe title');
            return false;
        }
        if (!ingredients.trim()) {
            Alert.alert('Error', 'Please enter ingredients');
            return false;
        }
        if (!instructions.trim()) {
            Alert.alert('Error', 'Please enter cooking instructions');
            return false;
        }
        return true;
    };

    const parseIngredients = (ingredientsText: string): string[] => {
        return ingredientsText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.replace(/^[-•*]\s*/, ''));
    };

    const parseInstructions = (instructionsText: string): string[] => {
        return instructionsText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.replace(/^\d+\.\s*/, ''));
    };

    const parseTags = (tagsText: string): string[] => {
        return tagsText
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const newRecipe: ImportedRecipe = {
                id: `user_${Date.now()}`,
                title: title.trim(),
                description: description.trim(),
                cuisine: cuisine || 'Other',
                time: time || 'Unknown',
                difficulty: difficulty || 'Medium',
                ingredients: parseIngredients(ingredients),
                instructions: parseInstructions(instructions),
                tags: parseTags(tags),
                isUserGenerated: true,
                createdAt: new Date().toISOString(),
            };

            const saved = await AsyncStorage.getItem('user_recipes');
            const userRecipes = saved ? JSON.parse(saved) : [];
            userRecipes.push(newRecipe);
            await AsyncStorage.setItem('user_recipes', JSON.stringify(userRecipes));

            Alert.alert(
                'Success!',
                'Recipe saved successfully!',
                [
                    {
                        text: 'View Recipe',
                        onPress: () => navigation.navigate('RecipeDetail', { recipe: newRecipe })
                    },
                    {
                        text: 'Add Another',
                        onPress: () => clearForm()
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to save recipe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setTitle('');
        setDescription('');
        setCuisine('');
        setTime('');
        setDifficulty('');
        setIngredients('');
        setInstructions('');
        setTags('');
    };

    const renderDropdown = (
        label: string,
        value: string,
        options: string[],
        onSelect: (value: string) => void
    ) => (
        <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dropdownContainer}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.dropdownOption,
                            { backgroundColor: value === option ? theme.primary : theme.surface, borderColor: theme.border }
                        ]}
                        onPress={() => onSelect(option)}
                    >
                        <Text style={[
                            styles.dropdownOptionText,
                            { color: value === option ? '#fff' : theme.text }
                        ]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Import Recipe</Text>
                    <TouchableOpacity onPress={clearForm}>
                        <Ionicons name="refresh" size={24} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recipe Details</Text>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Recipe Title *</Text>
                            <TextInput
                                style={[styles.textInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Enter recipe title"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Description</Text>
                            <TextInput
                                style={[styles.textArea, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Brief description of the recipe"
                                placeholderTextColor={theme.textSecondary}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        {renderDropdown('Cuisine', cuisine, cuisineOptions, setCuisine)}
                        {renderDropdown('Difficulty', difficulty, difficultyOptions, setDifficulty)}

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Cooking Time</Text>
                            <TextInput
                                style={[styles.textInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
                                value={time}
                                onChangeText={setTime}
                                placeholder="e.g., 30 min, 1 hour"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Tags (comma separated)</Text>
                            <TextInput
                                style={[styles.textInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
                                value={tags}
                                onChangeText={setTags}
                                placeholder="e.g., Vegetarian, Quick, Healthy"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Ingredients *</Text>
                        <Text style={[styles.helperText, { color: theme.textSecondary }]}>
                            Enter each ingredient on a new line. You can use bullet points (-, •, *) or numbers.
                        </Text>
                        <TextInput
                            style={[styles.textArea, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
                            value={ingredients}
                            onChangeText={setIngredients}
                            placeholder="2 cups flour\n1 cup sugar\n3 eggs\n1 tsp vanilla"
                            placeholderTextColor={theme.textSecondary}
                            multiline
                            numberOfLines={8}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Instructions *</Text>
                        <Text style={[styles.helperText, { color: theme.textSecondary }]}>
                            Enter each step on a new line. You can use numbers (1., 2.) or bullet points.
                        </Text>
                        <TextInput
                            style={[styles.textArea, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
                            value={instructions}
                            onChangeText={setInstructions}
                            placeholder="1. Preheat oven to350ix dry ingredients\n3. Add wet ingredients\n4. Bake for 25 minutes"
                            placeholderTextColor={theme.textSecondary}
                            multiline
                            numberOfLines={8}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            <Ionicons name="save-outline" size={20} color="#fff" />
                            <Text style={styles.saveButtonText}>
                                {loading ? 'Saving...' : 'Save Recipe'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView >
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
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    helperText: {
        fontSize: 14,
        marginBottom: 8,
        fontStyle: 'italic',
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    dropdownContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    dropdownOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
    },
    dropdownOptionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
}); 