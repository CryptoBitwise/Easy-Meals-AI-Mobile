# EasyMeals AI - Mobile App 🍽️

A modern, AI-powered recipe and meal planning mobile application built with React Native and Expo.

## ✨ Features

### 🤖 AI-Powered Features

- **AI Chat Assistant** - Get recipe ideas, cooking tips, and meal suggestions
- **AI Recipe Search** - Find recipes using natural language queries
- **AI Meal Planner** - Generate personalized meal plans
- **AI Shopping List Generator** - Create shopping lists from meal plans
- **AI Recipe Recommendations** - Personalized recipe suggestions
- **AI Nutrition Analysis** - Detailed nutritional information
- **AI Step-by-Step Guidance** - Interactive cooking instructions
- **AI Ingredient Substitutions** - Find alternatives for ingredients

### 📱 Core App Features

- **Recipe Search & Discovery** - Advanced search with filters
- **Recipe Favorites** - Save and organize favorite recipes
- **Recipe Categories** - Browse by cuisine, diet, and time
- **User Profile & Preferences** - Personalized experience
- **Dark Mode** - Beautiful dark theme support
- **Offline Support** - Works without internet connection

### 🎨 User Experience

- **Modern UI/UX** - Clean, intuitive interface
- **Loading States** - Smooth loading animations
- **Error Handling** - Graceful error states
- **Empty States** - Helpful empty state designs
- **Accessibility** - Screen reader support
- **Performance Optimized** - Fast and responsive

## 🏗️ Architecture

### Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe development
- **AsyncStorage** - Local data persistence
- **React Navigation** - Screen navigation
- **Expo Vector Icons** - Icon library

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LoadingSpinner.tsx
│   ├── EmptyState.tsx
│   └── ErrorBoundary.tsx
├── context/            # React Context providers
│   └── ThemeContext.tsx
├── screens/            # App screens
│   ├── HomeScreen.tsx
│   ├── SearchScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── PreferencesScreen.tsx
│   └── ... (other screens)
├── services/           # Business logic services
│   ├── aiService.ts
│   ├── preferencesService.ts
│   └── ... (other services)
└── utils/              # Utility functions
    ├── validation.ts
    └── performance.ts
```

### Key Components

#### 🎯 Core Services

- **AI Service** - Centralized AI functionality with mock implementations
- **Preferences Service** - User preferences management
- **Validation Utils** - Form and data validation
- **Performance Utils** - Caching, debouncing, and optimization

#### 🎨 UI Components

- **LoadingSpinner** - Reusable loading indicator
- **EmptyState** - Consistent empty state design
- **ErrorBoundary** - Error handling and recovery

#### 🌙 Theme System

- **Dark/Light Mode** - Complete theme support
- **Consistent Colors** - Unified color palette
- **Accessibility** - Proper contrast ratios

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd EasyMealsAI-Mobile
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

### Development

#### Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
npm run eject      # Eject from Expo (not recommended)
```

#### Environment Setup

The app is configured for Expo Go compatibility. For production builds:

1. Install EAS CLI: `npm install -g @expo/eas-cli`
2. Configure EAS: `eas build:configure`
3. Build for production: `eas build`

## 📱 App Screens

### Main Screens

1. **Intro Screen** - Welcome and onboarding
2. **Login Screen** - User authentication
3. **Home Screen** - Main dashboard with quick actions
4. **Search Screen** - Advanced recipe search with filters
5. **Recipe Detail** - Detailed recipe view
6. **Profile Screen** - User profile and settings
7. **Preferences Screen** - Dietary and cooking preferences

### AI Feature Screens

1. **AI Chat** - Conversational recipe assistant
2. **AI Recipe Search** - Natural language recipe search
3. **AI Meal Planner** - Personalized meal planning
4. **AI Shopping List** - Automated shopping lists
5. **AI Recommendations** - Personalized recipe suggestions
6. **AI Nutrition Analysis** - Detailed nutrition info
7. **AI Step-by-Step** - Interactive cooking guidance
8. **AI Ingredient Sub** - Ingredient substitution finder

### Core Feature Screens

1. **Favorites** - Saved recipes management
2. **Categories** - Recipe browsing by category
3. **Meal Plan** - Weekly meal planning
4. **Shopping List** - Grocery list management

## 🔧 Configuration

### AI Integration

The app currently uses mock AI responses. To integrate real AI:

1. **OpenAI Integration**

   ```typescript
   // In src/services/aiService.ts
   const OPENAI_API_KEY = 'your-api-key';
   const response = await fetch('https://api.openai.com/v1/chat/completions', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${OPENAI_API_KEY}`,
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       model: 'gpt-3.5-turbo',
       messages: [{ role: 'user', content: prompt }],
     }),
   });
   ```

2. **Voice Integration**
   - Uncomment voice features in screens
   - Install: `expo install @react-native-community/voice`
   - Configure permissions in `app.json`

### Data Persistence

- **AsyncStorage** - Local data storage
- **User Preferences** - Dietary restrictions, cooking skill
- **Favorites** - Saved recipes
- **Search History** - Recent searches

## 🎨 Customization

### Theme Customization

```typescript
// In src/context/ThemeContext.tsx
const lightTheme = {
  primary: '#4CAF50',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#333333',
  // ... other colors
};
```

### Adding New Features

1. Create screen in `src/screens/`
2. Add to navigation in `App.tsx`
3. Create service in `src/services/` if needed
4. Add to appropriate navigation flows

## 🧪 Testing

### Manual Testing

- Test all screens and navigation flows
- Verify dark/light mode switching
- Test offline functionality
- Check accessibility features

### Performance Testing

- Monitor app performance with React DevTools
- Use performance utilities in `src/utils/performance.ts`
- Test on different devices and screen sizes

## 📦 Deployment

### Expo Go (Development)

- Perfect for testing and development
- No build required
- Limited to Expo SDK features

### Standalone App (Production)

1. **EAS Build**

   ```bash
   eas build --platform ios
   eas build --platform android
   ```

2. **App Store/Play Store**
   - Follow platform-specific guidelines
   - Configure app signing
   - Submit for review

## 🤝 Contributing

### Development Guidelines

1. **TypeScript** - Use strict typing
2. **Component Structure** - Follow existing patterns
3. **Error Handling** - Implement proper error boundaries
4. **Performance** - Use memoization and optimization
5. **Accessibility** - Include proper labels and navigation

### Code Style

- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow React Native best practices
- Use consistent naming conventions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Expo Team** - For the amazing development platform
- **React Native Community** - For the excellent ecosystem
- **OpenAI** - For AI capabilities (when integrated)
- **Ionicons** - For the beautiful icon set

---

**Built with ❤️ using React Native and Expo**

*EasyMeals AI - Making cooking easier, one recipe at a time! 🍳*
