import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  FileBarChart,
  Calendar,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  FileText,
} from 'lucide-react';
import { reportCashFlowData } from '../mockData';
import { formatCurrency } from '../utils';

const reportTypes = [
  { value: 'fluxo_caixa', label: 'Fluxo de Caixa', description: 'Movimentos de entradas e saídas de caixa' },
  { value: 'balanco', label: 'Balanço Patrimonial', description: 'Activos, passivos e capital próprio' },
  { value: 'dre', label: 'Demonstração de Resultados', description: 'Receitas, custos e resultado líquido' },
  { value: 'reconciliacao', label: 'Reconciliação Bancária', description: 'Confronto saldo bancário vs. contabilidade' },
];

const summaryRows = [
  { descricao: 'Receitas Operacionais', jul: 14200000, ago: 17100000, set: 16300000, out: 19800000, nov: 23500000, dez: 26800000 },
  { descricao: 'Prestação de Serviços', jul: 4300000, ago: 3900000, set: 3500000, out: 4700000, nov: 4500000, dez: 5200000 },
  { descricao: 'Outros Rendimentos', jul: 0, ago: 0, set: 0, out: 0, nov: 0, dez: 0 },
  { descricao: 'Custos de Pessoal', jul: -5200000, ago: -5200000, set: -5200000, out: -5200000, nov: -5200000, dez: -5200000 },
  { descricao: 'Fornecedores e Serviços', jul: -4100000, ago: -5800000, set: -4700000, out: -6600000, nov: -8700000, dez: -12100000 },
  { descricao: 'Outros Custos', jul: -3000000, ago: -3200000, set: -3200000, out: -4000000, nov: -4300000, dez: -5200000 },
];

const months = ['jul', 'ago', 'set', 'out', 'nov', 'dez'];
const monthLabels: Record<string, string> = { jul: 'Jul', ago: 'Ago', set: 'Set', out: 'Out', nov: 'Nov', dez: 'Dez' };

function formatVal(v: number) {
  if (v === 0) return '—';
  const abs = Math.abs(v);
  const formatted = abs >= 1000000 ? `${(abs / 1000000).toFixed(1)}M` : `${(abs / 1000).toFixed(0)}K`;
  return `${v < 0 ? '-' : ''}${formatted}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded shadow-sm p-3" style={{ border: '1px solid #edebe9', fontSize: '12px' }}>
        <p style={{ fontWeight: 600, color: '#323130', marginBottom: '6px' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color, margin: '2px 0' }}>
            {p.name}: <strong>AOA {p.value.toLocaleString('pt-PT')}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Reports() {
  const [reportType, setReportType] = useState('fluxo_caixa');
  const [dateFrom, setDateFrom] = useState('2023-07-01');
  const [dateTo, setDateTo] = useState('2023-12-31');
  const [generated, setGenerated] = useState(true);
  const [loading, setLoading] = useState(false);

  const selectedReport = reportTypes.find((r) => r.value === reportType)!;

  const totalEntradas = reportCashFlowData.reduce((s, d) => s + d.entradas, 0);
  const totalSaidas = reportCashFlowData.reduce((s, d) => s + d.saidas, 0);
  const resultado = totalEntradas - totalSaidas;

  const generate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setGenerated(true);
    setLoading(false);
  };

  const inputStyle = {
    fontSize: '13px',
    color: '#323130',
    border: '1px solid #edebe9',
    borderRadius: '4px',
    padding: '7px 10px',
    outline: 'none',
    backgroundColor: 'white',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#323130', margin: 0 }}>
          Relatórios Financeiros
        </h1>
        <p style={{ fontSize: '12px', color: '#605e5c', marginTop: '2px' }}>
          Geração e exportação de mapas financeiros
        </p>
      </div>

      {/* Config panel */}
      <div className="bg-white rounded p-4" style={{ border: '1px solid #edebe9' }}>
        <div className="flex flex-wrap items-end gap-4">
          {/* Report type */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
              Tipo de Relatório
            </label>
            <select
              value={reportType}
              onChange={(e) => { setReportType(e.target.value); setGenerated(false); }}
              style={{ ...inputStyle, minWidth: '250px', cursor: 'pointer' }}
            >
              {reportTypes.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <p style={{ fontSize: '11px', color: '#a19f9d', marginTop: '3px' }}>{selectedReport.description}</p>
          </div>

          {/* Date from */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
              Data Início
            </label>
            <div className="flex items-center gap-1">
              <Calendar size={13} color="#605e5c" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setGenerated(false); }}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Date to */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
              Data Fim
            </label>
            <div className="flex items-center gap-1">
              <Calendar size={13} color="#605e5c" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setGenerated(false); }}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-2 rounded hover:opacity-90 transition-opacity"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: '#0078d4',
              color: 'white',
              border: 'none',
              padding: '9px 18px',
              cursor: 'pointer',
            }}
          >
            {loading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <FileBarChart size={14} />
            )}
            {loading ? 'A Gerar...' : 'Gerar Relatório'}
          </button>
        </div>
      </div>

      {/* Report output */}
      {generated && (
        <>
          {/* KPI summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded p-4" style={{ border: '1px solid #edebe9' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Total Entradas
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} color="#107c10" />
                <span style={{ fontSize: '22px', fontWeight: 700, color: '#107c10' }}>
                  {(totalEntradas / 1000000).toFixed(1)}M
                </span>
                <span style={{ fontSize: '12px', color: '#605e5c' }}>AOA</span>
              </div>
              <div style={{ fontSize: '11px', color: '#605e5c', marginTop: '4px' }}>
                Julho — Dezembro 2023
              </div>
            </div>

            <div className="bg-white rounded p-4" style={{ border: '1px solid #edebe9' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Total Saídas
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown size={18} color="#d13438" />
                <span style={{ fontSize: '22px', fontWeight: 700, color: '#d13438' }}>
                  {(totalSaidas / 1000000).toFixed(1)}M
                </span>
                <span style={{ fontSize: '12px', color: '#605e5c' }}>AOA</span>
              </div>
              <div style={{ fontSize: '11px', color: '#605e5c', marginTop: '4px' }}>
                Julho — Dezembro 2023
              </div>
            </div>

            <div className="bg-white rounded p-4" style={{ border: '1px solid #edebe9' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Resultado Líquido
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} color="#107c10" />
                <span style={{ fontSize: '22px', fontWeight: 700, color: '#107c10' }}>
                  +{(resultado / 1000000).toFixed(1)}M
                </span>
                <span style={{ fontSize: '12px', color: '#605e5c' }}>AOA</span>
              </div>
              <div style={{ fontSize: '11px', color: '#605e5c', marginTop: '4px' }}>
                Margem: {((resultado / totalEntradas) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded p-4" style={{ border: '1px solid #edebe9' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#323130', margin: 0 }}>
                {selectedReport.label} — Julho a Dezembro 2023
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#107c10' }} />
                  <span style={{ fontSize: '11px', color: '#605e5c' }}>Entradas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#d13438' }} />
                  <span style={{ fontSize: '11px', color: '#605e5c' }}>Saídas</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={reportCashFlowData} barGap={8} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#edebe9" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#605e5c' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#605e5c' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="entradas" fill="#107c10" radius={[2, 2, 0, 0]} name="Entradas" />
                <Bar dataKey="saidas" fill="#d13438" radius={[2, 2, 0, 0]} name="Saídas" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary table */}
          <div className="bg-white rounded" style={{ border: '1px solid #edebe9' }}>
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid #edebe9', backgroundColor: '#faf9f8' }}
            >
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#323130', margin: 0 }}>
                Mapa Detalhado (AOA '000)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1.5 rounded hover:opacity-90 px-3 py-1.5"
                  style={{ fontSize: '12px', backgroundColor: '#d13438', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  <Download size={12} />
                  Exportar PDF
                </button>
                <button
                  className="flex items-center gap-1.5 rounded hover:opacity-90 px-3 py-1.5"
                  style={{ fontSize: '12px', backgroundColor: '#107c10', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  <Download size={12} />
                  Exportar Excel
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#faf9f8', borderBottom: '1px solid #edebe9' }}>
                    <th className="text-left px-4 py-2.5" style={{ fontSize: '11px', fontWeight: 700, color: '#605e5c', minWidth: '200px' }}>
                      Descrição
                    </th>
                    {months.map((m) => (
                      <th
                        key={m}
                        className="text-right px-4 py-2.5"
                        style={{ fontSize: '11px', fontWeight: 700, color: '#605e5c', whiteSpace: 'nowrap' }}
                      >
                        {monthLabels[m]}
                      </th>
                    ))}
                    <th className="text-right px-4 py-2.5" style={{ fontSize: '11px', fontWeight: 700, color: '#323130', whiteSpace: 'nowrap' }}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {summaryRows.map((row, idx) => {
                    const total = months.reduce((s, m) => s + (row as any)[m], 0);
                    const isNegative = total < 0;
                    return (
                      <tr
                        key={idx}
                        className="hover:bg-[#f3f2f1] transition-colors"
                        style={{ borderBottom: '1px solid #f3f2f1' }}
                      >
                        <td className="px-4 py-2.5">
                          <span style={{ fontSize: '13px', color: '#323130' }}>{row.descricao}</span>
                        </td>
                        {months.map((m) => {
                          const v = (row as any)[m] as number;
                          return (
                            <td key={m} className="px-4 py-2.5 text-right">
                              <span
                                style={{
                                  fontSize: '12px',
                                  color: v < 0 ? '#d13438' : v > 0 ? '#323130' : '#a19f9d',
                                  fontVariantNumeric: 'tabular-nums',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {formatVal(v)}
                              </span>
                            </td>
                          );
                        })}
                        <td className="px-4 py-2.5 text-right">
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 700,
                              color: isNegative ? '#d13438' : '#107c10',
                              fontVariantNumeric: 'tabular-nums',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {formatVal(total)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {/* Total row */}
                  <tr style={{ backgroundColor: '#faf9f8', borderTop: '2px solid #edebe9' }}>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#323130' }}>RESULTADO TOTAL</span>
                    </td>
                    {months.map((m) => {
                      const v = summaryRows.reduce((s, r) => s + (r as any)[m], 0);
                      return (
                        <td key={m} className="px-4 py-3 text-right">
                          <span style={{ fontSize: '12px', fontWeight: 700, color: v >= 0 ? '#107c10' : '#d13438', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                            {formatVal(v)}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-right">
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#107c10', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                        {formatVal(summaryRows.reduce((s, r) => s + months.reduce((ss, m) => ss + (r as any)[m], 0), 0))}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}