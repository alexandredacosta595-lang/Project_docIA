import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  FolderOpen,
  ScanSearch,
  MessageSquare,
  BarChart3,
  FileText,
  X,
  Settings,
  LogOut,
  GitMerge,
  Cloud,
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Painel', end: true },
  { to: '/documentos', icon: FolderOpen, label: 'Documentos', end: false },
  { to: '/analise', icon: ScanSearch, label: 'Análise IA', end: false },
  { to: '/chat', icon: MessageSquare, label: 'Chat IA', end: false },
  { to: '/reconciliacao', icon: GitMerge, label: 'Reconciliação', end: false },
  { to: '/relatorios', icon: BarChart3, label: 'Relatórios', end: false },
];

const bottomItems = [
  { icon: Settings, label: 'Definições' },
  { icon: LogOut, label: 'Terminar Sessão' },
];

export function Sidebar({ onClose }: SidebarProps) {
  return (
    <div
      className="h-full bg-white flex flex-col"
      style={{ width: '220px', minWidth: '220px', borderRight: '1px solid #edebe9' }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{ height: '48px', borderBottom: '1px solid #edebe9' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded"
            style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, #0078d4 0%, #005a9e 100%)' }}
          >
            <FileText size={14} color="white" />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0078d4', letterSpacing: '-0.3px' }}>
            DocFlow
          </span>
        </div>
        <button
          className="lg:hidden rounded p-1 hover:bg-[#f3f2f1]"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <X size={16} color="#605e5c" />
        </button>
      </div>

      {/* M365 Integration badge */}
      <div
        className="mx-3 mt-2 mb-1 flex items-center gap-2 rounded px-2 py-1.5"
        style={{ backgroundColor: '#eff6fc', border: '1px solid #c7e0f4' }}
      >
        <Cloud size={11} color="#0078d4" />
        <span style={{ fontSize: '10px', color: '#0078d4', fontWeight: 600 }}>OneDrive · SAP integrado</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={{ textDecoration: 'none', display: 'block' }}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 py-2 transition-colors',
                isActive
                  ? 'bg-[#eff6fc] text-[#0078d4] border-l-[3px] border-[#0078d4] pl-[13px] pr-4'
                  : 'text-[#323130] border-l-[3px] border-transparent pl-[13px] pr-4 hover:bg-[#f3f2f1]',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} color={isActive ? '#0078d4' : '#605e5c'} />
                <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400 }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div style={{ borderTop: '1px solid #edebe9' }}>
        {bottomItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-3 w-full py-2 pl-4 pr-4 hover:bg-[#f3f2f1] transition-colors"
            style={{ fontSize: '13px', color: '#605e5c', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Icon size={16} color="#605e5c" />
            <span>{label}</span>
          </button>
        ))}

        {/* User profile */}
        <div className="flex items-center gap-3 p-4" style={{ borderTop: '1px solid #edebe9' }}>
          <div
            className="flex items-center justify-center rounded-full text-white shrink-0"
            style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #0078d4, #005a9e)', fontSize: '11px', fontWeight: 700 }}
          >
            AS
          </div>
          <div className="overflow-hidden">
            <div
              style={{ fontSize: '13px', fontWeight: 600, color: '#323130', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              Ana Santos
            </div>
            <div style={{ fontSize: '11px', color: '#605e5c' }}>Administradora · SAP FI</div>
          </div>
        </div>
      </div>
    </div>
  );
}
