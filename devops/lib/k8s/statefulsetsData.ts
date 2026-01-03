// file: lib/k8s/statefulsetsData.ts
const statefulsets = [
  {
    id: "ss1",
    name: "mongodb",
    namespace: "db",
    imageTag: "mongo:6.0",
    health: "Saudável", // Saudável | Parcial | Degradado
    serviceName: "mongodb-headless",
    podManagementPolicy: "OrderedReady",
    spec: { replicas: 3 },
    status: { readyReplicas: 3, updatedReplicas: 3, currentReplicas: 3 },
    selector: { app: "mongodb" },
    template: {
      labels: { app: "mongodb", tier: "database" },
      containers: [{ name: "mongodb", image: "mongo:6.0" }],
    },
    updateStrategy: { type: "RollingUpdate", rollingUpdate: { partition: 0 } },
    pods: [
      { ordinal: 0, name: "mongodb-0", node: "ip-192-168-89-7", ready: true },
      { ordinal: 1, name: "mongodb-1", node: "ip-192-168-88-5", ready: true },
      { ordinal: 2, name: "mongodb-2", node: "ip-192-168-87-11", ready: true },
    ],
    volumeClaims: [
      { pvc: "data-mongodb-0", size: "100Gi", mode: "ReadWriteOnce", status: "Bound", pv: "pv-01" },
      { pvc: "data-mongodb-1", size: "100Gi", mode: "ReadWriteOnce", status: "Bound", pv: "pv-02" },
      { pvc: "data-mongodb-2", size: "100Gi", mode: "ReadWriteOnce", status: "Bound", pv: "pv-03" },
    ],
    conditions: [
      { type: "Available", status: "True", lastUpdate: "10/10/2025 11:35", lastTransition: "10/10/2025 11:30", reason: "AllReplicasReady", message: "All pods ready." },
    ],
    events: [
      { id: "e1", type: "Normal", reason: "SuccessfulCreate", message: "Created pod mongodb-2", object: "StatefulSet/mongodb", age: "22m" },
    ],
  },
  {
    id: "ss2",
    name: "media-cache",
    namespace: "media",
    imageTag: "redis:7.2",
    health: "Parcial",
    serviceName: "media-cache-headless",
    podManagementPolicy: "OrderedReady",
    spec: { replicas: 3 },
    status: { readyReplicas: 2, updatedReplicas: 2, currentReplicas: 3 },
    selector: { app: "media-cache" },
    template: {
      labels: { app: "media-cache", tier: "cache" },
      containers: [{ name: "redis", image: "redis:7.2" }],
    },
    updateStrategy: { type: "RollingUpdate", rollingUpdate: { partition: 1 } },
    pods: [
      { ordinal: 0, name: "media-cache-0", node: "ip-192-168-89-7", ready: true },
      { ordinal: 1, name: "media-cache-1", node: "ip-192-168-88-5", ready: true },
      { ordinal: 2, name: "media-cache-2", node: "ip-192-168-87-11", ready: false },
    ],
    volumeClaims: [
      { pvc: "data-media-cache-0", size: "20Gi", mode: "ReadWriteOnce", status: "Bound", pv: "pv-21" },
      { pvc: "data-media-cache-1", size: "20Gi", mode: "ReadWriteOnce", status: "Bound", pv: "pv-22" },
      { pvc: "data-media-cache-2", size: "20Gi", mode: "ReadWriteOnce", status: "Pending", pv: "—" },
    ],
    conditions: [
      { type: "Progressing", status: "True", lastUpdate: "10/10/2025 11:50", lastTransition: "10/10/2025 11:45", reason: "PartitionUpdate", message: "Updating pods above partition." },
    ],
    events: [
      { id: "e2", type: "Warning", reason: "FailedAttachVolume", message: "Multi-Attach error for volume pv-23", object: "Pod/media-cache-2", age: "9m" },
    ],
  },
  {
    id: "ss3",
    name: "video-indexer",
    namespace: "media",
    imageTag: "ghcr.io/synth/video-indexer:0.9.1",
    health: "Degradado",
    serviceName: "video-indexer-headless",
    podManagementPolicy: "Parallel",
    spec: { replicas: 2 },
    status: { readyReplicas: 0, updatedReplicas: 1, currentReplicas: 1 },
    selector: { app: "video-indexer" },
    template: {
      labels: { app: "video-indexer", tier: "worker" },
      containers: [{ name: "indexer", image: "ghcr.io/synth/video-indexer:0.9.1" }],
    },
    updateStrategy: { type: "OnDelete" },
    pods: [
      { ordinal: 0, name: "video-indexer-0", node: "ip-192-168-89-7", ready: false },
      { ordinal: 1, name: "video-indexer-1", node: "ip-192-168-88-5", ready: false },
    ],
    volumeClaims: [
      { pvc: "data-video-indexer-0", size: "200Gi", mode: "ReadWriteOnce", status: "Bound", pv: "pv-90" },
      { pvc: "data-video-indexer-1", size: "200Gi", mode: "ReadWriteOnce", status: "Bound", pv: "pv-91" },
    ],
    conditions: [
      { type: "Degraded", status: "True", lastUpdate: "10/10/2025 11:15", lastTransition: "10/10/2025 11:10", reason: "PodsNotReady", message: "No pods are ready." },
    ],
    events: [
      { id: "e3", type: "Warning", reason: "ImagePullBackOff", message: "Back-off pulling image ghcr.io/synth/video-indexer:0.9.1", object: "Pod/video-indexer-0", age: "25m" },
    ],
  },
];

export default statefulsets;
