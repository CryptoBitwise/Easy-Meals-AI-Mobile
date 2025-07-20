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

export interface Category {
    id: string;
    title: string;
    icon: string;
    recipeCount: number;
    type: 'cuisine' | 'dietary' | 'time';
    apiKey?: string; // For API category mapping
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

    // Fetch all categories from TheMealDB
    async fetchCategories(): Promise<Category[]> {
        try {
            // Fetch cuisine categories (areas)
            const areasRes = await fetch(`${THEMEALDB_BASE}/list.php?a=list`);
            const areasData = await areasRes.json();

            // Fetch meal categories
            const categoriesRes = await fetch(`${THEMEALDB_BASE}/list.php?c=list`);
            const categoriesData = await categoriesRes.json();

            const categories: Category[] = [];

            // Add cuisine categories (areas)
            if (areasData.meals) {
                for (const area of areasData.meals) {
                    const recipeCount = await this.getRecipeCountByArea(area.strArea);
                    categories.push({
                        id: area.strArea.toLowerCase().replace(/\s+/g, '-'),
                        title: area.strArea,
                        icon: this.getCuisineIcon(area.strArea),
                        recipeCount,
                        type: 'cuisine' as const,
                        apiKey: area.strArea
                    });
                }
            }

            // Add dietary categories (meal categories)
            if (categoriesData.meals) {
                for (const category of categoriesData.meals) {
                    const recipeCount = await this.getRecipeCountByCategory(category.strCategory);
                    categories.push({
                        id: category.strCategory.toLowerCase().replace(/\s+/g, '-'),
                        title: category.strCategory,
                        icon: this.getDietaryIcon(category.strCategory),
                        recipeCount,
                        type: 'dietary' as const,
                        apiKey: category.strCategory
                    });
                }
            }

            return categories;
        } catch (e) {
            console.error('Error fetching categories:', e);
            return [];
        }
    }

    // Get recipe count by area (cuisine)
    async getRecipeCountByArea(area: string): Promise<number> {
        try {
            const res = await fetch(`${THEMEALDB_BASE}/filter.php?a=${encodeURIComponent(area)}`);
            const data = await res.json();
            return data.meals ? data.meals.length : 0;
        } catch (e) {
            return 0;
        }
    }

    // Get recipe count by category
    async getRecipeCountByCategory(category: string): Promise<number> {
        try {
            const res = await fetch(`${THEMEALDB_BASE}/filter.php?c=${encodeURIComponent(category)}`);
            const data = await res.json();
            return data.meals ? data.meals.length : 0;
        } catch (e) {
            return 0;
        }
    }

    // Get recipes by category
    async getRecipesByCategory(category: Category): Promise<Recipe[]> {
        try {
            let endpoint = '';
            if (category.type === 'cuisine') {
                endpoint = `${THEMEALDB_BASE}/filter.php?a=${encodeURIComponent(category.apiKey || category.title)}`;
            } else {
                endpoint = `${THEMEALDB_BASE}/filter.php?c=${encodeURIComponent(category.apiKey || category.title)}`;
            }

            const res = await fetch(endpoint);
            const data = await res.json();

            if (!data.meals) return [];

            // Get full recipe details for each meal
            const recipes: Recipe[] = [];
            for (const meal of data.meals.slice(0, 20)) { // Limit to 20 for performance
                const fullRecipe = await this.getRecipeById(meal.idMeal);
                if (fullRecipe) {
                    recipes.push(fullRecipe);
                }
            }

            return recipes;
        } catch (e) {
            console.error('Error fetching recipes by category:', e);
            return [];
        }
    }

    // Get cuisine icon based on area name
    getCuisineIcon(area: string): string {
        const iconMap: { [key: string]: string } = {
            'American': 'flag-outline',
            'British': 'flag-outline',
            'Chinese': 'restaurant-outline',
            'French': 'flag-outline',
            'Indian': 'flame-outline',
            'Italian': 'pizza-outline',
            'Japanese': 'restaurant-outline',
            'Mexican': 'leaf-outline',
            'Spanish': 'flag-outline',
            'Thai': 'restaurant-outline',
            'Turkish': 'restaurant-outline',
            'Unknown': 'restaurant-outline'
        };
        return iconMap[area] || 'restaurant-outline';
    }

    // Get dietary icon based on category name
    getDietaryIcon(category: string): string {
        const iconMap: { [key: string]: string } = {
            'Vegetarian': 'leaf-outline',
            'Vegan': 'nutrition-outline',
            'Gluten Free': 'medical-outline',
            'Chicken': 'nutrition-outline',
            'Beef': 'nutrition-outline',
            'Lamb': 'nutrition-outline',
            'Pasta': 'restaurant-outline',
            'Seafood': 'fish-outline',
            'Miscellaneous': 'restaurant-outline',
            'Goat': 'nutrition-outline',
            'Pork': 'nutrition-outline',
            'Dessert': 'ice-cream-outline',
            'Starter': 'restaurant-outline',
            'Breakfast': 'sunny-outline',
            'Side': 'restaurant-outline'
        };
        return iconMap[category] || 'restaurant-outline';
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