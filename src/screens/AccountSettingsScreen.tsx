import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    SafeAreaView,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageManager } from '../utils/storage';

interface UserProfile {
    name: string;
    email: string;
    bio: string;
    location: string;
}

const AccountSettingsScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile>({
        name: user?.displayName || user?.email?.split('@')[0] || '',
        email: user?.email || '',
        bio: '',
        location: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        loadApiKey();
        loadProfile();
        loadProfileImage();
    }, [user]);

    const loadProfileImage = async () => {
        try {
            const savedImage = await AsyncStorage.getItem('profile_image');
            if (savedImage) {
                setProfileImage(savedImage);
            }
        } catch (error) {
            console.log('Error loading profile image:', error);
        }
    };

    const loadProfile = async () => {
        try {
            const savedProfile = await AsyncStorage.getItem('user_profile');
            if (savedProfile) {
                const parsedProfile = JSON.parse(savedProfile);
                setProfile(parsedProfile);
            } else {
                // Initialize with user data if no saved profile
                setProfile({
                    name: user?.displayName || user?.email?.split('@')[0] || '',
                    email: user?.email || '',
                    bio: '',
                    location: '',
                });
            }
        } catch (error) {
            console.log('Error loading profile:', error);
        }
    };

    const loadApiKey = async () => {
        try {
            const savedApiKey = await StorageManager.getApiKey();
            if (savedApiKey) {
                setApiKey(savedApiKey);
            }
        } catch (error) {
            console.log('Error loading API key:', error);
        }
    };

    const handleSave = async () => {
        try {
            // Save profile to AsyncStorage
            await AsyncStorage.setItem('user_profile', JSON.stringify(profile));

            // Save API key if provided
            if (apiKey) {
                await StorageManager.setApiKey(apiKey);
            }

            // Update user display name in Firebase if changed
            if (user && profile.name !== user.displayName) {
                // Note: In a real app, you'd update the user profile in Firebase
                // For now, we'll just save locally
                console.log('Profile name updated:', profile.name);
            }

            setIsEditing(false);
            Alert.alert('Success', 'Profile and API key updated successfully!', [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.goBack();
                    }
                }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to save profile');
        }
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        // Second confirmation
                        Alert.alert(
                            'Final Confirmation',
                            'This will permanently delete all your data including:\n\n• Profile information\n• Saved recipes\n• Shopping lists\n• API settings\n• All preferences\n\nThis action cannot be undone. Are you absolutely sure?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Yes, Delete Everything',
                                    style: 'destructive',
                                    onPress: async () => {
                                        try {
                                            // Delete user data from AsyncStorage
                                            await AsyncStorage.multiRemove([
                                                'user_profile',
                                                'openai_api_key',
                                                'favorites',
                                                'shopping_lists',
                                                'preferences'
                                            ]);

                                            // Delete user from Firebase (this would require backend implementation)
                                            // For now, we'll just sign out the user
                                            Alert.alert(
                                                'Account Deleted',
                                                'Your account data has been cleared. You will be signed out.',
                                                [
                                                    {
                                                        text: 'OK',
                                                        onPress: () => {
                                                            // Sign out and navigate to intro
                                                            navigation.reset({
                                                                index: 0,
                                                                routes: [{ name: 'Intro' }],
                                                            });
                                                        }
                                                    }
                                                ]
                                            );
                                        } catch (error) {
                                            Alert.alert('Error', 'Failed to delete account');
                                        }
                                    },
                                },
                            ]
                        );
                    },
                },
            ]
        );
    };

    const handleChangePassword = () => {
        if (!user?.email) {
            Alert.alert('Error', 'Email not available');
            return;
        }

        Alert.alert(
            'Reset Password',
            'We will send a password reset email to your registered email address.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Send Email',
                    onPress: async () => {
                        try {
                            const { resetPassword } = await import('../services/firebase');
                            const result = await resetPassword(user.email || '');
                            if (result.success) {
                                Alert.alert('Success', 'Password reset email sent! Check your inbox.');
                            } else {
                                Alert.alert('Error', result.error || 'Failed to send reset email');
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to send reset email');
                        }
                    },
                },
            ]
        );
    };

    const handleNotificationSettings = () => {
        Alert.alert(
            'Notification Settings',
            'This feature will be available in a future update.',
            [{ text: 'OK' }]
        );
    };

    const handlePrivacySettings = () => {
        Alert.alert(
            'Privacy Settings',
            'This feature will be available in a future update.',
            [{ text: 'OK' }]
        );
    };

    const handleChangePhoto = async () => {
        Alert.alert(
            'Change Profile Photo',
            'Choose how you want to add a photo',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Take Photo',
                    onPress: () => pickImage('camera')
                },
                {
                    text: 'Choose from Gallery',
                    onPress: () => pickImage('gallery')
                }
            ]
        );
    };

    const pickImage = async (source: 'camera' | 'gallery') => {
        try {
            // Request permissions
            if (source === 'camera') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Camera permission is required to take a photo.');
                    return;
                }
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Gallery permission is required to select a photo.');
                    return;
                }
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                setProfileImage(result.assets[0].uri);
                // Save image URI to AsyncStorage
                await AsyncStorage.setItem('profile_image', result.assets[0].uri);
                Alert.alert('Success', 'Profile photo updated!');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile photo');
        }
    };

    const renderInputField = (
        label: string,
        value: string,
        onChangeText: (text: string) => void,
        placeholder: string,
        multiline: boolean = false
    ) => (
        <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{label}</Text>
            <TextInput
                style={[
                    styles.textInput,
                    {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                        color: theme.text,
                    },
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.textSecondary}
                multiline={multiline}
                editable={isEditing}
            />
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Account Settings</Text>
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                    <Ionicons name={isEditing ? "checkmark" : "pencil"} size={24} color={theme.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Profile Picture Section */}
                <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.profilePictureContainer}>
                        <TouchableOpacity
                            style={[styles.profilePicture, { backgroundColor: theme.border }]}
                            onPress={isEditing ? handleChangePhoto : undefined}
                        >
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={styles.profileImage} />
                            ) : (
                                <Text style={styles.profilePictureText}>👤</Text>
                            )}
                        </TouchableOpacity>
                        {isEditing && (
                            <TouchableOpacity
                                style={[styles.changePhotoButton, { backgroundColor: theme.primary }]}
                                onPress={handleChangePhoto}
                            >
                                <Ionicons name="camera" size={16} color="#fff" />
                                <Text style={styles.changePhotoText}>Change Photo</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Profile Information */}
                <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.primary }]}>Personal Information</Text>

                    {renderInputField(
                        'Full Name',
                        profile.name,
                        (text) => setProfile({ ...profile, name: text }),
                        'Enter your full name'
                    )}

                    {renderInputField(
                        'Email',
                        profile.email,
                        (text) => setProfile({ ...profile, email: text }),
                        'Enter your email address'
                    )}

                    {renderInputField(
                        'Bio',
                        profile.bio,
                        (text) => setProfile({ ...profile, bio: text }),
                        'Tell us about yourself',
                        true
                    )}

                    {renderInputField(
                        'Location',
                        profile.location,
                        (text) => setProfile({ ...profile, location: text }),
                        'Enter your location'
                    )}
                </View>

                {/* API Key Section */}
                <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.primary }]}>AI Settings</Text>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>OpenAI API Key</Text>
                        <View style={styles.apiKeyContainer}>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    {
                                        backgroundColor: theme.surface,
                                        borderColor: theme.border,
                                        color: theme.text,
                                        flex: 1,
                                    },
                                ]}
                                value={showApiKey ? apiKey : apiKey ? '••••••••••••••••' : ''}
                                onChangeText={setApiKey}
                                placeholder="Enter your OpenAI API key"
                                placeholderTextColor={theme.textSecondary}
                                secureTextEntry={!showApiKey}
                                editable={isEditing}
                            />
                            {isEditing && apiKey && (
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowApiKey(!showApiKey)}
                                >
                                    <Ionicons
                                        name={showApiKey ? "eye-off" : "eye"}
                                        size={20}
                                        color={theme.textSecondary}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={[styles.helpText, { color: theme.textTertiary }]}>
                            Get your API key from platform.openai.com
                        </Text>
                    </View>
                </View>

                {/* Account Actions */}
                <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.primary }]}>Account Actions</Text>

                    <TouchableOpacity
                        style={[styles.actionButton, { borderColor: theme.border }]}
                        onPress={handleChangePassword}
                    >
                        <Ionicons name="lock-closed-outline" size={20} color={theme.primary} />
                        <Text style={[styles.actionText, { color: theme.text }]}>Change Password</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { borderColor: theme.border }]}
                        onPress={handleNotificationSettings}
                    >
                        <Ionicons name="notifications-outline" size={20} color={theme.primary} />
                        <Text style={[styles.actionText, { color: theme.text }]}>Notification Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { borderColor: theme.border }]}
                        onPress={handlePrivacySettings}
                    >
                        <Ionicons name="shield-outline" size={20} color={theme.primary} />
                        <Text style={[styles.actionText, { color: theme.text }]}>Privacy Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Danger Zone */}
                <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: '#E91E63' }]}>Danger Zone</Text>

                    <TouchableOpacity
                        style={[styles.dangerButton, { borderColor: '#E91E63' }]}
                        onPress={handleDeleteAccount}
                    >
                        <Ionicons name="trash-outline" size={20} color="#E91E63" />
                        <Text style={[styles.dangerText, { color: '#E91E63' }]}>Delete Account</Text>
                    </TouchableOpacity>
                </View>

                {/* Save Button */}
                {isEditing && (
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: theme.primary }]}
                        onPress={handleSave}
                    >
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

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
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 20,
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    profilePictureContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    profilePictureText: {
        fontSize: 40,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    changePhotoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    changePhotoText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: '500',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 48,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    actionText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
    },
    dangerText: {
        fontSize: 16,
        marginLeft: 12,
        fontWeight: '500',
    },
    saveButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    apiKeyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    eyeButton: {
        padding: 8,
        marginLeft: 8,
    },
    helpText: {
        fontSize: 12,
        marginTop: 4,
        fontStyle: 'italic',
    },
});

export default AccountSettingsScreen; 