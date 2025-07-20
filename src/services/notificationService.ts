import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export interface NotificationSettings {
    enabled: boolean;
    mealReminders: boolean;
    recipeSuggestions: boolean;
    shoppingReminders: boolean;
    cookingTips: boolean;
}

const NOTIFICATION_SETTINGS_KEY = '@easymealsai:notificationSettings';

// Default settings
const DEFAULT_SETTINGS: NotificationSettings = {
    enabled: false,
    mealReminders: true,
    recipeSuggestions: true,
    shoppingReminders: true,
    cookingTips: true,
};

export const notificationService = {
    // Initialize notification settings
    async initialize(): Promise<void> {
        try {
            const settings = await this.getSettings();
            if (settings.enabled) {
                await this.requestPermissions();
            }
        } catch (error) {
            console.log('Error initializing notifications:', error);
        }
    },

    // Request notification permissions
    async requestPermissions(): Promise<boolean> {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.log('Error requesting notification permissions:', error);
            return false;
        }
    },

    // Get notification settings
    async getSettings(): Promise<NotificationSettings> {
        try {
            const stored = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
            return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
        } catch (error) {
            console.log('Error loading notification settings:', error);
            return DEFAULT_SETTINGS;
        }
    },

    // Save notification settings
    async saveSettings(settings: NotificationSettings): Promise<void> {
        try {
            await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));

            if (settings.enabled) {
                await this.requestPermissions();
            }
        } catch (error) {
            console.log('Error saving notification settings:', error);
        }
    },

    // Toggle notifications on/off
    async toggleNotifications(enabled: boolean): Promise<void> {
        const settings = await this.getSettings();
        settings.enabled = enabled;
        await this.saveSettings(settings);
    },

    // Generic notification sender
    async sendNotification(title: string, body: string, data: any): Promise<void> {
        const settings = await this.getSettings();
        if (!settings.enabled) return;

        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    data,
                },
                trigger: null,
            });
        } catch (error) {
            console.log('Error sending notification:', error);
        }
    },

    // Send a meal reminder notification
    async sendMealReminder(mealName: string, time: string): Promise<void> {
        const settings = await this.getSettings();
        if (!settings.enabled || !settings.mealReminders) return;

        await this.sendNotification(
            '👩‍🍳 Clara from EasyMeal AI',
            `Time to prepare: ${mealName}`,
            { type: 'meal_reminder', mealName }
        );
    },

    // Send a recipe suggestion notification
    async sendRecipeSuggestion(recipeName: string): Promise<void> {
        const settings = await this.getSettings();
        if (!settings.enabled || !settings.recipeSuggestions) return;

        await this.sendNotification(
            '👩‍🍳 Clara from EasyMeal AI',
            `Try this recipe: ${recipeName}`,
            { type: 'recipe_suggestion', recipeName }
        );
    },

    // Send a shopping reminder notification
    async sendShoppingReminder(itemCount: number): Promise<void> {
        const settings = await this.getSettings();
        if (!settings.enabled || !settings.shoppingReminders) return;

        await this.sendNotification(
            '👩‍🍳 Clara from EasyMeal AI',
            `You have ${itemCount} items on your shopping list`,
            { type: 'shopping_reminder', itemCount }
        );
    },

    // Send a cooking tip notification
    async sendCookingTip(tip: string): Promise<void> {
        const settings = await this.getSettings();
        if (!settings.enabled || !settings.cookingTips) return;

        await this.sendNotification(
            '👩‍🍳 Clara from EasyMeal AI',
            `💡 ${tip}`,
            { type: 'cooking_tip', tip }
        );
    },

    // Clear all scheduled notifications
    async clearAllNotifications(): Promise<void> {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            console.log('Cleared all notifications');
        } catch (error) {
            console.log('Error clearing notifications:', error);
        }
    },
};

export default notificationService; 