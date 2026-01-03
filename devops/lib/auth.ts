const STORAGE_KEY = "sintracon_admin_token";
const EXPIRES_KEY = "sintracon_admin_token_expires_at";
const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;

export function getStoredSession() {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem(STORAGE_KEY);
    const rawExpires = localStorage.getItem(EXPIRES_KEY);
    const expiresAt = rawExpires ? Number(rawExpires) : null;
    if (!token) return null;
    if (!expiresAt || Number.isNaN(expiresAt) || expiresAt <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EXPIRES_KEY);
      return null;
    }
    return { token, expiresAt };
  } catch {
    return null;
  }
}

export function getStoredToken() {
  const session = getStoredSession();
  return session ? session.token : null;
}

export function setStoredToken(token: string, expiresAt?: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, token);
    const nextExpires = expiresAt ?? Date.now() + TOKEN_TTL_MS;
    localStorage.setItem(EXPIRES_KEY, String(nextExpires));
  } catch {
    // ignore
  }
}

export function clearStoredToken() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXPIRES_KEY);
  } catch {
    // ignore
  }
}
