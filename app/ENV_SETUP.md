# Environment Variables Setup Guide

This file documents all required environment variables for optimal SEO and functionality.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Base URL Configuration (REQUIRED)
NEXT_PUBLIC_BASE_URL=http://localhost:3005
# Production: NEXT_PUBLIC_BASE_URL=https://www.yourdomain.com

# Site Information for SEO (REQUIRED)
NEXT_PUBLIC_SITE_NAME=THE STORE
NEXT_PUBLIC_SITE_DESCRIPTION=Shop the latest fashion trends, clothing, shoes, and accessories at THE STORE. Discover quality products with fast shipping and excellent customer service.
NEXT_PUBLIC_SITE_KEYWORDS=fashion, clothing, shoes, accessories, online shopping, apparel, footwear, style

# Social Media & Branding (OPTIONAL but recommended)
NEXT_PUBLIC_SITE_AUTHOR=THE STORE
NEXT_PUBLIC_TWITTER_HANDLE=@thestore
NEXT_PUBLIC_FACEBOOK_PAGE=https://www.facebook.com/thestore
NEXT_PUBLIC_INSTAGRAM_HANDLE=@thestore

# Contact Information (OPTIONAL)
NEXT_PUBLIC_CONTACT_EMAIL=support@thestore.com
NEXT_PUBLIC_CONTACT_PHONE=+1-800-THE-STORE

# Business Information for Structured Data (OPTIONAL)
NEXT_PUBLIC_BUSINESS_NAME=THE STORE
NEXT_PUBLIC_BUSINESS_TYPE=RetailStore
NEXT_PUBLIC_BUSINESS_ADDRESS_STREET=123 Main Street
NEXT_PUBLIC_BUSINESS_ADDRESS_CITY=New York
NEXT_PUBLIC_BUSINESS_ADDRESS_STATE=NY
NEXT_PUBLIC_BUSINESS_ADDRESS_ZIP=10001
NEXT_PUBLIC_BUSINESS_ADDRESS_COUNTRY=US

# Open Graph & Social Sharing (OPTIONAL)
NEXT_PUBLIC_OG_IMAGE=https://www.yourdomain.com/og-image.jpg
NEXT_PUBLIC_OG_TYPE=website

# Additional Social Media Links for Entity Linking (OPTIONAL)
NEXT_PUBLIC_LINKEDIN_PAGE=https://www.linkedin.com/company/thestore
NEXT_PUBLIC_WIKIPEDIA_PAGE=https://en.wikipedia.org/wiki/The_Store
NEXT_PUBLIC_CRUNCHBASE_PAGE=https://www.crunchbase.com/organization/thestore
NEXT_PUBLIC_YOUTUBE_PAGE=https://www.youtube.com/@thestore
NEXT_PUBLIC_PINTEREST_PAGE=https://www.pinterest.com/thestore

# Analytics (OPTIONAL)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=

# Authentication (REQUIRED for app functionality)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Node Environment
NODE_ENV=development

# Staging/Test Environment (OPTIONAL)
# Set to 'staging' to enable staging mode for automated testing
NEXT_PUBLIC_ENVIRONMENT=development
# Or use a staging URL pattern:
# NEXT_PUBLIC_BASE_URL=https://staging.yourdomain.com
# NEXT_PUBLIC_STAGING_URL=https://staging.yourdomain.com
```

## Quick Setup

1. Copy the variables above into a new file named `.env.local`
2. Update the values with your actual information
3. For production, ensure `NEXT_PUBLIC_BASE_URL` points to your production domain
4. Restart your development server after making changes

## SEO-Specific Variables

For optimal SEO (100 score), ensure these are set:

- ✅ `NEXT_PUBLIC_BASE_URL` - Your production domain
- ✅ `NEXT_PUBLIC_SITE_NAME` - Your site name
- ✅ `NEXT_PUBLIC_SITE_DESCRIPTION` - Meta description (150-160 characters)
- ✅ `NEXT_PUBLIC_SITE_KEYWORDS` - Comma-separated keywords
- ✅ `NEXT_PUBLIC_TWITTER_HANDLE` - For Twitter cards
- ✅ `NEXT_PUBLIC_OG_IMAGE` - Open Graph image (1200x630px recommended)

## Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` to version control
- Use `.env.example` as a template (without sensitive values)
- Restart the dev server after changing environment variables

