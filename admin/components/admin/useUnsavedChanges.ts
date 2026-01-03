"use client";

import { useEffect } from "react";

export function useUnsavedChanges(block: boolean, message = "Você tem mudanças não salvas. Sair mesmo assim?") {
  useEffect(() => {
    if (!block) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [block, message]);
}

export function confirmUnsavedChanges(message = "Você tem mudanças não salvas. Deseja continuar?") {
  return window.confirm(message);
}

