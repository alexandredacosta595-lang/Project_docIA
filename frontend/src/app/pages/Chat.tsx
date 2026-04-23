import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Bot,
  User,
  FileText,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Search,
  Loader2,
  Sparkles,
  RefreshCw,
  Trash2,
  PlusCircle,
  ExternalLink,
  Paperclip,
  Mic,
} from 'lucide-react';
import { mockDocuments, mockChatMessages } from '../mockData';
import type { ChatMessage } from '../types/document';
import { formatDate, formatDateTime } from '../utils';

// ─── Markdown renderer ─────────────────────────────────────────────────────────
function renderContent(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bullet list
    if (line.startsWith('• ') || line.startsWith('- ')) {
      const content = line.slice(2);
      const parts = content.split(/\*\*(.*?)\*\*/g);
      return (
        <li key={i} style={{ margin: '2px 0', paddingLeft: '4px', lineHeight: 1.6 }}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
          )}
        </li>
      );
    }
    // Normal line with bold
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} style={{ margin: i === 0 ? 0 : '4px 0 0 0', lineHeight: 1.6 }}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
        )}
      </p>
    );
  });
}

// ─── Source Card ──────────────────────────────────────────────────────────────
function SourceCard({ source }: { source: ChatMessage['sources'][0] }) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor =
    source.relevanceScore >= 0.9
      ? '#107c10'
      : source.relevanceScore >= 0.75
      ? '#835b00'
      : '#d13438';
  return (
    <div
      className="rounded cursor-pointer transition-colors"
      style={{
        border: `1px solid ${expanded ? '#0078d4' : '#edebe9'}`,
        backgroundColor: expanded ? '#eff6fc08' : '#faf9f8',
      }}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <FileText size={12} color="#0078d4" className="shrink-0" />
        <span
          style={{
            fontSize: '11px',
            color: '#0078d4',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {source.documentName}
        </span>
        {source.page && (
          <span style={{ fontSize: '10px', color: '#a19f9d' }}>p.{source.page}</span>
        )}
        <span
          className="rounded"
          style={{
            fontSize: '10px',
            backgroundColor: `${scoreColor}18`,
            color: scoreColor,
            padding: '1px 5px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          {Math.round(source.relevanceScore * 100)}%
        </span>
        {expanded ? <ChevronUp size={12} color="#605e5c" /> : <ChevronDown size={12} color="#605e5c" />}
      </div>
      {expanded && (
        <div className="px-3 pb-2.5" style={{ borderTop: '1px solid #edebe9' }}>
          <p
            style={{
              fontSize: '11px',
              color: '#605e5c',
              fontStyle: 'italic',
              marginTop: '8px',
              lineHeight: 1.6,
              borderLeft: '2px solid #0078d4',
              paddingLeft: '8px',
            }}
          >
            "{source.excerpt}"
          </p>
          <button
            className="flex items-center gap-1 mt-2 hover:underline"
            style={{ fontSize: '10px', color: '#0078d4', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
          >
            <ExternalLink size={10} />
            Abrir documento
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1" style={{ padding: '4px 0' }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: '6px',
            height: '6px',
            backgroundColor: '#0078d4',
            animation: `bounce 1.2s ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Message Bubble ──────────────────────────────────────────────────────────
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ animation: 'fadeSlideUp 0.3s ease-out' }}
    >
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Avatar */}
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{
          width: '30px',
          height: '30px',
          background: isUser
            ? 'linear-gradient(135deg, #0078d4, #005a9e)'
            : 'linear-gradient(135deg, #605e5c, #323130)',
          alignSelf: 'flex-end',
        }}
      >
        {isUser ? <User size={14} color="white" /> : <Bot size={14} color="white" />}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: '78%' }}>
        <div
          className="rounded-2xl"
          style={{
            background: isUser
              ? 'linear-gradient(135deg, #0078d4, #005a9e)'
              : 'white',
            color: isUser ? 'white' : '#323130',
            border: isUser ? 'none' : '1px solid #edebe9',
            padding: '10px 14px',
            fontSize: '13px',
            boxShadow: isUser ? '0 2px 8px rgba(0,120,212,0.2)' : '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          {message.isStreaming ? (
            <TypingDots />
          ) : (
            <div>{renderContent(message.content)}</div>
          )}
        </div>

        {/* Sources */}
        {message.sources.length > 0 && !message.isStreaming && (
          <div className="mt-2 space-y-1.5">
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#a19f9d',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={10} />
              Fontes RAG ({message.sources.length})
            </div>
            {message.sources.map((source) => (
              <SourceCard key={`${source.documentId}-${source.page}`} source={source} />
            ))}
          </div>
        )}

        <div
          style={{
            fontSize: '10px',
            color: '#a19f9d',
            marginTop: '4px',
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {formatDateTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}

// ─── Smart suggestions per context ────────────────────────────────────────────
const suggestionGroups = [
  {
    label: 'Financeiro',
    color: '#0078d4',
    items: [
      'Qual é o total de faturas de janeiro de 2024?',
      'Que documentos têm divergências na reconciliação?',
      'Resume o fluxo de caixa do 1.º trimestre.',
    ],
  },
  {
    label: 'SAP / Contabilidade',
    color: '#835b00',
    items: [
      'Quais documentos estão classificados como FI_SUPPLIER_INVOICE?',
      'Que conta do PGC-A foi atribuída às faturas Sonangol?',
      'Há documentos sem número SAP atribuído?',
    ],
  },
  {
    label: 'Conformidade',
    color: '#d13438',
    items: [
      'Existem documentos com classificação Restrito?',
      'Quais fornecedores têm NIF em falta?',
      'Há faturas com vencimento ultrapassado?',
    ],
  },
];

// ─── Main Chat ────────────────────────────────────────────────────────────────
export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [input, setInput] = useState('');
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(
    new Set(['doc-001', 'doc-002', 'doc-005', 'doc-006'])
  );
  const [isLoading, setIsLoading] = useState(false);
  const [docSearch, setDocSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [activeSugGroup, setActiveSugGroup] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleDoc = (id: string) => {
    setSelectedDocIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearConversation = () => {
    setMessages([]);
    setShowSuggestions(true);
  };

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isLoading) return;

      setShowSuggestions(false);

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        sources: [],
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');

      // Streaming placeholder
      const streamingId = `msg-${Date.now() + 1}`;
      const streamingMsg: ChatMessage = {
        id: streamingId,
        role: 'assistant',
        content: '',
        sources: [],
        createdAt: new Date().toISOString(),
        isStreaming: true,
      };
      setIsLoading(true);
      setMessages((prev) => [...prev, streamingMsg]);

      await new Promise((r) => setTimeout(r, 1800));

      // Generate a contextual response
      let responseContent =
        `Com base nos **${selectedDocIds.size} documento(s)** seleccionado(s), analisei a sua questão.\n\n` +
        `Esta é uma resposta simulada do assistente DocFlow AI. Em produção, o sistema consultaria a base de conhecimento RAG com os documentos seleccionados e devolveria uma resposta fundamentada com citações precisas dos documentos financeiros.\n\n` +
        `**Documentos consultados:**\n` +
        [...selectedDocIds]
          .slice(0, 3)
          .map((id) => {
            const doc = mockDocuments.find((d) => d.id === id);
            return doc ? `• ${doc.name}` : '';
          })
          .filter(Boolean)
          .join('\n');

      if (selectedDocIds.size > 3) {
        responseContent += `\n• … e mais ${selectedDocIds.size - 3} documento(s)`;
      }

      const aiMsg: ChatMessage = {
        id: streamingId,
        role: 'assistant',
        content: responseContent,
        sources:
          selectedDocIds.size > 0
            ? [
                {
                  documentId: [...selectedDocIds][0],
                  documentName:
                    mockDocuments.find((d) => d.id === [...selectedDocIds][0])?.name ?? 'Documento',
                  excerpt:
                    '...trecho relevante extraído pelo sistema de recuperação semântica (RAG)...',
                  relevanceScore: 0.93,
                  page: 1,
                },
              ]
            : [],
        createdAt: new Date().toISOString(),
        isStreaming: false,
      };

      setMessages((prev) => prev.map((m) => (m.id === streamingId ? aiMsg : m)));
      setIsLoading(false);
    },
    [input, isLoading, selectedDocIds]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredDocs = mockDocuments.filter(
    (d) => !docSearch || d.name.toLowerCase().includes(docSearch.toLowerCase())
  );

  const analyzedCount = mockDocuments.filter((d) => d.status === 'analisado').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#323130', margin: 0 }}>
            Chat IA — RAG Financeiro
          </h1>
          <p style={{ fontSize: '12px', color: '#605e5c', marginTop: '2px' }}>
            Consulte documentos com linguagem natural · {selectedDocIds.size} doc(s) no contexto ·{' '}
            {analyzedCount} analisados disponíveis
          </p>
        </div>
        <button
          onClick={clearConversation}
          className="flex items-center gap-1.5 rounded px-3 py-2 hover:bg-[#fde7e9] transition-colors"
          style={{ fontSize: '12px', color: '#d13438', border: '1px solid #fde7e9', background: 'white', cursor: 'pointer' }}
        >
          <Trash2 size={12} />
          Nova Conversa
        </button>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4"
        style={{ height: 'calc(100vh - 200px)', minHeight: '520px' }}
      >
        {/* ─── LEFT: Document selector ─────────────────────────────────────── */}
        <div
          className="bg-white rounded flex flex-col"
          style={{ border: '1px solid #edebe9', overflow: 'hidden' }}
        >
          <div
            className="px-3 py-2.5"
            style={{ borderBottom: '1px solid #edebe9', backgroundColor: '#faf9f8' }}
          >
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#323130',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              Contexto RAG
            </div>
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#a19f9d' }} />
              <input
                type="text"
                placeholder="Filtrar documentos..."
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                className="w-full rounded"
                style={{
                  fontSize: '12px',
                  border: '1px solid #edebe9',
                  padding: '5px 8px 5px 26px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-1">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDocIds.has(doc.id);
              const isAnalyzed = doc.status === 'analisado';
              return (
                <label
                  key={doc.id}
                  className="flex items-start gap-2.5 px-3 py-2 cursor-pointer hover:bg-[#f3f2f1] transition-colors"
                  style={{ backgroundColor: isSelected ? '#eff6fc' : undefined }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleDoc(doc.id)}
                    style={{ cursor: 'pointer', marginTop: '2px', accentColor: '#0078d4' }}
                  />
                  <div className="overflow-hidden flex-1">
                    <div
                      style={{
                        fontSize: '12px',
                        color: isSelected ? '#0078d4' : '#323130',
                        fontWeight: isSelected ? 600 : 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={doc.name}
                    >
                      {doc.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="rounded"
                        style={{
                          fontSize: '9px',
                          backgroundColor: isAnalyzed ? '#dff6dd' : '#fff4ce',
                          color: isAnalyzed ? '#107c10' : '#835b00',
                          padding: '1px 4px',
                          fontWeight: 600,
                        }}
                      >
                        {isAnalyzed ? '✓ Analisado' : 'Pendente'}
                      </span>
                      {doc.sapCategory && (
                        <span style={{ fontSize: '9px', color: '#a19f9d' }}>
                          {doc.sapCategory.split('_')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Footer */}
          <div
            className="px-3 py-2 flex items-center justify-between"
            style={{ borderTop: '1px solid #edebe9', backgroundColor: '#faf9f8' }}
          >
            <span style={{ fontSize: '11px', color: '#605e5c' }}>
              {selectedDocIds.size}/{mockDocuments.length} sel.
            </span>
            <button
              onClick={() => setSelectedDocIds(new Set(mockDocuments.map((d) => d.id)))}
              style={{
                fontSize: '10px',
                color: '#0078d4',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Todos
            </button>
          </div>
        </div>

        {/* ─── RIGHT: Chat ──────────────────────────────────────────────────── */}
        <div
          className="bg-white rounded flex flex-col"
          style={{ border: '1px solid #edebe9', overflow: 'hidden' }}
        >
          {/* Chat header */}
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{ borderBottom: '1px solid #edebe9', backgroundColor: '#faf9f8' }}
          >
            <div
              className="flex items-center justify-center rounded"
              style={{ width: '22px', height: '22px', background: 'linear-gradient(135deg, #0078d4, #005a9e)' }}
            >
              <Bot size={12} color="white" />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#323130' }}>
              DocFlow AI · RAG Financeiro
            </span>
            <span
              className="ml-auto rounded"
              style={{
                fontSize: '10px',
                backgroundColor: '#dff6dd',
                color: '#107c10',
                padding: '1px 7px',
                fontWeight: 600,
              }}
            >
              ● Activo
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* System banner */}
            <div className="flex justify-center">
              <div
                className="rounded-full text-center"
                style={{
                  fontSize: '11px',
                  color: '#605e5c',
                  backgroundColor: '#f3f2f1',
                  padding: '5px 16px',
                }}
              >
                {selectedDocIds.size} documento(s) no contexto · Modelo RAG activo
              </div>
            </div>

            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions panel */}
          {showSuggestions && messages.length <= 4 && !isLoading && (
            <div
              className="px-4 py-3"
              style={{ borderTop: '1px solid #edebe9', backgroundColor: '#fafafa' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={11} color="#0078d4" />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Sugestões
                </span>
                <div className="flex gap-1 ml-auto">
                  {suggestionGroups.map((g, idx) => (
                    <button
                      key={g.label}
                      onClick={() => setActiveSugGroup(idx)}
                      style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: `1px solid ${activeSugGroup === idx ? g.color : '#edebe9'}`,
                        backgroundColor: activeSugGroup === idx ? `${g.color}15` : 'white',
                        color: activeSugGroup === idx ? g.color : '#605e5c',
                        cursor: 'pointer',
                        fontWeight: activeSugGroup === idx ? 700 : 400,
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestionGroups[activeSugGroup].items.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded transition-colors hover:border-[#0078d4] hover:text-[#0078d4]"
                    style={{
                      fontSize: '11px',
                      color: '#605e5c',
                      border: '1px solid #edebe9',
                      padding: '4px 10px',
                      cursor: 'pointer',
                      backgroundColor: 'white',
                      textAlign: 'left',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input bar */}
          <div
            className="px-4 py-3 flex items-end gap-3"
            style={{ borderTop: '1px solid #edebe9' }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedDocIds.size === 0
                  ? 'Selecione documentos para iniciar a conversa...'
                  : 'Escreva a sua pergunta financeira... (Enter para enviar, Shift+Enter para nova linha)'
              }
              disabled={selectedDocIds.size === 0 || isLoading}
              rows={2}
              className="flex-1 rounded resize-none focus:outline-none"
              style={{
                fontSize: '13px',
                color: '#323130',
                border: '1px solid #edebe9',
                padding: '8px 12px',
                lineHeight: 1.5,
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#0078d4')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#edebe9')}
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading || selectedDocIds.size === 0}
                className="flex items-center justify-center rounded transition-all"
                style={{
                  width: '40px',
                  height: '40px',
                  background:
                    !input.trim() || isLoading || selectedDocIds.size === 0
                      ? '#c8c6c4'
                      : 'linear-gradient(135deg, #0078d4, #005a9e)',
                  border: 'none',
                  cursor: !input.trim() || isLoading || selectedDocIds.size === 0 ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                  boxShadow:
                    input.trim() && !isLoading
                      ? '0 2px 8px rgba(0,120,212,0.3)'
                      : 'none',
                }}
              >
                {isLoading ? (
                  <Loader2 size={16} color="white" className="animate-spin" />
                ) : (
                  <Send size={16} color="white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
