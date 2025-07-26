import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    TextInput,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { StorageManager } from '../utils/storage';

export default function AISettingsScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [apiKey, setApiKey] = useState('');
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState('');

    React.useEffect(() => {
        loadApiKey();
    }, []);

    const loadApiKey = async () => {
        try {
            console.log('Loading API key from storage...');
            const storedKey = await StorageManager.getApiKey();
            console.log('Stored API key found:', storedKey ? 'Yes' : 'No');
            if (storedKey) {
                setApiKey(storedKey);
                console.log('API key loaded successfully');
            } else {
                console.log('No API key found in storage');
            }
        } catch (error) {
            console.error('Error loading API key:', error);
        }
    };

    const saveApiKey = async () => {
        try {
            console.log('Saving API key to storage...');
            const success = await StorageManager.setApiKey(apiKey);
            console.log('API key save result:', success ? 'Success' : 'Failed');

            if (success) {
                Alert.alert('Success', 'API key saved successfully!');
            } else {
                Alert.alert('Error', 'Failed to save API key. Please try again.');
            }
        } catch (error) {
            console.error('Error saving API key:', error);
            Alert.alert('Error', 'Failed to save API key.');
        }
    };

    const testApiKey = async () => {
        if (!apiKey.trim()) {
            Alert.alert('Error', 'Please enter an API key first.');
            return;
        }

        setIsTesting(true);
        setTestResult('Testing...');

        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setTestResult('✅ API key is valid!');
            } else {
                const errorData = await response.json();
                setTestResult(`❌ API key is invalid: ${errorData.error?.message || 'Unknown error'}`);
            }
        } catch (error: any) {
            setTestResult(`❌ Network error: ${error.message}`);
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>AI Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* API Key Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>OpenAI API Key</Text>
                    <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
                        Enter your OpenAI API key to enable AI features
                    </Text>

                    <TextInput
                        style={[styles.input, {
                            backgroundColor: theme.surface,
                            color: theme.text,
                            borderColor: theme.border
                        }]}
                        placeholder="sk-..."
                        placeholderTextColor={theme.textSecondary}
                        value={apiKey}
                        onChangeText={setApiKey}
                        secureTextEntry
                    />

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.primary }]}
                            onPress={saveApiKey}
                        >
                            <Text style={styles.buttonText}>Save Key</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={testApiKey}
                            disabled={isTesting}
                        >
                            <Text style={[styles.buttonText, { color: theme.text }]}>
                                {isTesting ? 'Testing...' : 'Test Key'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {testResult ? (
                        <Text style={[styles.testResult, { color: theme.text }]}>{testResult}</Text>
                    ) : null}
                </View>

                {/* Voice Features Info */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Voice Features</Text>
                    <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
                        Voice recognition is available on web browsers that support the Web Speech API. On mobile devices, voice features are being prepared for future updates.
                    </Text>

                    <View style={[styles.infoBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
                        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                            For the best experience, use the quick prompts or type your messages directly.
                        </Text>
                    </View>
                </View>

                {/* Instructions */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>How to Get an API Key</Text>
                    <Text style={[styles.instructionText, { color: theme.textSecondary }]}>
                        1. Go to platform.openai.com{'\n'}
                        2. Sign up or log in{'\n'}
                        3. Navigate to API Keys{'\n'}
                        4. Create a new secret key{'\n'}
                        5. Copy and paste it here
                    </Text>
                </View>
            </ScrollView>
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
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    sectionDescription: {
        fontSize: 14,
        marginBottom: 15,
        lineHeight: 20,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 15,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    testResult: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '500',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        marginTop: 10,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
        marginLeft: 10,
        flex: 1,
    },
    instructionText: {
        fontSize: 14,
        lineHeight: 22,
    },
}); 