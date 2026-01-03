import { getRequestConfig } from "next-intl/server";

const locales = ["pt-BR", "pt-PT", "es", "en"] as const;
const defaultLocale = "pt-BR";

export default getRequestConfig(async ({ locale }) => {
  const activeLocale = locale && locales.includes(locale as any) ? locale : defaultLocale;
  const base = (await import(`./messages/${activeLocale}.json`)).default;
  let messages = { ...base } as Record<string, unknown>;
  try {
    const acervo = (await import(`./messages/acervo/${activeLocale}.json`)).default;
    messages = { ...messages, acervo };
  } catch {
    // optional bundle
  }
  return {
    locales,
    defaultLocale,
    locale: activeLocale,
    messages,
    getMessageFallback: ({ key }) => key,
    onError: (error) => {
      if (process.env.NODE_ENV === "production" && error.code === "MISSING_MESSAGE") return;
      throw error;
    },
  };
});
