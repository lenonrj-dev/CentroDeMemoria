import PersonalArchiveForm from "../../../../../components/admin/forms/PersonalArchiveForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PersonalArchiveForm id={id} />;
}
