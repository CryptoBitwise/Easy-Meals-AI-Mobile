# Legal Documents for EasyMeals AI

This directory contains the legal documents required for app store deployment and compliance.

## 📋 Documents Included

### 1. Privacy Policy

- **File:** `privacy-policy.md` (Markdown version)
- **File:** `privacy-policy.html` (HTML version for web hosting)
- **Purpose:** Explains how we collect, use, and protect user data
- **Required for:** App Store, Google Play Store, GDPR compliance

### 2. Terms of Service

- **File:** `terms-of-service.md`
- **Purpose:** Defines user rights, app usage rules, and legal protections
- **Required for:** App Store, Google Play Store, legal protection

## 🚀 Deployment Instructions

### 1. Host the Privacy Policy

You need to host the privacy policy online so it can be accessed via URL. Options:

**Option A: GitHub Pages (Free)**

```bash
# Create a new repository called 'easymealsai-legal'
# Upload privacy-policy.html as index.html
# Enable GitHub Pages in repository settings
# URL will be: https://yourusername.github.io/easymealsai-legal/
```

**Option B: Netlify (Free)**

```bash
# Drag and drop the legal folder to netlify.com
# Get a URL like: https://your-site.netlify.app
```

**Option C: Your own domain**

```bash
# Upload to your web server
# URL: https://easymealsai.com/privacy-policy
```

### 2. Update App Configuration

The `app.json` file has been updated with:

```json
{
  "privacyPolicyUrl": "https://easymealsai.com/privacy-policy"
}
```

Update this URL to match where you host the privacy policy.

### 3. App Store Requirements

**Apple App Store:**

- Privacy Policy URL required
- Terms of Service recommended
- Data collection disclosure required

**Google Play Store:**

- Privacy Policy URL required
- Terms of Service recommended
- Data safety section required

## 📝 Customization Needed

Before deployment, update these items:

### 1. Contact Information

In both documents, update:

- `privacy@easymealsai.com` → Your actual email
- `legal@easymealsai.com` → Your actual email
- `https://easymealsai.com` → Your actual website
- `[Your Company Address]` → Your actual address

### 2. Legal Jurisdiction

In `terms-of-service.md`, update:

- `[Your State/Country]` → Your actual legal jurisdiction

### 3. Company Details

- Update company name if different from "EasyMeals AI"
- Add your actual business information

## 🔒 Compliance Features

### GDPR Compliance (EU)

- ✅ Right to access data
- ✅ Right to delete data
- ✅ Right to data portability
- ✅ Clear consent mechanisms

### CCPA Compliance (California)

- ✅ Right to know what data is collected
- ✅ Right to delete personal information
- ✅ Right to opt-out of data sales
- ✅ Non-discrimination protection

### App Store Compliance

- ✅ Privacy policy URL
- ✅ Data collection disclosure
- ✅ User rights explanation
- ✅ Contact information

## 📞 Support

If you need help with:

- Hosting the documents
- Customizing the content
- App store submission
- Legal compliance questions

Contact: <legal@easymealsai.com>

---

**Last Updated:** July 17, 2024
**Status:** Ready for deployment
