# Cloudinary Setup Guide

## Why Cloudinary?
Your file uploads are failing on Vercel because Vercel's serverless functions run in a read-only filesystem environment. Cloudinary provides cloud storage for media files that works perfectly with Vercel deployments.

## Steps to Set Up Cloudinary

1. **Create a Cloudinary Account**
   - Go to [Cloudinary's website](https://cloudinary.com/) and sign up for a free account
   - The free tier includes 25GB storage and 25GB monthly bandwidth

2. **Get Your Cloudinary Credentials**
   - After signing up, go to your Cloudinary dashboard
   - Look for the "Account Details" section
   - You'll need three values:
     - Cloud Name
     - API Key
     - API Secret

3. **Add Credentials to Environment Variables**
   - Add the following to your `.env` file locally:
     ```
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```
   - Add the same variables to your Vercel project:
     - Go to your Vercel dashboard
     - Select your project
     - Go to Settings > Environment Variables
     - Add the three Cloudinary variables

4. **Deploy Your Project**
   - After adding the environment variables, redeploy your project on Vercel

## How It Works
- The updated code now uploads files directly to Cloudinary instead of the local filesystem
- Cloudinary returns a URL that you can use to access the file
- This works in both development and production environments

## Testing
- After deployment, test file uploads in your production environment
- You should see files appearing in your Cloudinary Media Library
