import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    FlatList,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface OnboardingStep {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    color: string;
}

const onboardingSteps: OnboardingStep[] = [
    {
        id: 'welcome',
        title: 'Welcome to EasyMeals AI!',
        subtitle: 'Your AI-powered cooking companion',
        description: "Hi! I'm Clara, your personal cooking assistant! 👩‍🍳 I'm here to help you discover amazing recipes, plan your meals, and make cooking fun and easy.",
        icon: 'restaurant',
        color: '#8B5CF6',
    },
    {
        id: 'chat',
        title: 'Chat with Clara',
        subtitle: 'Your AI cooking assistant',
        description: "Ask me anything about cooking! I can suggest recipes, help with meal planning, suggest ingredient substitutions, and answer all your cooking questions.",
        icon: 'chatbubble-ellipses',
        color: '#10B981',
    },
    {
        id: 'explore',
        title: 'Explore Recipes',
        subtitle: 'Discover delicious dishes',
        description: "Browse our collection of recipes or search for specific dishes. Find recipes by cuisine, dietary preferences, or ingredients you have on hand.",
        icon: 'search',
        color: '#F59E0B',
    },
    {
        id: 'plan',
        title: 'Meal Planning',
        subtitle: 'Organize your week',
        description: "Plan your meals for the week ahead. I'll help you create shopping lists and ensure you have everything you need for delicious meals.",
        icon: 'calendar',
        color: '#3B82F6',
    },
    {
        id: 'shop',
        title: 'Shopping Lists',
        subtitle: 'Never forget ingredients',
        description: "Automatically generate shopping lists from your meal plans or create custom lists. Never forget an ingredient again!",
        icon: 'list',
        color: '#EF4444',
    },
    {
        id: 'ready',
        title: "You're All Set!",
        subtitle: 'Ready to start cooking',
        description: "You're ready to start your culinary journey! Tap 'Get Started' to begin exploring recipes and chatting with me. Happy cooking! 🍳",
        icon: 'checkmark-circle',
        color: '#8B5CF6',
    },
];

export default function OnboardingScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const handleNext = () => {
        if (currentIndex < onboardingSteps.length - 1) {
            setCurrentIndex(currentIndex + 1);
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
        } else {
            completeOnboarding();
        }
    };

    const handleSkip = () => {
        completeOnboarding();
    };

    const completeOnboarding = async () => {
        try {
            console.log('Completing onboarding...');
            await AsyncStorage.setItem('onboarding_completed', 'true');
            console.log('Onboarding completed successfully');

            // Verify the save worked
            const savedStatus = await AsyncStorage.getItem('onboarding_completed');
            console.log('Verified saved status:', savedStatus);

            navigation.replace('Home');
        } catch (error) {
            console.log('Error saving onboarding status:', error);
            navigation.replace('Home');
        }
    };

    const renderStep = ({ item, index }: { item: OnboardingStep; index: number }) => (
        <View style={[styles.stepContainer, { width: screenWidth }]}>
            <View style={styles.stepContent}>
                {/* Icon */}
                <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon as any} size={60} color={item.color} />
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                    <Text style={[styles.stepTitle, { color: theme.text }]}>
                        {item.title}
                    </Text>
                    <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>
                        {item.subtitle}
                    </Text>
                    <Text style={[styles.stepDescription, { color: theme.text }]}>
                        {item.description}
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderDots = () => (
        <View style={styles.dotsContainer}>
            {onboardingSteps.map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        {
                            backgroundColor: index === currentIndex ? onboardingSteps[currentIndex].color : theme.border,
                            width: index === currentIndex ? 24 : 8,
                        }
                    ]}
                />
            ))}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Skip Button */}
            <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
                activeOpacity={0.7}
            >
                <Text style={[styles.skipText, { color: theme.textSecondary }]}>
                    Skip
                </Text>
            </TouchableOpacity>

            {/* Steps */}
            <FlatList
                ref={flatListRef}
                data={onboardingSteps}
                renderItem={renderStep}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                    setCurrentIndex(newIndex);
                }}
                scrollEnabled={false}
            />

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                {/* Dots */}
                {renderDots()}

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    {currentIndex < onboardingSteps.length - 1 ? (
                        <TouchableOpacity
                            style={[styles.nextButton, { backgroundColor: onboardingSteps[currentIndex].color }]}
                            onPress={handleNext}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.nextButtonText}>Next</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.getStartedButton, { backgroundColor: onboardingSteps[currentIndex].color }]}
                            onPress={handleNext}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.getStartedButtonText}>Get Started</Text>
                            <Ionicons name="checkmark" size={20} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    skipButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '600',
    },
    stepContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    stepContent: {
        alignItems: 'center',
        maxWidth: 320,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    textContainer: {
        alignItems: 'center',
    },
    stepTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    stepSubtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    stepDescription: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        opacity: 0.9,
    },
    bottomSection: {
        paddingHorizontal: 30,
        paddingBottom: 40,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    buttonContainer: {
        alignItems: 'center',
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        minWidth: 140,
        justifyContent: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginRight: 8,
    },
    getStartedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        minWidth: 160,
        justifyContent: 'center',
    },
    getStartedButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginRight: 8,
    },
}); 