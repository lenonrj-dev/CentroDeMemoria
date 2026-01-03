import ReferenceForm from "../../../../../components/admin/forms/ReferenceForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReferenceForm id={id} />;
}

