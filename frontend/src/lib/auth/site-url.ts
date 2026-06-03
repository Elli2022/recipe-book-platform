/**
 * Origin used in Supabase auth redirects (password reset, email confirm).
 * On Netlify, set NEXT_PUBLIC_SITE_URL to your live URL so emails never point at localhost.
 */
export function getAuthRedirectOrigin(fallbackOrigin?: string): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) {
    return configured;
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  if (fallbackOrigin) {
    return fallbackOrigin.replace(/\/$/, "");
  }

  return "";
}

export function getPasswordResetRedirectUrl(fallbackOrigin?: string): string {
  const origin = getAuthRedirectOrigin(fallbackOrigin);
  return origin ? `${origin}/auth/reset-password` : "/auth/reset-password";
}
