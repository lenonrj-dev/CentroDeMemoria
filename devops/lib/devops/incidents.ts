export const incidentsSeed = [
  { id: "INC-1042", title: "Erro 5xx em /orders/checkout", severity: "Critical", status: "Aberto", team: "SRE", service: "checkout", owner: "ana.silva", updatedAt: "há 5 min" },
  { id: "INC-1041", title: "Fila de builds saturada", severity: "High", status: "Em andamento", team: "DevTools", service: "ci-runner", owner: "devops-bot", updatedAt: "há 12 min" },
  { id: "INC-1040", title: "Latência alta no auth", severity: "Medium", status: "Aberto", team: "Platform", service: "auth", owner: "rodrigo.m", updatedAt: "há 25 min" },
  { id: "INC-1039", title: "Alertas de disco em worker-billing", severity: "Low", status: "Resolvido", team: "FinOps", service: "worker-billing", owner: "ci-bot", updatedAt: "há 1 h" },
  { id: "INC-1038", title: "Queue backlog em notifications", severity: "Medium", status: "Em andamento", team: "Growth", service: "notifications", owner: "bia.r", updatedAt: "há 45 min" },
];
