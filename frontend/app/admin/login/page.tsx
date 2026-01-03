import LoginClient from "./LoginClient";

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = (await searchParams) ?? {};
  const raw = sp.next;
  const nextPath = typeof raw === "string" && raw.trim() ? raw : "/admin";
  return <LoginClient nextPath={nextPath} />;
}

