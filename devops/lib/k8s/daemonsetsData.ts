// file: lib/k8s/daemonsetsData.ts
const daemonsets = [
  {
    id: "ds1",
    name: "kube-proxy",
    namespace: "kube-system",
    imageTag: "k8s.gcr.io/kube-proxy:v1.29.4",
    health: "Saudável", // Saudável | Parcial | Degradado
    status: {
      desiredNumberScheduled: 3,
      currentNumberScheduled: 3,
      updatedNumberScheduled: 3,
      numberReady: 3,
      numberAvailable: 3,
      numberMisscheduled: 0,
    },
    selector: { "k8s-app": "kube-proxy" },
    template: {
      labels: { "k8s-app": "kube-proxy" },
      containers: [{ name: "kube-proxy", image: "k8s.gcr.io/kube-proxy:v1.29.4" }],
    },
    strategy: { type: "RollingUpdate", rollingUpdate: { maxUnavailable: "10%" } },
    nodeSelector: {},
    tolerations: [{ key: "node-role.kubernetes.io/control-plane", effect: "NoSchedule" }],
    targetedNodes: [
      { name: "ip-192-168-89-7", podName: "kube-proxy-svn6b", ready: true },
      { name: "ip-192-168-88-5", podName: "kube-proxy-k3md9", ready: true },
      { name: "ip-192-168-87-11", podName: "kube-proxy-0w9fd", ready: true },
    ],
    conditions: [
      { type: "NumberAvailable", status: "True", lastUpdate: "10/10/2025 11:40", lastTransition: "10/10/2025 11:35", reason: "MinimumAvailability", message: "All pods available." },
    ],
    events: [
      { id: "e1", type: "Normal", reason: "SuccessfulCreate", message: "Created pod kube-proxy-svn6b", object: "DaemonSet/kube-proxy", age: "20m" },
    ],
  },
  {
    id: "ds2",
    name: "calico-node",
    namespace: "kube-system",
    imageTag: "docker.io/calico/node:v3.27.0",
    health: "Parcial",
    status: {
      desiredNumberScheduled: 3,
      currentNumberScheduled: 3,
      updatedNumberScheduled: 2,
      numberReady: 2,
      numberAvailable: 2,
      numberMisscheduled: 0,
    },
    selector: { "k8s-app": "calico-node" },
    template: {
      labels: { "k8s-app": "calico-node" },
      containers: [{ name: "calico-node", image: "docker.io/calico/node:v3.27.0" }],
    },
    strategy: { type: "RollingUpdate", rollingUpdate: { maxUnavailable: "25%" } },
    nodeSelector: {},
    tolerations: [{ key: "node.kubernetes.io/not-ready", effect: "NoExecute" }],
    targetedNodes: [
      { name: "ip-192-168-89-7", podName: "calico-node-rwf4g", ready: true },
      { name: "ip-192-168-88-5", podName: "calico-node-3sd88", ready: true },
      { name: "ip-192-168-87-11", podName: "calico-node-9md22", ready: false },
    ],
    conditions: [
      { type: "Progressing", status: "True", lastUpdate: "10/10/2025 11:50", lastTransition: "10/10/2025 11:45", reason: "UpdatingPods", message: "Rolling update in progress." },
    ],
    events: [
      { id: "e2", type: "Warning", reason: "BackOff", message: "Back-off restarting failed container", object: "Pod/calico-node-9md22", age: "7m" },
    ],
  },
  {
    id: "ds3",
    name: "node-exporter",
    namespace: "monitoring",
    imageTag: "quay.io/prometheus/node-exporter:v1.8.1",
    health: "Degradado",
    status: {
      desiredNumberScheduled: 3,
      currentNumberScheduled: 2,
      updatedNumberScheduled: 2,
      numberReady: 1,
      numberAvailable: 1,
      numberMisscheduled: 1,
    },
    selector: { "app.kubernetes.io/name": "node-exporter" },
    template: {
      labels: { "app.kubernetes.io/name": "node-exporter" },
      containers: [{ name: "node-exporter", image: "quay.io/prometheus/node-exporter:v1.8.1" }],
    },
    strategy: { type: "RollingUpdate", rollingUpdate: { maxUnavailable: "1" } },
    nodeSelector: { "kubernetes.io/os": "linux" },
    tolerations: [],
    targetedNodes: [
      { name: "ip-192-168-89-7", podName: "node-exporter-7cd22", ready: true },
      { name: "ip-192-168-88-5", podName: "node-exporter-8jm11", ready: false },
      { name: "ip-192-168-87-11", podName: "node-exporter-missched", ready: false },
    ],
    conditions: [
      { type: "Degraded", status: "True", lastUpdate: "10/10/2025 11:10", lastTransition: "10/10/2025 11:05", reason: "UnavailablePods", message: "Some pods are not ready." },
    ],
    events: [
      { id: "e3", type: "Warning", reason: "FailedScheduling", message: "0/3 nodes are available: 1 node(s) had taint ...", object: "DaemonSet/node-exporter", age: "25m" },
    ],
  },
];

export default daemonsets;
