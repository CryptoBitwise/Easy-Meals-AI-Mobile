import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Switch,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen({ navigation }: any) {
    const { isDarkMode, toggleTheme, theme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [aiSuggestions, setAiSuggestions] = useState(true);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => navigation.replace('Intro')
                },
            ]
        );
    };

    const renderProfileHeader = () => (
        <View style={[styles.profileHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.border }]}>
                <Text style={styles.avatar}>👤</Text>
            </View>
            <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.text }]}>John Doe</Text>
                <Text style={[styles.userEmail, { color: theme.textSecondary }]}>john.doe@example.com</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
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
                    {renderMenuItem('notifications-outline', 'Notifications', 'Manage your notifications', undefined, true, true, notifications, setNotifications)}
                    {renderMenuItem('moon-outline', 'Dark Mode', 'Switch to dark theme', undefined, true, true, isDarkMode, toggleTheme)}
                    <TouchableOpacity
                        style={[styles.menuItem, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
                        onPress={() => navigation.navigate('AISettings')}
                    >
                        <Ionicons name="key-outline" size={22} color={theme.primary} style={{ marginRight: 16 }} />
                        <Text style={[styles.menuText, { color: theme.text }]}>AI Settings</Text>
                    </TouchableOpacity>
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
                    {renderMenuItem('bookmark-outline', 'Saved Recipes', 'View your favorite recipes')}
                    {renderMenuItem('calendar-outline', 'Meal Plans', 'Manage your meal planning')}
                    {renderMenuItem('list-outline', 'Shopping Lists', 'View your shopping history')}
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
                    {renderMenuItem('document-text-outline', 'Terms of Service', 'Read our terms')}
                    {renderMenuItem('shield-checkmark-outline', 'Privacy Policy', 'How we protect your data')}
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
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