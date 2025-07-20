#!/bin/bash

# 🚀 EasyMeal AI Deployment Script
echo "🚀 Starting EasyMeal AI deployment..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

# Login to Expo (if not already logged in)
echo "🔐 Logging into Expo..."
eas login

# Configure EAS Build
echo "⚙️ Configuring EAS Build..."
eas build:configure

# Build for Android
echo "📱 Building for Android..."
eas build --platform android --non-interactive

# Build for iOS (requires Apple Developer account)
echo "🍎 Building for iOS..."
eas build --platform ios --non-interactive

echo "✅ Builds completed!"
echo "📋 Next steps:"
echo "1. Review builds in Expo dashboard"
echo "2. Submit to app stores:"
echo "   - Android: eas submit --platform android"
echo "   - iOS: eas submit --platform ios"
echo "3. Update app store metadata"
echo "4. Monitor app store review process"

echo "🎉 Deployment script completed!" 