# AGENTS.md — nonprofit-resources/website

## Facts
- Org: `nonprofit-resources` · site: SolidStart · primary domain `nonprofit-resources.org`
- No separate Antora docs; AsciiDoc articles live in `content/` (`news`, `blog`, `guides`)
- DB: Turso/libSQL + Drizzle; auth: Better Auth; news: Customer.io; tx mail: Resend
- Related OSS in footer: DevCentr, OpenShellOrg, HCI Nerdz, linx.photos, InstaLay — not FoodTruckNerdz

## Commands
- `pnpm dev` / `pnpm build` / `pnpm content:build` / `pnpm media:download` / `pnpm logo:export` (needs sibling `../.github/assets/logo.svg`; writes tiled logo, `logo-only` mark, and a tighter tiled favicon)

## Deploy
- Do **not** link the GitHub org repo in the Netlify UI (team pricing).
- Netlify site `nonprofit-resources` (personal team) is manual/CLI-only.
- GitHub Actions workflow `Deploy Netlify` pushes builds; secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`.
