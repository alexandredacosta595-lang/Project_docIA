import { useState, useCallback } from 'react';
import {
  Upload,
  Search,
  FileText,
  Eye,
  Download,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  CheckSquare,
  Tag,
  Cloud,
  GitMerge,
  AlertCircle,
  Cpu,
  ExternalLink,
} from 'lucide-react';
import { mockDocuments } from '../mockData';
import type { Document, DocumentStatus, DocumentType } from '../types/document';
import {
  formatCurrency,
  formatDate,
  formatFileSize,
  getTypeName,
  getSapCategoryLabel,
  getAccountClassName,
} from '../utils';
import { StatusBadge } from '../components/StatusBadge';
import { useNavigate } from 'react-router';

const ALL = 'todos';

const typeOptions: { value: string; label: string }[] = [
  { value: ALL, label: 'Todos os Tipos' },
  { value: 'fatura', label: 'Fatura' },
  { value: 'nota_debito', label: 'Nota de Débito' },
  { value: 'nota_credito', label: 'Nota de Crédito' },
  { value: 'recibo', label: 'Recibo' },
  { value: 'extrato_bancario', label: 'Extrato Bancário' },
  { value: 'ordem_pagamento', label: 'Ordem de Pagamento' },
  { value: 'relatorio', label: 'Relatório' },
  { value: 'balanco', label: 'Balanço' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'outro', label: 'Outro' },
];

const statusOptions: { value: string; label: string }[] = [
  { value: ALL, label: 'Todos os Estados' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'processando', label: 'A Processar' },
  { value: 'analisado', label: 'Analisado' },
  { value: 'erro', label: 'Erro' },
];

type SortField = 'name' | 'type' | 'uploadedAt' | 'status' | 'amount';

function ReconBadge({ status }: { status: Document['reconciliation'] }) {
  if (!status) return null;
  const cfg = {
    conciliado: { label: '✓ Conc.', bg: '#dff6dd', text: '#107c10' },
    divergencia: { label: '▲ Div.', bg: '#fff4ce', text: '#835b00' },
    pendente: { label: '○ Pend.', bg: '#f3f2f1', text: '#605e5c' },
  }[status.status] ?? { label: '○', bg: '#f3f2f1', text: '#605e5c' };
  return (
    <span
      className="inline-block rounded"
      style={{ fontSize: '10px', backgroundColor: cfg.bg, color: cfg.text, padding: '1px 5px', fontWeight: 600 }}
    >
      {cfg.label}
    </span>
  );
}

export function Documents() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState(ALL);
  const [filterStatus, setFilterStatus] = useState(ALL);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDragOver, setIsDragOver] = useState(false);
  const [sortField, setSortField] = useState<SortField>('uploadedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [viewMode] = useState<'table' | 'cards'>('table');

  const filtered = mockDocuments
    .filter((doc) => {
      const matchSearch =
        !search ||
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(search.toLowerCase()) ||
        (doc.tags ?? []).some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        (doc.sapDocNumber ?? '').toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === ALL || doc.type === filterType;
      const matchStatus = filterStatus === ALL || doc.status === filterStatus;
      const matchDateFrom = !dateFrom || doc.uploadedAt >= dateFrom;
      const matchDateTo = !dateTo || doc.uploadedAt <= dateTo + 'T23:59:59';
      return matchSearch && matchType && matchStatus && matchDateFrom && matchDateTo;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'type') cmp = a.type.localeCompare(b.type);
      else if (sortField === 'uploadedAt') cmp = a.uploadedAt.localeCompare(b.uploadedAt);
      else if (sortField === 'status') cmp = a.status.localeCompare(b.status);
      else if (sortField === 'amount') cmp = (a.amount ?? 0) - (b.amount ?? 0);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((d) => d.id)));
  };

  const clearFilters = () => {
    setSearch('');
    setFilterType(ALL);
    setFilterStatus(ALL);
    setDateFrom('');
    setDateTo('');
  };

  const hasFilters = search || filterType !== ALL || filterStatus !== ALL || dateFrom || dateTo;

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field ? (
      sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : (
      <ChevronDown size={12} style={{ opacity: 0.3 }} />
    );

  const selectStyle = {
    fontSize: '13px',
    color: '#323130',
    backgroundColor: 'white',
    border: '1px solid #edebe9',
    borderRadius: '4px',
    padding: '6px 10px',
    cursor: 'pointer',
    outline: 'none',
  };

  // Summary stats
  const totalAmount = mockDocuments.reduce((s, d) => s + (d.amount ?? 0), 0);
  const sapClassified = mockDocuments.filter((d) => d.sapCategory && d.sapCategory !== 'OTHER').length;
  const withM365 = mockDocuments.filter((d) => d.m365?.oneDriveUrl || d.m365?.outlookMessageId).length;
  const divergencias = mockDocuments.filter((d) => d.reconciliation?.status === 'divergencia').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#323130', margin: 0 }}>
            Arquivo de Documentos
          </h1>
          <p style={{ fontSize: '12px', color: '#605e5c', marginTop: '2px' }}>
            {filtered.length} de {mockDocuments.length} documentos · Classificação SAP/PGC-A automática
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/reconciliacao')}
            className="flex items-center gap-1.5 rounded px-3 py-2 hover:bg-[#f3f2f1] transition-colors"
            style={{ fontSize: '12px', color: '#605e5c', border: '1px solid #edebe9', background: 'white', cursor: 'pointer' }}
          >
            <GitMerge size={13} />
            Reconciliar
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Valor Total', value: `AOA ${(totalAmount / 1000000).toFixed(1)}M`, icon: FileText, color: '#0078d4', bg: '#eff6fc' },
          { label: 'Classif. SAP', value: `${sapClassified}/${mockDocuments.length}`, icon: Cpu, color: '#107c10', bg: '#dff6dd' },
          { label: 'M365 Sincron.', value: `${withM365} docs`, icon: Cloud, color: '#8764b8', bg: '#f4f0ff' },
          { label: 'Divergências', value: `${divergencias} item(s)`, icon: AlertCircle, color: divergencias > 0 ? '#d13438' : '#107c10', bg: divergencias > 0 ? '#fde7e9' : '#dff6dd' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded flex items-center gap-3 px-3 py-2"
            style={{ border: '1px solid #edebe9' }}
          >
            <div className="flex items-center justify-center rounded" style={{ width: '30px', height: '30px', backgroundColor: bg }}>
              <Icon size={14} color={color} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#323130' }}>{value}</div>
              <div style={{ fontSize: '10px', color: '#605e5c' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); }}
        className="rounded transition-all"
        style={{
          border: `2px dashed ${isDragOver ? '#0078d4' : '#c8c6c4'}`,
          backgroundColor: isDragOver ? '#eff6fc' : '#faf9f8',
          padding: '16px 20px',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <div className="flex items-center justify-center gap-4">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: '36px', height: '36px', backgroundColor: isDragOver ? '#0078d4' : '#edebe9' }}
          >
            <Upload size={16} color={isDragOver ? 'white' : '#605e5c'} />
          </div>
          <div className="text-left">
            <p style={{ fontSize: '13px', fontWeight: 600, color: isDragOver ? '#0078d4' : '#323130', margin: 0 }}>
              Arraste ficheiros ou{' '}
              <span style={{ color: '#0078d4', textDecoration: 'underline', cursor: 'pointer' }}>
                clique para selecionar
              </span>
              {' '}· ou importe do OneDrive
            </p>
            <p style={{ fontSize: '11px', color: '#605e5c', marginTop: '2px' }}>
              PDF, DOC, DOCX, XLS, XLSX · Máx. 50 MB · Classificação SAP/PGC-A automática após análise IA
            </p>
          </div>
          <button
            className="flex items-center gap-1.5 rounded px-3 py-2 hover:opacity-80 transition-opacity"
            style={{ fontSize: '11px', backgroundColor: '#0078d4', color: 'white', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            <Cloud size={12} />
            OneDrive
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded flex flex-wrap items-center gap-3 p-3" style={{ border: '1px solid #edebe9' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#a19f9d' }} />
          <input
            type="text"
            placeholder="Pesquisar por nome, autor, tag, nº SAP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded"
            style={{
              fontSize: '13px',
              color: '#323130',
              border: '1px solid #edebe9',
              padding: '6px 10px 6px 30px',
              outline: 'none',
            }}
          />
        </div>

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={selectStyle}>
          {typeOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyle}>
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ ...selectStyle, padding: '5px 8px' }} />
          <span style={{ fontSize: '12px', color: '#605e5c' }}>até</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ ...selectStyle, padding: '5px 8px' }} />
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded hover:bg-[#f3f2f1]"
            style={{ fontSize: '12px', color: '#605e5c', border: 'none', background: 'none', cursor: 'pointer', padding: '6px 8px' }}
          >
            <X size={12} />
            Limpar
          </button>
        )}
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-2 rounded"
          style={{ backgroundColor: '#eff6fc', border: '1px solid #c7e0f4' }}
        >
          <CheckSquare size={16} color="#0078d4" />
          <span style={{ fontSize: '13px', color: '#0078d4', fontWeight: 600 }}>
            {selectedIds.size} selecionado(s)
          </span>
          <div className="flex items-center gap-2 ml-2">
            <button
              className="flex items-center gap-1.5 rounded px-3 py-1 hover:opacity-80"
              style={{ fontSize: '12px', backgroundColor: '#d13438', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              <Trash2 size={12} />
              Eliminar
            </button>
            <button
              className="flex items-center gap-1.5 rounded px-3 py-1 hover:bg-[#edebe9]"
              style={{ fontSize: '12px', color: '#323130', border: '1px solid #edebe9', cursor: 'pointer', background: 'white' }}
            >
              <Download size={12} />
              Exportar
            </button>
            <button
              className="flex items-center gap-1.5 rounded px-3 py-1 hover:bg-[#edebe9]"
              style={{ fontSize: '12px', color: '#323130', border: '1px solid #edebe9', cursor: 'pointer', background: 'white' }}
            >
              <GitMerge size={12} />
              Reconciliar
            </button>
          </div>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto rounded p-1 hover:bg-[#c7e0f4]"
            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
          >
            <X size={14} color="#0078d4" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded" style={{ border: '1px solid #edebe9' }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <FileText size={36} color="#c8c6c4" />
            <p style={{ fontSize: '14px', color: '#605e5c' }}>Nenhum documento encontrado</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                style={{ fontSize: '13px', color: '#0078d4', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#faf9f8', borderBottom: '1px solid #edebe9' }}>
                  <th className="px-4 py-2.5 w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  {[
                    { field: 'name' as SortField, label: 'Nome / SAP' },
                    { field: 'type' as SortField, label: 'Tipo / Conta PGC-A' },
                    { field: 'uploadedAt' as SortField, label: 'Data' },
                    { field: 'status' as SortField, label: 'Estado' },
                    { field: 'amount' as SortField, label: 'Valor' },
                  ].map(({ field, label }) => (
                    <th
                      key={field}
                      className="text-left px-4 py-2.5 cursor-pointer select-none hover:bg-[#f3f2f1]"
                      style={{ fontSize: '11px', fontWeight: 600, color: '#605e5c', whiteSpace: 'nowrap' }}
                      onClick={() => toggleSort(field)}
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        <SortIcon field={field} />
                      </div>
                    </th>
                  ))}
                  <th className="text-left px-4 py-2.5" style={{ fontSize: '11px', fontWeight: 600, color: '#605e5c' }}>
                    Reconcil.
                  </th>
                  <th className="text-left px-4 py-2.5" style={{ fontSize: '11px', fontWeight: 600, color: '#605e5c' }}>
                    M365
                  </th>
                  <th className="px-4 py-2.5" style={{ fontSize: '11px', fontWeight: 600, color: '#605e5c' }}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-[#f3f2f1] transition-colors"
                    style={{
                      borderBottom: '1px solid #f3f2f1',
                      backgroundColor: selectedIds.has(doc.id) ? '#eff6fc' : undefined,
                    }}
                  >
                    <td className="px-4 py-2.5">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(doc.id)}
                        onChange={() => toggleSelect(doc.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <FileText size={14} color="#0078d4" className="shrink-0" />
                        <span
                          style={{
                            fontSize: '13px',
                            color: '#0078d4',
                            cursor: 'pointer',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          }}
                          title={doc.name}
                          onClick={() => navigate('/analise')}
                        >
                          {doc.name}
                        </span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#a19f9d', marginTop: '1px', paddingLeft: '22px' }}>
                        {doc.pageCount} pág. · {doc.uploadedBy}
                        {doc.sapDocNumber && (
                          <span style={{ color: '#0078d4', marginLeft: '4px' }}>· #{doc.sapDocNumber}</span>
                        )}
                      </div>
                      {/* Tags */}
                      {doc.tags && doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 pl-5">
                          {doc.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              style={{ fontSize: '9px', backgroundColor: '#f3f2f1', color: '#605e5c', padding: '1px 5px', borderRadius: '3px' }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="inline-block rounded"
                        style={{ fontSize: '11px', color: '#605e5c', backgroundColor: '#f3f2f1', padding: '2px 8px', whiteSpace: 'nowrap' }}
                      >
                        {getTypeName(doc.type)}
                      </span>
                      {doc.sapCategory && doc.sapCategory !== 'OTHER' && (
                        <div style={{ fontSize: '9px', color: '#0078d4', marginTop: '2px', whiteSpace: 'nowrap' }}>
                          {getSapCategoryLabel(doc.sapCategory)}
                        </div>
                      )}
                      {doc.accountClass && (
                        <div style={{ fontSize: '9px', color: '#835b00', marginTop: '1px', whiteSpace: 'nowrap' }}>
                          {getAccountClassName(doc.accountClass)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span style={{ fontSize: '12px', color: '#605e5c', whiteSpace: 'nowrap' }}>
                        {formatDate(doc.uploadedAt)}
                      </span>
                      {doc.dueDate && (
                        <div style={{ fontSize: '10px', color: '#835b00' }}>
                          Vence: {formatDate(doc.dueDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span style={{ fontSize: '12px', color: '#323130', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                        {doc.amount ? formatCurrency(doc.amount, doc.currency) : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <ReconBadge status={doc.reconciliation} />
                    </td>
                    <td className="px-4 py-2.5">
                      {doc.m365?.oneDriveUrl ? (
                        <div className="flex items-center gap-1">
                          <Cloud size={12} color="#0078d4" />
                          <span style={{ fontSize: '9px', color: '#0078d4' }}>OneDrive</span>
                        </div>
                      ) : doc.m365?.outlookMessageId ? (
                        <div className="flex items-center gap-1">
                          <Tag size={12} color="#8764b8" />
                          <span style={{ fontSize: '9px', color: '#8764b8' }}>Outlook</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '10px', color: '#c8c6c4' }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate('/analise')}
                          className="p-1.5 rounded hover:bg-[#edebe9]"
                          title="Analisar"
                        >
                          <Eye size={13} color="#605e5c" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-[#edebe9]" title="Descarregar">
                          <Download size={13} color="#605e5c" />
                        </button>
                        <button
                          onClick={() => navigate('/chat')}
                          className="p-1.5 rounded hover:bg-[#edebe9]"
                          title="Perguntar ao AI"
                        >
                          <ExternalLink size={13} color="#605e5c" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-[#fde7e9]" title="Eliminar">
                          <Trash2 size={13} color="#d13438" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div
            className="flex items-center justify-between px-4 py-2"
            style={{ borderTop: '1px solid #edebe9' }}
          >
            <span style={{ fontSize: '12px', color: '#605e5c' }}>
              Mostrando {filtered.length} de {mockDocuments.length} documentos
            </span>
            <div className="flex items-center gap-2">
              <button
                className="rounded px-3 py-1 hover:bg-[#f3f2f1]"
                style={{ fontSize: '12px', color: '#323130', border: '1px solid #edebe9', cursor: 'pointer', background: 'white' }}
              >
                Anterior
              </button>
              <button
                className="rounded px-3 py-1 hover:bg-[#f3f2f1]"
                style={{ fontSize: '12px', color: '#323130', border: '1px solid #edebe9', cursor: 'pointer', background: 'white' }}
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
