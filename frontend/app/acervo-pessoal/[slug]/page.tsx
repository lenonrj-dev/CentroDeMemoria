import type { Metadata } from "next";
import PersonalArchivePage from "../_components/PersonalArchivePage";
import { buildPersonalArchiveMetadata, buildPersonalArchivePageData } from "./page-data";

export async function generateMetadata({ params }: { params: { slug?: string } }): Promise<Metadata> {
  const slug = params?.slug || "rubem-machado";
  return buildPersonalArchiveMetadata(slug);
}

export default async function Page({ params }: { params: { slug?: string } }) {
  const slug = params?.slug || "rubem-machado";
  const { content, journals, photos, references, jsonLd } = await buildPersonalArchivePageData(slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PersonalArchivePage content={content} journals={journals} photos={photos} references={references} />
    </>
  );
}
