import Page, { generateMetadata as generate } from "../[slug]/page";

export function generateMetadata() {
  return generate({ params: { slug: "dom-waldyr" } });
}

export default function DomWaldyrPage() {
  return <Page params={{ slug: "dom-waldyr" }} />;
}
