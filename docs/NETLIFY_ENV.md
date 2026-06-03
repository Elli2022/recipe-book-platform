# Netlify environment variables

Required for full production behavior (API routes, recipe CRUD, favorites):

| Variable | Scope | Status |
|----------|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | All | Set on Netlify |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | All | Set on Netlify |
| `SUPABASE_SERVICE_ROLE_KEY` | Build + runtime (server only) | **Add in Netlify UI** |

## Add missing service role

1. Supabase Dashboard → **Project Settings** → **API** → copy **service_role** (secret).
2. Netlify → **Site configuration** → **Environment variables** → **Add variable**.
3. Key: `SUPABASE_SERVICE_ROLE_KEY`, value: paste service role, scopes: **All** (or at least Builds + Functions).
4. Trigger **Deploy site** (clear cache optional).

Never prefix the service role with `NEXT_PUBLIC_`.

## GitHub Actions (E2E)

Add repository **Secrets** (Settings → Secrets and variables → Actions) so the E2E job can bake public Supabase config at build time:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)

## Verify locally

```bash
cd frontend
cp .env.example .env.local
# fill all three Supabase values
npm run verify:supabase
```
