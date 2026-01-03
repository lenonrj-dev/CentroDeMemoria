const ID_RE = /^[a-zA-Z0-9_-]{6,}$/;

export function extractYoutubeId(input: string): string | null {
  const raw = (input || "").trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return sanitizeId(url.pathname.split("/")[1]);
    }

    if (host.endsWith("youtube.com")) {
      if (url.pathname === "/watch") {
        return sanitizeId(url.searchParams.get("v") || "");
      }
      if (url.pathname.startsWith("/embed/")) {
        return sanitizeId(url.pathname.split("/")[2]);
      }
      if (url.pathname.startsWith("/shorts/")) {
        return sanitizeId(url.pathname.split("/")[2]);
      }
    }
  } catch {
    // ignore and try raw id below
  }

  return sanitizeId(raw);
}

export function youtubeEmbedUrl(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

export function youtubeThumbUrl(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function sanitizeId(value: string | null | undefined) {
  const id = (value || "").split("?")[0].split("&")[0].trim();
  return ID_RE.test(id) ? id : null;
}
