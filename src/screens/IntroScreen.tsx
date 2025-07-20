import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import GradientButton from '../components/GradientButton';
import ModernCard from '../components/ModernCard';

const { width: screenWidth } = Dimensions.get('window');

export default function IntroScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const features = [
        {
            icon: 'restaurant-outline',
            title: 'AI Recipe Recommendations',
            description: 'Get personalized recipe suggestions based on your preferences and ingredients',
        },
        {
            icon: 'search-outline',
            title: 'Smart Recipe Search',
            description: 'Find recipes by ingredients, cuisine, or dietary restrictions',
        },
        {
            icon: 'list-outline',
            title: 'Shopping List Management',
            description: 'Automatically generate shopping lists from your meal plans',
        },
        {
            icon: 'nutrition-outline',
            title: 'Nutrition Analysis',
            description: 'Track calories, macros, and nutritional information for every recipe',
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % features.length;
            setCurrentIndex(nextIndex);

            // Animate fade out
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                // Animate fade in
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            });
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, [currentIndex, features.length]);

    const renderFeatureCard = (feature: any, index: number) => {
        const isActive = index === currentIndex;

        return (
            <Animated.View
                key={index}
                style={[
                    styles.featureCardContainer,
                    {
                        opacity: isActive ? fadeAnim : 0,
                        transform: [{
                            scale: isActive ? 1 : 0.9
                        }]
                    }
                ]}
            >
                <ModernCard variant="elevated" style={styles.featureCard}>
                    <View style={styles.featureContent}>
                        <View style={[styles.featureIcon, { backgroundColor: theme.primary + '20' }]}>
                            <Ionicons name={feature.icon as any} size={32} color={theme.primary} />
                        </View>
                        <View style={styles.featureText}>
                            <Text style={[styles.featureTitle, { color: theme.text }]}>
                                {feature.title}
                            </Text>
                            <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
                                {feature.description}
                            </Text>
                        </View>
                    </View>
                </ModernCard>
            </Animated.View>
        );
    };

    const handleCardPress = () => {
        const nextIndex = (currentIndex + 1) % features.length;
        setCurrentIndex(nextIndex);

        // Animate fade out
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            // Animate fade in
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });
    };

    const renderDots = () => {
        return (
            <View style={styles.dotsContainer}>
                {features.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: index === currentIndex ? theme.primary : theme.border,
                                width: index === currentIndex ? 24 : 8,
                            }
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={[styles.logoContainer, { backgroundColor: theme.primary + '20' }]}>
                        <Ionicons name="restaurant" size={48} color={theme.primary} />
                    </View>
                    <Text style={[styles.appName, { color: theme.text }]}>EasyMealAI</Text>
                    <Text style={[styles.tagline, { color: theme.textSecondary }]}>
                        The ultimate AI-powered cooking companion
                    </Text>
                </View>

                {/* Features Carousel Section */}
                <View style={styles.featuresSection}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        What you can do
                    </Text>

                    <TouchableOpacity
                        style={styles.carouselContainer}
                        onPress={handleCardPress}
                        activeOpacity={0.9}
                    >
                        {features.map((feature, index) => renderFeatureCard(feature, index))}
                    </TouchableOpacity>

                    {renderDots()}
                    <Text style={[styles.tapHint, { color: theme.textTertiary }]}>
                        Tap to see more features
                    </Text>
                </View>

                {/* CTA Section */}
                <View style={styles.ctaSection}>
                    <GradientButton
                        title="Get Started"
                        onPress={() => navigation.replace('Login')}
                        icon="arrow-forward-outline"
                        variant="primary"
                        size="xlarge"
                        pill={true}
                        ripple={true}
                        style={styles.getStartedButton}
                    />
                    <Text style={[styles.disclaimer, { color: theme.textTertiary }]}>
                        Free to start • No credit card required
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        paddingTop: 20,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    tagline: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    featuresSection: {
        marginBottom: 40,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 30,
        textAlign: 'center',
    },
    carouselContainer: {
        height: 200,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureCardContainer: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
    },
    featureCard: {
        width: screenWidth - 80,
        maxWidth: 400,
    },
    featureContent: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    featureIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    featureText: {
        alignItems: 'center',
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        height: 20,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    ctaSection: {
        alignItems: 'center',
    },
    getStartedButton: {
        marginBottom: 16,
        minWidth: 320,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 16,
    },
    disclaimer: {
        fontSize: 12,
        textAlign: 'center',
    },
    tapHint: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
    },
}); 