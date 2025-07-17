import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

export default function AISettingsScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [apiKey, setApiKey] = useState('');
    const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
    const [isAIFeaturesEnabled, setIsAIFeaturesEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedApiKey = await AsyncStorage.getItem('openai_api_key');
            if (savedApiKey) {
                setApiKey(savedApiKey);
            }

            const aiEnabled = await AsyncStorage.getItem('ai_features_enabled');
            setIsAIFeaturesEnabled(aiEnabled !== 'false');
        } catch (error) {
            console.error('Error loading AI settings:', error);
        }
    };

    const saveApiKey = async () => {
        if (!apiKey.trim()) {
            Alert.alert('Error', 'Please enter a valid API key');
            return;
        }

        setIsLoading(true);
        try {
            await AsyncStorage.setItem('openai_api_key', apiKey.trim());
            Alert.alert('Success', 'API key saved successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save API key');
        } finally {
            setIsLoading(false);
        }
    };

    const testApiKey = async () => {
        if (!apiKey.trim()) {
            Alert.alert('Error', 'Please enter an API key first');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${apiKey.trim()}`,
                },
            });

            if (response.ok) {
                Alert.alert('Success', 'API key is valid and working!');
            } else {
                Alert.alert('Error', 'Invalid API key. Please check and try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to test API key. Please check your internet connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAIFeatures = async (value: boolean) => {
        setIsAIFeaturesEnabled(value);
        try {
            await AsyncStorage.setItem('ai_features_enabled', value.toString());
        } catch (error) {
            console.error('Error saving AI features setting:', error);
        }
    };

    const clearApiKey = () => {
        Alert.alert(
            'Clear API Key',
            'Are you sure you want to clear your API key? This will disable AI features.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('openai_api_key');
                            setApiKey('');
                            Alert.alert('Success', 'API key cleared');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear API key');
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Ionicons name="settings-outline" size={24} color={theme.primary} />
                    <Text style={[styles.headerTitle, { color: theme.text }]}>AI Settings</Text>
                </View>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: theme.text }]}>AI Assistant Settings</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Configure your AI cooking assistant preferences
                </Text>

                {/* API Key Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>OpenAI API Configuration</Text>

                    <View style={[styles.apiKeyContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.apiKeyHeader}>
                            <Ionicons name="key-outline" size={20} color={theme.primary} />
                            <Text style={[styles.apiKeyLabel, { color: theme.text }]}>API Key</Text>
                            <TouchableOpacity onPress={() => setIsApiKeyVisible(!isApiKeyVisible)}>
                                <Ionicons
                                    name={isApiKeyVisible ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color={theme.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={[styles.apiKeyInput, {
                                backgroundColor: theme.background,
                                borderColor: theme.border,
                                color: theme.text
                            }]}
                            placeholder="Enter your OpenAI API key"
                            placeholderTextColor={theme.textSecondary}
                            value={isApiKeyVisible ? apiKey : apiKey.replace(/./g, '•')}
                            onChangeText={setApiKey}
                            secureTextEntry={!isApiKeyVisible}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <View style={styles.apiKeyActions}>
                            <TouchableOpacity
                                style={[styles.apiKeyButton, { backgroundColor: theme.primary }]}
                                onPress={saveApiKey}
                                disabled={isLoading}
                            >
                                <Text style={styles.apiKeyButtonText}>Save</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.apiKeyButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                onPress={testApiKey}
                                disabled={isLoading}
                            >
                                <Text style={[styles.apiKeyButtonText, { color: theme.text }]}>Test</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.apiKeyButton, { backgroundColor: '#ff4444' }]}
                                onPress={clearApiKey}
                                disabled={isLoading}
                            >
                                <Text style={styles.apiKeyButtonText}>Clear</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={[styles.helpText, { color: theme.textSecondary }]}>
                        Get your API key from{' '}
                        <Text style={{ color: theme.primary }}>platform.openai.com</Text>
                    </Text>
                </View>

                {/* AI Features Toggle */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>AI Features</Text>

                    <View style={[styles.settingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Ionicons name="bulb-outline" size={24} color={theme.primary} />
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, { color: theme.text }]}>Enable AI Features</Text>
                            <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                                Turn AI features on or off
                            </Text>
                        </View>
                        <Switch
                            value={isAIFeaturesEnabled}
                            onValueChange={toggleAIFeatures}
                            trackColor={{ false: theme.border, true: theme.primary }}
                            thumbColor={isAIFeaturesEnabled ? '#fff' : theme.textSecondary}
                        />
                    </View>
                </View>

                {/* Other Settings */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>

                    <TouchableOpacity
                        style={[styles.settingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={() => navigation.navigate('Preferences')}
                    >
                        <Ionicons name="person-outline" size={24} color={theme.primary} />
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, { color: theme.text }]}>Dietary Preferences</Text>
                            <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                                Set your dietary restrictions and preferences
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.settingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={() => navigation.navigate('Preferences')}
                    >
                        <Ionicons name="restaurant-outline" size={24} color={theme.primary} />
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, { color: theme.text }]}>Cuisine Preferences</Text>
                            <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                                Choose your favorite cuisines
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.settingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={() => navigation.navigate('Preferences')}
                    >
                        <Ionicons name="time-outline" size={24} color={theme.primary} />
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, { color: theme.text }]}>Cooking Time</Text>
                            <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                                Set your preferred cooking time limits
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.settingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={() => navigation.navigate('Preferences')}
                    >
                        <Ionicons name="mic-outline" size={24} color={theme.primary} />
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, { color: theme.text }]}>Voice Commands</Text>
                            <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                                Configure voice input settings
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>
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
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15
    },
    apiKeyContainer: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 10,
    },
    apiKeyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    apiKeyLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
        flex: 1
    },
    apiKeyInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12
    },
    apiKeyActions: {
        flexDirection: 'row',
        gap: 10
    },
    apiKeyButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1
    },
    apiKeyButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    helpText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    settingsContainer: {
        gap: 12,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    settingContent: {
        flex: 1,
        marginLeft: 12,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    settingSubtitle: {
        fontSize: 14,
    },
}); 