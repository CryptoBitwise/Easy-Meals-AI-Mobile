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
    primary: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
}

const lightTheme: ThemeColors = {
    background: '#f5f5f5',
    surface: '#fff',
    primary: '#4CAF50',
    text: '#333',
    textSecondary: '#666',
    border: '#e0e0e0',
    shadow: '#000',
};

const darkTheme: ThemeColors = {
    background: '#121212',
    surface: '#1e1e1e',
    primary: '#4CAF50',
    text: '#fff',
    textSecondary: '#ccc',
    border: '#333',
    shadow: '#000',
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