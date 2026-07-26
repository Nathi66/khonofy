# Folder Structure

```
khonofy/                 # Application package (repo root of this app)
├── .kiro/               # AEOS (constitution, specs, skills, …)
├── .cursor/             # Cursor rules + thin skill loaders
├── src/                 # React frontend
│   ├── api/             # Client facade
│   ├── components/      # UI, layout, dashboards
│   ├── hooks/
│   ├── lib/             # Auth context, utils, query client
│   ├── pages/           # Route pages
│   └── utils/
├── backend/             # Express + Prisma API
│   ├── prisma/          # schema, seed
│   └── src/             # index, lib, config
├── base44/              # Entity defs & reminder cloud functions
├── AGENTS.md
├── Khonofy.md           # Human index → .kiro/specs
└── package.json
```
