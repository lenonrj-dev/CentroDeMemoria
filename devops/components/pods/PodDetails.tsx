// file: components/pods/PodDetails.tsx
"use client";

import MiniSpark from "../k8s/MiniSpark";

export default function PodDetails({ pod, onClose }) {
  if (!pod) {
    return <div className="text-sm text-gray-400">Selecione um pod para ver os detalhes.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={onClose} className="px-2 py-1 text-xs rounded border border-white/10 bg-white/5 hover:border-white/20">Fechar</button>
        <span className="text-xs text-gray-400">Namespace:</span>
        <span className="text-xs text-gray-200">{pod.namespace}</span>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 text-sm rounded-lg bg-cyan-500/10 border border-cyan-500/30">CPU</button>
        <button className="px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10">Memória</button>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0e141b] p-3">
        <MiniSpark points={pod.cpuHistory} height={120} strokeWidth={2} filled ariaLabel="Histórico de CPU" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <Info label="Criado em" value={pod.createdAt} />
        <Info label="Status" value={<span className="text-emerald-400">{pod.status}</span>} />
        <Info label="Nó" value={<a href="#" className="text-cyan-400 hover:underline">{pod.node}</a>} />
        <Info label="IP do Pod" value={pod.podIP} />
        <Info label="Reinícios" value={pod.restarts ?? 0} />
        <Info label="Classe de Prioridade" value={pod.priorityClass || "—"} />
      </div>

      <div className="space-y-2">
        <h4 className="text-xs uppercase tracking-wide text-gray-400">Rótulos</h4>
        <div className="flex flex-wrap gap-2">
          {pod.labels.map((l) => (
            <span key={l} className="text-xs rounded border border-white/10 bg-white/5 px-2 py-1">{l}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {pod.conditions.map((c) => (
          <span key={c} className="rounded border border-white/10 bg-white/5 px-2 py-1 text-center">{c}</span>
        ))}
      </div>

      <div className="text-xs text-gray-400">
        Controlado por: <span className="text-gray-200">{pod.controller}</span>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="text-xs uppercase tracking-wide text-gray-400">{label}</div>
      <div className="mt-0.5 text-gray-100">{value}</div>
    </div>
  );
}
