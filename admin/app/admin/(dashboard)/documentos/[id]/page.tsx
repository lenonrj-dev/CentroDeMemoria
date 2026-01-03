import DocumentForm from "../../../../../components/admin/forms/DocumentForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DocumentForm id={id} />;
}

