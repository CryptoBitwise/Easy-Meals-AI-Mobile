import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../services/recipeService';

// Offline storage keys
const OFFLINE_KEYS = {
    SAVED_RECIPES: 'offline_saved_recipes',
    SHOPPING_LISTS: 'offline_shopping_lists',
    USER_PREFERENCES: 'offline_user_preferences',
    RECENT_SEARCHES: 'offline_recent_searches',
    FAVORITES: 'offline_favorites',
    LAST_SYNC: 'offline_last_sync',
} as const;

// Lite version offline features
const LITE_OFFLINE_FEATURES = {
    savedRecipes: true,
    shoppingLists: true,
    userPreferences: true,
    recentSearches: true,
    favorites: true,
    // Pro features (disabled in lite)
    fullRecipeDatabase: false,
    aiFeatures: false,
    ocrFeatures: false,
    advancedMealPlanning: false,
    nutritionTracking: false,
} as const;

export class OfflineManager {
    /**
     * Save recipe for offline access
     */
    static async saveRecipeForOffline(recipe: Recipe): Promise<boolean> {
        try {
            const savedRecipes = await this.getSavedRecipes();
            const existingIndex = savedRecipes.findIndex(r => r.id === recipe.id);

            if (existingIndex >= 0) {
                savedRecipes[existingIndex] = recipe;
            } else {
                savedRecipes.push(recipe);
            }

            await AsyncStorage.setItem(OFFLINE_KEYS.SAVED_RECIPES, JSON.stringify(savedRecipes));
            await this.updateLastSync();
            return true;
        } catch (error) {
            console.error('Error saving recipe for offline:', error);
            return false;
        }
    }

    /**
     * Get all saved recipes for offline access
     */
    static async getSavedRecipes(): Promise<Recipe[]> {
        try {
            const data = await AsyncStorage.getItem(OFFLINE_KEYS.SAVED_RECIPES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting saved recipes:', error);
            return [];
        }
    }

    /**
     * Remove recipe from offline storage
     */
    static async removeRecipeFromOffline(recipeId: string): Promise<boolean> {
        try {
            const savedRecipes = await this.getSavedRecipes();
            const filteredRecipes = savedRecipes.filter(r => r.id !== recipeId);
            await AsyncStorage.setItem(OFFLINE_KEYS.SAVED_RECIPES, JSON.stringify(filteredRecipes));
            return true;
        } catch (error) {
            console.error('Error removing recipe from offline:', error);
            return false;
        }
    }

    /**
     * Save shopping list for offline access
     */
    static async saveShoppingListForOffline(list: any): Promise<boolean> {
        try {
            const shoppingLists = await this.getShoppingLists();
            const existingIndex = shoppingLists.findIndex(l => l.id === list.id);

            if (existingIndex >= 0) {
                shoppingLists[existingIndex] = list;
            } else {
                shoppingLists.push(list);
            }

            await AsyncStorage.setItem(OFFLINE_KEYS.SHOPPING_LISTS, JSON.stringify(shoppingLists));
            return true;
        } catch (error) {
            console.error('Error saving shopping list for offline:', error);
            return false;
        }
    }

    /**
     * Get all shopping lists for offline access
     */
    static async getShoppingLists(): Promise<any[]> {
        try {
            const data = await AsyncStorage.getItem(OFFLINE_KEYS.SHOPPING_LISTS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting shopping lists:', error);
            return [];
        }
    }

    /**
     * Save user preferences for offline access
     */
    static async saveUserPreferences(preferences: any): Promise<boolean> {
        try {
            await AsyncStorage.setItem(OFFLINE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
            return true;
        } catch (error) {
            console.error('Error saving user preferences:', error);
            return false;
        }
    }

    /**
     * Get user preferences for offline access
     */
    static async getUserPreferences(): Promise<any> {
        try {
            const data = await AsyncStorage.getItem(OFFLINE_KEYS.USER_PREFERENCES);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting user preferences:', error);
            return null;
        }
    }

    /**
     * Save recent search for offline access
     */
    static async saveRecentSearch(search: string): Promise<boolean> {
        try {
            const recentSearches = await this.getRecentSearches();
            const filteredSearches = recentSearches.filter(s => s !== search);
            const updatedSearches = [search, ...filteredSearches].slice(0, 10); // Keep last 10

            await AsyncStorage.setItem(OFFLINE_KEYS.RECENT_SEARCHES, JSON.stringify(updatedSearches));
            return true;
        } catch (error) {
            console.error('Error saving recent search:', error);
            return false;
        }
    }

    /**
     * Get recent searches for offline access
     */
    static async getRecentSearches(): Promise<string[]> {
        try {
            const data = await AsyncStorage.getItem(OFFLINE_KEYS.RECENT_SEARCHES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting recent searches:', error);
            return [];
        }
    }

    /**
     * Save favorite recipe for offline access
     */
    static async saveFavoriteRecipe(recipe: Recipe): Promise<boolean> {
        try {
            const favorites = await this.getFavoriteRecipes();
            const existingIndex = favorites.findIndex(r => r.id === recipe.id);

            if (existingIndex === -1) {
                favorites.push(recipe);
                await AsyncStorage.setItem(OFFLINE_KEYS.FAVORITES, JSON.stringify(favorites));
            }

            return true;
        } catch (error) {
            console.error('Error saving favorite recipe:', error);
            return false;
        }
    }

    /**
     * Remove favorite recipe from offline access
     */
    static async removeFavoriteRecipe(recipeId: string): Promise<boolean> {
        try {
            const favorites = await this.getFavoriteRecipes();
            const filteredFavorites = favorites.filter(r => r.id !== recipeId);
            await AsyncStorage.setItem(OFFLINE_KEYS.FAVORITES, JSON.stringify(filteredFavorites));
            return true;
        } catch (error) {
            console.error('Error removing favorite recipe:', error);
            return false;
        }
    }

    /**
     * Get favorite recipes for offline access
     */
    static async getFavoriteRecipes(): Promise<Recipe[]> {
        try {
            const data = await AsyncStorage.getItem(OFFLINE_KEYS.FAVORITES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting favorite recipes:', error);
            return [];
        }
    }

    /**
     * Check if recipe is available offline
     */
    static async isRecipeAvailableOffline(recipeId: string): Promise<boolean> {
        try {
            const savedRecipes = await this.getSavedRecipes();
            return savedRecipes.some(r => r.id === recipeId);
        } catch (error) {
            console.error('Error checking offline availability:', error);
            return false;
        }
    }

    /**
     * Get offline storage size (for lite version limits)
     */
    static async getOfflineStorageSize(): Promise<number> {
        try {
            const savedRecipes = await this.getSavedRecipes();
            const shoppingLists = await this.getShoppingLists();
            const favorites = await this.getFavoriteRecipes();

            const totalData = {
                savedRecipes,
                shoppingLists,
                favorites,
            };

            return JSON.stringify(totalData).length;
        } catch (error) {
            console.error('Error calculating storage size:', error);
            return 0;
        }
    }

    /**
     * Clear all offline data (for app reset)
     */
    static async clearAllOfflineData(): Promise<boolean> {
        try {
            await AsyncStorage.multiRemove([
                OFFLINE_KEYS.SAVED_RECIPES,
                OFFLINE_KEYS.SHOPPING_LISTS,
                OFFLINE_KEYS.USER_PREFERENCES,
                OFFLINE_KEYS.RECENT_SEARCHES,
                OFFLINE_KEYS.FAVORITES,
                OFFLINE_KEYS.LAST_SYNC,
            ]);
            return true;
        } catch (error) {
            console.error('Error clearing offline data:', error);
            return false;
        }
    }

    /**
     * Update last sync timestamp
     */
    private static async updateLastSync(): Promise<void> {
        try {
            await AsyncStorage.setItem(OFFLINE_KEYS.LAST_SYNC, Date.now().toString());
        } catch (error) {
            console.error('Error updating last sync:', error);
        }
    }

    /**
     * Get last sync timestamp
     */
    static async getLastSync(): Promise<number> {
        try {
            const data = await AsyncStorage.getItem(OFFLINE_KEYS.LAST_SYNC);
            return data ? parseInt(data) : 0;
        } catch (error) {
            console.error('Error getting last sync:', error);
            return 0;
        }
    }

    /**
     * Check if offline features are available (lite vs pro)
     */
    static isOfflineFeatureAvailable(feature: keyof typeof LITE_OFFLINE_FEATURES): boolean {
        return LITE_OFFLINE_FEATURES[feature];
    }

    /**
     * Get available offline features for current version
     */
    static getAvailableOfflineFeatures(): typeof LITE_OFFLINE_FEATURES {
        return LITE_OFFLINE_FEATURES;
    }
}

export default OfflineManager; 