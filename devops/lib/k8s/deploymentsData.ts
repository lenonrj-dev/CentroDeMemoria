// file: app/lib/k8s/deploymentsData.ts
const deployments = [
  {
    id: "d1",
    name: "web",
    namespace: "web",
    imageTag: "ghcr.io/synth/web:1.12.0",
    status: "Disponível", // Disponível | Progredindo | Degradado
    paused: false,
    replicas: { desired: 3, updated: 3, available: 3, unavailable: 0 },
    rolloutProgress: [0.2,0.4,0.55,0.7,0.85,1,1,1,1,1],
    strategy: { type: "RollingUpdate", maxSurge: "25%", maxUnavailable: "25%" },
    revision: { current: 14, lastChange: "10/10/2025 11:32" },
    selector: { "app": "web" },
    template: {
      labels: { app: "web", tier: "frontend" },
      containers: [{ name: "web", image: "ghcr.io/synth/web:1.12.0" }],
    },
    conditions: [
      { type: "Available", status: "True", lastUpdate: "10/10/2025 11:32", lastTransition: "10/10/2025 11:30", reason: "MinimumReplicasAvailable", message: "Deployment has minimum availability." },
      { type: "Progressing", status: "True", lastUpdate: "10/10/2025 11:31", lastTransition: "10/10/2025 11:29", reason: "NewReplicaSetAvailable", message: "ReplicaSet web-7c54df now has 3 pods." },
    ],
    events: [
      { id: "e1", type: "Normal", reason: "ScalingReplicaSet", message: "Scaled up replica set web-7c54df to 3", object: "Deployment/web", age: "12m" },
    ],
  },
  {
    id: "d2",
    name: "api",
    namespace: "api",
    imageTag: "ghcr.io/synth/api:2.8.3",
    status: "Progredindo",
    paused: false,
    replicas: { desired: 4, updated: 3, available: 2, unavailable: 2 },
    rolloutProgress: [0.1,0.2,0.33,0.4,0.5,0.55,0.6,0.65,0.7,0.75],
    strategy: { type: "RollingUpdate", maxSurge: "50%", maxUnavailable: "25%" },
    revision: { current: 42, lastChange: "10/10/2025 11:45" },
    selector: { "app": "api" },
    template: {
      labels: { app: "api", tier: "backend" },
      containers: [{ name: "api", image: "ghcr.io/synth/api:2.8.3" }],
    },
    conditions: [
      { type: "Available", status: "False", lastUpdate: "10/10/2025 11:45", lastTransition: "10/10/2025 11:40", reason: "ProgressDeadlineExceeded", message: "Deployment is progressing." },
      { type: "Progressing", status: "True", lastUpdate: "10/10/2025 11:44", lastTransition: "10/10/2025 11:40", reason: "ReplicaSetUpdated", message: "Updated 3 pods so far." },
    ],
    events: [
      { id: "e2", type: "Normal", reason: "Pulling", message: "Pulling image ghcr.io/synth/api:2.8.3", object: "Pod/api-7c54df-1", age: "9m" },
    ],
  },
  {
    id: "d3",
    name: "media-proc",
    namespace: "media",
    imageTag: "ghcr.io/synth/media-proc:0.9.1",
    status: "Degradado",
    paused: true,
    replicas: { desired: 2, updated: 1, available: 0, unavailable: 2 },
    rolloutProgress: [0.15,0.2,0.2,0.18,0.16,0.1,0.08,0.05,0.05,0.05],
    strategy: { type: "RollingUpdate", maxSurge: "25%", maxUnavailable: "25%" },
    revision: { current: 7, lastChange: "10/10/2025 10:58" },
    selector: { "app": "media-proc" },
    template: {
      labels: { app: "media-proc", tier: "worker" },
      containers: [{ name: "media-proc", image: "ghcr.io/synth/media-proc:0.9.1" }],
    },
    conditions: [
      { type: "Available", status: "False", lastUpdate: "10/10/2025 10:58", lastTransition: "10/10/2025 10:54", reason: "MinimumReplicasUnavailable", message: "Unavailable replicas." },
      { type: "Progressing", status: "False", lastUpdate: "10/10/2025 10:58", lastTransition: "10/10/2025 10:57", reason: "ProgressDeadlineExceeded", message: "Progress deadline exceeded." },
    ],
    events: [
      { id: "e3", type: "Warning", reason: "BackOff", message: "Back-off restarting failed container", object: "Pod/media-proc-44", age: "7m" },
    ],
  },
];

export default deployments;
