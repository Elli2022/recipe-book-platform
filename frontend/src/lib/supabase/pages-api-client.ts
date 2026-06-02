import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
  type CookieOptions,
} from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabasePublicKey, getSupabaseUrl } from "@/lib/supabase/env";

/**
 * Supabase client bound to the Pages API request/response (session cookies).
 */
export function createSupabasePagesApiClient(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = getSupabaseUrl();
  const anon = getSupabasePublicKey();

  if (!url || !anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or Supabase public key (anon/publishable)."
    );
  }

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return parseCookieHeader(req.headers.cookie ?? "");
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.appendHeader("Set-Cookie", serializeCookieHeader(name, value, options));
        });
      },
    },
  });
}
