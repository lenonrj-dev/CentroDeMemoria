// file: components/nodes/NodeActions.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Wrench, Power, RefreshCcw, Lock } from "lucide-react";

/**
 * NodeActions
 * - Ações de nó com feedback visual, loading e confirmações.
 * - Usa mocks assíncronos quando não há backend.
 *
 * Props:
 * - node: { id, name, schedulable: boolean }
 * - onCordonChange?: (nextSchedulable: boolean) => void
 * - onDrain?: () => void
 * - onRestart?: () => void
 * - onHealthCheck?: (result: { ok: boolean; details?: string }) => void
 * - onPowerOff?: () => void
 */
export default function NodeActions({
  node,
  onCordonChange = () => {},
  onDrain = () => {},
  onRestart = () => {},
  onHealthCheck = () => {},
  onPowerOff = () => {},
}) {
  const [loading, setLoading] = useState(null); // 'cordon' | 'drain' | 'restart' | 'health' | 'power' | null

  // Mock API: espera curta para simular requisições
  const mock = useCallback((ms = 700) => new Promise((r) => setTimeout(r, ms)), []);

  const name = useMemo(() => node?.name || node?.id || "nó", [node]);

  const handleCordon = useCallback(async () => {
    const action = node?.schedulable ? "cordon" : "uncordon";
    setLoading("cordon");
    try {
      // Ação de cordon/uncordon (mock)
      await mock();
      onCordonChange(!node?.schedulable);
      alert(`(mock) ${node?.schedulable ? "Cordon aplicado" : "Uncordon aplicado"} em ${name}.`);
    } catch {
      alert("Falha ao aplicar cordon/uncordon (mock).");
    } finally {
      setLoading(null);
    }
  }, [mock, name, node?.schedulable, onCordonChange]);

  const handleDrain = useCallback(async () => {
    if (!confirm(`Drenar ${name}? Isto irá desalocar pods deste nó. (mock)`)) return;
    setLoading("drain");
    try {
      await mock(1200);
      onDrain();
      alert(`(mock) Drain iniciado em ${name}.`);
    } catch {
      alert("Falha ao iniciar drain (mock).");
    } finally {
      setLoading(null);
    }
  }, [mock, name, onDrain]);

  const handleRestart = useCallback(async () => {
    if (!confirm(`Reiniciar ${name}? (mock)`)) return;
    setLoading("restart");
    try {
      await mock(1000);
      onRestart();
      alert(`(mock) Reinício solicitado para ${name}.`);
    } catch {
      alert("Falha ao reiniciar (mock).");
    } finally {
      setLoading(null);
    }
  }, [mock, name, onRestart]);

  const handleHealth = useCallback(async () => {
    setLoading("health");
    try {
      await mock(800);
      const result = { ok: true, details: "CPU, memória e rede dentro dos limites." };
      onHealthCheck(result);
      alert(`(mock) Saúde OK em ${name}.\n${result.details}`);
    } catch {
      onHealthCheck({ ok: false });
      alert("Falha ao verificar saúde (mock).");
    } finally {
      setLoading(null);
    }
  }, [mock, name, onHealthCheck]);

  const handlePowerOff = useCallback(async () => {
    if (!confirm(`Desligar ${name}? Pode causar indisponibilidade. (mock)`)) return;
    setLoading("power");
    try {
      await mock(1200);
      onPowerOff();
      alert(`(mock) Comando de desligar enviado para ${name}.`);
    } catch {
      alert("Falha ao desligar (mock).");
    } finally {
      setLoading(null);
    }
  }, [mock, name, onPowerOff]);

  const btnBase =
    "inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed";

  const Button = ({ children, onClick, loadingKey, ariaLabel }) => (
    <motion.button
      type="button"
      onClick={onClick}
      className={btnBase}
      aria-label={ariaLabel}
      disabled={!!loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {loading === loadingKey ? (
        <span className="relative inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80" aria-hidden="true" />
          <span>Processando…</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={handleCordon}
        loadingKey="cordon"
        ariaLabel={node?.schedulable ? "Aplicar cordon ao nó" : "Remover cordon (uncordon) do nó"}
      >
        <Lock className="h-4 w-4" />
        {node?.schedulable ? "Cordon" : "Uncordon"}
      </Button>

      <Button onClick={handleDrain} loadingKey="drain" ariaLabel="Drenar o nó">
        <Wrench className="h-4 w-4" />
        Drain
      </Button>

      <Button onClick={handleRestart} loadingKey="restart" ariaLabel="Reiniciar o nó">
        <RefreshCcw className="h-4 w-4" />
        Reiniciar
      </Button>

      <Button onClick={handleHealth} loadingKey="health" ariaLabel="Verificar saúde do nó">
        <ShieldCheck className="h-4 w-4" />
        Verificar saúde
      </Button>

      <Button onClick={handlePowerOff} loadingKey="power" ariaLabel="Desligar o nó">
        <Power className="h-4 w-4" />
        Desligar
      </Button>
    </div>
  );
}
