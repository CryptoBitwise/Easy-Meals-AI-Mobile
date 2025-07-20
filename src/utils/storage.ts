import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage utility for better persistence
export const StorageKeys = {
    OPENAI_API_KEY: 'openai_api_key',
    AI_FEATURES_ENABLED: 'ai_features_enabled',
    USER_PREFERENCES: 'user_preferences',
} as const;

export class StorageManager {
    static async getItem(key: string): Promise<string | null> {
        try {
            const value = await AsyncStorage.getItem(key);
            console.log(`Storage getItem(${key}):`, value ? 'Found' : 'Not found');
            return value;
        } catch (error) {
            console.error(`Error getting item ${key}:`, error);
            return null;
        }
    }

    static async setItem(key: string, value: string): Promise<boolean> {
        try {
            await AsyncStorage.setItem(key, value);
            console.log(`Storage setItem(${key}): Success`);

            // Verify the save worked
            const verifyValue = await AsyncStorage.getItem(key);
            const success = verifyValue === value;
            console.log(`Storage verification(${key}):`, success ? 'Success' : 'Failed');

            return success;
        } catch (error) {
            console.error(`Error setting item ${key}:`, error);
            return false;
        }
    }

    static async removeItem(key: string): Promise<boolean> {
        try {
            await AsyncStorage.removeItem(key);
            console.log(`Storage removeItem(${key}): Success`);
            return true;
        } catch (error) {
            console.error(`Error removing item ${key}:`, error);
            return false;
        }
    }

    static async clear(): Promise<boolean> {
        try {
            await AsyncStorage.clear();
            console.log('Storage clear: Success');
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    // Specific methods for API key
    static async getApiKey(): Promise<string | null> {
        return this.getItem(StorageKeys.OPENAI_API_KEY);
    }

    static async setApiKey(apiKey: string): Promise<boolean> {
        return this.setItem(StorageKeys.OPENAI_API_KEY, apiKey);
    }

    static async removeApiKey(): Promise<boolean> {
        return this.removeItem(StorageKeys.OPENAI_API_KEY);
    }
} 