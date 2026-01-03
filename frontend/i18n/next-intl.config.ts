import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const baseMessages = (await import(`../messages/${locale}.json`)).default;
  const acervoMessages = (await import(`../messages/acervo/${locale}.json`)).default;

  return {
    locale,
    messages: {
      ...baseMessages,
      acervo: acervoMessages,
    },
  };
});
