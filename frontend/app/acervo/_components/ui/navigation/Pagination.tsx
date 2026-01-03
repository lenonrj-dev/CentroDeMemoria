export function Pagination() {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-white/70">
      <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10">Anterior</button>
      <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">1</span>
      <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">2</span>
      <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10">Próxima</button>
    </div>
  );
}
