import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { signIn, signUp, resetPassword, trackUserAction } from '../services/firebase';
import GradientButton from '../components/GradientButton';
import ModernCard from '../components/ModernCard';

export default function LoginScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Load remember me preference and saved email on component mount
    React.useEffect(() => {
        const loadSavedPreferences = async () => {
            try {
                const savedRememberMe = await AsyncStorage.getItem('remember_me');
                if (savedRememberMe !== null) {
                    setRememberMe(savedRememberMe === 'true');

                    // If remember me is enabled, load the saved email
                    if (savedRememberMe === 'true') {
                        const savedEmail = await AsyncStorage.getItem('saved_email');
                        if (savedEmail) {
                            setEmail(savedEmail);
                        }
                    }
                }
            } catch (error) {
                console.log('Error loading saved preferences:', error);
            }
        };

        loadSavedPreferences();
    }, []);

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setIsLoading(true);
        try {
            // Save remember me preference and email
            if (!isSignUp) {
                await AsyncStorage.setItem('remember_me', rememberMe.toString());

                // Save email if remember me is enabled
                if (rememberMe) {
                    await AsyncStorage.setItem('saved_email', email);
                } else {
                    // Clear saved email if remember me is disabled
                    await AsyncStorage.removeItem('saved_email');
                }
            }

            const result = isSignUp
                ? await signUp(email, password)
                : await signIn(email, password, rememberMe);

            if (result.success) {
                trackUserAction(isSignUp ? 'user_signup' : 'user_signin', { email, rememberMe });
                // Navigation will be handled automatically by AuthNavigator
                // No need to manually navigate
            } else {
                Alert.alert('Error', result.error || 'Authentication failed');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email first');
            return;
        }

        setIsLoading(true);
        try {
            const result = await resetPassword(email);
            if (result.success) {
                Alert.alert('Success', 'Password reset email sent! Check your inbox.');
                trackUserAction('password_reset_requested', { email });
            } else {
                Alert.alert('Error', result.error || 'Failed to send reset email');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
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
                                secureTextEntry={!showPassword}
                                placeholderTextColor={theme.textTertiary}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color={theme.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>

                        {!isSignUp && (
                            <View style={styles.forgotPasswordRow}>
                                <TouchableOpacity
                                    style={styles.rememberMeContainer}
                                    onPress={async () => {
                                        const newRememberMe = !rememberMe;
                                        setRememberMe(newRememberMe);

                                        // If user unchecks remember me, clear saved email
                                        if (!newRememberMe) {
                                            try {
                                                await AsyncStorage.removeItem('saved_email');
                                            } catch (error) {
                                                console.log('Error clearing saved email:', error);
                                            }
                                        }
                                    }}
                                >
                                    <View style={[
                                        styles.checkbox,
                                        {
                                            backgroundColor: rememberMe ? theme.primary : 'transparent',
                                            borderColor: rememberMe ? theme.primary : theme.border
                                        }
                                    ]}>
                                        {rememberMe && (
                                            <Ionicons name="checkmark" size={16} color="#fff" />
                                        )}
                                    </View>
                                    <Text style={[styles.rememberMeText, { color: theme.textSecondary }]}>
                                        Remember me
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleForgotPassword}>
                                    <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>
                            </View>
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

                        <TouchableOpacity
                            style={styles.backToIntro}
                            onPress={() => navigation.replace('Intro')}
                        >
                            <Text style={[styles.backToIntroText, { color: theme.textTertiary }]}>
                                ← Back to Intro
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
    eyeButton: {
        padding: 8,
        marginLeft: 8,
    },
    forgotPasswordRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    rememberMeText: {
        fontSize: 14,
        fontWeight: '500',
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
    backToIntro: {
        marginTop: 16,
        alignItems: 'center',
    },
    backToIntroText: {
        fontSize: 14,
        fontWeight: '500',
    },
}); 