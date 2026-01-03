const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{6,}$/;

function pickId(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return YOUTUBE_ID_RE.test(trimmed) ? trimmed : "";
}

export function extractYoutubeId(input: string) {
  const raw = (input || "").trim();
  if (!raw) return "";

  const direct = pickId(raw);
  if (direct) return direct;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return pickId(url.pathname.split("/")[1] || "");
    }

    if (host.endsWith("youtube.com") || host === "youtube-nocookie.com") {
      if (url.pathname === "/watch") {
        return pickId(url.searchParams.get("v") || "");
      }
      if (url.pathname.startsWith("/embed/")) {
        return pickId(url.pathname.split("/")[2] || "");
      }
      if (url.pathname.startsWith("/shorts/")) {
        return pickId(url.pathname.split("/")[2] || "");
      }
    }
  } catch {
    return "";
  }

  return "";
}
