import { initializeApp } from 'firebase/app';
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

// Firebase configuration
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const signIn = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error: any) {
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
        await signOut(auth);
        return { success: true };
    } catch (error: any) {
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

export default {
    auth,
    db,
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
}; 