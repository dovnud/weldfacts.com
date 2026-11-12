# weldfacts.com

Manufacturer-sourced welder specifications and an outlet-and-job check. Astro 5, static output, Node 22, Cloudflare Pages project `weldfacts`.

Specs are transcribed from manufacturer product pages, spec sheets, and owner’s manuals. A field the maker does not publish is shown as “Not published by manufacturer.” The read date on the pages is 2 November 2026.

```bash
nvm use
npm install
npm test
npm run build
```

`npm run build` checks citations, writes sitemap dates, generates Open Graph images, then builds `dist/`.

## Cloudflare Pages

**This project is DIRECT-UPLOAD ONLY. It has no git source (confirmed via the Pages API, 2026-11-11): pushes to this repo NEVER deploy.** Every change ships by building locally and uploading `dist` with Wrangler (see "Deploy with Wrangler" below). Repo commits are source control only.

- Build command: `npm run build` (run locally; all gates must pass)
- Build output: `dist` (`pages_build_output_dir` in `wrangler.jsonc`)
- Node: `22` or newer (the prebuild uses `--experimental-strip-types`)
- Project name: `weldfacts`
- Custom domains: `weldfacts.com` and `www.weldfacts.com`

The AdSense loader (pub-1450356163101033) and `public/ads.txt` are part of the build since 2026-11-11. There is no subscriber database.

### Amazon Associates

`src/config/affiliate.ts` holds `AMAZON_TAG` (`weldfacts-20`). Every Amazon link is a search until an ASIN is added to `ASINS` after the live product title is checked.

### IndexNow

Key file: `public/39d11ce7093f4488ad801272e38b8095.txt`.

After the production deploy:

```bash
npm run indexnow
```

### Deploy with Wrangler

Requires a Cloudflare API token for account `282f30db11735ae9d0262b358511c070` with Pages edit and zone DNS edit on `weldfacts.com`.

```bash
npx wrangler pages project create weldfacts --production-branch main
npx wrangler pages deploy dist --project-name weldfacts --commit-dirty=true
npx wrangler pages domain add weldfacts.com --project-name weldfacts
npx wrangler pages domain add www.weldfacts.com --project-name weldfacts
```
