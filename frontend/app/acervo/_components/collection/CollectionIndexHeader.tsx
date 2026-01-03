export function CollectionIndexHeader({
  label,
  typeLabel,
}: {
  label: string;
  typeLabel: string;
}) {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
        {typeLabel}
      </div>
      <h1 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
        {label}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-white/70">
        Explore os itens desta colecao. Use a busca e os filtros para refinar os resultados.
      </p>
    </header>
  );
}
