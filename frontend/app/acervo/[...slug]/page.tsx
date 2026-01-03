import { AcervoReaderClient } from "./components/AcervoReaderClient";
import { isCollectionKey } from "./data";

export default function AcervoReaderPage({ params }: { params: { slug?: string[] } }) {
  const [c, s] = Array.isArray(params?.slug) ? params.slug : [null, null];
  const collection = isCollectionKey(c) ? c : "boletins";
  const slug = s || "1952-03";

  return <AcervoReaderClient collection={collection} slug={slug} />;
}
