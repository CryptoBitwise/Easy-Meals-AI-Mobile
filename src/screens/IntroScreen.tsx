import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function IntroScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logo}>🍽️</Text>
                <Text style={styles.appName}>EasyMeals AI</Text>
            </View>
            <Text style={styles.tagline}>AI-powered meal planning & recipes</Text>
            <TouchableOpacity style={styles.getStartedButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        fontSize: 64,
        marginBottom: 8,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    tagline: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 48,
    },
    getStartedButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 32,
        alignItems: 'center',
    },
    getStartedText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
}); 