import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
    name: string;
    email: string;
    bio: string;
    location: string;
}

const AccountSettingsScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const [profile, setProfile] = useState<UserProfile>({
        name: 'John Doe',
        email: 'john.doe@example.com',
        bio: 'Food enthusiast and home cook',
        location: 'New York, NY',
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        try {
            await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save profile');
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        // Handle account deletion
                        Alert.alert('Account Deleted', 'Your account has been deleted.');
                    },
                },
            ]
        );
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
                        <View style={[styles.profilePicture, { backgroundColor: theme.border }]}>
                            <Text style={styles.profilePictureText}>👤</Text>
                        </View>
                        {isEditing && (
                            <TouchableOpacity style={[styles.changePhotoButton, { backgroundColor: theme.primary }]}>
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

                {/* Account Actions */}
                <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.primary }]}>Account Actions</Text>

                    <TouchableOpacity style={[styles.actionButton, { borderColor: theme.border }]}>
                        <Ionicons name="lock-closed-outline" size={20} color={theme.primary} />
                        <Text style={[styles.actionText, { color: theme.text }]}>Change Password</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, { borderColor: theme.border }]}>
                        <Ionicons name="notifications-outline" size={20} color={theme.primary} />
                        <Text style={[styles.actionText, { color: theme.text }]}>Notification Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, { borderColor: theme.border }]}>
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
});

export default AccountSettingsScreen; 