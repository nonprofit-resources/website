# Environment variables

Names only — never store secret values in git. Copy [`.env.example`](../.env.example) to `.env` locally. Production / CI values go in Netlify or GitHub Actions secrets.

| Variable name | Service | What it does | Required? | Where to obtain a value | Set value in | If unset |
| --- | --- | --- | --- | --- | --- | --- |
| `SITE_URL` | App | Public site origin for links / local absolute URLs | Recommended | Your deploy URL or `http://localhost:3000` | Local `.env`, Netlify | Defaults / broken absolute links |
| `BETTER_AUTH_SECRET` | Better Auth | Session signing secret (≥32 chars) | Required for auth | Generate a long random string | Local `.env`, Netlify, Actions→Netlify sync | Auth fails |
| `BETTER_AUTH_URL` | Better Auth | Canonical auth base URL | Required for auth | `https://nonprofit-resources.org` (or local) | Local `.env`, Netlify vars | Auth redirects wrong |
| `TURSO_DATABASE_URL` | [Turso](https://turso.tech/) | libSQL database URL | Required for auth/reviews | Turso console → database → URL (`file:./data/local.db` locally) | Local `.env`, Netlify | Catalog seed still works; auth/DB features fail |
| `TURSO_AUTH_TOKEN` | Turso | DB auth token | Required for remote Turso | Turso console → database → tokens | Local `.env`, Netlify | Remote DB access fails |
| `TURSO_API_TOKEN` | Turso | Org platform API token (manage DBs) | Optional | Turso console → API tokens | Local `.env` | Cannot manage DBs via API |
| `GITHUB_CLIENT_ID` | GitHub OAuth | Optional sign-in with GitHub | Optional | GitHub → Settings → Developer settings → OAuth Apps | Local `.env`, Netlify | Email/password only |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth | OAuth client secret | Optional | Same OAuth App | Local `.env`, Netlify | GitHub sign-in broken |
| `ADMIN_EMAILS` | App | Comma-separated staff emails for `/staff` | Recommended | Your operator emails | Local `.env`, Netlify | No one can approve org verification |
| `CATALOG_WEBHOOK_ADMIN_TOKEN` | App | Bearer token to register catalog webhooks | Optional | Generate random string | Local `.env`, Netlify | Staff session still works for webhook admin |
| `CATALOG_WEBHOOK_DISPATCH_SECRET` | App | Auth for post-deploy webhook dispatch | Optional | Generate random string | Local `.env`, Netlify, Actions | Dispatch after deploy fails |
| `OSS_FUND_GITHUB_WEBHOOK_SECRET` | GitHub webhook | HMAC secret from OSS.Fund directory webhook | Optional | Value you configure on the GitHub webhook | Local `.env`, Netlify | Inbound OSS.Fund push sync disabled |
| `GITHUB_DISPATCH_TOKEN` | GitHub API | PAT/App token to fire `repository_dispatch` | Optional | Fine-grained PAT with `actions: write` on this repo | Local `.env`, Netlify | Inbound hook cannot start sync workflow |
| `GITHUB_DISPATCH_REPO` | GitHub | `owner/repo` for dispatch target | Optional | Usually `nonprofit-resources/website` | Local `.env`, Netlify | Defaults in code / example |
| `CUSTOMER_IO_SITE_ID` | [Customer.io](https://customer.io/) | News subscribe tracking site id | Optional | Customer.io → Settings → API credentials | Local `.env`, Netlify | Customer.io path unused |
| `CUSTOMER_IO_API_KEY` | Customer.io | App API key | Optional | Same | Local `.env`, Netlify | — |
| `CUSTOMER_IO_TRACK_API_KEY` | Customer.io | Track API key | Optional | Same | Local `.env`, Netlify | — |
| `RESEND_API_KEY` | [Resend](https://resend.com/) | Transactional + audience mail | Optional | Resend → API Keys | Local `.env`, Netlify | Email features fail |
| `RESEND_FROM` | Resend | From address | Recommended | Verified domain sender | Local `.env`, Netlify / Actions vars | Example default in deploy |
| `RESEND_NEWS_AUDIENCE_ID` | Resend | News contacts audience id | Optional | Resend → Audiences | Local `.env`, Netlify vars | News subscribe audience skip |
| `NETLIFY_AUTH_TOKEN` | [Netlify](https://app.netlify.com/) | CLI deploy from Actions | Required for deploy workflow | Netlify → User settings → Applications → Personal access tokens | **GitHub Actions secrets only** | Deploy workflow fails |
| `NETLIFY_SITE_ID` | Netlify | Target blank/manual site id | Required for deploy workflow | Netlify site → Site configuration → Site details | **GitHub Actions secrets only** | Deploy workflow fails |
| `GEMINI_API_KEY` | [Google AI Studio / Gemini API](https://aistudio.google.com/apikey) | Weekly catalog verify (`pnpm catalog:verify`) | Required for Verify catalog workflow | AI Studio API key for the Google Cloud project (Bitwarden item **nonprofit-resources**; project `54406180065`) | Local `.env`, **GitHub Actions secret** `GEMINI_API_KEY` | Script dry-runs (fetch only); workflow cannot patch |
| `GEMINI_MODEL` | Gemini | Model id for catalog verify | Optional | e.g. `gemini-2.5-flash-lite` or `gemini-2.5-flash` | Local `.env`, GitHub Actions **variable** | Defaults to `gemini-2.5-flash-lite` |
| `CATALOG_VERIFY_MAX_AGE_DAYS` | App / CI | Re-verify hand rows older than N days | Optional | Integer days (default `30`) | Local `.env`, Actions variable | Default 30 |
| `CATALOG_VERIFY_LIMIT` | App / CI | Max rows per run (`0` = all stale) | Optional | Integer | Local `.env`, Actions variable | All stale rows |
| `CATALOG_VERIFY_MIN_CONFIDENCE` | App / CI | Minimum model confidence to apply a patch | Optional | `0`–`1` (default `0.7`) | Local `.env`, Actions variable | Default 0.7 |
| `CATALOG_VERIFY_GITHUB_TOKEN` | GitHub | Fine-grained PAT so Verify catalog can open PRs | Required for Verify catalog PRs | See [CATALOG_VERIFY_GITHUB_TOKEN](#catalog_verify_github_token) below | **GitHub Actions secret only** (never Netlify) | Workflow verifies but cannot open a PR (org blocks `GITHUB_TOKEN` PRs) |

## `CATALOG_VERIFY_GITHUB_TOKEN`

Org policy blocks the default Actions `GITHUB_TOKEN` from opening pull requests (same reason Sync OSS.Fund commits straight to `main`). AI catalog edits must land as a **human-reviewed PR**, so the Verify catalog workflow needs a separate credential.

### What it is

A **fine-grained personal access token** (or GitHub App installation token) that can:

- Push a branch on `nonprofit-resources/website`
- Open / update pull requests on that repo

Store it only as the Actions secret named `CATALOG_VERIFY_GITHUB_TOKEN`. Do not put it in Netlify or commit it.

### How to create one (fine-grained PAT)

1. Sign in as a user who can push to `nonprofit-resources/website` (org owner or collaborator with write).
2. Open [GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens](https://github.com/settings/tokens?type=beta) → **Generate new token**.
3. **Token name:** e.g. `nonprofit-resources catalog verify`.
4. **Expiration:** pick a rotation period you will remember (90 days is fine).
5. **Resource owner:** `nonprofit-resources`.
6. **Repository access:** Only select repositories → `website`.
7. **Permissions:**
   - Repository → **Contents:** Read and write (push the `chore/catalog-verify` branch)
   - Repository → **Pull requests:** Read and write (open/update the PR)
   - Repository → **Metadata:** Read-only (automatic)
8. Generate, copy the token once, and save it in Bitwarden (e.g. next to the Gemini key under **nonprofit-resources**).
9. In the GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `CATALOG_VERIFY_GITHUB_TOKEN`
   - Value: the PAT

Also add secret `GEMINI_API_KEY` from Bitwarden (item **nonprofit-resources** / Google AI key for project number `54406180065`).

### If the secret is missing

The verify job can still run model calls (with `GEMINI_API_KEY`), but `peter-evans/create-pull-request` will fail when there are seed changes. Sync OSS.Fund does **not** use this token.

## Local catalog verify

```bash
# Uses GEMINI_API_KEY from .env; omit key for fetch-only dry run
pnpm catalog:verify
pnpm catalog:verify -- --dry-run
```
