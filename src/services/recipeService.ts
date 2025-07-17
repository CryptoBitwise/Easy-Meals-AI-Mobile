export interface Recipe {
    id: string;
    title: string;
    time?: string;
    difficulty?: string;
    cuisine?: string;
    dietary?: string[];
    image?: string;
    description?: string;
    tags?: string[];
    prepTime?: string;
    why?: string;
    spiceLevel?: string;
}

// No local recipes
const allRecipes: Recipe[] = [];

const THEMEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';

class RecipeService {
    // Fetch all recipes (by category, area, or ingredient)
    async fetchAllRecipes(): Promise<Recipe[]> {
        // TheMealDB does not have a single endpoint for all recipes, so fetch by category as an example
        try {
            const res = await fetch(`${THEMEALDB_BASE}/search.php?s=`);
            const data = await res.json();
            if (!data.meals) return [];
            return data.meals.map(this.transformMealDBRecipe);
        } catch (e) {
            return [];
        }
    }

    // Search recipes by name
    async searchRecipes(query: string): Promise<Recipe[]> {
        try {
            const res = await fetch(`${THEMEALDB_BASE}/search.php?s=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (!data.meals) return [];
            return data.meals.map(this.transformMealDBRecipe);
        } catch (e) {
            return [];
        }
    }

    // Get recipe by ID
    async getRecipeById(id: string): Promise<Recipe | undefined> {
        try {
            const res = await fetch(`${THEMEALDB_BASE}/lookup.php?i=${id}`);
            const data = await res.json();
            if (!data.meals || !data.meals[0]) return undefined;
            return this.transformMealDBRecipe(data.meals[0]);
        } catch (e) {
            return undefined;
        }
    }

    // Transform TheMealDB recipe to our Recipe type
    transformMealDBRecipe(meal: any): Recipe {
        return {
            id: meal.idMeal,
            title: meal.strMeal,
            image: meal.strMealThumb,
            cuisine: meal.strArea,
            description: meal.strInstructions,
            tags: meal.strTags ? meal.strTags.split(',') : [],
            // TheMealDB does not provide time/difficulty/dietary info
        };
    }
}

export default new RecipeService(); 