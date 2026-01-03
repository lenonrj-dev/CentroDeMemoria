// app/acervo/fotos/page.jsx  (SERVER COMPONENT — sem "use client")
import PhotosGalleryClient from "./PhotosGalleryClient";

export const metadata = {
  title: "Acervo Fotográfico — Banco de Memória",
  description:
    "Explore séries fotográficas do acervo. Busque por título, tags e década, e acesse cada item com descrição completa.",
  alternates: { canonical: "/acervo/fotos" },
  openGraph: {
    title: "Acervo Fotográfico — Banco de Memória",
    description:
      "Séries e itens fotográficos com contexto histórico e curadoria.",
    url: "/acervo/fotos",
    type: "website",
    siteName: "Sintracon",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acervo Fotográfico — Banco de Memória",
    description:
      "Navegue por coleções fotográficas com filtros e busca.",
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  // wrapper server → carrega client component
  return <PhotosGalleryClient />;
}
