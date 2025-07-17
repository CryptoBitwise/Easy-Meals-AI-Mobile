import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserPreferences {
    dietaryRestrictions: string[];
    cookingSkill: string;
    favoriteCuisines: string[];
    allergies: string[];
    servingSize: number;
    spiceLevel: string;
    mealPlanning: boolean;
    notifications: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    dietaryRestrictions: [],
    cookingSkill: 'Intermediate',
    favoriteCuisines: [],
    allergies: [],
    servingSize: 2,
    spiceLevel: 'Medium',
    mealPlanning: true,
    notifications: true,
};

class PreferencesService {
    private static instance: PreferencesService;
    private preferences: UserPreferences = DEFAULT_PREFERENCES;
    private listeners: ((preferences: UserPreferences) => void)[] = [];

    static getInstance(): PreferencesService {
        if (!PreferencesService.instance) {
            PreferencesService.instance = new PreferencesService();
        }
        return PreferencesService.instance;
    }

    async loadPreferences(): Promise<UserPreferences> {
        try {
            const saved = await AsyncStorage.getItem('user_preferences');
            if (saved) {
                this.preferences = { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
            }
            return this.preferences;
        } catch (error) {
            console.error('Error loading preferences:', error);
            return this.preferences;
        }
    }

    async savePreferences(preferences: Partial<UserPreferences>): Promise<void> {
        try {
            this.preferences = { ...this.preferences, ...preferences };
            await AsyncStorage.setItem('user_preferences', JSON.stringify(this.preferences));
            this.notifyListeners();
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    }

    getPreferences(): UserPreferences {
        return this.preferences;
    }

    // Get preferences formatted for AI prompts
    getAIPromptPreferences(): string {
        const { dietaryRestrictions, cookingSkill, favoriteCuisines, allergies, spiceLevel } = this.preferences;

        let prompt = '';

        if (dietaryRestrictions.length > 0) {
            prompt += `Dietary restrictions: ${dietaryRestrictions.join(', ')}. `;
        }

        if (allergies.length > 0) {
            prompt += `Allergies: ${allergies.join(', ')}. `;
        }

        prompt += `Cooking skill level: ${cookingSkill}. `;
        prompt += `Preferred spice level: ${spiceLevel}. `;

        if (favoriteCuisines.length > 0) {
            prompt += `Favorite cuisines: ${favoriteCuisines.join(', ')}. `;
        }

        return prompt.trim();
    }

    // Check if a recipe matches user preferences
    matchesPreferences(recipe: any): boolean {
        // Check dietary restrictions
        if (this.preferences.dietaryRestrictions.length > 0) {
            const hasRestriction = this.preferences.dietaryRestrictions.some(restriction => {
                return recipe.tags?.includes(restriction) || recipe.dietary?.includes(restriction);
            });
            if (!hasRestriction) return false;
        }

        // Check allergies
        if (this.preferences.allergies.length > 0) {
            const hasAllergy = this.preferences.allergies.some(allergy => {
                return recipe.ingredients?.some((ingredient: string) =>
                    ingredient.toLowerCase().includes(allergy.toLowerCase())
                );
            });
            if (hasAllergy) return false;
        }

        // Check cooking skill
        if (recipe.difficulty && this.preferences.cookingSkill === 'Beginner') {
            if (recipe.difficulty === 'Advanced' || recipe.difficulty === 'Expert') {
                return false;
            }
        }

        return true;
    }

    // Get serving size multiplier for recipe scaling
    getServingMultiplier(recipeServings: number): number {
        return this.preferences.servingSize / recipeServings;
    }

    // Subscribe to preference changes
    subscribe(listener: (preferences: UserPreferences) => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.preferences));
    }

    // Reset to default preferences
    async resetPreferences(): Promise<void> {
        await this.savePreferences(DEFAULT_PREFERENCES);
    }
}

export default PreferencesService.getInstance(); 