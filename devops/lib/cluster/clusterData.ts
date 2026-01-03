// file: lib/cluster/clusterData.ts
const clusters = [
  {
    id: "c1",
    name: "synth-vps-01",
    provider: "Generic VPS",
    region: "us-east",
    size: "2 vCPU • 4 GB • 80 GB",
    status: "Running",
    cpu: { used: 42.1, history: [18,22,31,45,41,39,42], historyLong: [12,14,20,25,31,29,35,45,42,40] },
    memory: { used: 63.8, history: [50,51,59,62,64,63,63.8], historyLong: [40,42,45,50,58,60,62,64,63,63.8] },
    disk: { used: 71.4, history: [60,61,63,67,70,71,71.4] },
    network: { used: 35.0, publicIP: "203.0.113.24", privateIP: "10.0.1.17", vpc: "vpc-synth-main" },
    ssh: { user: "ubuntu" },

    mongodb: {
      status: "Online",
      version: "6.0",
      database: "synth_prod",
      uri: "mongodb://synth:••••••@10.0.1.17:27017/synth_prod?authSource=admin",
    },

    captureAgent: {
      running: true,
      interval: "a cada 10 min",
      targetBucket: "s3://synth-assets", // ou seu storage/KVM
    },

    security: {
      firewall: "Ativo",
      openPorts: [22, 80, 443, 27017],
    },

    volumes: [
      { id: "v1", name: "root", type: "SSD", sizeGb: 80, usedGb: 57, mountPath: "/" },
      { id: "v2", name: "media", type: "HDD", sizeGb: 500, usedGb: 320, mountPath: "/mnt/media" },
    ],

    backup: {
      schedule: "Diário • 03:00",
      retention: "7 dias",
      lastRun: "Hoje 03:01",
      recent: [
        { id: "b1", date: "10/10/2025 03:01", sizeGb: 320 },
        { id: "b2", date: "09/10/2025 03:00", sizeGb: 319 },
        { id: "b3", date: "08/10/2025 03:00", sizeGb: 318 },
      ],
    },

    logs: [
      "[03:01] backup: concluído (320GB) • destino s3://synth-backups/daily",
      "[02:55] mongodb: compactação concluída em 5m",
      "[02:40] capture-agent: 124 imagens novas, 4 vídeos • /mnt/media",
      "[00:14] nginx: 200 GET /api/assets?page=2 134ms",
      "[00:02] systemd: atualização de segurança aplicada (openssl)",
    ],
  },
];

export default clusters;
