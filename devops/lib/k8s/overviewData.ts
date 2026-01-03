// file: lib/k8s/overviewData.ts
const totalPods = 220;

const data = {
  summary: {
    pods: {
      running: 182,
      pending: 6,
      failed: 3,
      capacity: 300,
    },
    deployments: { total: 38, available: 36 },
    replicasets: { total: 52 },
    statefulsets: { total: 7 },
    daemonsets: { total: 6 },
    jobs: { total: 9, active: 2 },
    cronjobs: { total: 11, scheduled: 11 },
    resources: {
      cpu: 41.3,
      memory: 62.7,
    },
    lastHour: {
      failures: 1,
      successes: 18,
    },
    hpa: { total: 4 },
  },

  series: {
    cpu: [22, 28, 31, 36, 38, 41, 39, 42, 40, 41.3],
    memory: [55, 56, 58, 60, 62, 63, 62, 62.5, 62.1, 62.7],
  },

  namespaces: [
    { name: "default", pods: 34 },
    { name: "kube-system", pods: 29 },
    { name: "media", pods: 41 },
    { name: "api", pods: 26 },
    { name: "web", pods: 22 },
    { name: "db", pods: 18 },
    { name: "monitoring", pods: 24 },
    { name: "cert-manager", pods: 6 },
    { name: "jobs", pods: 20 },
  ]
    .map((ns) => ({ ...ns, pct: Math.min(100, Math.round((ns.pods / totalPods) * 100)) }))
    .sort((a, b) => b.pods - a.pods),

  recentEvents: [
    { id: "e1", type: "Normal",  reason: "ScalingReplicaSet", message: "Scaled up replica set web-7c54df to 3", object: "Deployment/web", age: "2m" },
    { id: "e2", type: "Warning", reason: "BackOff",          message: "Back-off restarting failed container media-processor", object: "Pod/media-processor-44", age: "6m" },
    { id: "e3", type: "Normal",  reason: "Pulled",            message: "Successfully pulled image ghcr.io/synth/api:1.12.0", object: "Pod/api-7c54df", age: "12m" },
    { id: "e4", type: "Normal",  reason: "Created",           message: "Created container mongodb", object: "Pod/mongodb-0", age: "18m" },
  ],

  lastDeployments: [
    { name: "web",         namespace: "web",  version: "1.12.0", status: "Disponível",  age: "12m" },
    { name: "api",         namespace: "api",  version: "2.8.3",  status: "Progredindo", age: "9m" },
    { name: "media-proc",  namespace: "media",version: "0.9.1",  status: "Falhou",      age: "7m" },
    { name: "jobs-runner", namespace: "jobs", version: "1.2.5",  status: "Disponível",  age: "22m" },
  ],
};

export default data;
