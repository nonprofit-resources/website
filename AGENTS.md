# AGENTS.md — nonprofit-resources/website

## Facts
- Org: `nonprofit-resources` · site: SolidStart · primary domain `nonprofit-resources.org`
- Hosting: Netlify (personal team). DB: Turso/libSQL + Drizzle (set `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` for reviews / human verification). Local fallback: `file:./data/local.db`.
- Auth: **Better Auth only** (email/password + optional GitHub). Tables: `user`, `session`, `account`, `verification` in `src/lib/schema.ts`.
- Catalog: seed in `src/lib/services-seed.ts` (programs + platform apps) plus generated OSS.Fund import `src/lib/oss-fund-seed.generated.ts` (`pnpm catalog:sync-oss-fund`). OSS.Fund rows keep sticky `firstImportedAt` and content-hash `lastUpdatedAt`; summary/details say `Imported from OSS.Fund on <date> under CC BY 4.0`. Compare is client-side until/alongside Turso. JSON feed: `GET /api/catalog`. Webhooks: `/api/webhooks`. Hand-row re-verify: `pnpm catalog:verify` / workflow `Verify catalog` (Gemini + PR via `CATALOG_VERIFY_GITHUB_TOKEN`). Env names: `docs/ENV-VARIABLES.md`.
- Related OSS in footer: DevCentr, OpenShellOrg, HCI Nerdz, linx.photos, InstaLay — not FoodTruckNerdz
- Workflow `Sync OSS.Fund` commits import refreshes straight to `main` (org policy blocks `GITHUB_TOKEN` from opening PRs). Skips the commit when content hashes are unchanged. `Verify catalog` opens a PR instead (needs `CATALOG_VERIFY_GITHUB_TOKEN` + `GEMINI_API_KEY`).

## Commands
- `pnpm dev` / `pnpm build` / `pnpm content:build` / `pnpm media:download` / `pnpm media:marks` (GitHub invertocat, AWS smile, DevCentr orbital mark, partner placeholder light/dark pairs) / `pnpm logo:export` (needs sibling `../.github/assets/logo.svg`; writes tiled logo, `logo-only` mark, and a tighter tiled favicon)
- `pnpm catalog:sync-oss-fund` — regenerate OSS.Fund import from `oss-fund/directory` (preserves `firstImportedAt` per id; bumps `lastUpdatedAt` when source content hash changes; hashes stored in `ossFundSeedMeta.contentHashes`; no-op write when hashes match)
- `pnpm catalog:verify` — Gemini re-verify of stale hand listings (portal fetch + JSON patches; PR in CI)

## Deploy
- Do **not** link the GitHub org repo in the Netlify UI (team pricing).
- Netlify site `nonprofit-resources` (personal team) is manual/CLI-only.
- GitHub Actions workflow `Deploy Netlify` pushes builds; secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`.
