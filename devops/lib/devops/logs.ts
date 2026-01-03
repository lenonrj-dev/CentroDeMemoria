export const initialLogs = [
  { level: "INFO", message: "web-api rollout canary 20% iniciado", timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
  { level: "INFO", message: "autoscaler aumentou réplicas de checkout para 10", timestamp: new Date(Date.now() - 1000 * 60 * 2.5).toISOString() },
  { level: "WARN", message: "latência 95p do auth acima de 250ms", timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
  { level: "ERROR", message: "pipeline checkout release falhou na etapa integração", timestamp: new Date(Date.now() - 1000 * 60 * 1.5).toISOString() },
  { level: "INFO", message: "incidente INC-1042 atribuído para ana.silva", timestamp: new Date(Date.now() - 1000 * 60).toISOString() },
  { level: "WARN", message: "queue builds com 120 itens, limite 150", timestamp: new Date(Date.now() - 1000 * 45).toISOString() },
];

export const liveLogTemplates = [
  () => ({ level: "INFO", message: "healthcheck ok em web-api", timestamp: new Date().toISOString() }),
  () => ({ level: "WARN", message: "latência checkout acima de 220ms", timestamp: new Date().toISOString() }),
  () => ({ level: "ERROR", message: "erro 502 em /orders/checkout", timestamp: new Date().toISOString() }),
  () => ({ level: "INFO", message: "deploy catalog v1.9.1 aprovado para stage", timestamp: new Date().toISOString() }),
  () => ({ level: "INFO", message: "autoscaler reduziu worker-billing para 4 réplicas", timestamp: new Date().toISOString() }),
  () => ({ level: "WARN", message: "CPU nó pool-a acima de 85%", timestamp: new Date().toISOString() }),
];
