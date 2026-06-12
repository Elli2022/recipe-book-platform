import { getStoredUser } from "@/lib/auth/local-user";

const CACHE_TTL_MS = 5 * 60_000;
const STORAGE_KEY = "receptbok.favorites.v1";

let cachedFavoriteIds: string[] | null = null;
let cachedUserId: string | null = null;
let cachedAt = 0;
let inflight: Promise<string[]> | null = null;

type SessionPayload = {
  ids?: string[];
  userId?: string;
  at?: number;
};

function currentUserId(): string | null {
  return getStoredUser()?.id ?? null;
}

function readSessionCache(): string[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const userId = currentUserId();
  if (!userId) {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as SessionPayload;
    if (
      !parsed.ids ||
      !parsed.at ||
      parsed.userId !== userId ||
      Date.now() - parsed.at > CACHE_TTL_MS
    ) {
      return null;
    }
    return parsed.ids;
  } catch {
    return null;
  }
}

function writeSessionCache(ids: string[], userId: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ids, userId, at: Date.now() })
    );
  } catch {
    // sessionStorage kan vara full eller blockerad
  }
}

export function peekFavoriteIds(): string[] | undefined {
  const userId = currentUserId();
  if (!userId) {
    return undefined;
  }

  if (
    cachedFavoriteIds &&
    cachedUserId === userId &&
    Date.now() - cachedAt < CACHE_TTL_MS
  ) {
    return cachedFavoriteIds;
  }

  const fromSession = readSessionCache();
  if (fromSession) {
    cachedFavoriteIds = fromSession;
    cachedUserId = userId;
    cachedAt = Date.now();
    return fromSession;
  }

  return undefined;
}

export function stashFavoriteIds(ids: string[]): void {
  const userId = currentUserId();
  if (!userId) {
    return;
  }

  cachedFavoriteIds = ids;
  cachedUserId = userId;
  cachedAt = Date.now();
  writeSessionCache(ids, userId);
}

export function addFavoriteId(recipeId: string): void {
  const current = peekFavoriteIds() ?? [];
  if (current.includes(recipeId)) {
    return;
  }
  stashFavoriteIds([recipeId, ...current]);
}

export function removeFavoriteId(recipeId: string): void {
  const current = peekFavoriteIds() ?? [];
  stashFavoriteIds(current.filter((id) => id !== recipeId));
}

export function clearFavoriteIdsCache(): void {
  cachedFavoriteIds = null;
  cachedUserId = null;
  cachedAt = 0;
  inflight = null;
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}

export function prefetchFavoriteIds(): void {
  if (currentUserId()) {
    void fetchFavoriteIds();
  }
}

export async function fetchFavoriteIds(): Promise<string[]> {
  const userId = currentUserId();
  if (!userId) {
    return [];
  }

  const cached = peekFavoriteIds();
  if (cached) {
    return cached;
  }

  if (inflight) {
    return inflight;
  }

  inflight = (async () => {
    try {
      const response = await fetch("/api/favorites", { credentials: "include" });
      if (response.status === 401) {
        clearFavoriteIdsCache();
        return [];
      }
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      const ids = Array.isArray(data.recipeIds) ? data.recipeIds : [];
      stashFavoriteIds(ids);
      return ids;
    } catch {
      return [];
    }
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}
