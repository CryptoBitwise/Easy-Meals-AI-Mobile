import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/context/ThemeContext';
import ErrorBoundary from './src/components/ErrorBoundary';

// Import screens
import IntroScreen from './src/screens/IntroScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import MealPlanScreen from './src/screens/MealPlanScreen';
import ShoppingListScreen from './src/screens/ShoppingListScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AIChatScreen from './src/screens/AIChatScreen';
import AIRecipeSearchScreen from './src/screens/AIRecipeSearchScreen';
import AIMealPlannerScreen from './src/screens/AIMealPlannerScreen';
import AIShoppingListScreen from './src/screens/AIShoppingListScreen';
import AIRecommendationsScreen from './src/screens/AIRecommendationsScreen';
import AINutritionAnalysisScreen from './src/screens/AINutritionAnalysisScreen';
import AIStepByStepScreen from './src/screens/AIStepByStepScreen';
import AIIngredientSubScreen from './src/screens/AIIngredientSubScreen';
import AISettingsScreen from './src/screens/AISettingsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import CategoryRecipesScreen from './src/screens/CategoryRecipesScreen';
import PreferencesScreen from './src/screens/PreferencesScreen';
import AccountSettingsScreen from './src/screens/AccountSettingsScreen';
import RecipeImportScreen from './src/screens/RecipeImportScreen';

const Stack = createStackNavigator();



export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="Intro"
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,

            }}
          >
            <Stack.Screen name="Intro" component={IntroScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
            <Stack.Screen name="MealPlan" component={MealPlanScreen} />
            <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="AIChat" component={AIChatScreen} />
            <Stack.Screen name="AIRecipeSearch" component={AIRecipeSearchScreen} />
            <Stack.Screen name="AIMealPlanner" component={AIMealPlannerScreen} />
            <Stack.Screen name="AIShoppingList" component={AIShoppingListScreen} />
            <Stack.Screen name="AIRecommendations" component={AIRecommendationsScreen} />
            <Stack.Screen name="AINutritionAnalysis" component={AINutritionAnalysisScreen} />
            <Stack.Screen name="AIStepByStep" component={AIStepByStepScreen} />
            <Stack.Screen name="AIIngredientSub" component={AIIngredientSubScreen} />
            <Stack.Screen name="AISettings" component={AISettingsScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="Categories" component={CategoriesScreen} />
            <Stack.Screen name="CategoryRecipes" component={CategoryRecipesScreen} />
            <Stack.Screen name="Preferences" component={PreferencesScreen} />
            <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
            <Stack.Screen name="RecipeImport" component={RecipeImportScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
