import TestimonialForm from "../../../../../components/admin/forms/TestimonialForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TestimonialForm id={id} />;
}

