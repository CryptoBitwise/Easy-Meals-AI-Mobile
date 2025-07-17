// Validation utilities for form inputs and data

export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean;
    message?: string;
}

export interface ValidationResult {
    isValid: boolean;
    message?: string;
}

export const validateField = (value: any, rules: ValidationRule): ValidationResult => {
    // Required check
    if (rules.required && (!value || value.toString().trim() === '')) {
        return {
            isValid: false,
            message: rules.message || 'This field is required'
        };
    }

    // Skip other validations if value is empty and not required
    if (!value || value.toString().trim() === '') {
        return { isValid: true };
    }

    const stringValue = value.toString();

    // Length checks
    if (rules.minLength && stringValue.length < rules.minLength) {
        return {
            isValid: false,
            message: rules.message || `Minimum length is ${rules.minLength} characters`
        };
    }

    if (rules.maxLength && stringValue.length > rules.maxLength) {
        return {
            isValid: false,
            message: rules.message || `Maximum length is ${rules.maxLength} characters`
        };
    }

    // Pattern check
    if (rules.pattern && !rules.pattern.test(stringValue)) {
        return {
            isValid: false,
            message: rules.message || 'Invalid format'
        };
    }

    // Custom validation
    if (rules.custom && !rules.custom(value)) {
        return {
            isValid: false,
            message: rules.message || 'Invalid value'
        };
    }

    return { isValid: true };
};

// Common validation rules
export const validationRules = {
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    password: {
        required: true,
        minLength: 6,
        message: 'Password must be at least 6 characters'
    },
    name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        message: 'Name must be between 2 and 50 characters'
    },
    searchQuery: {
        minLength: 2,
        message: 'Search query must be at least 2 characters'
    }
};

// Validate form data
export const validateForm = (data: Record<string, any>, rules: Record<string, ValidationRule>) => {
    const errors: Record<string, string> = {};
    let isValid = true;

    Object.keys(rules).forEach(field => {
        const result = validateField(data[field], rules[field]);
        if (!result.isValid) {
            errors[field] = result.message || 'Invalid field';
            isValid = false;
        }
    });

    return { isValid, errors };
};

// Sanitize input data
export const sanitizeInput = (input: string): string => {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/\s+/g, ' '); // Normalize whitespace
};

// Validate recipe data
export const validateRecipe = (recipe: any) => {
    const rules = {
        title: { required: true, minLength: 3, maxLength: 100 },
        ingredients: { required: true, custom: (value: any) => Array.isArray(value) && value.length > 0 },
        instructions: { required: true, custom: (value: any) => Array.isArray(value) && value.length > 0 },
        time: { required: true, custom: (value: any) => parseInt(value) > 0 },
        difficulty: { required: true, custom: (value: any) => ['Easy', 'Medium', 'Hard'].includes(value) }
    };

    return validateForm(recipe, rules);
};

// Validate user preferences
export const validatePreferences = (preferences: any) => {
    const rules = {
        cookingSkill: { required: true, custom: (value: any) => ['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(value) },
        servingSize: { required: true, custom: (value: any) => parseInt(value) > 0 && parseInt(value) <= 20 },
        spiceLevel: { required: true, custom: (value: any) => ['Mild', 'Medium', 'Hot', 'Extra Hot'].includes(value) }
    };

    return validateForm(preferences, rules);
}; 