// file: lib/cluster/nodesData.ts
const nodes = [
  {
    id: "n1",
    name: "ip-192-168-89-7.eu-north-1.compute.internal",
    hostname: "ip-192-168-89-7",
    role: "worker",
    status: "Ready",
    schedulable: true,
    internalIP: "192.168.89.7",
    externalIP: "203.0.113.34",
    cidr: "192.168.89.0/24",

    cpu: { used: 37.4, allocatable: 2, history: [10,18,22,35,31,33,37], historyLong: [8,12,15,20,25,28,30,34,36,37] },
    memory: { used: 62.1, allocatable: 4, history: [40,45,50,55,60,61,62], historyLong: [38,40,45,48,52,56,60,61,62,62.1] },
    disk: { used: 55.7, capacity: 80, history: [45,47,49,52,54,55,55.7], historyLong: [40,42,45,47,50,52,54,55,55.5,55.7] },

    pods: {
      running: 24,
      capacity: 110,
      allocatable: 100,
      items: [
        "aws-node-rwf4g","kube-proxy-svn6b","cert-manager-789598","nginx-6d7bcd",
        "api-7c54df","worker-9a31d","jobs-runner-12","media-processor-44", "mongodb-0",
      ],
    },

    labels: {
      "kubernetes.io/hostname": "ip-192-168-89-7",
      "node-role.kubernetes.io/worker": "true",
      "topology.kubernetes.io/region": "eu-north-1",
      "beta.kubernetes.io/os": "linux",
    },

    taints: [],

    network: { cni: "calico", firewall: "Ativo", openPorts: [22, 80, 443] },

    versions: {
      kubelet: "1.29.4",
      kubeProxy: "1.29.4",
      containerRuntime: "containerd://1.7.11",
    },

    osImage: "Ubuntu 22.04.4 LTS",
    kernelVersion: "6.8.0-31-generic",
    arch: "x86_64",

    conditions: [
      { type: "Ready", status: "True" },
      { type: "MemoryPressure", status: "False" },
      { type: "DiskPressure", status: "False" },
      { type: "PIDPressure", status: "False" },
      { type: "NetworkUnavailable", status: "False" },
    ],
  },

  {
    id: "n2",
    name: "ip-192-168-88-5.eu-north-1.compute.internal",
    hostname: "ip-192-168-88-5",
    role: "control-plane",
    status: "Ready",
    schedulable: false,
    internalIP: "192.168.88.5",
    externalIP: "203.0.113.35",

    cpu: { used: 21.0, allocatable: 2, history: [12,14,18,21,20,19,21], historyLong: [10,12,14,16,18,19,20,21,20,21] },
    memory: { used: 48.6, allocatable: 4, history: [38,41,45,46,48,48,48.6], historyLong: [36,38,40,42,44,45,46,47,48,48.6] },
    disk: { used: 33.2, capacity: 120, history: [25,28,29,31,32,33,33.2], historyLong: [23,24,26,27,29,30,31,32,33,33.2] },

    pods: {
      running: 18, capacity: 110, allocatable: 100,
      items: ["kube-apiserver","kube-scheduler","kube-controller-manager","etcd","coredns-6d4b75","metrics-server"],
    },

    labels: {
      "node-role.kubernetes.io/control-plane": "true",
      "topology.kubernetes.io/region": "eu-north-1",
      "beta.kubernetes.io/os": "linux",
    },

    taints: [{ key: "node-role.kubernetes.io/control-plane", value: "true", effect: "NoSchedule" }],

    network: { cni: "calico", firewall: "Ativo", openPorts: [22, 443, 6443] },

    versions: {
      kubelet: "1.29.4",
      kubeProxy: "1.29.4",
      containerRuntime: "containerd://1.7.11",
    },

    osImage: "Ubuntu 22.04.4 LTS",
    kernelVersion: "6.8.0-31-generic",
    arch: "x86_64",

    conditions: [
      { type: "Ready", status: "True" },
      { type: "MemoryPressure", status: "False" },
      { type: "DiskPressure", status: "False" },
      { type: "PIDPressure", status: "False" },
      { type: "NetworkUnavailable", status: "False" },
    ],
  },
];

export default nodes;
