# Darisi Vasundhara - Premium Developer Portfolio

A production-ready, world-class personal developer portfolio website built for Darisi Vasundhara. The project features an elegant, responsive design with a dark/light mode toggle, powered by React, Vite, and Firebase.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Vanilla CSS with CSS Variables for theme management
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Backend/CMS**: Firebase (Auth, Firestore)

## Features
- **Premium UI/UX**: Custom design system focusing on typography, spacing, and micro-interactions.
- **Dark/Light Mode**: Respects user system preference and persists choice in `localStorage`.
- **Responsive**: Fully optimized for mobile, tablet, and desktop devices.
- **Admin Dashboard**: Protected `/admin` route allowing content modifications via Firebase.
- **Data-Driven**: Content is fetched dynamically from Firestore.

## Installation

1. **Clone the repository** (if applicable) and navigate to the root directory.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your Firebase configuration keys:
   ```bash
   cp .env.example .env
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```

## Firebase Setup

1. **Create a Firebase Project**: Go to the Firebase Console and create a new project.
2. **Enable Firestore**: Create a Firestore database. Update the rules in `firestore.rules`.
3. **Enable Authentication**: Enable Email/Password authentication. Create an admin user.
4. **Deploy Rules**: Use the Firebase CLI to deploy your rules, or paste them into the console:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /portfolio/{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

## Cloudinary Media

If you intend to use Cloudinary for media uploads within the admin dashboard:
1. Ensure your `.env` contains `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`.
2. Setup an **unsigned** upload preset in your Cloudinary settings.
3. Media URLs (like the portrait and certificates) can be pasted into the admin dashboard fields directly.

## Deployment

This project is optimized for deployment on Vercel, Netlify, or Firebase Hosting.
- For Vercel/Netlify: Ensure your build command is `npm run build` and publish directory is `dist`. Add your environment variables in the project settings.
- Ensure you set up a rewrite rule for SPA routing (`/*` -> `/index.html`) if deploying to Firebase Hosting or Netlify.

## Security Considerations

- **NEVER** commit your `.env` file containing API secrets.
- **NEVER** hardcode Firebase Authentication passwords in the source code.
- Only authenticated users can access the `/admin` dashboard and write to Firestore.
