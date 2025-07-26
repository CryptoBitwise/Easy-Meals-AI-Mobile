import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getAIStepByStep } from '../services/aiService';

const mockRecipe = {
    title: 'Spicy Chickpea Buddha Bowl',
    steps: [
        'Preheat oven to 400°F (200°C).',
        'Rinse and drain chickpeas. Toss with olive oil and spices.',
        'Spread chickpeas on a baking sheet and roast for 25 minutes.',
        'Prepare veggies and cook quinoa while chickpeas roast.',
        'Assemble bowl: quinoa, veggies, roasted chickpeas, drizzle with tahini sauce.',
        'Serve and enjoy your healthy meal!'
    ]
};

export default function AIStepByStepScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<string[]>([]);

    useEffect(() => {
        loadSteps();
    }, []);

    const loadSteps = async () => {
        const stepData = await getAIStepByStep(mockRecipe);
        setSteps(stepData);
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Ionicons name="list-outline" size={24} color={theme.primary} />
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Step-by-Step Guide</Text>
                </View>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 32 }}>
                <Text style={[styles.recipeTitle, { color: theme.text }]}>{mockRecipe.title}</Text>

                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    backgroundColor: theme.primary,
                                    width: `${((currentStep + 1) / steps.length) * 100}%`
                                }
                            ]}
                        />
                    </View>
                    <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                        Step {currentStep + 1} of {steps.length}
                    </Text>
                </View>

                <View style={[styles.stepContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.stepNumber, { color: theme.primary }]}>
                        Step {currentStep + 1}
                    </Text>
                    <Text style={[styles.stepText, { color: theme.text }]}>
                        {steps[currentStep]}
                    </Text>
                </View>

                <View style={styles.navigationButtons}>
                    <TouchableOpacity
                        style={[
                            styles.navButton,
                            { backgroundColor: theme.surface, borderColor: theme.border },
                            currentStep === 0 && { opacity: 0.5 }
                        ]}
                        onPress={prevStep}
                        disabled={currentStep === 0}
                    >
                        <Ionicons name="chevron-back" size={20} color={theme.text} />
                        <Text style={[styles.navButtonText, { color: theme.text }]}>Previous</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.navButton,
                            { backgroundColor: theme.primary }
                        ]}
                        onPress={nextStep}
                        disabled={currentStep === steps.length - 1}
                    >
                        <Text style={[styles.navButtonText, { color: '#fff' }]}>Next</Text>
                        <Ionicons name="chevron-forward" size={20} color="#fff" />
                    </TouchableOpacity>
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
        paddingHorizontal: 18,
        paddingTop: 20,
    },
    recipeTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
    },
    progressContainer: {
        marginBottom: 20,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        textAlign: 'center',
    },
    stepContainer: {
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 20,
    },
    stepNumber: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    stepText: {
        fontSize: 16,
        lineHeight: 24,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        minWidth: 120,
        justifyContent: 'center',
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginHorizontal: 4,
    },
}); 