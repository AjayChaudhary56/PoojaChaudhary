# Pooja Chaudhary Portfolio - Content Editing Guide

All text, credits, links and file paths live in one place:

`src/content/portfolio.ts`

## Replace the hero portrait

Replace `public/images/pooja/pooja-cutout.png` with a transparent PNG using the same filename.

## Replace film posters and trailers

1. Pooja currently has one film entry. Replace its local poster or paste an official poster URL into `poster`.
2. Edit the `films` entry in `src/content/portfolio.ts`, including optional `detailsUrl` and `creditStatus` fields.
3. Keep the object field names unchanged. The page updates automatically.

## Replace music-video thumbnails and links

1. Pooja currently has two music-video entries. Replace a local thumbnail or paste an official thumbnail URL into `thumbnail`.
2. Edit the two `musicVideos` entries in `src/content/portfolio.ts`, including `videoUrl` and `creditStatus`.

## Update the rotating Instagram reels

Edit the `instagramReels` array in `src/content/portfolio.ts`. Each item needs a short `title` and a public `reelUrl`. The section changes reels automatically every 12 seconds, and visitors can pause it or choose a reel manually.

The current setup uses a curated list so it works without account credentials. Fully automatic discovery of every newly posted reel requires Pooja's Instagram professional account to be connected through Meta's Instagram API.

## Replace the showreel

Edit `showreelUrl` and `showreelThumbnail` in `src/content/portfolio.ts`.

## Replace the resumes

Replace these two files without changing their names:

- `public/documents/pooja-chaudhary-acting-resume.pdf`
- `public/documents/pooja-chaudhary-professional-resume.pdf`

You can also change their URLs in `resumeLinks` inside `src/content/portfolio.ts`.

## Replace gallery images and social links

- Gallery files: `public/images/gallery/`
- Gallery labels and paths: `gallery` in `src/content/portfolio.ts`
- Social profiles: `socialLinks` in `src/content/portfolio.ts`

## Change collaboration contact

Edit `email`, `subject`, `availability` and `websiteMessageLabel` inside `collaboration` in `src/content/portfolio.ts`. The enquiry form prepares a message in the visitor's email app and includes the website label automatically.

## Future hero background video

The planned hero background-video fields are recorded in `futureWebsiteIdeas` inside `src/content/portfolio.ts`. They are intentionally disabled for now, so the current portrait-led hero remains unchanged.

## Deploy with GitHub and Vercel

See `VERCEL_DEPLOYMENT.md`. Connecting the GitHub repository to Vercel is recommended because each push can deploy automatically; the supplied ZIP can also be uploaded manually.

Every placeholder is labelled clearly in the website until it is replaced.
