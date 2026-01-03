import PhotoArchiveForm from "../../../../../components/admin/forms/PhotoArchiveForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PhotoArchiveForm id={id} />;
}

