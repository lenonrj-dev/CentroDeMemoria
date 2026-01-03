const normalizeRe = /[\\u0300-\\u036f]/g;
const nonSlugRe = /[^a-z0-9]+/g;
const hyphenTrimRe = /(^-|-$)/g;

type SlugStatus = {
  slug: string;
  empty: boolean;
  tooShort: boolean;
  valid: boolean;
};

export function normalizeSlug(value: string, maxLength = 80) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(normalizeRe, "")
    .replace(nonSlugRe, "-")
    .replace(/-{2,}/g, "-")
    .replace(hyphenTrimRe, "")
    .slice(0, maxLength);
}

export function slugify(value: string, maxLength = 80) {
  return normalizeSlug(value, maxLength);
}

export function getSlugStatus(value: string, minLength = 3, maxLength = 80): SlugStatus {
  const slug = normalizeSlug(value || "", maxLength);
  const empty = slug.length === 0;
  const tooShort = slug.length > 0 && slug.length < minLength;
  return { slug, empty, tooShort, valid: !empty && !tooShort };
}
