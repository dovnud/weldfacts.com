# weldfacts.com

Manufacturer-sourced welder specifications and an outlet-and-job check. Astro 5, static output, Node 22, Cloudflare Pages project `weldfacts`.

Specs are transcribed from manufacturer product pages, spec sheets, and owner’s manuals. A field the maker does not publish is shown as “Not published by manufacturer.” The read date on the pages is 2 November 2026.

Model pages add jobs, power, duty cycle, included items, and a verdict from those fields. A comparison is indexed when the two machines share a brand or a published process. Other pairs stay on the compare form, use `noindex`, and are left out of the sitemap and `llms.txt`.

```bash
nvm use
npm install
npm test
npm run build
```

`npm run build` checks citations, writes sitemap dates, generates Open Graph images, then builds `dist/`.

## Cloudflare Pages

Connect this Git repository. Production branch: `main`.

- Build command: `npm run build`
- Build output: `dist` (`pages_build_output_dir` in `wrangler.jsonc`)
- Environment variable: `NODE_VERSION` = `22`
- Project name: `weldfacts`
- Custom domains: `weldfacts.com` and `www.weldfacts.com`

There is no AdSense tag and no subscriber database.

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
