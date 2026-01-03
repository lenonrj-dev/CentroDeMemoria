import { setRequestLocale as baseSetRequestLocale, getLocale } from "next-intl/server";

export function setRequestLocale(locale?: string) {
  if (locale) baseSetRequestLocale(locale);
}

export async function resolveLocale(): Promise<string> {
  return (await getLocale()) || "pt-BR";
}
