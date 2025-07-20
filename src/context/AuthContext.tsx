import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { getCurrentUser, onAuthStateChange, signOutUser, shouldRememberUser } from '../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChange(async (user) => {
            if (user) {
                // Check if user should be remembered
                const shouldRemember = await shouldRememberUser();
                if (!shouldRemember) {
                    // For session-only users, we'll keep them logged in during the session
                    // but they'll be logged out when the app is completely closed and reopened
                    console.log('Session-only user detected - will be logged out on app restart');
                }
            } else {
                // User is signed out, clear any stored auth preferences
                try {
                    await AsyncStorage.removeItem('session_only');
                    await AsyncStorage.removeItem('remember_me');
                    await AsyncStorage.removeItem('saved_email');
                } catch (error) {
                    console.log('Error clearing auth preferences:', error);
                }
            }
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signOut = async () => {
        try {
            await signOutUser();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    const value = {
        user,
        loading,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 