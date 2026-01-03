// file: lib/k8s/replicasetsData.ts
const replicatsets = [
  {
    id: "rs1",
    name: "web-7c54df",
    namespace: "web",
    owner: "Deployment/web",
    imageTag: "ghcr.io/synth/web:1.12.0",
    health: "Saudável",
    spec: { replicas: 3 },
    status: { replicas: 3, readyReplicas: 3, availableReplicas: 3, fullyLabeledReplicas: 3 },
    selector: { app: "web" },
    template: {
      labels: { app: "web", tier: "frontend" },
      containers: [{ name: "web", image: "ghcr.io/synth/web:1.12.0" }],
    },
    minReadySeconds: 0,
    deletePolicy: "Foreground",
    revisions: [
      { rev: 14, image: "ghcr.io/synth/web:1.12.0" },
      { rev: 13, image: "ghcr.io/synth/web:1.11.2" },
    ],
    pods: [
      { name: "web-7c54df-abc12", node: "ip-192-168-89-7", ready: true },
      { name: "web-7c54df-xyz77", node: "ip-192-168-88-5", ready: true },
      { name: "web-7c54df-k9p44", node: "ip-192-168-87-11", ready: true },
    ],
    conditions: [
      { type: "ReplicaFailure", status: "False", lastUpdate: "10/10/2025 11:30", lastTransition: "10/10/2025 11:28", reason: "NewReplicaSetAvailable", message: "Minimum availability achieved." },
    ],
    events: [
      { id: "e1", type: "Normal", reason: "SuccessfulCreate", message: "Created pod web-7c54df-abc12", object: "ReplicaSet/web-7c54df", age: "18m" },
    ],
  },
  {
    id: "rs2",
    name: "api-7c54df",
    namespace: "api",
    owner: "Deployment/api",
    imageTag: "ghcr.io/synth/api:2.8.3",
    health: "Parcial",
    spec: { replicas: 4 },
    status: { replicas: 4, readyReplicas: 2, availableReplicas: 2, fullyLabeledReplicas: 3 },
    selector: { app: "api" },
    template: {
      labels: { app: "api", tier: "backend" },
      containers: [{ name: "api", image: "ghcr.io/synth/api:2.8.3" }],
    },
    minReadySeconds: 10,
    deletePolicy: "Foreground",
    revisions: [
      { rev: 42, image: "ghcr.io/synth/api:2.8.3" },
      { rev: 41, image: "ghcr.io/synth/api:2.8.2" },
    ],
    pods: [
      { name: "api-7c54df-qwe11", node: "ip-192-168-89-7", ready: true },
      { name: "api-7c54df-kju22", node: "ip-192-168-88-5", ready: true },
      { name: "api-7c54df-zzz33", node: "ip-192-168-87-11", ready: false },
      { name: "api-7c54df-aaa44", node: "ip-192-168-87-11", ready: false },
    ],
    conditions: [
      { type: "ReplicaFailure", status: "False", lastUpdate: "10/10/2025 11:45", lastTransition: "10/10/2025 11:40", reason: "Progressing", message: "Updating pods." },
    ],
    events: [
      { id: "e2", type: "Normal", reason: "Pulling", message: "Pulling image ghcr.io/synth/api:2.8.3", object: "Pod/api-7c54df-qwe11", age: "9m" },
    ],
  },
  {
    id: "rs3",
    name: "media-proc-44",
    namespace: "media",
    owner: "Deployment/media-proc",
    imageTag: "ghcr.io/synth/media-proc:0.9.1",
    health: "Degradado",
    spec: { replicas: 2 },
    status: { replicas: 2, readyReplicas: 0, availableReplicas: 0, fullyLabeledReplicas: 1 },
    selector: { app: "media-proc" },
    template: {
      labels: { app: "media-proc", tier: "worker" },
      containers: [{ name: "media-proc", image: "ghcr.io/synth/media-proc:0.9.1" }],
    },
    minReadySeconds: 0,
    deletePolicy: "Background",
    revisions: [
      { rev: 7, image: "ghcr.io/synth/media-proc:0.9.1" },
      { rev: 6, image: "ghcr.io/synth/media-proc:0.9.0" },
    ],
    pods: [
      { name: "media-proc-44-1", node: "ip-192-168-89-7", ready: false },
      { name: "media-proc-44-2", node: "ip-192-168-88-5", ready: false },
    ],
    conditions: [
      { type: "ReplicaFailure", status: "True", lastUpdate: "10/10/2025 10:58", lastTransition: "10/10/2025 10:57", reason: "BackOff", message: "Containers failing to start." },
    ],
    events: [
      { id: "e3", type: "Warning", reason: "BackOff", message: "Back-off restarting failed container", object: "Pod/media-proc-44-2", age: "7m" },
    ],
  },
];

export default replicatsets;
