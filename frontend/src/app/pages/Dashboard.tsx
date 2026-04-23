import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  GitMerge,
  Cpu,
  Cloud,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { mockDocuments, monthlyChartData, docTypeData, sapClassData } from '../mockData';
import { formatCurrency, formatDate, getTypeName } from '../utils';
import { StatusBadge } from '../components/StatusBadge';
import { useNavigate } from 'react-router';

const total = mockDocuments.length;
const pending = mockDocuments.filter((d) => d.status === 'pendente').length;
const analyzed = mockDocuments.filter((d) => d.status === 'analisado').length;
const errors = mockDocuments.filter((d) => d.status === 'erro').length;
const reconciled = mockDocuments.filter((d) => d.reconciliation?.status === 'conciliado').length;
const divergent = mockDocuments.filter((d) => d.reconciliation?.status === 'divergencia').length;
const sapClassified = mockDocuments.filter((d) => d.sapCategory && d.sapCategory !== 'OTHER').length;
const recentDocs = [...mockDocuments].slice(0, 6);

const totalAmount = mockDocuments.reduce((s, d) => s + (d.amount ?? 0), 0);

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  change: string;
  positive: boolean;
  onClick?: () => void;
}

function KPICard({ title, value, icon: Icon, iconColor, iconBg, change, positive, onClick }: KPICardProps) {
  return (
    <div
      className="bg-white rounded p-4 transition-shadow hover:shadow-sm cursor-pointer"
      style={{ border: '1px solid #edebe9' }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="flex items-center justify-center rounded"
          style={{ width: '36px', height: '36px', backgroundColor: iconBg }}
        >
          <Icon size={18} color={iconColor} />
        </div>
        <div className="flex items-center gap-1">
          {positive ? (
            <TrendingUp size={12} color="#107c10" />
          ) : (
            <TrendingDown size={12} color="#d13438" />
          )}
          <span style={{ fontSize: '11px', color: positive ? '#107c10' : '#d13438', fontWeight: 500 }}>
            {change}
          </span>
        </div>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 700, color: '#323130', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '12px', color: '#605e5c', marginTop: '4px' }}>{title}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded shadow-sm p-3" style={{ border: '1px solid #edebe9', fontSize: '12px' }}>
        <p style={{ fontWeight: 600, color: '#323130', marginBottom: '4px' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Quick action tile
function QuickAction({
  icon: Icon,
  label,
  sub,
  color,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  sub: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full rounded p-3 text-left transition-colors hover:bg-[#f3f2f1]"
      style={{ border: '1px solid #edebe9', background: 'white', cursor: 'pointer' }}
    >
      <div
        className="flex items-center justify-center rounded shrink-0"
        style={{ width: '34px', height: '34px', backgroundColor: `${color}18` }}
      >
        <Icon size={16} color={color} />
      </div>
      <div className="overflow-hidden">
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#323130' }}>{label}</div>
        <div style={{ fontSize: '11px', color: '#605e5c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>
      </div>
      <ArrowRight size={14} color="#a19f9d" className="ml-auto shrink-0" />
    </button>
  );
}

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#323130', margin: 0 }}>
            Painel de Controlo
          </h1>
          <p style={{ fontSize: '12px', color: '#605e5c', marginTop: '2px' }}>
            DocFlow · Sistema de Gestão Financeira · SAP Fiori + M365 · 18 de Abril, 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/reconciliacao')}
            className="flex items-center gap-2 rounded hover:bg-[#f3f2f1] transition-colors"
            style={{
              backgroundColor: 'white',
              color: '#323130',
              fontSize: '13px',
              fontWeight: 500,
              padding: '7px 14px',
              border: '1px solid #edebe9',
              cursor: 'pointer',
            }}
          >
            <GitMerge size={14} />
            Reconciliar
          </button>
          <button
            onClick={() => navigate('/documentos')}
            className="flex items-center gap-2 rounded hover:opacity-90 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #0078d4, #005a9e)',
              color: 'white',
              fontSize: '13px',
              fontWeight: 500,
              padding: '7px 14px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Upload size={14} />
            Enviar Documento
          </button>
        </div>
      </div>

      {/* KPI Cards — 6 across */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <KPICard
          title="Total Documentos"
          value={total}
          icon={FileText}
          iconColor="#0078d4"
          iconBg="#eff6fc"
          change="+12% mês"
          positive
          onClick={() => navigate('/documentos')}
        />
        <KPICard
          title="Pendentes"
          value={pending}
          icon={Clock}
          iconColor="#835b00"
          iconBg="#fff4ce"
          change="+3 hoje"
          positive={false}
          onClick={() => navigate('/documentos')}
        />
        <KPICard
          title="Analisados IA"
          value={analyzed}
          icon={Cpu}
          iconColor="#107c10"
          iconBg="#dff6dd"
          change="+8% mês"
          positive
          onClick={() => navigate('/analise')}
        />
        <KPICard
          title="Classif. SAP"
          value={sapClassified}
          icon={CheckCircle2}
          iconColor="#0078d4"
          iconBg="#eff6fc"
          change="automático"
          positive
        />
        <KPICard
          title="Reconciliados"
          value={reconciled}
          icon={GitMerge}
          iconColor="#107c10"
          iconBg="#dff6dd"
          change={`${divergent} diver.`}
          positive={divergent === 0}
          onClick={() => navigate('/reconciliacao')}
        />
        <KPICard
          title="Erros / Alertas"
          value={errors}
          icon={AlertTriangle}
          iconColor="#d13438"
          iconBg="#fde7e9"
          change="1 novo"
          positive={false}
        />
      </div>

      {/* Value highlight */}
      <div
        className="rounded p-4 flex items-center gap-6 flex-wrap"
        style={{
          background: 'linear-gradient(135deg, #0078d4 0%, #005a9e 100%)',
          color: 'white',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Valor Total Gerido
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.2 }}>
            AOA {(totalAmount / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>
            {total} documentos · {analyzed} analisados
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap ml-auto">
          {[
            { label: 'Faturas', value: mockDocuments.filter((d) => d.type === 'fatura').length, sub: 'documentos' },
            { label: 'Extratos', value: mockDocuments.filter((d) => d.type === 'extrato_bancario').length, sub: 'documentos' },
            { label: 'Taxa Conc.', value: `${Math.round((reconciled / total) * 100)}%`, sub: 'reconciliação' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="text-center" style={{ opacity: 0.9 }}>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>{value}</div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>{label}</div>
              <div style={{ fontSize: '9px', opacity: 0.6 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded" style={{ border: '1px solid #edebe9', padding: '16px' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#323130', margin: 0 }}>
              Documentos por Mês
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#0078d4' }} />
                <span style={{ fontSize: '11px', color: '#605e5c' }}>Total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#71afe5' }} />
                <span style={{ fontSize: '11px', color: '#605e5c' }}>Analisados</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={monthlyChartData} barGap={4} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#edebe9" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#605e5c' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#605e5c' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="documentos" fill="#0078d4" radius={[2, 2, 0, 0]} name="Total" />
              <Bar dataKey="analisados" fill="#71afe5" radius={[2, 2, 0, 0]} name="Analisados" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SAP class donut */}
        <div className="bg-white rounded" style={{ border: '1px solid #edebe9', padding: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#323130', marginBottom: '4px' }}>
            Distribuição PGC-A
          </h3>
          <p style={{ fontSize: '10px', color: '#a19f9d', marginBottom: '8px' }}>Por classe de conta SAP</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie
                data={sapClassData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={58}
                dataKey="value"
                paddingAngle={2}
              >
                {sapClassData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: '12px', borderColor: '#edebe9' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {sapClassData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: entry.color }} />
                <span style={{ fontSize: '10px', color: '#605e5c', flex: 1 }}>{entry.name}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#323130' }}>{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Quick Actions + Recent Docs */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
        {/* Quick actions */}
        <div className="space-y-2">
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Acções Rápidas
          </h3>
          <QuickAction
            icon={Upload}
            label="Enviar Documento"
            sub="Classificação SAP automática"
            color="#0078d4"
            onClick={() => navigate('/documentos')}
          />
          <QuickAction
            icon={GitMerge}
            label="Reconciliar"
            sub={`${divergent} divergência(s) pendente(s)`}
            color={divergent > 0 ? '#d13438' : '#107c10'}
            onClick={() => navigate('/reconciliacao')}
          />
          <QuickAction
            icon={Cpu}
            label="Análise IA"
            sub={`${pending} docs por analisar`}
            color="#835b00"
            onClick={() => navigate('/analise')}
          />
          <QuickAction
            icon={Cloud}
            label="Sincronizar M365"
            sub="OneDrive · Outlook · Teams"
            color="#8764b8"
            onClick={() => {}}
          />
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded" style={{ border: '1px solid #edebe9' }}>
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid #edebe9' }}
          >
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#323130' }}>
              Documentos Recentes
            </h3>
            <button
              onClick={() => navigate('/documentos')}
              style={{
                fontSize: '12px',
                color: '#0078d4',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Ver todos →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#faf9f8', borderBottom: '1px solid #edebe9' }}>
                  {['Documento', 'Tipo', 'Data', 'Estado', 'Valor', 'Reconcil.', ''].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2"
                      style={{ fontSize: '11px', fontWeight: 600, color: '#605e5c', whiteSpace: 'nowrap' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-[#f3f2f1] transition-colors"
                    style={{ borderBottom: '1px solid #f3f2f1' }}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <FileText size={13} color="#0078d4" />
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#323130',
                            maxWidth: '180px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          }}
                          title={doc.name}
                        >
                          {doc.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span style={{ fontSize: '11px', color: '#605e5c' }}>{getTypeName(doc.type)}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span style={{ fontSize: '11px', color: '#605e5c', whiteSpace: 'nowrap' }}>
                        {formatDate(doc.uploadedAt)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <span style={{ fontSize: '11px', color: '#323130', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                        {doc.amount ? formatCurrency(doc.amount, doc.currency) : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {doc.reconciliation && (
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            fontWeight: 600,
                            backgroundColor:
                              doc.reconciliation.status === 'conciliado'
                                ? '#dff6dd'
                                : doc.reconciliation.status === 'divergencia'
                                ? '#fff4ce'
                                : '#f3f2f1',
                            color:
                              doc.reconciliation.status === 'conciliado'
                                ? '#107c10'
                                : doc.reconciliation.status === 'divergencia'
                                ? '#835b00'
                                : '#605e5c',
                          }}
                        >
                          {doc.reconciliation.status === 'conciliado'
                            ? '✓ Conc.'
                            : doc.reconciliation.status === 'divergencia'
                            ? '▲ Div.'
                            : '○ Pend.'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate('/analise')}
                          className="p-1 rounded hover:bg-[#edebe9]"
                          title="Ver análise"
                        >
                          <Eye size={12} color="#605e5c" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#edebe9]" title="Descarregar">
                          <Download size={12} color="#605e5c" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
