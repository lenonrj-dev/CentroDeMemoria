// file: lib/k8s/teamsData.ts
const data = {
  teams: [
    {
      id: "t1",
      name: "Plataforma",
      org: "SynthLabs",
      tags: ["infra","k8s","obs"],
      projects: ["cluster-api","deploy-operator","observabilidade"],
      updated: "10/10/2025 12:10",
      updatedEpoch: 1760094600,
      archived: false,
      members: [
        { id:"u1", name:"Alice Santos", email:"alice@synthlabs.io", role:"Owner", joined:"2025-03-12", avatar:"https://i.pravatar.cc/64?img=1" },
        { id:"u2", name:"Bruno Lima", email:"bruno@synthlabs.io", role:"Admin", joined:"2025-04-01", avatar:"https://i.pravatar.cc/64?img=2" },
        { id:"u3", name:"Carla Souza", email:"carla@synthlabs.io", role:"Dev", joined:"2025-06-20", avatar:"https://i.pravatar.cc/64?img=3" },
      ],
      oncall: [
        { person: "Bruno Lima", role: "Primário", window: "Semanal • 24x7" },
        { person: "Carla Souza", role: "Backup", window: "Semanal • 24x7" },
      ],
      tokens: [
        { id:"tok1", name:"CI Deploy", prefix:"synth_pat_1ab9", created:"2025-08-01 09:10" },
      ],
      activity: [
        { text: "Adicionou projeto observabilidade", when:"há 2h" },
        { text: "Convidou dave@synthlabs.io", when:"há 1d" },
      ],
      visibility: "internal",
      invitePolicy: "admin",
    },
    {
      id: "t2",
      name: "API",
      org: "SynthLabs",
      tags: ["backend","go"],
      projects: ["api-gateway","billing","auth"],
      updated: "10/10/2025 11:40",
      updatedEpoch: 1760092800,
      archived: false,
      members: [
        { id:"u4", name:"Daniel Rocha", email:"daniel@synthlabs.io", role:"Owner", joined:"2025-01-08", avatar:"https://i.pravatar.cc/64?img=4" },
        { id:"u5", name:"Erika N.", email:"erika@synthlabs.io", role:"Dev", joined:"2025-07-10", avatar:"https://i.pravatar.cc/64?img=5" },
      ],
      oncall: [{ person: "Daniel Rocha", role: "Primário", window: "Seg-Sex • 9-18" }],
      tokens: [],
      activity: [{ text: "Atualizou ownership de billing", when:"há 3h" }],
      visibility: "private",
      invitePolicy: "owner",
    },
    {
      id: "t3",
      name: "Web",
      org: "SynthLabs",
      tags: ["frontend","react"],
      projects: ["site","dashboard","design-system"],
      updated: "09/10/2025 17:10",
      updatedEpoch: 1760019000,
      archived: false,
      members: [
        { id:"u6", name:"Fernanda S.", email:"fernanda@synthlabs.io", role:"Admin", joined:"2025-02-14", avatar:"https://i.pravatar.cc/64?img=6" },
        { id:"u7", name:"Guilherme P.", email:"guilherme@synthlabs.io", role:"Viewer", joined:"2025-07-30", avatar:"https://i.pravatar.cc/64?img=7" },
      ],
      oncall: [],
      tokens: [],
      activity: [],
      visibility: "public",
      invitePolicy: "qualquer dev",
    },
  ],
};

export default data;
