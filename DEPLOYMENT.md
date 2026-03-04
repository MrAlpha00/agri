# Deployment Guide: AgriScan Platform

This guide covers everything you need to deploy the AgriScan Next.js application to Vercel and connect it securely to Supabase and Firebase.

## Prerequisites
1. A [Vercel](https://vercel.com/) account.
2. A [Supabase](https://supabase.com/) account and project.
3. A [Firebase](https://firebase.google.com/) account for Google Auth.
4. A [Hugging Face](https://huggingface.co/) token (optional, for real AI inference).

---

## 1. Setting up Supabase

1. Go to your Supabase project dashboard.
2. Go to **Settings > API**.
3. Copy your `Project URL` and `anon public` key.
4. Navigate to **SQL Editor** and ensure your `predictions` table exists:
   ```sql
   create table predictions (
     id uuid default uuid_generate_v4() primary key,
     crop text,
     disease text,
     confidence numeric,
     severity text,
     image_url text,
     created_at timestamp with time zone default now()
   );
   ```
5. Navigate to **Storage** and create a public bucket named `crop-images`. Allow necessary policies for inserts.

---

## 2. Setting up Firebase (Google Auth)

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project or select an existing one.
3. In **Authentication > Sign-in method**, enable **Google**.
4. Register a "Web App" under project settings to get your Firebase configuration values (`apiKey`, `authDomain`, `projectId`, etc.).

---

## 3. Deployment on Vercel

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Log in to [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import your repository.
4. Vercel will auto-detect the **Next.js** framework. The default build command (`next build`) and install command (`npm install`) are correct.

### Configuring Environment Variables
Expand the **Environment Variables** section before deploying and add the following keys. You can reference the `.env.example` file in the repository:

*   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon public key.
*   `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API key.
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain.
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project ID.
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket.
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID.
*   `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase app ID.
*   `HF_TOKEN`: (Optional) Your Hugging Face access token to enable real AI processing. If omitted, the app securely falls back to its internal mock testing engine gracefully.

5. Click **Deploy**.

---

## 4. Post-Deployment Optimization & Verification
- **Ensure Storage Connectivity:** Verify image uploading by testing a single crop scan analysis from your deployed Vercel domain.
- **Serverless Analytics Testing:** Check your `/dashboard` statistics; Next.js routes are automatically optimized for Vercel's edge network.
- **Google Login Origin:** Ensure that your Vercel URL is added to your Firebase project's **Authorized Domains** within the Authentication settings.
