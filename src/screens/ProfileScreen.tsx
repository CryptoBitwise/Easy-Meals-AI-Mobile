import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Switch,
    Alert,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from '../services/notificationService';

export default function ProfileScreen({ navigation }: any) {
    const { isDarkMode, toggleTheme, theme } = useTheme();
    const { user, signOut } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [aiSuggestions, setAiSuggestions] = useState(true);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        loadUserProfile();
        loadNotificationSettings();
    }, []);

    // Reload profile when screen comes into focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadUserProfile();
        });

        return unsubscribe;
    }, [navigation]);

    const loadUserProfile = async () => {
        try {
            const savedProfile = await AsyncStorage.getItem('user_profile');
            if (savedProfile) {
                setUserProfile(JSON.parse(savedProfile));
            }

            // Load profile image
            const savedImage = await AsyncStorage.getItem('profile_image');
            if (savedImage) {
                setProfileImage(savedImage);
            }
        } catch (error) {
            console.log('Error loading user profile:', error);
        }
    };

    const loadNotificationSettings = async () => {
        try {
            const settings = await notificationService.getSettings();
            setNotifications(settings.enabled);
        } catch (error) {
            console.log('Error loading notification settings:', error);
        }
    };

    const handleNotificationToggle = async (enabled: boolean) => {
        try {
            setNotifications(enabled);
            await notificationService.toggleNotifications(enabled);

            if (enabled) {
                const hasPermission = await notificationService.requestPermissions();
                if (!hasPermission) {
                    Alert.alert(
                        'Permission Required',
                        'Please enable notifications in your device settings to receive cooking reminders and tips.',
                        [{ text: 'OK' }]
                    );
                }
            }
        } catch (error) {
            console.log('Error toggling notifications:', error);
            Alert.alert('Error', 'Failed to update notification settings');
        }
    };



    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        // Navigation will be handled by AuthNavigator
                    }
                },
            ]
        );
    };

    const handleTermsOfService = () => {
        Alert.alert(
            'Terms of Service',
            'EasyMeal AI Terms of Service\n\n' +
            '1. Acceptance of Terms\n' +
            'By using EasyMeal AI, you agree to these terms.\n\n' +
            '2. Service Description\n' +
            'EasyMeal AI provides AI-powered cooking assistance and recipe management.\n\n' +
            '3. User Responsibilities\n' +
            'You are responsible for the accuracy of information you provide.\n\n' +
            '4. Privacy\n' +
            'Your privacy is important. See our Privacy Policy for details.\n\n' +
            '5. Modifications\n' +
            'We may update these terms. Continued use constitutes acceptance.\n\n' +
            '6. Contact\n' +
            'For questions about these terms, contact us at support@easymeal.ai',
            [{ text: 'OK' }]
        );
    };

    const handlePrivacyPolicy = () => {
        Alert.alert(
            'Privacy Policy',
            'EasyMeal AI Privacy Policy\n\n' +
            '1. Information We Collect\n' +
            '• Account information (email, profile data)\n' +
            '• Usage data (recipes, preferences, chat history)\n' +
            '• Device information (app usage, crash reports)\n\n' +
            '2. How We Use Information\n' +
            '• Provide personalized cooking assistance\n' +
            '• Improve our AI services\n' +
            '• Send important updates\n\n' +
            '3. Data Security\n' +
            '• We use industry-standard encryption\n' +
            '• Your data is stored securely\n' +
            '• We never sell your personal information\n\n' +
            '4. Your Rights\n' +
            '• Access your data\n' +
            '• Request data deletion\n' +
            '• Opt out of communications\n\n' +
            '5. Contact\n' +
            'For privacy questions: privacy@easymeal.ai',
            [{ text: 'OK' }]
        );
    };

    const renderProfileHeader = () => (
        <View style={[styles.profileHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.border }]}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                ) : (
                    <Text style={styles.avatar}>👤</Text>
                )}
            </View>
            <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.text }]}>
                    {userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'User'}
                </Text>
                <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                    {userProfile?.email || user?.email || 'user@example.com'}
                </Text>
                {userProfile?.bio && (
                    <Text style={[styles.userBio, { color: theme.textTertiary }]} numberOfLines={1}>
                        {userProfile.bio}
                    </Text>
                )}
            </View>
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('AccountSettings')}
            >
                <Ionicons name="pencil" size={20} color={theme.primary} />
            </TouchableOpacity>
        </View>
    );

    const renderMenuItem = (
        icon: string,
        title: string,
        subtitle?: string,
        onPress?: () => void,
        showArrow: boolean = true,
        showSwitch?: boolean,
        switchValue?: boolean,
        onSwitchChange?: (value: boolean) => void
    ) => (
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.surface, borderBottomColor: theme.border }]} onPress={onPress}>
            <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                    <Ionicons name={icon as any} size={24} color={theme.primary} />
                </View>
                <View style={styles.menuText}>
                    <Text style={[styles.menuTitle, { color: theme.text }]}>{title}</Text>
                    {subtitle && <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
                </View>
            </View>
            <View style={styles.menuItemRight}>
                {showSwitch && (
                    <Switch
                        value={switchValue}
                        onValueChange={onSwitchChange}
                        trackColor={{ false: theme.border, true: theme.primary }}
                        thumbColor="#fff"
                    />
                )}
                {showArrow && !showSwitch && (
                    <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Profile Header */}
                {renderProfileHeader()}

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Account</Text>
                    {renderMenuItem('person-outline', 'Personal Information', 'Update your profile details', () => navigation.navigate('AccountSettings'))}
                    {renderMenuItem('notifications-outline', 'Notifications', 'Manage your notifications', undefined, true, true, notifications, handleNotificationToggle)}
                    {renderMenuItem('moon-outline', 'Dark Mode', 'Switch to dark theme', undefined, true, true, isDarkMode, toggleTheme)}
                    {renderMenuItem('key-outline', 'AI Settings', 'Configure OpenAI API and AI features', () => navigation.navigate('AISettings'))}
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Preferences</Text>
                    {renderMenuItem('restaurant-outline', 'Dietary Preferences', 'Set your food restrictions', () => navigation.navigate('Preferences'))}
                    {renderMenuItem('fitness-outline', 'Cooking Skill Level', 'Beginner, Intermediate, Expert', () => navigation.navigate('Preferences'))}
                    {renderMenuItem('heart-outline', 'Favorite Cuisines', 'Italian, Asian, Mexican, etc.', () => navigation.navigate('Preferences'))}
                    {renderMenuItem('bulb-outline', 'AI Suggestions', 'Get personalized recipe recommendations', undefined, true, true, aiSuggestions, setAiSuggestions)}
                </View>

                {/* App Features Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Features</Text>
                    {renderMenuItem('bookmark-outline', 'Saved Recipes', 'View your favorite recipes', () => navigation.navigate('Favorites'))}
                    {renderMenuItem('calendar-outline', 'Meal Plans', 'Manage your meal planning', () => navigation.navigate('MealPlan'))}
                    {renderMenuItem('list-outline', 'Shopping Lists', 'View your shopping history', () => navigation.navigate('ShoppingList'))}
                    {renderMenuItem('analytics-outline', 'Cooking Stats', 'Track your cooking progress')}
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Support</Text>
                    {renderMenuItem('help-circle-outline', 'Help & FAQ', 'Get help with the app')}
                    {renderMenuItem('chatbubble-outline', 'Contact Support', 'Reach out to our team')}
                    {renderMenuItem('star-outline', 'Rate App', 'Leave a review')}
                    {renderMenuItem('share-outline', 'Share App', 'Tell friends about EasyMeals AI')}
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>About</Text>
                    {renderMenuItem('information-circle-outline', 'App Version', '1.0.0')}
                    {renderMenuItem('document-text-outline', 'Terms of Service', 'Read our terms', () => handleTermsOfService())}
                    {renderMenuItem('shield-checkmark-outline', 'Privacy Policy', 'How we protect your data', () => handlePrivacyPolicy())}

                </View>

                {/* Logout Button */}
                <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.surface, borderColor: '#E91E63' }]} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#E91E63" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 10, // Extra padding for status bar
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50, // Extra padding for camera lens/notch
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    avatar: {
        fontSize: 30,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    userBio: {
        fontSize: 12,
        marginTop: 2,
    },
    editButton: {
        padding: 8,
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 5,
        marginLeft: 20,
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIcon: {
        width: 40,
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    menuItemRight: {
        alignItems: 'center',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 15,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 30,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E91E63',
    },
    logoutText: {
        color: '#E91E63',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
}); 