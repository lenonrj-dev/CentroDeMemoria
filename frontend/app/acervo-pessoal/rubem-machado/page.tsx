import Page, { generateMetadata as generate } from "../[slug]/page";

export function generateMetadata() {
  return generate({ params: { slug: "rubem-machado" } });
}

export default function RubemMachadoPage() {
  return <Page params={{ slug: "rubem-machado" }} />;
}
