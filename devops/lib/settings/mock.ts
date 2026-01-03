// file: lib/settings/mock.ts
export const currentUser = {
  name: "Dev Pro",
  email: "dev@example.com",
  locale: "pt-BR",
  timezone: "America/Sao_Paulo",
};

export const uiPrefs = {
  theme: "synth-dark",      // synth-dark | synth-light | system
  density: "comfortable",    // compact | comfortable
  language: "pt-BR",
};

export const notif = {
  email: true,
  slack: true,
  webhook: false,
  digest: "diário",         // instantâneo | horário | diário
};

export const tokens = [
  { id: "tok_01", name: "CLI local", created: "2025-10-09 18:11", lastUsed: "há 2h", prefix: "synth_pat_3u9K", secret: "synth_pat_3u9K_********************************" },
  { id: "tok_02", name: "CI/CD", created: "2025-10-08 09:02", lastUsed: "há 1d", prefix: "synth_pat_bQ1a", secret: "synth_pat_bQ1a_********************************" },
];

export const integrations = [
  { key: "github", name: "GitHub", connected: true, info: "org SynthLabs", scopes: "repo, admin:repo_hook" },
  { key: "docker", name: "Docker Hub", connected: false, info: "-", scopes: "-" },
  { key: "slack", name: "Slack", connected: true, info: "#alerts-devops", scopes: "chat:write" },
];

export const kube = [
  { id: "prod-1", name: "prod-br", context: "gke-prod-br", apiServer: "https://k8s.prod.br", defaultNs: "default", auth: "kubeconfig", status: "Conectado" },
  { id: "stg-1", name: "staging", context: "eks-stg", apiServer: "https://api.stg.aws", defaultNs: "staging", auth: "OIDC", status: "Conectado" },
];

export const secrets = [
  { key: "MONGODB_URI", type: "string", scope: "global", updated: "10/10/2025 11:30" },
  { key: "DOCKERHUB_TOKEN", type: "string", scope: "ci", updated: "10/10/2025 09:12" },
];

export const audits = [
  { id: "a1", time: "10/10/2025 11:52", actor: "dev@example.com", action: "Criou token", target: "CLI local", ip: "191.33.11.9" },
  { id: "a2", time: "10/10/2025 11:10", actor: "dev@example.com", action: "Atualizou tema", target: "synth-dark", ip: "191.33.11.9" },
];
