# Netlify auto-deploy från GitHub

Varje push till `master` kan deploya till [recipe-book-platform.netlify.app](https://recipe-book-platform.netlify.app) via GitHub Actions (`.github/workflows/netlify-deploy.yml`).

## Engångsinställning (GitHub Secrets)

Gå till **GitHub → recipe-book-platform → Settings → Secrets and variables → Actions** och lägg till:

| Secret | Var du hittar värdet |
|--------|----------------------|
| `NETLIFY_AUTH_TOKEN` | [Netlify → User settings → Applications → Personal access tokens](https://app.netlify.com/user/applications#personal-access-tokens) → **New access token** |
| `NETLIFY_SITE_ID` | `31242a3e-998f-45ad-99bd-17b786aa626d` (recipe-book-platform) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API Keys (publishable/anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API Keys (service_role) |

Efter secrets är sparade: pusha till `master` eller kör workflow manuellt under **Actions → Deploy to Netlify → Run workflow**.

## Alternativ: Netlify GitHub-integration

I [Netlify site settings](https://app.netlify.com/projects/recipe-book-platform/configuration/deploys#continuous-deployment):

1. **Link repository** → `Elli2022/recipe-book-platform`
2. Branch: **master**
3. Build command / publish directory läses från `netlify.toml` i repots rot

Om både Netlify-integration **och** GitHub Actions deployar kan dubbla builds uppstå — välj en metod.
