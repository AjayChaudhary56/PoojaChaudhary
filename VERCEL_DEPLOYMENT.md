# Deploy Pooja's Portfolio with GitHub and Vercel

The recommended setup is a GitHub repository connected to Vercel. Every push to the repository's production branch will then publish a fresh deployment automatically.

## 1. Upload to GitHub

1. Create a new empty GitHub repository.
2. Unzip the supplied portfolio package on your computer.
3. Upload all extracted files to the repository, including `package.json`, `package-lock.json`, `vercel.json`, `app/`, `src/` and `public/`.
4. Do not upload local `.env` files or `node_modules/`.

## 2. Connect GitHub to Vercel

1. Sign in to Vercel and choose **Add New > Project**.
2. Import the GitHub repository.
3. Vercel should detect **Next.js** automatically.
4. Keep the project root as the repository root.
5. Deploy. The included `vercel.json` runs `npm run build:vercel`.

After this first setup, edit the project, commit the changes and push them to GitHub. Vercel will automatically build and publish the update.

## Content updates

Most real content can be changed in one file:

`src/content/portfolio.ts`

The hero photo, gallery, PDF résumés and local artwork are inside `public/`. See `CONTENT_EDITING_GUIDE.md` for exact paths.

## Instagram reels

The current website rotates a curated list of public reel URLs stored in `src/content/portfolio.ts`. Add a new URL to the `instagramReels` array to include it in rotation without changing any React component.

Automatic discovery of every future reel requires Pooja's Instagram professional account to be connected through Meta's Instagram API and requires server-side credentials. Never commit those credentials to GitHub.
