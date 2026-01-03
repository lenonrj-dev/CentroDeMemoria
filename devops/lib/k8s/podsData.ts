// file: lib/k8s/podsData.ts
const pods = [
  {
    id: "p1",
    name: "aws-node-rwf4g",
    status: "Running",
    namespace: "kube-system",
    node: "ip-192-168-89-7.eu-north-1.compute.internal",
    podIP: "192.168.89.7",
    priorityClass: "-",
    createdAt: "21 outubro 2023 - 15:38:24",
    restarts: 0,
    cpu: 0.012,
    memory: 34.1,
    cpuHistory: [0.004, 0.006, 0.009, 0.008, 0.005, 0.006, 0.012],
    memHistory: [22, 24, 27, 30, 28, 32, 34],
    labels: ["k8s-app:calico-node", "controller-revision-hash:5c9cdc...", "pod-template-generation:1"],
    conditions: ["Initialized", "Ready", "ContainersReady", "PodScheduled"],
    controller: "DaemonSet: calico-node",
  },
  // … adicione os demais aqui como já tinha
];

export default pods;
