import AsyncStorage from '@react-native-async-storage/async-storage';
import preferencesService from './preferencesService';

// OpenAI API Configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o'; // Using GPT-4o as recommended

// Centralized AI Service with real OpenAI integration

// Helper function to check if AI features are enabled
async function isAIFeaturesEnabled(): Promise<boolean> {
    try {
        const enabled = await AsyncStorage.getItem('ai_features_enabled');
        return enabled !== 'false';
    } catch (error) {
        return true; // Default to enabled if error
    }
}

// Helper function to get API key
async function getOpenAIKey(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem('openai_api_key');
    } catch (error) {
        console.error('Error getting OpenAI API key:', error);
        return null;
    }
}

// Helper function to make OpenAI API calls
async function callOpenAI(messages: any[], temperature: number = 0.7): Promise<string> {
    // Check if AI features are enabled
    const aiEnabled = await isAIFeaturesEnabled();
    if (!aiEnabled) {
        throw new Error('AI features are disabled. Please enable them in AI Settings.');
    }

    const apiKey = await getOpenAIKey();

    if (!apiKey) {
        throw new Error('OpenAI API key not found. Please add your API key in AI Settings.');
    }

    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                messages,
                temperature,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response from AI';
    } catch (error) {
        console.error('OpenAI API call failed:', error);
        throw error;
    }
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

    const prompt = `Generate 4 personalized recipe recommendations based on these user preferences:
- Dietary restrictions: ${preferences.dietaryRestrictions?.join(', ') || 'None'}
- Cuisine preferences: ${preferences.favoriteCuisines?.join(', ') || 'All'}
- Cooking skill: ${preferences.cookingSkill || 'Intermediate'}
- Allergies: ${preferences.allergies?.join(', ') || 'None'}

Return the response as a JSON array with this exact format:
[
  {
    "id": "unique_id",
    "title": "Recipe Name",
    "description": "Brief description",
    "cuisine": "Cuisine type",
    "difficulty": "Beginner/Intermediate/Advanced",
    "cookTime": "30 minutes",
    "servings": 4,
    "tags": ["tag1", "tag2"],
    "why": "Why this recipe was recommended"
  }
]`;

    try {
        const response = await callOpenAI([
            {
                role: 'system',
                content: 'You are a recipe recommendation expert. Always respond with valid JSON arrays containing recipe objects.'
            },
            {
                role: 'user',
                content: prompt
            }
        ], 0.3); // Lower temperature for more consistent recommendations

        // Parse the JSON response
        const recipes = JSON.parse(response);
        return Array.isArray(recipes) ? recipes : [];
    } catch (error) {
        console.error('Error getting AI recommendations:', error);
        // Fallback to mock data
        return [
            {
                id: '1',
                title: 'Spicy Chickpea Buddha Bowl',
                liked: false,
                saved: false,
                difficulty: 'Beginner',
                cuisine: 'Mediterranean',
                dietary: ['Vegetarian', 'Gluten-Free'],
                spiceLevel: 'Medium'
            },
            {
                id: '2',
                title: 'Salmon Avocado Sushi',
                liked: false,
                saved: false,
                difficulty: 'Intermediate',
                cuisine: 'Japanese',
                dietary: ['Pescatarian'],
                spiceLevel: 'Mild'
            },
            {
                id: '3',
                title: 'Vegan Pad Thai',
                liked: false,
                saved: false,
                difficulty: 'Intermediate',
                cuisine: 'Thai',
                dietary: ['Vegan', 'Gluten-Free'],
                spiceLevel: 'Hot'
            },
            {
                id: '4',
                title: 'Simple Pasta Carbonara',
                liked: false,
                saved: false,
                difficulty: 'Beginner',
                cuisine: 'Italian',
                dietary: ['Vegetarian'],
                spiceLevel: 'Mild'
            }
        ];
    }
}

export async function getAINutritionAnalysis(recipe: any): Promise<any> {
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
}

Be realistic and accurate with the nutritional values.`;

    try {
        const response = await callOpenAI([
            {
                role: 'system',
                content: 'You are a nutrition expert. Provide accurate nutritional analysis in JSON format.'
            },
            {
                role: 'user',
                content: prompt
            }
        ], 0.2);

        return JSON.parse(response);
    } catch (error) {
        console.error('Error getting nutrition analysis:', error);
        // Fallback to mock data
        return {
            calories: 520,
            protein: 22,
            carbs: 65,
            fat: 18,
            fiber: 9,
            sugar: 8,
            sodium: 620,
            vitamins: { A: '30%', C: '45%', D: '10%', B12: '12%' },
            minerals: { Calcium: '18%', Iron: '22%', Potassium: '15%' },
        };
    }
}

export async function getAIStepByStep(recipe: any): Promise<string[]> {
    const preferences = preferencesService.getPreferences();
    const skillLevel = preferences.cookingSkill || 'Intermediate';

    const prompt = `Create detailed step-by-step cooking instructions for: "${recipe.title}"

User's cooking skill level: ${skillLevel}

Provide instructions appropriate for this skill level:
- Beginner: Very detailed, include basic techniques and safety tips
- Intermediate: Standard detailed instructions
- Advanced: Concise but complete instructions

Return as a JSON array of strings, each representing one step.`;

    try {
        const response = await callOpenAI([
            {
                role: 'system',
                content: 'You are a cooking instructor. Provide clear, step-by-step instructions in JSON array format.'
            },
            {
                role: 'user',
                content: prompt
            }
        ], 0.3);
        const steps = JSON.parse(response);
        return Array.isArray(steps) ? steps : [];
    } catch (error) {
        console.error('Error getting step-by-step instructions:', error);
        // Fallback to mock data
        const baseSteps = [
            'Preheat oven to 400°F (200°C).',
            'Rinse and drain chickpeas. Toss with olive oil and spices.',
            'Spread chickpeas on a baking sheet and roast for 25 minutes.',
            'Prepare veggies and cook quinoa while chickpeas roast.',
            'Assemble bowl: quinoa, veggies, roasted chickpeas, drizzle with tahini sauce.',
            'Serve and enjoy your healthy meal!'
        ];

        if (skillLevel === 'Beginner') {
            return [
                'Preheat oven to 400°F (200°C). Set a timer for 5 minutes to let it heat up.',
                'Open the can of chickpeas and drain them in a colander. Rinse with cold water.',
                'In a bowl, toss chickpeas with 2 tablespoons olive oil, 1 teaspoon paprika, and salt to taste.',
                'Line a baking sheet with parchment paper and spread chickpeas in a single layer.',
                'Place in oven and set timer for 25 minutes. Check at 20 minutes.',
                'While chickpeas roast, rinse 1 cup quinoa and cook according to package instructions.',
                'Wash and chop your favorite vegetables (bell peppers, cucumber, tomatoes).',
                'When chickpeas are golden and crispy, remove from oven.',
                'Assemble your bowl: quinoa base, fresh veggies, roasted chickpeas.',
                'Drizzle with tahini sauce and serve immediately!'
            ];
        }

        return baseSteps;
    }
}

export async function getAIIngredientSubstitutions(ingredient: string): Promise<string[]> {
    const preferences = preferencesService.getPreferences();
    const allergies = preferences.allergies || [];

    const prompt = `Find suitable substitutions for: "${ingredient}"

User allergies to avoid: ${allergies.join(', ') || 'None'}

Provide 3-5 alternative ingredients that can be used as substitutes. Consider:
- Similar taste and texture
- Availability
- Allergies and dietary restrictions

Return as a JSON array of strings.`;

    try {
        const response = await callOpenAI([
            {
                role: 'system',
                content: 'You are a culinary expert. Provide practical ingredient substitutions in JSON array format.'
            },
            {
                role: 'user',
                content: prompt
            }
        ], 0.4);
        const substitutions = JSON.parse(response);
        return Array.isArray(substitutions) ? substitutions : [];
    } catch (error) {
        console.error('Error getting ingredient substitutions:', error);
        // Fallback to mock data
        const mock: Record<string, string[]> = {
            Chickpeas: ['White beans', 'Lentils', 'Tofu'],
            Quinoa: ['Brown rice', 'Couscous', 'Farro'],
            Spinach: ['Kale', 'Swiss chard', 'Arugula'],
            Tahini: ['Sunflower seed butter', 'Peanut butter', 'Greek yogurt'],
            Lemon: ['Lime', 'Vinegar', 'Orange juice'],
            'Olive Oil': ['Avocado oil', 'Canola oil', 'Sesame oil'],
            Paprika: ['Chili powder', 'Smoked paprika', 'Cayenne'],
            Cucumber: ['Zucchini', 'Celery', 'Green bell pepper'],
            Tomato: ['Red bell pepper', 'Sun-dried tomato', 'Roasted red pepper'],
        };

        let substitutions = mock[ingredient] || [];

        // Filter out substitutions that contain user allergies
        if (allergies.length > 0) {
            substitutions = substitutions.filter(sub =>
                !allergies.some(allergy =>
                    sub.toLowerCase().includes(allergy.toLowerCase())
                )
            );
        }

        return substitutions;
    }
} 