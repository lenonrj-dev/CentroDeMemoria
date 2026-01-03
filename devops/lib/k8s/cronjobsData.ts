// file: lib/k8s/cronjobsData.ts
const base = 1696953600; // epoch mock para ordenação

const cronjobs = [
  {
    id: "cj1",
    name: "media-snapshot",
    namespace: "media",
    schedule: "*/30 * * * *",
    timezone: "UTC",
    suspend: false,
    concurrencyPolicy: "Forbid",
    startingDeadlineSeconds: 120,
    history: { successful: 3, failed: 1 },
    lastSchedule: "10/10/2025 11:30",
    lastScheduleEpoch: base - 60 * 60,
    nextRun: "10/10/2025 12:00",
    nextRunEpoch: base,
    selector: { "cronjob-name": "media-snapshot" },
    template: {
      labels: { app: "media-snapshot" },
      containers: [{ name: "snapshot", image: "ghcr.io/synth/media-snapshot:1.3.0" }],
    },
    recentRuns: [
      { id: "r1", time: "10/10/2025 11:30", status: "Succeeded", duration: 120 },
      { id: "r0", time: "10/10/2025 11:00", status: "Succeeded", duration: 115 },
    ],
    activeJobs: [],
    conditions: [
      { type: "Ready", status: "True", lastUpdate: "10/10/2025 11:31", lastTransition: "10/10/2025 11:31", reason: "Scheduled", message: "Next run scheduled." },
    ],
    events: [
      { id: "e1", type: "Normal", reason: "SawCompletedJob", message: "Job media-snapshot-1130 completed", object: "CronJob/media-snapshot", age: "35m" },
    ],
  },
  {
    id: "cj2",
    name: "db-backup",
    namespace: "db",
    schedule: "0 */6 * * *",
    timezone: "UTC",
    suspend: false,
    concurrencyPolicy: "Replace",
    startingDeadlineSeconds: 300,
    history: { successful: 1, failed: 2 },
    lastSchedule: "10/10/2025 06:00",
    lastScheduleEpoch: base - 6 * 60 * 60,
    nextRun: "10/10/2025 12:00",
    nextRunEpoch: base,
    selector: { "cronjob-name": "db-backup" },
    template: {
      labels: { app: "db-backup" },
      containers: [{ name: "backup", image: "ghcr.io/synth/db-backup:2.2.1" }],
    },
    recentRuns: [
      { id: "r1", time: "10/10/2025 06:00", status: "Failed", duration: 480 },
      { id: "r0", time: "10/10/2025 00:00", status: "Succeeded", duration: 460 },
    ],
    activeJobs: [
      { id: "j-run", name: "db-backup-1200", namespace: "db", active: 1, succeeded: 0, failed: 0, age: "2m" },
    ],
    conditions: [
      { type: "BackoffLimited", status: "False", lastUpdate: "10/10/2025 06:08", lastTransition: "10/10/2025 06:08", reason: "Retrying", message: "Previous run failed, retry scheduled." },
    ],
    events: [
      { id: "e2", type: "Warning", reason: "FailedJob", message: "Job db-backup-0600 failed", object: "CronJob/db-backup", age: "6h" },
    ],
  },
  {
    id: "cj3",
    name: "thumbnail-batch",
    namespace: "web",
    schedule: "*/10 8-20 * * 1-5",
    timezone: "America/Sao_Paulo",
    suspend: true,
    concurrencyPolicy: "Allow",
    startingDeadlineSeconds: null,
    history: { successful: 0, failed: 0 },
    lastSchedule: "—",
    lastScheduleEpoch: 0,
    nextRun: "—",
    nextRunEpoch: Number.MAX_SAFE_INTEGER,
    selector: { "cronjob-name": "thumbnail-batch" },
    template: {
      labels: { app: "thumbnail-batch" },
      containers: [{ name: "thumb", image: "ghcr.io/synth/img-thumb:1.0.0" }],
    },
    recentRuns: [],
    activeJobs: [],
    conditions: [],
    events: [],
  },
];

export default cronjobs;
