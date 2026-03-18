# GoldenNet EDMS — نظام إدارة الوثائق

Arabic RTL Document Management System UI for Al-Qabas College (كلية القبس الأهلية).

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 + Cairo font |
| Backend API | Alfresco Community Edition REST API |
| Auth | Alfresco ticket-based authentication |
| UI Components | Radix UI + shadcn/ui |
| Charts | Recharts |
| Routing | Wouter |

## Running

| Service | URL |
|---------|-----|
| UI (Vite dev server) | http://localhost:5173 |
| Alfresco CE | http://localhost:8080 |

```bash
# Install dependencies
npm install --ignore-scripts

# Start dev server
npm run dev

# Build for production
npm run build
```

## Architecture

```
artifacts/goldennet-edms/
├── index.html              # Entry point (Arabic RTL)
├── vite.config.ts          # Vite config with /alfresco proxy
└── src/
    ├── services/
    │   └── alfrescoApi.ts  # Alfresco REST API client
    ├── hooks/
    │   ├── use-auth.ts     # Authentication hook
    │   └── use-documents.ts # Document CRUD hook
    ├── pages/
    │   ├── login.tsx       # Login page
    │   ├── dashboard.tsx   # Dashboard with KPIs + charts
    │   ├── library.tsx     # Document library grid
    │   ├── upload.tsx      # Document upload form
    │   ├── incoming.tsx    # Incoming correspondence
    │   ├── outgoing.tsx    # Outgoing correspondence
    │   ├── workflow.tsx    # Workflow management
    │   └── settings.tsx    # System settings
    └── components/         # Reusable UI components
```

## Alfresco API Integration

- **Auth:** `POST /alfresco/api/-default-/public/authentication/versions/1/tickets`
- **List nodes:** `GET /alfresco/api/-default-/public/alfresco/versions/1/nodes/{id}/children`
- **Upload:** `POST /alfresco/api/-default-/public/alfresco/versions/1/nodes/{id}/children` (multipart)
- **Search:** `POST /alfresco/api/-default-/public/search/versions/1/search` (AFTS query)
- **Metadata:** `GET/PUT /alfresco/api/-default-/public/alfresco/versions/1/nodes/{id}`

All requests authenticated via `?alf_ticket={token}` query parameter.

## Custom Content Type

```
qabas:MorasalaRasmiya (Formal Correspondence)
```

## Mock Fallback

If Alfresco CE is unreachable, the app falls back to mock data:
- Login: `admin` / `admin` works offline
- Dashboard and library show sample Arabic documents
