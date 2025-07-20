import React, { useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Optimized debounce hook for search inputs
 */
export const useDebounce = (value: string, delay: number = 500): string => {
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

/**
 * Optimized search function with memoization
 */
export const useSearchOptimization = (items: any[], searchTerm: string, searchKeys: string[]) => {
    return useMemo(() => {
        if (!searchTerm.trim()) return items;

        const lowerSearchTerm = searchTerm.toLowerCase();
        return items.filter(item =>
            searchKeys.some(key =>
                item[key]?.toLowerCase().includes(lowerSearchTerm)
            )
        );
    }, [items, searchTerm, searchKeys]);
};

/**
 * Optimized list rendering with pagination
 */
export const usePagination = (items: any[], itemsPerPage: number = 20) => {
    const [currentPage, setCurrentPage] = React.useState(1);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    }, [items, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    const goToPage = useCallback((page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    }, [totalPages]);

    const nextPage = useCallback(() => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }, [currentPage, totalPages]);

    const prevPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }, [currentPage]);

    return {
        paginatedItems,
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
    };
};

/**
 * Optimized image loading with caching
 */
export const useImageOptimization = (imageUrl: string) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);

    const handleLoad = useCallback(() => {
        setIsLoading(false);
        setHasError(false);
    }, []);

    const handleError = useCallback(() => {
        setIsLoading(false);
        setHasError(true);
    }, []);

    return {
        isLoading,
        hasError,
        handleLoad,
        handleError,
    };
};

/**
 * Optimized theme-aware styles
 */
export const useOptimizedStyles = (styleCreator: () => any, dependencies: any[] = []) => {
    return useMemo(styleCreator, dependencies);
};

/**
 * Optimized async storage operations
 */
export const useAsyncStorageOptimization = () => {
    const setItem = useCallback(async (key: string, value: any) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }, []);

    const getItem = useCallback(async (key: string) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error('Error reading data:', error);
            return null;
        }
    }, []);

    const removeItem = useCallback(async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing data:', error);
            return false;
        }
    }, []);

    return { setItem, getItem, removeItem };
}; 