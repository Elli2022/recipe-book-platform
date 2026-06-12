# Netlify auto-deploy från GitHub

Varje push till `master` deployar automatiskt till [recipe-book-platform.netlify.app](https://recipe-book-platform.netlify.app) när CI är grön.

## Så funkar det

1. **Push till `master`** → workflow `CI` kör lint, build och e2e.
2. När testerna passerar → **Deploy**-steget anropar Netlify build hook (`NETLIFY_BUILD_HOOK`).
3. Netlify bygger senaste commit från `Elli2022/recipe-book-platform` enligt `netlify.toml`.

Netlify-sajten är kopplad till repot `Elli2022/recipe-book-platform`, branch `master`.

## GitHub Secrets (redan konfigurerat)

| Secret | Syfte |
|--------|--------|
| `NETLIFY_BUILD_HOOK` | Triggar produktionsbuild efter lyckad CI |
| `NEXT_PUBLIC_SUPABASE_URL` | E2E / build i CI |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | E2E / build i CI |

Valfritt för manuell CLI-deploy (`Actions → Deploy to Netlify`):

| Secret | Värde |
|--------|--------|
| `NETLIFY_AUTH_TOKEN` | [Personal access token](https://app.netlify.com/user/applications#personal-access-tokens) |
| `NETLIFY_SITE_ID` | `31242a3e-998f-45ad-99bd-17b786aa626d` |
