import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import IntroScreen from '../screens/IntroScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import MealPlanScreen from '../screens/MealPlanScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AIChatScreen from '../screens/AIChatScreen';
import AIRecipeSearchScreen from '../screens/AIRecipeSearchScreen';
import AIMealPlannerScreen from '../screens/AIMealPlannerScreen';
import AIShoppingListScreen from '../screens/AIShoppingListScreen';
import AIRecommendationsScreen from '../screens/AIRecommendationsScreen';
import AINutritionAnalysisScreen from '../screens/AINutritionAnalysisScreen';
import AIStepByStepScreen from '../screens/AIStepByStepScreen';
import AIIngredientSubScreen from '../screens/AIIngredientSubScreen';
import AISettingsScreen from '../screens/AISettingsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryRecipesScreen from '../screens/CategoryRecipesScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import RecipeImportScreen from '../screens/RecipeImportScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

const Stack = createStackNavigator();

const AuthNavigator: React.FC = () => {
    const { user, loading } = useAuth();
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

    useEffect(() => {
        if (user) {
            // Only check onboarding status when user is authenticated
            checkOnboardingStatus();
        } else {
            // Reset onboarding status when user is not authenticated
            setHasCompletedOnboarding(null);
        }
    }, [user]);

    const checkOnboardingStatus = async () => {
        try {
            const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
            console.log('Onboarding status check:', { onboardingCompleted, user: !!user });
            setHasCompletedOnboarding(onboardingCompleted === 'true');
        } catch (error) {
            console.log('Error checking onboarding status:', error);
            setHasCompletedOnboarding(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // If user is not authenticated, show intro/login screens
    if (!user) {
        return (
            <Stack.Navigator
                initialRouteName="Intro"
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                }}
            >
                <Stack.Screen
                    name="Intro"
                    component={IntroScreen}
                    options={{
                        gestureEnabled: false,
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        gestureEnabled: false,
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
        );
    }

    // User is authenticated, check onboarding status
    const initialRoute = hasCompletedOnboarding === null ? "Home" : (hasCompletedOnboarding ? "Home" : "Onboarding");
    console.log('AuthNavigator - User authenticated, initial route:', initialRoute, 'onboarding status:', hasCompletedOnboarding);

    return (
        <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
            }}
        >
            {/* Authenticated user screens */}
            <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                }}
            />
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
    );
};

export default AuthNavigator; 