import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOZE_mPi6RYcDdYLPlqMXle8RgbfPxtdU",
    authDomain: "easy-meal-ai.firebaseapp.com",
    projectId: "easy-meal-ai",
    storageBucket: "easy-meal-ai.firebasestorage.app",
    messagingSenderId: "776787291999",
    appId: "1:776787291999:web:a14d2908082186f2f510ea",
    measurementId: "G-BLKG63MK39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
let auth;
try {
    // Try to initialize with AsyncStorage persistence
    const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
} catch (error) {
    // Fallback to default auth if persistence fails
    auth = getAuth(app);
}

const db = getFirestore(app);

// Initialize Analytics (only in web environment)
let analytics = null;
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
        analytics = getAnalytics(app);
    } catch (error) {
        console.log('Analytics not available:', error);
    }
}

// Authentication functions
export const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
        console.log('Signing in with rememberMe:', rememberMe);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Handle remember me logic
        if (!rememberMe) {
            // Set session-only flag for users who don't want to be remembered
            await AsyncStorage.setItem('session_only', 'true');
            await AsyncStorage.setItem('remember_me', 'false');
            console.log('Session-only mode enabled');
        } else {
            // Clear session-only flag and set remember me to true
            await AsyncStorage.removeItem('session_only');
            await AsyncStorage.setItem('remember_me', 'true');
            console.log('Remember me mode enabled');
        }

        return { success: true, user: userCredential.user };
    } catch (error: any) {
        console.log('Sign in error:', error);
        return { success: false, error: error.message };
    }
};

export const signUp = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const signOutUser = async () => {
    try {
        console.log('Signing out user');
        // Clear remember me preference when signing out
        await AsyncStorage.removeItem('remember_me');
        await AsyncStorage.removeItem('session_only');
        await AsyncStorage.removeItem('saved_email');
        console.log('Cleared auth preferences');

        await signOut(auth);
        console.log('User signed out successfully');
        return { success: true };
    } catch (error: any) {
        console.log('Sign out error:', error);
        return { success: false, error: error.message };
    }
};

export const resetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

export const shouldRememberUser = async (): Promise<boolean> => {
    try {
        const rememberMe = await AsyncStorage.getItem('remember_me');
        const sessionOnly = await AsyncStorage.getItem('session_only');

        console.log('Checking remember me status:', { rememberMe, sessionOnly });

        // If remember_me is explicitly set to false, don't remember
        if (rememberMe === 'false') {
            console.log('Remember me explicitly disabled');
            return false;
        }

        // If session_only is true, don't remember
        if (sessionOnly === 'true') {
            console.log('Session-only mode detected');
            return false;
        }

        // Default to remembering user
        console.log('Defaulting to remember user');
        return true;
    } catch (error) {
        console.log('Error checking remember me status:', error);
        return true; // Default to remembering user
    }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

// Firestore functions for user data
export const saveUserPreferences = async (userId: string, preferences: any) => {
    try {
        await setDoc(doc(db, 'users', userId, 'data', 'preferences'), preferences);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getUserPreferences = async (userId: string) => {
    try {
        const docRef = doc(db, 'users', userId, 'data', 'preferences');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { success: true, data: docSnap.data() };
        } else {
            return { success: true, data: null };
        }
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const saveFavoriteRecipe = async (userId: string, recipe: any) => {
    try {
        await setDoc(doc(db, 'users', userId, 'favorites', recipe.id), {
            ...recipe,
            savedAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const removeFavoriteRecipe = async (userId: string, recipeId: string) => {
    try {
        await deleteDoc(doc(db, 'users', userId, 'favorites', recipeId));
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getFavoriteRecipes = async (userId: string) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'users', userId, 'favorites'));
        const favorites = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return { success: true, data: favorites };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const saveShoppingList = async (userId: string, list: any) => {
    try {
        await setDoc(doc(db, 'users', userId, 'shoppingLists', list.id), {
            ...list,
            updatedAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getShoppingLists = async (userId: string) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'users', userId, 'shoppingLists'));
        const lists = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return { success: true, data: lists };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const saveRecentSearch = async (userId: string, search: string) => {
    try {
        const searchesRef = collection(db, 'users', userId, 'recentSearches');
        await setDoc(doc(searchesRef, search), {
            search,
            timestamp: new Date().toISOString()
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getRecentSearches = async (userId: string) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'users', userId, 'recentSearches'));
        const searches = querySnapshot.docs
            .map(doc => doc.data())
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);
        return { success: true, data: searches };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

// Analytics functions
export const trackEvent = (eventName: string, parameters?: any) => {
    if (analytics) {
        try {
            import('firebase/analytics').then(({ logEvent }) => {
                logEvent(analytics, eventName, parameters);
            });
        } catch (error) {
            console.log('Analytics tracking failed:', error);
        }
    }
};

export const trackUserAction = (action: string, details?: any) => {
    trackEvent('user_action', {
        action,
        details,
        timestamp: new Date().toISOString()
    });
};

export default {
    auth,
    db,
    analytics,
    signIn,
    signUp,
    signOutUser,
    resetPassword,
    getCurrentUser,
    onAuthStateChange,
    saveUserPreferences,
    getUserPreferences,
    saveFavoriteRecipe,
    removeFavoriteRecipe,
    getFavoriteRecipes,
    saveShoppingList,
    getShoppingLists,
    saveRecentSearch,
    getRecentSearches,
    trackEvent,
    trackUserAction,
}; 