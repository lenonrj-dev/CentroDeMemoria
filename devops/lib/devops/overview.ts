export const metricCards = [
  {
    id: "cpu",
    title: "Uso de CPU",
    value: "72%",
    delta: "+3.1%",
    state: "warning",
    hint: "pico por builds paralelas",
    series: [0.42, 0.44, 0.46, 0.51, 0.63, 0.72, 0.7, 0.69],
  },
  {
    id: "memory",
    title: "Uso de Memória",
    value: "65%",
    delta: "-1.4%",
    state: "healthy",
    hint: "sobre headroom de 4GB",
    series: [0.51, 0.53, 0.55, 0.58, 0.6, 0.64, 0.65, 0.63],
  },
  {
    id: "latency",
    title: "Latência média",
    value: "182ms",
    delta: "-6.8%",
    state: "healthy",
    hint: "95p: 240ms",
    series: [0.26, 0.25, 0.24, 0.21, 0.23, 0.22, 0.19, 0.18],
  },
  {
    id: "errors",
    title: "Erros/min",
    value: "14",
    delta: "+2",
    state: "warning",
    hint: "incidentes em api-web",
    series: [0.04, 0.05, 0.06, 0.05, 0.04, 0.06, 0.08, 0.09],
  },
  {
    id: "uptime",
    title: "Serviços UP",
    value: "42/45",
    delta: "+1",
    state: "healthy",
    hint: "2 degradados, 1 em manutenção",
    series: [0.88, 0.9, 0.92, 0.94, 0.93, 0.95, 0.96, 0.95],
  },
  {
    id: "deploys",
    title: "Deploys 24h",
    value: "28",
    delta: "+6",
    state: "healthy",
    hint: "80% sucesso",
    series: [0.21, 0.22, 0.18, 0.24, 0.28, 0.3, 0.29, 0.32],
  },
];

export const healthPanels = [
  { title: "Status da Plataforma", status: "Estável", detail: "SLO 99.8% nas últimas 24h", sentiment: "healthy" },
  { title: "Incidentes Abertos", status: "3 críticos", detail: "web-api, pagamentos, builds", sentiment: "warning" },
  { title: "Deploys HO", status: "6 execuções", detail: "2 aguardando aprovação", sentiment: "neutral" },
  { title: "Alertas", status: "18 ativos", detail: "5 críticos, 7 altos, 6 médios", sentiment: "warning" },
];

export const latestDeployments = [
  { service: "web-api", env: "prod", version: "v2.18.4", status: "Sucesso", author: "ana.silva", time: "há 8 min" },
  { service: "checkout", env: "prod", version: "v3.2.1", status: "Falha", author: "devops-bot", time: "há 22 min" },
  { service: "catalog", env: "stage", version: "v1.9.0", status: "Sucesso", author: "rodrigo.m", time: "há 35 min" },
  { service: "worker-billing", env: "prod", version: "v1.4.7", status: "Em execução", author: "ana.silva", time: "em curso" },
];

export const serviceErrors = [
  { id: "apm-1", service: "web-api", path: "/orders/checkout", rate: 1.9, trend: "up" },
  { id: "apm-2", service: "checkout", path: "/pay", rate: 1.4, trend: "flat" },
  { id: "apm-3", service: "auth", path: "/login", rate: 0.6, trend: "down" },
  { id: "apm-4", service: "notifications", path: "/send", rate: 0.4, trend: "flat" },
];

export const alertBanners = [
  { tone: "warning", title: "3 incidentes críticos abertos", description: "web-api, pagamentos e fila de builds com erros 5xx." },
  { tone: "info", title: "Nova release aguardando aprovação", description: "checkout v3.2.1 pronta para promover para produção." },
];
