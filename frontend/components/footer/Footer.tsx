import Link from "next/link";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { GlobalContent } from "../../lib/content-types";

type FooterProps = {
  content?: GlobalContent["footer"];
};

export default function Footer({ content }: FooterProps) {
  const t = useTranslations("footer");
  const locale = useLocale();
  const year = useMemo(() => new Date().getFullYear(), []);

  const links =
    content?.links?.map((link) => ({
      ...link,
      label: t(link.label as any, { defaultMessage: link.label }),
      href: link.href.startsWith("/") ? `/${locale}${link.href}` : link.href,
    })) || [
      { label: t("privacy"), href: `/${locale}/privacidade` },
      { label: t("terms"), href: `/${locale}/termos` },
      { label: t("contact"), href: `/${locale}/contato` },
    ];

  const copyright = content?.copyright || `© ${year} CMODRM. ${t("reserved")}`;

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/60">{copyright}</p>
          <nav className="flex gap-4 text-sm text-white/70">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
