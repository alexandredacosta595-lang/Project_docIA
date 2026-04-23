import { Menu, Search, Bell, HelpCircle, ChevronRight, CloudOff, Cloud } from 'lucide-react';
import { useLocation } from 'react-router';

const pageInfo: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Painel de Controlo', subtitle: 'Visão geral do sistema' },
  '/documentos': { title: 'Documentos', subtitle: 'Arquivo central · Classificação SAP/PGC-A' },
  '/analise': { title: 'Análise de Documentos', subtitle: 'Análise inteligente com IA' },
  '/chat': { title: 'Chat IA (RAG)', subtitle: 'Consulta assistida por IA · Documentos financeiros' },
  '/relatorios': { title: 'Relatórios Financeiros', subtitle: 'Geração e exportação de relatórios' },
  '/reconciliacao': { title: 'Reconciliação Financeira', subtitle: 'Confronto bancário vs. contabilidade' },
};

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { pathname } = useLocation();
  const info = pageInfo[pathname] ?? { title: 'DocFlow', subtitle: '' };

  return (
    <div
      className="flex items-center gap-3 px-4 shrink-0"
      style={{ height: '48px', backgroundColor: 'white', borderBottom: '1px solid #edebe9' }}
    >
      {/* Hamburger mobile */}
      <button
        className="lg:hidden p-1.5 rounded hover:bg-[#f3f2f1] transition-colors"
        onClick={onMenuClick}
        aria-label="Menu"
      >
        <Menu size={18} color="#323130" />
      </button>

      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2">
        <span style={{ fontSize: '12px', color: '#605e5c' }}>DocFlow</span>
        <ChevronRight size={12} color="#a19f9d" />
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#323130' }}>{info.title}</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-4">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#a19f9d' }} />
          <input
            type="text"
            placeholder="Pesquisar documentos, análises..."
            className="w-full rounded focus:outline-none transition-colors"
            style={{
              fontSize: '13px',
              color: '#323130',
              backgroundColor: '#f3f2f1',
              border: '1px solid transparent',
              padding: '5px 10px 5px 30px',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#0078d4')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'transparent')}
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* SAP Connection indicator */}
      <div
        className="hidden lg:flex items-center gap-1.5 rounded px-2 py-1"
        style={{ backgroundColor: '#dff6dd', border: '1px solid #a9d18e' }}
        title="SAP Fiori conectado"
      >
        <Cloud size={11} color="#107c10" />
        <span style={{ fontSize: '10px', color: '#107c10', fontWeight: 600 }}>SAP · M365</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button
          className="relative p-2 rounded hover:bg-[#f3f2f1] transition-colors"
          aria-label="Notificações"
        >
          <Bell size={17} color="#605e5c" />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#d13438' }}
          />
        </button>
        <button
          className="p-2 rounded hover:bg-[#f3f2f1] transition-colors"
          aria-label="Ajuda"
        >
          <HelpCircle size={17} color="#605e5c" />
        </button>
        <div
          className="flex items-center justify-center rounded-full text-white ml-2 cursor-pointer"
          style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #0078d4, #005a9e)', fontSize: '11px', fontWeight: 700 }}
          title="Ana Santos"
        >
          AS
        </div>
      </div>
    </div>
  );
}
