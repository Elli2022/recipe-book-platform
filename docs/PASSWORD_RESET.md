# Lösenordsåterställning (Supabase + Netlify)

Om du får **Netlify "Site not found"** när du klickar på länken i mejlet, pekar länken på fel domän — inte på din app.

## 1. Supabase → Authentication → URL Configuration

| Fält | Ska vara |
|------|----------|
| **Site URL** | `https://recipe-book-platform.netlify.app` |
| **Redirect URLs** | Lägg till (en rad per URL eller wildcard): |

```text
https://recipe-book-platform.netlify.app/**
http://localhost:3000/**
```

Spara. Utan detta använder Supabase ofta `http://localhost:3000` som standard — då blir mejllänken fel.

## 2. E-postmall (Recovery)

**Authentication → Email Templates → Reset password**

Kontrollera att länken använder redirect, t.ex.:

```html
<a href="{{ .ConfirmationURL }}">Återställ lösenord</a>
```

Om du byggt egen mall med bara `{{ .SiteURL }}` utan `{{ .RedirectTo }}` kan användaren skickas till fel adress.

## 3. Ny länk efter ändringar

Gamla mejl pekar fortfarande på gamla URL:er. Gå till **Glömt lösenord** på den live-sajten och begär en **ny** länk efter att steg 1–2 är klara.

## 4. Kontrollera länken i mejlet

Hovra över knappen/länken. Efter Supabase-omdirigering ska du landa på något i stil med:

`https://recipe-book-platform.netlify.app/auth/reset-password?...`

Om domänen är `localhost`, fel netlify-adress eller något annat än din app — fixa Site URL / Redirect URLs (steg 1).

## 5. Netlify (redan i repo)

`netlify.toml` sätter `NEXT_PUBLIC_SITE_URL` vid build så appen alltid skickar rätt `redirectTo` från produktion.
