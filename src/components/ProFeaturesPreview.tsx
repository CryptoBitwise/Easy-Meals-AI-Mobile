import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface ProFeature {
    icon: string;
    title: string;
    description: string;
    comingSoon: boolean;
}

const PRO_FEATURES: ProFeature[] = [
    {
        icon: 'camera-outline',
        title: 'Recipe Scanner',
        description: 'Scan any recipe with your camera and add it to your collection',
        comingSoon: true,
    },
    {
        icon: 'calendar-outline',
        title: 'Advanced Meal Planning',
        description: 'Weekly meal planner with automatic shopping list generation',
        comingSoon: true,
    },
    {
        icon: 'resize-outline',
        title: 'Smart Recipe Scaling',
        description: 'Automatically adjust any recipe for 2, 4, or 8 people',
        comingSoon: true,
    },
    {
        icon: 'analytics-outline',
        title: 'Nutrition Tracking',
        description: 'Track your daily nutrition goals and meal history',
        comingSoon: true,
    },
    {
        icon: 'people-outline',
        title: 'Social Features',
        description: 'Share recipes with friends and discover community favorites',
        comingSoon: true,
    },
    {
        icon: 'cloud-download-outline',
        title: 'Full Offline Access',
        description: 'Download entire recipe database for offline cooking',
        comingSoon: true,
    },
];

interface ProFeaturesPreviewProps {
    onUpgradePress?: () => void;
    showUpgradeButton?: boolean;
}

const ProFeaturesPreview: React.FC<ProFeaturesPreviewProps> = React.memo(({
    onUpgradePress,
    showUpgradeButton = true,
}) => {
    const { theme } = useTheme();

    const renderFeature = (feature: ProFeature, index: number) => (
        <View key={index} style={[styles.featureCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                <Ionicons name={feature.icon as any} size={24} color={theme.primary} />
            </View>
            <View style={styles.featureContent}>
                <View style={styles.featureHeader}>
                    <Text style={[styles.featureTitle, { color: theme.text }]}>{feature.title}</Text>
                    {feature.comingSoon && (
                        <View style={[styles.comingSoonBadge, { backgroundColor: theme.primary }]}>
                            <Text style={styles.comingSoonText}>Coming Soon</Text>
                        </View>
                    )}
                </View>
                <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
                    {feature.description}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Ionicons name="star" size={24} color={theme.primary} />
                <Text style={[styles.headerTitle, { color: theme.text }]}>Pro Features Coming Soon</Text>
            </View>

            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Unlock advanced features to take your cooking to the next level
            </Text>

            <ScrollView style={styles.featuresList} showsVerticalScrollIndicator={false}>
                {PRO_FEATURES.map((feature, index) => renderFeature(feature, index))}
            </ScrollView>

            {showUpgradeButton && onUpgradePress && (
                <TouchableOpacity
                    style={[styles.upgradeButton, { backgroundColor: theme.primary }]}
                    onPress={onUpgradePress}
                    activeOpacity={0.8}
                >
                    <Ionicons name="notifications-outline" size={20} color="#fff" />
                    <Text style={styles.upgradeButtonText}>Get Notified When Pro Launches</Text>
                </TouchableOpacity>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 20,
        lineHeight: 20,
    },
    featuresList: {
        flex: 1,
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    featureContent: {
        flex: 1,
    },
    featureHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    comingSoonBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    comingSoonText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    featureDescription: {
        fontSize: 14,
        lineHeight: 18,
    },
    upgradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginTop: 20,
    },
    upgradeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

ProFeaturesPreview.displayName = 'ProFeaturesPreview';

export default ProFeaturesPreview; 