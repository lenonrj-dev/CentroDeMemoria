// next.config.mjs
// Habilita o domínio do Cloudinary usado nas capas/jornais para o componente next/image.
// (Incluí os dois cloud_names que você usa: diwvlsgsw e dc7u5spia.)

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./next-intl.config.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Opção simples: use "domains" (habilita todo o host)
    // domains: ["res.cloudinary.com"],

    // Opção recomendada: restringe por caminho (remotePatterns)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/diwvlsgsw/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dc7u5spia/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dwf2uc6ot/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
