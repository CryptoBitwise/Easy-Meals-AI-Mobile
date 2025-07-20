import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
    theme: ThemeColors;
}

interface ThemeColors {
    background: string;
    surface: string;
    surfaceVariant: string;
    primary: string;
    primaryVariant: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderVariant: string;
    shadow: string;
    success: string;
    warning: string;
    error: string;
    gradient: {
        primary: string[];
        secondary: string[];
        surface: string[];
    };
}

// Modern AI App Theme - Light Mode
const lightTheme: ThemeColors = {
    background: '#fafbfc',
    surface: '#ffffff',
    surfaceVariant: '#f8f9fa',
    primary: '#6366f1', // Modern indigo
    primaryVariant: '#4f46e5',
    secondary: '#10b981', // Modern emerald
    accent: '#f59e0b', // Modern amber
    text: '#1f2937',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    border: '#e5e7eb',
    borderVariant: '#f3f4f6',
    shadow: 'rgba(0, 0, 0, 0.1)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: {
        primary: ['#6366f1', '#4f46e5', '#4338ca'],
        secondary: ['#10b981', '#059669', '#047857'],
        surface: ['#ffffff', '#f8f9fa', '#f1f5f9'],
    },
};

// Modern AI App Theme - Dark Mode
const darkTheme: ThemeColors = {
    background: '#0f172a',
    surface: '#1e293b',
    surfaceVariant: '#334155',
    primary: '#8b5cf6', // Modern violet
    primaryVariant: '#7c3aed',
    secondary: '#06b6d4', // Modern cyan
    accent: '#fbbf24', // Modern yellow
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    border: '#334155',
    borderVariant: '#475569',
    shadow: 'rgba(0, 0, 0, 0.3)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: {
        primary: ['#8b5cf6', '#7c3aed', '#6d28d9'],
        secondary: ['#06b6d4', '#0891b2', '#0e7490'],
        surface: ['#1e293b', '#334155', '#475569'],
    },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Load saved theme preference
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme) {
                setIsDarkMode(savedTheme === 'dark');
            }
        } catch (error) {
            console.log('Error loading theme preference:', error);
        }
    };

    const toggleTheme = async () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);

        try {
            await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
        } catch (error) {
            console.log('Error saving theme preference:', error);
        }
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 