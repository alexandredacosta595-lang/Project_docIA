You are a senior UI/UX engineer and design systems expert.

I am building a financial document management system called "DocFlow" for Angolan SMEs (small and medium enterprises). The users are accountants and financial managers who deal with invoices, receipts, bank statements, and financial reports daily.

## Tech stack
- Frontend: React + TypeScript + Vite
- Component library: Fluent UI React v9 (@fluentui/react-components)
- Routing: React Router v6
- State: Zustand
- Backend: FastAPI (Python)
- AI: Claude API via N8N workflows
- RAG: AnythingAI
- Database: PostgreSQL + pgvector

## Design system rules
Follow Microsoft 365 + SAP Fiori design principles:
- High information density (SAP style): compact tables, lots of visible data
- Fixed left sidebar navigation (M365 style): icons + labels, never top-nav
- Neutral color palette: white surfaces, #0078d4 as primary accent (Microsoft blue)
- Typography: Segoe UI / system-ui, 14px base, 12px for secondary info
- Spacing scale: 4px base unit (4, 8, 12, 16, 24, 32, 48)
- Border radius: 4px for inputs/cards, 2px for tags/badges
- Shadows: very subtle, 1px borders preferred over elevation

## Application pages to build
1. **Dashboard** — KPI cards (total docs, pending analysis, reconciled, alerts), recent documents table, quick upload button
2. **Documents** — filterable DataGrid with columns: name, type, date, status, amount, actions. Bulk select. Upload drag-and-drop zone at top.
3. **Analysis** — document detail view: metadata panel left, AI analysis panel right (summary, keywords, tone, signatory, confidentiality level), original document preview center
4. **Chat (RAG)** — split layout: document list left, chat interface right with message bubbles and source citations below each answer
5. **Reports** — financial map generation page with date range picker and export options

## Component requirements
- Use ONLY Fluent UI v9 components (no MUI, no Chakra, no custom CSS frameworks)
- Every table must use DataGrid from @fluentui/react-components
- All forms use Field + Input/Select from Fluent UI
- Navigation uses NavDrawer or Nav component
- Icons from @fluentui/react-icons (24px regular weight)
- All components must be responsive (collapse sidebar on <1024px)
- Dark mode support using FluentProvider theme switching

## File structure to follow
src/
├── app/ (App.tsx, theme.ts, router.tsx)
├── components/
│   ├── shell/ (AppShell.tsx, Sidebar.tsx, TopBar.tsx)
│   ├── documents/ (DocumentTable.tsx, UploadZone.tsx, DocumentCard.tsx)
│   ├── analysis/ (MetadataPanel.tsx, AIAnalysisPanel.tsx, DocumentPreview.tsx)
│   └── chat/ (ChatWindow.tsx, MessageBubble.tsx, SourceCitation.tsx)
├── pages/ (Dashboard.tsx, Documents.tsx, Analysis.tsx, Chat.tsx, Reports.tsx)
├── services/ (api.ts, documentService.ts, chatService.ts)
├── store/ (useDocStore.ts, useUIStore.ts)
└── types/ (document.ts, analysis.ts, chat.ts)

## TypeScript types to define first
```typescript
type DocumentStatus = 'pending' | 'processing' | 'analyzed' | 'error';
type DocumentType = 'invoice' | 'receipt' | 'bank_statement' | 'report' | 'contract' | 'other';
type ConfidentialityLevel = 'public' | 'internal' | 'confidential' | 'restricted';

interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  uploadedAt: string;
  uploadedBy: string;
  fileSize: number;
  pageCount: number;
  amount?: number;
  currency?: string;
  analysisId?: string;
}

interface DocumentAnalysis {
  id: string;
  documentId: string;
  summary: string;
  keywords: string[];
  tone: string;
  signatory: string;
  subject: string;
  confidentiality: ConfidentialityLevel;
  language: string;
  analyzedAt: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources: DocumentSource[];
  createdAt: string;
}

interface DocumentSource {
  documentId: string;
  documentName: string;
  excerpt: string;
  relevanceScore: number;
}
```

## Task — build in this order:
1. First, create all TypeScript types in src/types/
2. Create the theme.ts with Microsoft blue brand tokens for Fluent UI
3. Build AppShell.tsx with the fixed sidebar (NavDrawer) and main content area
4. Build the Sidebar.tsx with navigation items: Dashboard, Documents, Analysis, Chat, Reports — use DocumentFolder24Regular, Home24Regular, DataArea24Regular, Chat24Regular, DocumentTable24Regular icons
5. Build Dashboard.tsx with 4 KPI cards and a recent documents DataGrid (use mock data)
6. Build Documents.tsx with full DataGrid, column filters, status badges, and UploadZone
7. Build Analysis.tsx as a three-panel layout
8. Build Chat.tsx as a split layout with RAG interface

For each component:
- Write complete, working TypeScript code
- No TODOs, no placeholders — real implementations
- Add JSDoc comments on all props interfaces
- Use Fluent UI tokens for all colors/spacing (never hardcode hex values)
- Handle loading, empty, and error states

Start with step 1. After each step, confirm and wait for me to say "next" before continuing.