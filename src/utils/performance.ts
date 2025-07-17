// Performance optimization utilities

// Debounce function calls
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

// Throttle function calls
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let lastCall = 0;

    return (...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    };
};

// Simple cache implementation
export class Cache<T> {
    private cache = new Map<string, { data: T; timestamp: number }>();
    private maxAge: number;

    constructor(maxAge: number = 5 * 60 * 1000) { // 5 minutes default
        this.maxAge = maxAge;
    }

    set(key: string, data: T): void {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    get(key: string): T | null {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > this.maxAge) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }
}

// Memoization utility
export const memoize = <T extends (...args: any[]) => any>(
    func: T,
    keyGenerator?: (...args: Parameters<T>) => string
): T => {
    const cache = new Map<string, ReturnType<T>>();

    return ((...args: Parameters<T>): ReturnType<T> => {
        const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key)!;
        }

        const result = func(...args);
        cache.set(key, result);
        return result;
    }) as T;
};

// Lazy loading utility
export const lazyLoad = <T>(
    loader: () => Promise<T>,
    cache: Cache<T> = new Cache<T>()
) => {
    return async (key: string): Promise<T> => {
        const cached = cache.get(key);
        if (cached) return cached;

        const data = await loader();
        cache.set(key, data);
        return data;
    };
};

// Image preloading utility
export const preloadImages = (urls: string[]): Promise<void[]> => {
    return Promise.all(
        urls.map(url => {
            return new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
                img.src = url;
            });
        })
    );
};

// Batch processing utility
export const batchProcess = <T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize: number = 10
): Promise<R[]> => {
    const results: R[] = [];

    const processBatch = async (startIndex: number): Promise<void> => {
        const batch = items.slice(startIndex, startIndex + batchSize);
        const batchResults = await Promise.all(batch.map(processor));
        results.push(...batchResults);
    };

    return new Promise(async (resolve, reject) => {
        try {
            for (let i = 0; i < items.length; i += batchSize) {
                await processBatch(i);
            }
            resolve(results);
        } catch (error) {
            reject(error);
        }
    });
};

// Performance monitoring utility
export class PerformanceMonitor {
    private metrics: Map<string, number[]> = new Map();

    startTimer(label: string): () => void {
        const start = performance.now();
        return () => this.endTimer(label, start);
    }

    private endTimer(label: string, start: number): void {
        const duration = performance.now() - start;
        if (!this.metrics.has(label)) {
            this.metrics.set(label, []);
        }
        this.metrics.get(label)!.push(duration);
    }

    getAverageTime(label: string): number {
        const times = this.metrics.get(label);
        if (!times || times.length === 0) return 0;
        return times.reduce((sum, time) => sum + time, 0) / times.length;
    }

    getMetrics(): Record<string, { average: number; count: number }> {
        const result: Record<string, { average: number; count: number }> = {};
        this.metrics.forEach((times, label) => {
            result[label] = {
                average: this.getAverageTime(label),
                count: times.length
            };
        });
        return result;
    }

    clear(): void {
        this.metrics.clear();
    }
}

// Export a singleton instance
export const performanceMonitor = new PerformanceMonitor(); 