import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    ScrollView,
    Alert,
    ActivityIndicator,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import recipeService, { Recipe } from '../services/recipeService';
import EmptyState from '../components/EmptyState';

// Type declarations for speech recognition
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export default function AIRecipeSearchScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Recipe[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const requestMicrophonePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: 'Microphone Permission',
                        message: 'EasyMeals AI needs access to your microphone to enable voice commands.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn('Permission request error:', err);
                return false;
            }
        }
        return true; // iOS handles permissions through app.json
    };

    const startVoiceInput = async () => {
        console.log('Microphone button pressed in AI Recipe Search - starting voice input...');
        try {
            const hasPermission = await requestMicrophonePermission();
            if (!hasPermission) {
                Alert.alert('Permission Required', 'Microphone permission is required for voice input.');
                return;
            }

            // For now, we'll use a simple approach that works across platforms
            if (Platform.OS === 'web') {
                // Web speech recognition
                if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    const recognition = new SpeechRecognition();

                    recognition.continuous = false;
                    recognition.interimResults = false;
                    recognition.lang = 'en-US';

                    recognition.onstart = () => {
                        setIsListening(true);
                        console.log('Speech recognition started successfully in AI Recipe Search');
                    };

                    recognition.onresult = (event: any) => {
                        const transcript = event.results[0][0].transcript;
                        console.log('Speech recognized in AI Recipe Search:', transcript);
                        setSearchQuery(transcript);
                        setIsListening(false);
                    };

                    recognition.onerror = (event: any) => {
                        console.error('Speech recognition error in AI Recipe Search:', event.error);
                        setIsListening(false);
                        Alert.alert('Voice Error', 'Could not recognize speech. Please try typing instead.');
                    };

                    recognition.onend = () => {
                        setIsListening(false);
                        console.log('Speech recognition ended in AI Recipe Search');
                    };

                    recognition.start();
                } else {
                    console.log('Speech recognition not supported in this browser for AI Recipe Search');
                    Alert.alert('Not Supported', 'Voice recognition is not supported in this browser. Please type your search.');
                }
            } else {
                // For mobile, we'll automatically select an AI prompt for better UX
                console.log('Mobile platform detected in AI Recipe Search - auto-selecting AI prompt');
                const prompts = [
                    "Quick dinner with chicken",
                    "Vegetarian pasta dishes",
                    "Healthy breakfast ideas",
                    "Desserts under 30 minutes",
                    "Low-carb dinner options",
                    "Mediterranean recipes"
                ];
                const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
                console.log('Auto-selected AI prompt in Recipe Search:', randomPrompt);
                setSearchQuery(randomPrompt);

                // Show a brief success message
                Alert.alert(
                    'AI Prompt Selected',
                    `"${randomPrompt}" - Tap search to find recipes!`,
                    [{ text: 'OK' }]
                );
            }
        } catch (e) {
            console.error('Voice input error in AI Recipe Search:', e);
            Alert.alert('Voice Error', 'Could not start voice input. Please try typing instead.');
        }
    };

    const aiPrompts = [
        "Quick dinner with chicken",
        "Vegetarian pasta dishes",
        "Healthy breakfast ideas",
        "Desserts under 30 minutes",
        "Low-carb dinner options",
        "Mediterranean recipes",
        "Asian stir fry dishes",
        "Comfort food classics",
    ];

    const handleAISearch = async (prompt: string) => {
        setSearchQuery(prompt);
        setIsSearching(true);

        try {
            const results = await recipeService.searchRecipes(prompt);
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching recipes:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            style={[styles.recipeCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}
            onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
        >
            <View style={styles.recipeImage}>
                {item.image ? (
                    <Text style={styles.recipeEmoji}>{item.image}</Text>
                ) : (
                    <Ionicons name="restaurant-outline" size={32} color={theme.textSecondary} />
                )}
            </View>
            <View style={styles.recipeInfo}>
                <Text style={[styles.recipeTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.recipeDescription, { color: theme.textSecondary }]}>
                    {item.description || 'No description available'}
                </Text>
                <View style={styles.recipeMeta}>
                    <Text style={[styles.recipeCuisine, { color: theme.textSecondary }]}>{item.cuisine}</Text>
                </View>
                {item.tags && (
                    <View style={styles.recipeTags}>
                        {item.tags.slice(0, 3).map((tag, index) => (
                            <View key={tag + '-' + index} style={[styles.tag, { backgroundColor: theme.primary }]}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>AI Recipe Search</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.searchSection}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Describe what you want to cook</Text>
                    <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Ionicons name="search" size={20} color={theme.textSecondary} />
                        <TextInput
                            style={[styles.searchInput, { color: theme.text }]}
                            placeholder="e.g., quick chicken dinner, vegetarian pasta..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor={theme.textSecondary}
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.voiceButton, isListening ? { backgroundColor: theme.primary } : { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={startVoiceInput}
                        >
                            <Ionicons name={isListening ? 'mic' : 'mic-outline'} size={20} color={isListening ? '#fff' : theme.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.searchButton, { backgroundColor: theme.primary }]}
                            onPress={() => handleAISearch(searchQuery)}
                            disabled={isSearching || !searchQuery.trim()}
                        >
                            <Ionicons name="bulb-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.promptsSection}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Try these AI prompts</Text>
                    <View style={styles.promptsGrid}>
                        {aiPrompts.map((prompt) => (
                            <TouchableOpacity
                                key={prompt}
                                style={[styles.promptChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                onPress={() => handleAISearch(prompt)}
                                disabled={isSearching}
                            >
                                <Text style={[styles.promptText, { color: theme.text }]}>{prompt}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {isSearching ? (
                    <View style={styles.loadingContainer}>
                        <Ionicons name="bulb-outline" size={48} color={theme.primary} />
                        <Text style={[styles.loadingText, { color: theme.text }]}>AI is searching...</Text>
                        <Text style={[styles.loadingSubtext, { color: theme.textSecondary }]}>Finding the perfect recipes for you</Text>
                    </View>
                ) : searchResults.length > 0 ? (
                    <View style={styles.resultsSection}>
                        <Text style={[styles.resultsTitle, { color: theme.text }]}>Found {searchResults.length} recipes</Text>
                        <FlatList
                            data={searchResults}
                            renderItem={renderRecipeItem}
                            keyExtractor={(item) => item.id}
                            style={styles.resultsList}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                ) : searchQuery.trim() !== '' ? (
                    <EmptyState
                        icon="bulb-outline"
                        title="No Recipes Found"
                        message="Try adjusting your search terms to find more recipes."
                        actionText="Clear Search"
                        onAction={() => setSearchQuery('')}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="bulb-outline" size={48} color={theme.textSecondary} />
                        <Text style={[styles.emptyText, { color: theme.text }]}>Ready to discover recipes</Text>
                        <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>Describe what you want to cook and AI will find the perfect recipes</Text>
                    </View>
                )}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        maxHeight: 80,
    },
    searchButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    voiceButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        borderWidth: 1,
    },
    promptsContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    promptsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
    },
    promptButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 10,
    },
    promptText: {
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
    },
    loadingSubtext: {
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
    },
    resultsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    recipeCard: {
        flexDirection: 'row',
        alignItems: 'center',
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
    recipeImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
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
    recipeDescription: {
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 18,
    },
    recipeMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    recipeCuisine: {
        fontSize: 12,
    },
    recipeTags: {
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
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
    },
    emptySubtext: {
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
        lineHeight: 20,
    },
    micButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderWidth: 2,
        borderColor: '#4CAF50',
        backgroundColor: '#fff',
    },
    micButtonActive: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    content: {
        flex: 1,
    },
    searchSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    promptsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    promptChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        marginVertical: 5,
        marginHorizontal: 5,
    },
    resultsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    promptsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
}); 