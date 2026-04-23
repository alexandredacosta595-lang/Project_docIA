import { useState } from 'react';
import {
  FileText,
  Info,
  Cpu,
  Eye,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Download,
  Lock,
  User,
  Tag,
  Calendar,
  HardDrive,
  BookOpen,
  Globe,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  BarChart3,
  MessageSquare,
} from 'lucide-react';
import { mockDocuments, mockAnalyses } from '../mockData';
import {
  formatDate,
  formatDateTime,
  formatFileSize,
  getTypeName,
  getSapCategoryLabel,
  getAccountClassName,
} from '../utils';
import { StatusBadge, ConfidentialityBadge } from '../components/StatusBadge';

const analyzedDocs = mockDocuments.filter((d) => d.analysisId);

export function Analysis() {
  const [selectedDocId, setSelectedDocId] = useState(analyzedDocs[0]?.id ?? '');
  const [page, setPage] = useState(1);

  const selectedDoc = mockDocuments.find((d) => d.id === selectedDocId);
  const selectedAnalysis = selectedDoc?.analysisId
    ? mockAnalyses.find((a) => a.id === selectedDoc.analysisId)
    : null;

  const selectStyle = {
    fontSize: '13px',
    color: '#323130',
    backgroundColor: 'white',
    border: '1px solid #edebe9',
    borderRadius: '4px',
    padding: '7px 10px',
    cursor: 'pointer',
    outline: 'none',
    width: '100%',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#323130', margin: 0 }}>
            Análise de Documentos
          </h1>
          <p style={{ fontSize: '12px', color: '#605e5c', marginTop: '2px' }}>
            Análise inteligente com IA · {analyzedDocs.length} documentos analisados disponíveis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label style={{ fontSize: '12px', color: '#605e5c', whiteSpace: 'nowrap' }}>
            Selecionar documento:
          </label>
          <select
            value={selectedDocId}
            onChange={(e) => { setSelectedDocId(e.target.value); setPage(1); }}
            style={{ ...selectStyle, width: '280px' }}
          >
            {analyzedDocs.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedDoc ? (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-4 items-start">
          {/* LEFT — Metadata */}
          <div className="bg-white rounded space-y-0" style={{ border: '1px solid #edebe9' }}>
            <div
              className="px-4 py-3"
              style={{ borderBottom: '1px solid #edebe9', backgroundColor: '#faf9f8' }}
            >
              <div className="flex items-center gap-2">
                <Info size={14} color="#0078d4" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#323130', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Metadados
                </span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* File icon and name */}
              <div className="flex flex-col items-center gap-2 pb-4" style={{ borderBottom: '1px solid #f3f2f1' }}>
                <div
                  className="flex items-center justify-center rounded"
                  style={{ width: '52px', height: '52px', backgroundColor: '#eff6fc' }}
                >
                  <FileText size={26} color="#0078d4" />
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#323130',
                    textAlign: 'center',
                    wordBreak: 'break-all',
                  }}
                >
                  {selectedDoc.name}
                </p>
                <StatusBadge status={selectedDoc.status} />
              </div>

              {/* Metadata rows */}
              {[
                { icon: Tag, label: 'Tipo', value: getTypeName(selectedDoc.type) },
                {
                  icon: Calendar,
                  label: 'Enviado em',
                  value: formatDateTime(selectedDoc.uploadedAt),
                },
                { icon: User, label: 'Enviado por', value: selectedDoc.uploadedBy },
                { icon: HardDrive, label: 'Tamanho', value: formatFileSize(selectedDoc.fileSize) },
                { icon: BookOpen, label: 'Páginas', value: `${selectedDoc.pageCount} página(s)` },
                ...(selectedDoc.amount
                  ? [
                      {
                        icon: FileText,
                        label: 'Valor',
                        value: `${selectedDoc.currency ?? 'AOA'} ${selectedDoc.amount.toLocaleString('pt-PT')}`,
                      },
                    ]
                  : []),
                ...(selectedDoc.currency
                  ? [{ icon: Globe, label: 'Moeda', value: selectedDoc.currency }]
                  : []),
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3">
                  <Icon size={14} color="#a19f9d" className="mt-0.5 shrink-0" />
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#a19f9d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {label}
                    </div>
                    <div style={{ fontSize: '12px', color: '#323130', marginTop: '1px' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 space-y-2">
              <button
                className="w-full flex items-center justify-center gap-2 rounded hover:opacity-90"
                style={{
                  fontSize: '13px',
                  backgroundColor: '#0078d4',
                  color: 'white',
                  border: 'none',
                  padding: '8px',
                  cursor: 'pointer',
                }}
              >
                <Download size={14} />
                Descarregar
              </button>
            </div>
          </div>

          {/* CENTER — Document Preview */}
          <div className="bg-white rounded flex flex-col" style={{ border: '1px solid #edebe9', minHeight: '600px' }}>
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: '1px solid #edebe9', backgroundColor: '#faf9f8' }}
            >
              <div className="flex items-center gap-2">
                <Eye size={14} color="#0078d4" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#323130', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Visualização
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded hover:bg-[#edebe9]" title="Ampliar">
                  <ZoomIn size={14} color="#605e5c" />
                </button>
                <button className="p-1.5 rounded hover:bg-[#edebe9]" title="Reduzir">
                  <ZoomOut size={14} color="#605e5c" />
                </button>
                <span style={{ fontSize: '12px', color: '#605e5c' }}>
                  Pág. {page} / {selectedDoc.pageCount}
                </span>
                <button
                  className="p-1.5 rounded hover:bg-[#edebe9]"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft size={14} color={page <= 1 ? '#c8c6c4' : '#605e5c'} />
                </button>
                <button
                  className="p-1.5 rounded hover:bg-[#edebe9]"
                  onClick={() => setPage((p) => Math.min(selectedDoc.pageCount, p + 1))}
                  disabled={page >= selectedDoc.pageCount}
                >
                  <ChevronRight size={14} color={page >= selectedDoc.pageCount ? '#c8c6c4' : '#605e5c'} />
                </button>
              </div>
            </div>

            {/* PDF Placeholder */}
            <div
              className="flex-1 flex flex-col items-center justify-center p-8 gap-4"
              style={{ backgroundColor: '#605e5c10' }}
            >
              <div
                className="bg-white shadow-sm rounded flex flex-col"
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  minHeight: '520px',
                  border: '1px solid #edebe9',
                  padding: '32px 40px',
                  gap: '12px',
                }}
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <div
                      className="rounded"
                      style={{ width: '80px', height: '20px', backgroundColor: '#0078d4', marginBottom: '6px' }}
                    />
                    <div
                      className="rounded"
                      style={{ width: '120px', height: '8px', backgroundColor: '#edebe9' }}
                    />
                  </div>
                  <div className="text-right">
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#323130' }}>DOCUMENTO</div>
                    <div style={{ fontSize: '11px', color: '#605e5c' }}>
                      Nº {selectedDoc.id.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '11px', color: '#605e5c' }}>
                      Data: {formatDate(selectedDoc.uploadedAt)}
                    </div>
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: '#edebe9', margin: '8px 0' }} />

                {/* Fake content lines */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded"
                    style={{
                      height: '8px',
                      backgroundColor: '#f3f2f1',
                      width: `${60 + Math.sin(i * 2.5) * 30}%`,
                    }}
                  />
                ))}

                <div style={{ height: '1px', backgroundColor: '#edebe9', margin: '8px 0' }} />

                {/* Fake table */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="rounded" style={{ height: '8px', flex: 2, backgroundColor: '#f3f2f1' }} />
                    <div className="rounded" style={{ height: '8px', flex: 1, backgroundColor: '#f3f2f1' }} />
                    <div className="rounded" style={{ height: '8px', flex: 1, backgroundColor: '#eff6fc' }} />
                  </div>
                ))}

                <div style={{ height: '1px', backgroundColor: '#edebe9', margin: '8px 0' }} />
                <div className="flex justify-end">
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#323130' }}>
                    Total:{' '}
                    {selectedDoc.amount
                      ? `${selectedDoc.currency ?? 'AOA'} ${selectedDoc.amount.toLocaleString('pt-PT')}`
                      : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#107c10' }} />
                <span style={{ fontSize: '11px', color: '#605e5c' }}>
                  Pré-visualização simulada · Página {page} de {selectedDoc.pageCount}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — AI Analysis */}
          <div className="bg-white rounded" style={{ border: '1px solid #edebe9' }}>
            <div
              className="px-4 py-3"
              style={{ borderBottom: '1px solid #edebe9', backgroundColor: '#faf9f8' }}
            >
              <div className="flex items-center gap-2">
                <Cpu size={14} color="#0078d4" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#323130', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Análise IA
                </span>
                {selectedAnalysis && (
                  <span
                    className="ml-auto rounded"
                    style={{ fontSize: '10px', backgroundColor: '#dff6dd', color: '#107c10', padding: '1px 6px', fontWeight: 600 }}
                  >
                    Concluída
                  </span>
                )}
              </div>
            </div>

            {selectedAnalysis ? (
              <div className="p-4 space-y-4">
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '11px', color: '#a19f9d' }}>
                    {formatDateTime(selectedAnalysis.analyzedAt)}
                  </span>
                  {selectedAnalysis.classificationConfidence && (
                    <span
                      className="rounded"
                      style={{
                        fontSize: '10px',
                        backgroundColor: selectedAnalysis.classificationConfidence >= 0.9 ? '#dff6dd' : '#fff4ce',
                        color: selectedAnalysis.classificationConfidence >= 0.9 ? '#107c10' : '#835b00',
                        padding: '2px 7px',
                        fontWeight: 700,
                      }}
                    >
                      IA {Math.round(selectedAnalysis.classificationConfidence * 100)}% conf.
                    </span>
                  )}
                </div>

                {/* SAP Classification */}
                {selectedDoc?.sapCategory && (
                  <div
                    className="rounded p-3"
                    style={{ backgroundColor: '#eff6fc', border: '1px solid #c7e0f4' }}
                  >
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#0078d4', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Classificação SAP / PGC-A
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span style={{ fontSize: '11px', color: '#605e5c' }}>Módulo SAP</span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#0078d4' }}>
                          {getSapCategoryLabel(selectedDoc.sapCategory)}
                        </span>
                      </div>
                      {selectedDoc.accountClass && (
                        <div className="flex justify-between">
                          <span style={{ fontSize: '11px', color: '#605e5c' }}>Conta PGC-A</span>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#835b00' }}>
                            {getAccountClassName(selectedDoc.accountClass)}
                          </span>
                        </div>
                      )}
                      {selectedAnalysis.suggestedAccount && (
                        <div className="flex justify-between">
                          <span style={{ fontSize: '11px', color: '#605e5c' }}>Conta sugerida</span>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#323130' }}>
                            {selectedAnalysis.suggestedAccount}
                          </span>
                        </div>
                      )}
                      {selectedDoc.sapDocNumber && (
                        <div className="flex justify-between">
                          <span style={{ fontSize: '11px', color: '#605e5c' }}>Nº SAP</span>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#323130' }}>
                            {selectedDoc.sapDocNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Extracted financials */}
                {selectedAnalysis.extractedAmounts && (
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Valores Extraídos
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Bruto', val: selectedAnalysis.extractedAmounts.gross },
                        { label: 'Líquido', val: selectedAnalysis.extractedAmounts.net },
                        { label: 'IVA', val: selectedAnalysis.extractedAmounts.tax },
                      ]
                        .filter((r) => r.val !== undefined)
                        .map(({ label, val }) => (
                          <div key={label} className="flex justify-between">
                            <span style={{ fontSize: '11px', color: '#605e5c' }}>{label}</span>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#323130', fontVariantNumeric: 'tabular-nums' }}>
                              {selectedAnalysis.extractedAmounts?.currency ?? 'AOA'}{' '}
                              {(val ?? 0).toLocaleString('pt-PT')}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Resumo IA
                  </div>
                  <p style={{ fontSize: '12px', color: '#323130', lineHeight: '1.6' }}>
                    {selectedAnalysis.summary}
                  </p>
                </div>

                {/* Keywords */}
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Palavras-chave
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAnalysis.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded"
                        style={{ fontSize: '11px', backgroundColor: '#eff6fc', color: '#0078d4', padding: '2px 8px', fontWeight: 500 }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metadata */}
                {[
                  { label: 'Assunto', value: selectedAnalysis.subject },
                  { label: 'Tom', value: selectedAnalysis.tone },
                  { label: 'Signatário', value: selectedAnalysis.signatory },
                  { label: 'Idioma', value: selectedAnalysis.language },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
                      {label}
                    </div>
                    <p style={{ fontSize: '12px', color: '#323130' }}>{value}</p>
                  </div>
                ))}

                {/* Confidentiality */}
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Confidencialidade
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock size={13} color="#605e5c" />
                    <ConfidentialityBadge level={selectedAnalysis.confidentiality} />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-2" style={{ borderTop: '1px solid #edebe9' }}>
                  <button
                    className="w-full flex items-center justify-center gap-2 rounded hover:opacity-90"
                    style={{ fontSize: '13px', background: 'linear-gradient(135deg,#0078d4,#005a9e)', color: 'white', border: 'none', padding: '8px', cursor: 'pointer' }}
                  >
                    <Download size={14} />
                    Exportar Análise (PDF)
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 gap-3">
                <AlertCircle size={32} color="#c8c6c4" />
                <p style={{ fontSize: '13px', color: '#605e5c', textAlign: 'center' }}>
                  Este documento ainda não foi analisado pela IA.
                </p>
                <button
                  className="rounded hover:opacity-90"
                  style={{
                    fontSize: '13px',
                    backgroundColor: '#0078d4',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    cursor: 'pointer',
                  }}
                >
                  Iniciar Análise
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-white rounded py-20 gap-3" style={{ border: '1px solid #edebe9' }}>
          <FileText size={40} color="#c8c6c4" />
          <p style={{ fontSize: '14px', color: '#605e5c' }}>Nenhum documento analisado disponível.</p>
        </div>
      )}
    </div>
  );
}
