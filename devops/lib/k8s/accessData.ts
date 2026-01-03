// file: lib/k8s/accessData.ts
const data = {
  roles: [
    {
      id: "r1",
      name: "view",
      namespace: "media",
      rules: [
        { apiGroups: [""], resources: ["pods","services","endpoints"], verbs: ["get","list","watch"] },
        { apiGroups: ["apps"], resources: ["deployments","replicasets"], verbs: ["get","list","watch"] },
      ],
      age: "14d",
      ageSec: 1209600,
    },
    {
      id: "r2",
      name: "edit",
      namespace: "media",
      rules: [
        { apiGroups: [""], resources: ["pods","services","configmaps","secrets"], verbs: ["*"] },
        { apiGroups: ["apps"], resources: ["deployments","statefulsets"], verbs: ["*"] },
      ],
      age: "10d",
      ageSec: 864000,
    },
    {
      id: "r3",
      name: "cluster-admin",
      namespace: null, // ClusterRole
      rules: [{ apiGroups: ["*"], resources: ["*"], verbs: ["*"] }],
      age: "120d",
      ageSec: 10368000,
    },
  ],

  bindings: [
    {
      id: "b1",
      name: "view-to-devs",
      namespace: "media",
      roleRef: { kind: "Role", name: "view" },
      subjects: [
        { kind: "Group", name: "devs" },
        { kind: "User", name: "alice@example.com" },
      ],
      age: "9d",
      ageSec: 777600,
    },
    {
      id: "b2",
      name: "edit-to-ci",
      namespace: "media",
      roleRef: { kind: "Role", name: "edit" },
      subjects: [{ kind: "ServiceAccount", name: "ci", namespace: "media" }],
      age: "7d",
      ageSec: 604800,
    },
    {
      id: "b3",
      name: "cluster-admin-root",
      namespace: null, // ClusterRoleBinding
      roleRef: { kind: "ClusterRole", name: "cluster-admin" },
      subjects: [{ kind: "User", name: "root@example.com" }],
      age: "100d",
      ageSec: 8640000,
    },
  ],

  serviceAccounts: [
    {
      id: "sa1",
      name: "ci",
      namespace: "media",
      secrets: [{ name: "ci-dockercfg", type: "kubernetes.io/dockerconfigjson" }],
      tokens: [{ aud: "api", jwtMasked: "eyJhbGciOi...zzz (mascarado)" }],
      imagePullSecrets: ["regcred"],
      age: "30d",
      ageSec: 2592000,
    },
    {
      id: "sa2",
      name: "backup",
      namespace: "db",
      secrets: [],
      tokens: [],
      imagePullSecrets: [],
      age: "60d",
      ageSec: 5184000,
    },
  ],
};

export default data;
