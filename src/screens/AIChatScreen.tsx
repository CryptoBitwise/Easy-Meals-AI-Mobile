import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Alert,
    PermissionsAndroid,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getAIChatResponse } from '../services/aiService';

// Type declarations for speech recognition
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export default function AIChatScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi! I'm Culinary Clara, your AI cooking assistant! 👩‍🍳 I can help you find recipes, plan meals, suggest substitutions, and answer all your cooking questions. What would you like to cook today?",
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const flatListRef = useRef<FlatList>(null);

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
        console.log('Microphone button pressed - starting voice input...');
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
                        console.log('Speech recognition started successfully');
                    };

                    recognition.onresult = (event: any) => {
                        const transcript = event.results[0][0].transcript;
                        console.log('Speech recognized:', transcript);
                        setInputText(transcript);
                        setIsListening(false);
                    };

                    recognition.onerror = (event: any) => {
                        console.error('Speech recognition error:', event.error);
                        setIsListening(false);
                        Alert.alert('Voice Error', 'Could not recognize speech. Please try typing instead.');
                    };

                    recognition.onend = () => {
                        setIsListening(false);
                        console.log('Speech recognition ended');
                    };

                    recognition.start();
                } else {
                    console.log('Speech recognition not supported in this browser');
                    Alert.alert('Not Supported', 'Voice recognition is not supported in this browser. Please type your message.');
                }
            } else {
                // For mobile, we'll automatically select a quick prompt for better UX
                console.log('Mobile platform detected - auto-selecting quick prompt');
                const prompts = [
                    "Quick dinner ideas",
                    "Vegetarian recipes",
                    "Meal plan for the week",
                    "What can I make with chicken?",
                    "Healthy breakfast options",
                    "Dessert recipes"
                ];
                const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
                console.log('Auto-selected quick prompt:', randomPrompt);
                setInputText(randomPrompt);

                // Show a brief success message
                Alert.alert(
                    'Quick Prompt Selected',
                    `"${randomPrompt}" - Tap send to ask the AI!`,
                    [{ text: 'OK' }]
                );
            }
        } catch (e) {
            console.error('Voice input error:', e);
            Alert.alert('Voice Error', 'Could not start voice input. Please try typing instead.');
        }
    };

    const quickPrompts = [
        "Quick dinner ideas",
        "Vegetarian recipes",
        "Meal plan for the week",
        "What can I make with chicken?",
        "Healthy breakfast options",
        "Dessert recipes",
    ];

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        try {
            console.log('Sending message to AI:', inputText);
            const aiResponse = await getAIChatResponse(inputText);
            console.log('AI response received:', aiResponse);

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: aiResponse,
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error: any) {
            console.error('AI Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: `Error: ${error?.message || 'Failed to get AI response. Please check your API key and try again.'}`,
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const generateAIResponse = async (input: string) => {
        return await getAIChatResponse(input);
    };

    const handleQuickPrompt = (prompt: string) => {
        setInputText(prompt);
    };

    const handleClearChat = () => {
        Alert.alert(
            'Clear Chat',
            'Are you sure you want to clear all messages? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => {
                        setMessages([{
                            id: '1',
                            text: "Hi! I'm Culinary Clara, your AI cooking assistant! 👩‍🍳 I can help you find recipes, plan meals, suggest substitutions, and answer all your cooking questions. What would you like to cook today?",
                            isUser: false,
                            timestamp: new Date(),
                        }]);
                        setShowMenu(false);
                    }
                }
            ]
        );
    };

    const handleExportChat = () => {
        const chatText = messages.map(msg =>
            `${msg.isUser ? 'You' : 'Clara'}: ${msg.text}`
        ).join('\n\n');

        Alert.alert(
            'Export Chat',
            'Chat export feature coming soon! This will allow you to save your conversation with Clara.',
            [{ text: 'OK' }]
        );
        setShowMenu(false);
    };

    const handleChatSettings = () => {
        Alert.alert(
            'Chat Settings',
            'Chat settings feature coming soon! This will allow you to customize Clara\'s responses and behavior.',
            [{ text: 'OK' }]
        );
        setShowMenu(false);
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={[
            styles.messageContainer,
            item.isUser ? styles.userMessage : styles.aiMessage
        ]}>
            {!item.isUser && (
                <View style={styles.aiAvatar}>
                    <View style={[styles.avatarContainer, { backgroundColor: theme.primary + '20' }]}>
                        <Ionicons name="restaurant" size={20} color={theme.primary} />
                    </View>
                </View>
            )}
            <View style={[
                styles.messageBubble,
                item.isUser
                    ? [styles.userBubble, {
                        backgroundColor: theme.primary,
                        shadowColor: theme.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 4,
                    }]
                    : [styles.aiBubble, {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                        shadowColor: theme.shadow,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                    }]
            ]}>
                {!item.isUser && (
                    <View style={styles.aiMessageHeader}>
                        <Text style={[styles.aiName, { color: theme.primary }]}>Clara</Text>
                        <Ionicons name="sparkles" size={14} color={theme.primary} />
                    </View>
                )}
                <Text style={[
                    styles.messageText,
                    { color: item.isUser ? '#fff' : theme.text }
                ]}>
                    {item.text}
                </Text>
            </View>
            {item.isUser ? null : (
                <TouchableOpacity
                    style={[styles.speakButton, {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                        shadowColor: theme.shadow,
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 1,
                    }]}
                    onPress={() => Alert.alert('Voice output coming soon!')}
                >
                    <Ionicons name="volume-high-outline" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
            )}
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
                    <Ionicons name="chatbubble-ellipses" size={24} color={theme.primary} />
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Culinary Clara</Text>
                </View>
                <TouchableOpacity onPress={() => setShowMenu(true)}>
                    <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            {/* Quick Prompts */}
            <View style={styles.quickPromptsContainer}>
                <Text style={[styles.quickPromptsTitle, { color: theme.textSecondary }]}>
                    Quick Prompts
                </Text>
                <FlatList
                    data={quickPrompts}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.quickPrompt, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => handleQuickPrompt(item)}
                        >
                            <Text style={[styles.quickPromptText, { color: theme.text }]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.quickPromptsList}
                />
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                style={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                ListFooterComponent={
                    isTyping ? (
                        <View style={styles.typingContainer}>
                            <View style={styles.aiAvatar}>
                                <View style={[styles.avatarContainer, { backgroundColor: theme.primary + '20' }]}>
                                    <Ionicons name="restaurant" size={20} color={theme.primary} />
                                </View>
                            </View>
                            <View style={[styles.typingBubble, {
                                backgroundColor: theme.surface,
                                borderColor: theme.border,
                                shadowColor: theme.shadow,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 2,
                            }]}>
                                <View style={styles.aiMessageHeader}>
                                    <Text style={[styles.aiName, { color: theme.primary }]}>Clara</Text>
                                    <Ionicons name="sparkles" size={14} color={theme.primary} />
                                </View>
                                <Text style={[styles.typingText, { color: theme.textSecondary }]}>
                                    Clara is typing...
                                </Text>
                            </View>
                        </View>
                    ) : null
                }
            />

            {/* Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.inputContainer, {
                    backgroundColor: theme.surface,
                    borderTopColor: theme.border,
                    shadowColor: theme.shadow,
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 4,
                }]}
            >
                <TouchableOpacity
                    style={[styles.micButton, {
                        backgroundColor: theme.surface,
                        borderColor: theme.primary,
                        shadowColor: theme.shadow,
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 1,
                    }, isListening ? styles.micButtonActive : null]}
                    onPress={startVoiceInput}
                >
                    <Ionicons name={isListening ? 'mic' : 'mic-outline'} size={24} color={isListening ? '#fff' : theme.primary} />
                </TouchableOpacity>
                <TextInput
                    style={[styles.textInput, {
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.border,
                        shadowColor: theme.shadow,
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 1,
                    }]}
                    placeholder="Ask Clara anything about cooking..."
                    placeholderTextColor={theme.textSecondary}
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity
                    style={[styles.sendButton, {
                        backgroundColor: theme.primary,
                        shadowColor: theme.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 4,
                    }]}
                    onPress={handleSendMessage}
                    disabled={!inputText.trim()}
                >
                    <Ionicons
                        name="send"
                        size={20}
                        color={inputText.trim() ? '#fff' : theme.textSecondary}
                    />
                </TouchableOpacity>
            </KeyboardAvoidingView>

            {/* Chat Menu Modal */}
            <Modal
                visible={showMenu}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowMenu(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowMenu(false)}
                >
                    <View style={[styles.menuContainer, {
                        backgroundColor: theme.surface,
                        shadowColor: theme.shadow,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 8,
                    }]}>
                        <TouchableOpacity
                            style={[styles.menuItem, { borderBottomColor: theme.border }]}
                            onPress={handleClearChat}
                        >
                            <Ionicons name="trash-outline" size={20} color="#E91E63" />
                            <Text style={[styles.menuItemText, { color: '#E91E63' }]}>Clear Chat</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.menuItem, { borderBottomColor: theme.border }]}
                            onPress={handleExportChat}
                        >
                            <Ionicons name="download-outline" size={20} color={theme.primary} />
                            <Text style={[styles.menuItemText, { color: theme.text }]}>Export Chat</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={handleChatSettings}
                        >
                            <Ionicons name="settings-outline" size={20} color={theme.primary} />
                            <Text style={[styles.menuItemText, { color: theme.text }]}>Chat Settings</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
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
    quickPromptsContainer: {
        padding: 20,
    },
    quickPromptsTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
    },
    quickPromptsList: {
        paddingRight: 20,
    },
    quickPrompt: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 10,
    },
    quickPromptText: {
        fontSize: 14,
    },
    messagesList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    messageContainer: {
        marginVertical: 8,
    },
    userMessage: {
        alignItems: 'flex-end',
    },
    aiMessage: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    userBubble: {
        borderWidth: 0,
    },
    aiBubble: {
        borderWidth: 1,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    typingContainer: {
        marginVertical: 8,
        alignItems: 'flex-start',
    },
    typingBubble: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    typingText: {
        fontSize: 16,
        fontStyle: 'italic',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 20,
        paddingBottom: 40, // Extra padding for navigation bar
        borderTopWidth: 1,
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
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        maxHeight: 100,
        marginRight: 10,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    speakButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        borderWidth: 1,
    },
    aiAvatar: {
        marginRight: 8,
        alignItems: 'flex-start',
    },
    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiMessageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    aiName: {
        fontSize: 12,
        fontWeight: '600',
        marginRight: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        width: 200,
        borderRadius: 12,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 12,
    },
}); 