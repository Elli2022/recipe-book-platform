# Netlify auto-deploy från GitHub

Varje push till `master` deployar automatiskt till [recipe-book-platform.netlify.app](https://recipe-book-platform.netlify.app) när CI är grön.

## Så funkar det

1. **Push till `master`** → workflow `CI` kör lint, build och e2e.
2. När testerna passerar → **Deploy**-steget bygger och laddar upp till Netlify via CLI.
3. Produktion uppdateras på [recipe-book-platform.netlify.app](https://recipe-book-platform.netlify.app).

## GitHub Secrets (konfigurerat)

| Secret | Syfte |
|--------|--------|
| `NETLIFY_AUTH_TOKEN` | Autentisering mot Netlify API |
| `NETLIFY_SITE_ID` | `31242a3e-998f-45ad-99bd-17b786aa626d` |
| `NEXT_PUBLIC_SUPABASE_URL` | E2E / build i CI |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | E2E / build i CI |

Manuell deploy: **Actions → Deploy to Netlify → Run workflow**.
