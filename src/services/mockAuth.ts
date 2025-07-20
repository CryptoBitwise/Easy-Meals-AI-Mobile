// Temporary mock authentication for testing UI
// This will be replaced with real Firebase auth

export interface MockUser {
    uid: string;
    email: string;
    displayName?: string;
}

let currentUser: MockUser | null = null;

export const mockSignIn = async (email: string, password: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple validation
    if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
    }

    if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Create mock user
    currentUser = {
        uid: `mock_${Date.now()}`,
        email: email,
        displayName: email.split('@')[0],
    };

    return { success: true, user: currentUser };
};

export const mockSignUp = async (email: string, password: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple validation
    if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
    }

    if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
    }

    if (!email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
    }

    // Create mock user
    currentUser = {
        uid: `mock_${Date.now()}`,
        email: email,
        displayName: email.split('@')[0],
    };

    return { success: true, user: currentUser };
};

export const mockSignOut = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    currentUser = null;
    return { success: true };
};

export const mockGetCurrentUser = (): MockUser | null => {
    return currentUser;
};

export const mockResetPassword = async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
    }

    return { success: true };
};

export default {
    signIn: mockSignIn,
    signUp: mockSignUp,
    signOutUser: mockSignOut,
    getCurrentUser: mockGetCurrentUser,
    resetPassword: mockResetPassword,
}; 