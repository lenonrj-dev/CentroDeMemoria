// file: components/cluster/ClusterActions.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Power, RefreshCcw, Cog, Loader2, Shield, Camera, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClusterActions({ cluster }) {
  const [powerBusy, setPowerBusy] = useState(false);
  const [rebootBusy, setRebootBusy] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const btnMenuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!openMenu) return;
      if (menuRef.current && !menuRef.current.contains(e.target) && !btnMenuRef.current?.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    const onEscape = (e) => {
      if (e.key === "Escape") setOpenMenu(false);
    };
    window.addEventListener("mousedown", onClickOutside);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("keydown", onEscape);
    };
  }, [openMenu]);

  const confirmPower = async () => {
    const turningOn = cluster.status !== "Running";
    const ok = confirm(`Tem certeza que deseja ${turningOn ? "ligar" : "desligar"} o cluster "${cluster.name}"?`);
    if (!ok) return;
    setPowerBusy(true);
    await delay(1000);
    setPowerBusy(false);
    alert(`(mock) Cluster ${turningOn ? "ligado" : "desligado"} com sucesso.`);
  };

  const confirmReboot = async () => {
    const ok = confirm(`Reiniciar o cluster "${cluster.name}" agora? Os serviços ficarão temporariamente indisponíveis.`);
    if (!ok) return;
    setRebootBusy(true);
    await delay(1200);
    setRebootBusy(false);
    alert("(mock) Cluster reiniciado com sucesso.");
  };

  const quickAction = async (action) => {
    setOpenMenu(false);
    await delay(400);
    if (action === "firewall") alert("(mock) Regras de firewall revalidada(s).");
    if (action === "agent") alert("(mock) Agente de captura atualizado.");
    if (action === "mongo") alert("(mock) Healthcheck do Mongo executado.");
  };

  const Button = ({ children, icon: Icon, onClick, loading, disabled, ariaLabel }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={!!loading}
      disabled={disabled || loading}
      className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </motion.button>
  );

  return (
    <div className="relative flex flex-wrap gap-2">
      <Button
        icon={Power}
        onClick={confirmPower}
        loading={powerBusy}
        disabled={rebootBusy}
        ariaLabel={cluster.status === "Running" ? "Desligar cluster" : "Ligar cluster"}
      >
        {cluster.status === "Running" ? "Desligar" : "Ligar"}
      </Button>

      <Button
        icon={RefreshCcw}
        onClick={confirmReboot}
        loading={rebootBusy}
        disabled={powerBusy}
        ariaLabel="Reiniciar cluster"
      >
        Reiniciar
      </Button>

      {/* Menu de ações rápidas */}
      <motion.button
        ref={btnMenuRef}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpenMenu((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={openMenu}
        aria-controls="cluster-quick-actions"
        className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
      >
        <Cog className="h-4 w-4" />
        Ações rápidas
      </motion.button>

      <AnimatePresence>
        {openMenu && (
          <motion.div
            id="cluster-quick-actions"
            role="menu"
            ref={menuRef}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute z-10 mt-12 min-w-[220px] rounded-lg border border-white/10 bg-[#0e141b] shadow-lg p-1"
          >
            <MenuItem icon={Shield} label="Revalidar firewall" onClick={() => quickAction("firewall")} />
            <MenuItem icon={Camera} label="Atualizar agente de captura" onClick={() => quickAction("agent")} />
            <MenuItem icon={Database} label="Healthcheck do Mongo" onClick={() => quickAction("mongo")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="w-full inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
    >
      <Icon className="h-4 w-4 text-gray-300" />
      <span className="text-gray-100">{label}</span>
    </button>
  );
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
