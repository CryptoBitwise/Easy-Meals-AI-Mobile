import AsyncStorage from '@react-native-async-storage/async-storage';
import preferencesService from './preferencesService';
import { StorageManager } from '../utils/storage';



// Centralized AI Service with secure backend integration

// Helper function to check if AI features are enabled
async function isAIFeaturesEnabled(): Promise<boolean> {
    try {
        const enabled = await StorageManager.getItem('ai_features_enabled');
        return enabled !== 'false';
    } catch (error) {
        return true; // Default to enabled if error
    }
}

// Helper function to make OpenAI API calls
async function callOpenAIAPI(messages: any[], temperature: number = 0.7): Promise<string> {
    // Get API key from user settings
    const userApiKey = await StorageManager.getApiKey();

    if (!userApiKey) {
        throw new Error('Please add your OpenAI API key in Account Settings');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${userApiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            temperature,
            max_tokens: 500,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result.choices[0]?.message?.content || 'No response from AI';
}

// Legacy function for backward compatibility
async function callOpenAI(messages: any[], temperature: number = 0.7): Promise<string> {
    return await callOpenAIAPI(messages, temperature);
}

export async function getAIChatResponse(prompt: string): Promise<string> {
    const userPrefs = preferencesService.getAIPromptPreferences();

    const messages = [
        {
            role: 'system',
            content: `You are an expert cooking assistant for the EasyMeals AI app. You help users with:
- Recipe suggestions and ideas
- Cooking tips and techniques
- Meal planning advice
- Ingredient substitutions
- Nutritional information
- Step-by-step cooking guidance

User preferences: ${userPrefs}

Always be helpful, friendly, and provide practical cooking advice. Keep responses concise but informative.`
        },
        {
            role: 'user',
            content: prompt
        }
    ];

    return await callOpenAI(messages, 0.7);
}

export async function getAIRecipeRecommendations(userPrefs?: any): Promise<any[]> {
    const preferences = preferencesService.getPreferences();

    // Use mock data for now
    return [
        {
            id: '1',
            title: 'Spicy Chickpea Buddha Bowl',
            description: 'A healthy and flavorful vegetarian bowl with chickpeas, quinoa, and fresh vegetables.',
            cuisine: 'Mediterranean',
            difficulty: 'Beginner',
            cookTime: '25 minutes',
            servings: 2,
            tags: ['Vegetarian', 'Gluten-Free', 'Healthy'],
            why: 'Recommended based on your vegetarian preferences and beginner cooking level'
        },
        {
            id: '2',
            title: 'Salmon Avocado Sushi',
            description: 'Fresh salmon and creamy avocado wrapped in perfectly seasoned rice.',
            cuisine: 'Japanese',
            difficulty: 'Intermediate',
            cookTime: '45 minutes',
            servings: 4,
            tags: ['Pescatarian', 'Fresh', 'Elegant'],
            why: 'Perfect for your intermediate skill level and love of fresh ingredients'
        },
        {
            id: '3',
            title: 'Vegan Pad Thai',
            description: 'A delicious plant-based version of the classic Thai noodle dish.',
            cuisine: 'Thai',
            difficulty: 'Intermediate',
            cookTime: '30 minutes',
            servings: 3,
            tags: ['Vegan', 'Gluten-Free', 'Spicy'],
            why: 'Matches your spice preferences and dietary restrictions'
        },
        {
            id: '4',
            title: 'Simple Pasta Carbonara',
            description: 'Classic Italian pasta with eggs, cheese, and crispy pancetta.',
            cuisine: 'Italian',
            difficulty: 'Beginner',
            cookTime: '20 minutes',
            servings: 2,
            tags: ['Quick', 'Comfort Food', 'Classic'],
            why: 'Great for beginners and quick weeknight meals'
        }
    ];
}

export async function getAINutritionAnalysis(recipe: any): Promise<any> {
    try {
        const prompt = `Analyze the nutritional content of this recipe: "${recipe.title}"

Provide a detailed nutrition analysis in JSON format:
{
  "calories": 520,
  "protein": 22,
  "carbs": 65,
  "fat": 18,
  "fiber": 9,
  "sugar": 8,
  "sodium": 620,
  "vitamins": {
    "A": "30%",
    "C": "45%",
    "D": "10%",
    "B12": "12%"
  },
  "minerals": {
    "Calcium": "18%",
    "Iron": "22%",
    "Potassium": "15%"
  }
}`;

        const messages = [
            {
                role: 'system',
                content: 'You are a nutrition expert. Always respond with valid JSON nutrition data.'
            },
            {
                role: 'user',
                content: prompt
            }
        ];

        const response = await callOpenAIAPI(messages, 0.3);

        // Parse JSON response
        let nutrition;
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : response;
            nutrition = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Invalid JSON response from AI');
        }

        return nutrition;
    } catch (error) {
        console.error('Error getting nutrition analysis:', error);
        throw error;
    }
}

export async function getAIStepByStep(recipe: any): Promise<string[]> {
    const preferences = preferencesService.getPreferences();
    const skillLevel = preferences.cookingSkill || 'Intermediate';

    try {
        const prompt = `Provide step-by-step cooking instructions for "${recipe.title}" for a ${skillLevel} level cook.

Return the response as a JSON array of strings:
[
  "Step 1: Preheat oven to 400°F (200°C).",
  "Step 2: Rinse and drain chickpeas.",
  "Step 3: Toss with olive oil and spices."
]`;

        const messages = [
            {
                role: 'system',
                content: 'You are a cooking instructor. Always respond with valid JSON arrays of step-by-step instructions.'
            },
            {
                role: 'user',
                content: prompt
            }
        ];

        const response = await callOpenAIAPI(messages, 0.3);

        // Parse JSON response
        let steps;
        try {
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            const jsonString = jsonMatch ? jsonMatch[0] : response;
            steps = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Invalid JSON response from AI');
        }

        return Array.isArray(steps) ? steps : [];
    } catch (error) {
        console.error('Error getting step-by-step instructions:', error);
        throw error;
    }
}

export async function getAIIngredientSubstitutions(ingredient: string): Promise<string[]> {
    const preferences = preferencesService.getPreferences();
    const allergies = preferences.allergies || [];

    try {
        const prompt = `Provide ingredient substitutions for "${ingredient}". 

Return the response as a JSON array of strings:
[
  "Substitution 1 (1:1 ratio)",
  "Substitution 2 (1:1 ratio)",
  "Substitution 3 (1:1 ratio)"
]`;

        const messages = [
            {
                role: 'system',
                content: 'You are a cooking expert. Always respond with valid JSON arrays of ingredient substitutions.'
            },
            {
                role: 'user',
                content: prompt
            }
        ];

        const response = await callOpenAIAPI(messages, 0.3);

        // Parse JSON response
        let substitutions;
        try {
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            const jsonString = jsonMatch ? jsonMatch[0] : response;
            substitutions = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Invalid JSON response from AI');
        }

        // Filter out substitutions that contain user allergies
        if (allergies.length > 0) {
            return substitutions.filter((sub: string) =>
                !allergies.some(allergy =>
                    sub.toLowerCase().includes(allergy.toLowerCase())
                )
            );
        }

        return Array.isArray(substitutions) ? substitutions : [];
    } catch (error) {
        console.error('Error getting ingredient substitutions:', error);
        throw error;
    }
} 