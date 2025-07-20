import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import mockAuth from '../services/mockAuth';
import GradientButton from '../components/GradientButton';
import ModernCard from '../components/ModernCard';

export default function LoginScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setIsLoading(true);
        try {
            const result = isSignUp
                ? await mockAuth.signUp(email, password)
                : await mockAuth.signIn(email, password);

            if (result.success) {
                navigation.replace('Home');
            } else {
                Alert.alert('Error', result.error || 'Authentication failed');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email first');
            return;
        }
        // TODO: Implement password reset
        Alert.alert('Coming Soon', 'Password reset feature will be available soon');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={[styles.logoContainer, { backgroundColor: theme.primary + '20' }]}>
                        <Ionicons name="restaurant" size={48} color={theme.primary} />
                    </View>
                    <Text style={[styles.title, { color: theme.text }]}>
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        {isSignUp ? 'Join EasyMealAI to start cooking' : 'Sign in to continue cooking'}
                    </Text>
                </View>

                <ModernCard variant="elevated" style={styles.formCard}>
                    <View style={styles.form}>
                        <View style={[styles.inputContainer, { backgroundColor: theme.surfaceVariant, borderColor: theme.border }]}>
                            <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor={theme.textTertiary}
                            />
                        </View>

                        <View style={[styles.inputContainer, { backgroundColor: theme.surfaceVariant, borderColor: theme.border }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholderTextColor={theme.textTertiary}
                            />
                        </View>

                        {!isSignUp && (
                            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
                                <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>
                        )}

                        <GradientButton
                            title={isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                            onPress={handleAuth}
                            icon={isSignUp ? "person-add-outline" : "log-in-outline"}
                            disabled={isLoading}
                            size="xlarge"
                            pill={true}
                            ripple={true}
                            style={styles.authButton}
                        />

                        <TouchableOpacity
                            style={styles.switchMode}
                            onPress={() => setIsSignUp(!isSignUp)}
                        >
                            <Text style={[styles.switchModeText, { color: theme.textSecondary }]}>
                                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                            </Text>
                            <Text style={[styles.switchModeLink, { color: theme.primary }]}>
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ModernCard>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    formCard: {
        marginHorizontal: 8,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '500',
    },
    authButton: {
        marginBottom: 24,
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
    switchMode: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchModeText: {
        fontSize: 14,
    },
    switchModeLink: {
        fontSize: 14,
        fontWeight: '600',
    },
}); 