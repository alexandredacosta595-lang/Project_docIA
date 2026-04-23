import { createBrowserRouter } from 'react-router';
import { AppShell } from './components/shell/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Documents } from './pages/Documents';
import { Analysis } from './pages/Analysis';
import { Chat } from './pages/Chat';
import { Reports } from './pages/Reports';
import { Reconciliation } from './pages/Reconciliation';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
      <span style={{ fontSize: '40px' }}>📄</span>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#323130' }}>Página não encontrada</h2>
      <p style={{ fontSize: '14px', color: '#605e5c' }}>
        A página que procura não existe ou foi removida.
      </p>
      <a
        href="/"
        style={{ fontSize: '14px', color: '#0078d4', textDecoration: 'none', fontWeight: 500 }}
      >
        Voltar ao Painel →
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppShell,
    children: [
      { index: true, Component: Dashboard },
      { path: 'documentos', Component: Documents },
      { path: 'analise', Component: Analysis },
      { path: 'chat', Component: Chat },
      { path: 'relatorios', Component: Reports },
      { path: 'reconciliacao', Component: Reconciliation },
      { path: '*', Component: NotFound },
    ],
  },
]);
