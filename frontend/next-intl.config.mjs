import { getRequestConfig } from "next-intl/server";

const locales = ["pt-BR", "pt-PT", "es", "en"];
const defaultLocale = "pt-BR";

export default getRequestConfig(async ({ locale }) => {
  const activeLocale = locales.includes(locale) ? locale : defaultLocale;
  let messages = (await import(`./messages/${activeLocale}.json`)).default;
  try {
    const acervo = (await import(`./messages/acervo/${activeLocale}.json`)).default;
    messages = { ...messages, acervo };
  } catch {
    // ignore
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
