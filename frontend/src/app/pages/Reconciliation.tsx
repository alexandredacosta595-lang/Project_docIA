import { useState, useMemo } from 'react';
import {
  GitMerge,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  RefreshCw,
  FileText,
  ArrowLeftRight,
  Filter,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { mockReconciliationItems } from '../mockData';
import { formatCurrency, formatDate, getTypeName } from '../utils';
import type { ReconciliationItem } from '../types/document';

type ReconStatus = 'all' | 'matched' | 'unmatched' | 'partial';

function StatusPill({ status }: { status: ReconciliationItem['status'] }) {
  const map = {
    matched: { label: 'Conciliado', bg: '#dff6dd', text: '#107c10', icon: CheckCircle2 },
    unmatched: { label: 'Sem Correspondência', bg: '#fde7e9', text: '#d13438', icon: XCircle },
    partial: { label: 'Divergência', bg: '#fff4ce', text: '#835b00', icon: AlertTriangle },
    adjusted: { label: 'Ajustado', bg: '#eff6fc', text: '#0078d4', icon: Info },
  };
  const cfg = map[status] ?? map.matched;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 rounded"
      style={{ fontSize: '11px', backgroundColor: cfg.bg, color: cfg.text, padding: '2px 8px', fontWeight: 600, whiteSpace: 'nowrap' }}
    >
      <Icon size={10} />
      {cfg.label}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded shadow-sm p-3" style={{ border: '1px solid #edebe9', fontSize: '12px' }}>
        <p style={{ fontWeight: 600, color: '#323130', marginBottom: '4px' }}>{label} 2024</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>AOA {p.value.toFixed(1)}M</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Reconciliation() {
  const [filter, setFilter] = useState<ReconStatus>('all');
  const [search, setSearch] = useState('');
  const [running, setRunning] = useState(false);
  const [lastRun] = useState('18/04/2026 às 20:00');

  const items = useMemo(
    () =>
      mockReconciliationItems.filter((item) => {
        const matchStatus = filter === 'all' || item.status === filter;
        const matchSearch =
          !search ||
          item.documentName.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
      }),
    [filter, search]
  );

  const stats = useMemo(() => {
    const all = mockReconciliationItems;
    const matched = all.filter((i) => i.status === 'matched').length;
    const unmatched = all.filter((i) => i.status === 'unmatched').length;
    const partial = all.filter((i) => i.status === 'partial').length;
    const totalVariance = all.reduce((s, i) => s + Math.abs(i.variance), 0);
    const totalBook = all.reduce((s, i) => s + i.bookAmount, 0);
    const totalBank = all.reduce((s, i) => s + i.bankAmount, 0);
    return { matched, unmatched, partial, totalVariance, totalBook, totalBank, total: all.length };
  }, []);

  const chartData = [
    { name: 'Jan', livros: 18.5, banco: 18.5 },
    { name: 'Fev', livros: 24.3, banco: 24.26 },
    { name: 'Mar', livros: 31.2, banco: 31.08 },
  ];

  const handleRunReconciliation = async () => {
    setRunning(true);
    await new Promise((r) => setTimeout(r, 2000));
    setRunning(false);
  };

  const filterBtns: { val: ReconStatus; label: string; color: string }[] = [
    { val: 'all', label: `Todos (${stats.total})`, color: '#605e5c' },
    { val: 'matched', label: `Conciliados (${stats.matched})`, color: '#107c10' },
    { val: 'partial', label: `Divergências (${stats.partial})`, color: '#835b00' },
    { val: 'unmatched', label: `Sem Corresp. (${stats.unmatched})`, color: '#d13438' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#323130', margin: 0 }}>
            Reconciliação Financeira
          </h1>
          <p style={{ fontSize: '12px', color: '#605e5c', marginTop: '2px' }}>
            Confronto bancário vs. contabilidade · PGC-A Angola · Última execução: {lastRun}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 rounded px-3 py-2 hover:bg-[#f3f2f1] transition-colors"
            style={{ fontSize: '12px', color: '#605e5c', border: '1px solid #edebe9', background: 'white', cursor: 'pointer' }}
          >
            <Download size={13} />
            Exportar
          </button>
          <button
            onClick={handleRunReconciliation}
            disabled={running}
            className="flex items-center gap-2 rounded hover:opacity-90 transition-opacity"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: '#0078d4',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            {running ? <RefreshCw size={14} className="animate-spin" /> : <GitMerge size={14} />}
            {running ? 'A Reconciliar...' : 'Executar Reconciliação'}
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Saldo Livros',
            value: formatCurrency(stats.totalBook, 'AOA'),
            sub: 'Total contabilístico',
            icon: TrendingUp,
            iconColor: '#0078d4',
            iconBg: '#eff6fc',
          },
          {
            label: 'Saldo Bancário',
            value: formatCurrency(stats.totalBank, 'AOA'),
            sub: 'Total extractos',
            icon: ArrowLeftRight,
            iconColor: '#107c10',
            iconBg: '#dff6dd',
          },
          {
            label: 'Divergências',
            value: formatCurrency(stats.totalVariance, 'AOA'),
            sub: `${stats.partial + stats.unmatched} item(s) com variação`,
            icon: AlertTriangle,
            iconColor: stats.totalVariance > 0 ? '#d13438' : '#107c10',
            iconBg: stats.totalVariance > 0 ? '#fde7e9' : '#dff6dd',
          },
          {
            label: 'Taxa Conciliação',
            value: `${Math.round((stats.matched / stats.total) * 100)}%`,
            sub: `${stats.matched} de ${stats.total} itens`,
            icon: CheckCircle2,
            iconColor: '#107c10',
            iconBg: '#dff6dd',
          },
        ].map(({ label, value, sub, icon: Icon, iconColor, iconBg }) => (
          <div key={label} className="bg-white rounded p-4" style={{ border: '1px solid #edebe9' }}>
            <div className="flex items-start justify-between mb-3">
              <div
                className="flex items-center justify-center rounded"
                style={{ width: '36px', height: '36px', backgroundColor: iconBg }}
              >
                <Icon size={18} color={iconColor} />
              </div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#323130', lineHeight: 1.2 }}>{value}</div>
            <div style={{ fontSize: '12px', color: '#605e5c', marginTop: '2px' }}>{label}</div>
            <div style={{ fontSize: '10px', color: '#a19f9d', marginTop: '1px' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Chart + status overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded p-4" style={{ border: '1px solid #edebe9' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#323130', margin: 0 }}>
              Confronto: Livros vs. Banco (AOA)
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#0078d4' }} />
                <span style={{ fontSize: '11px', color: '#605e5c' }}>Livros</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#71afe5' }} />
                <span style={{ fontSize: '11px', color: '#605e5c' }}>Banco</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={chartData} barGap={4} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#edebe9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#605e5c' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#605e5c' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}M`}
                domain={[0, 40]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="livros" fill="#0078d4" radius={[2, 2, 0, 0]} name="Livros" />
              <Bar dataKey="banco" fill="#71afe5" radius={[2, 2, 0, 0]} name="Banco" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status breakdown */}
        <div className="bg-white rounded p-4" style={{ border: '1px solid #edebe9' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#323130', marginBottom: '16px' }}>
            Estado da Reconciliação
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Conciliados', count: stats.matched, color: '#107c10', bg: '#dff6dd', pct: Math.round((stats.matched / stats.total) * 100) },
              { label: 'Divergências', count: stats.partial, color: '#835b00', bg: '#fff4ce', pct: Math.round((stats.partial / stats.total) * 100) },
              { label: 'Sem Correspondência', count: stats.unmatched, color: '#d13438', bg: '#fde7e9', pct: Math.round((stats.unmatched / stats.total) * 100) },
            ].map(({ label, count, color, bg, pct }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: '12px', color: '#323130' }}>{label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color }}>{count} ({pct}%)</span>
                </div>
                <div className="w-full rounded-full" style={{ height: '6px', backgroundColor: '#f3f2f1' }}>
                  <div
                    className="rounded-full transition-all"
                    style={{ height: '6px', width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* PGC-A note */}
          <div
            className="mt-4 rounded p-3"
            style={{ backgroundColor: '#eff6fc', border: '1px solid #c7e0f4' }}
          >
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#0078d4', marginBottom: '3px' }}>
              Norma PGC-A
            </div>
            <p style={{ fontSize: '10px', color: '#0078d4', lineHeight: 1.5 }}>
              Reconciliações com divergência superior a AOA 50.000 requerem aprovação do Director Financeiro conforme Art. 18 do PGC-A.
            </p>
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="bg-white rounded" style={{ border: '1px solid #edebe9' }}>
        {/* Table header bar */}
        <div
          className="flex flex-wrap items-center gap-3 px-4 py-3"
          style={{ borderBottom: '1px solid #edebe9', backgroundColor: '#faf9f8' }}
        >
          {/* Filter buttons */}
          <div className="flex items-center gap-1 flex-wrap">
            {filterBtns.map(({ val, label, color }) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                style={{
                  fontSize: '11px',
                  fontWeight: filter === val ? 700 : 400,
                  color: filter === val ? color : '#605e5c',
                  backgroundColor: filter === val ? `${color}18` : 'white',
                  border: `1px solid ${filter === val ? color : '#edebe9'}`,
                  borderRadius: '4px',
                  padding: '3px 10px',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#a19f9d' }} />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded"
              style={{
                fontSize: '12px',
                border: '1px solid #edebe9',
                padding: '5px 8px 5px 26px',
                outline: 'none',
                width: '180px',
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#faf9f8', borderBottom: '1px solid #edebe9' }}>
                {['Documento', 'Tipo', 'Data', 'Valor Livros', 'Valor Banco', 'Variação', 'Estado', 'Acções'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5"
                    style={{ fontSize: '11px', fontWeight: 600, color: '#605e5c', whiteSpace: 'nowrap' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#f3f2f1] transition-colors"
                  style={{ borderBottom: '1px solid #f3f2f1' }}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <FileText size={13} color="#0078d4" />
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#323130',
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block',
                        }}
                        title={item.documentName}
                      >
                        {item.documentName}
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#a19f9d', paddingLeft: '21px', marginTop: '1px' }}>
                      {item.description}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className="inline-block rounded"
                      style={{ fontSize: '10px', color: '#605e5c', backgroundColor: '#f3f2f1', padding: '2px 6px', whiteSpace: 'nowrap' }}
                    >
                      {getTypeName(item.documentType)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span style={{ fontSize: '11px', color: '#605e5c', whiteSpace: 'nowrap' }}>
                      {formatDate(item.date)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span style={{ fontSize: '12px', color: '#323130', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                      {formatCurrency(item.bookAmount)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span style={{ fontSize: '12px', color: '#323130', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                      {item.bankAmount > 0 ? formatCurrency(item.bankAmount) : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                        color: item.variance === 0 ? '#107c10' : '#d13438',
                      }}
                    >
                      {item.variance === 0 ? '✓ 0' : `▲ ${formatCurrency(Math.abs(item.variance))}`}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusPill status={item.status} />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      {item.status !== 'matched' && (
                        <button
                          className="rounded px-2 py-1 hover:opacity-80 transition-opacity"
                          style={{ fontSize: '10px', backgroundColor: '#0078d4', color: 'white', border: 'none', cursor: 'pointer' }}
                          title="Ajustar"
                        >
                          Ajustar
                        </button>
                      )}
                      <button
                        className="p-1.5 rounded hover:bg-[#edebe9]"
                        title="Detalhes"
                      >
                        <ArrowLeftRight size={12} color="#605e5c" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderTop: '1px solid #edebe9' }}
        >
          <span style={{ fontSize: '12px', color: '#605e5c' }}>
            {items.length} de {mockReconciliationItems.length} itens
          </span>
          <span style={{ fontSize: '11px', color: '#a19f9d' }}>
            Reconciliação automática via SAP FI · PGC-A Angola
          </span>
        </div>
      </div>
    </div>
  );
}
