/** Estado de processamento de um documento */
export type DocumentStatus = 'pendente' | 'processando' | 'analisado' | 'erro';

/** Tipo de documento financeiro alinhado com SAP / PGC-A */
export type DocumentType =
  | 'fatura'
  | 'fatura_pro_forma'
  | 'nota_debito'
  | 'nota_credito'
  | 'recibo'
  | 'extrato_bancario'
  | 'ordem_pagamento'
  | 'relatorio'
  | 'balanco'
  | 'dre'
  | 'contrato'
  | 'outro';

/** Nível de confidencialidade do documento */
export type ConfidentialityLevel = 'publico' | 'interno' | 'confidencial' | 'restrito';

/**
 * Plano de Contas SAP / PGC-A (Angola)
 * Classe → Sub-conta → Rubrica
 */
export type SapAccountClass =
  | '1_activo_imobilizado'
  | '2_existencias'
  | '3_terceiros'
  | '4_terceiros_financeiros'
  | '5_capital_reservas'
  | '6_custos_perdas'
  | '7_proveitos_ganhos'
  | '8_resultados';

/** SAP document object-type classification */
export type SapDocumentCategory =
  | 'FI_SUPPLIER_INVOICE'  // Fatura de Fornecedor (FI)
  | 'FI_CUSTOMER_INVOICE'  // Fatura de Cliente
  | 'FI_BANK_STATEMENT'    // Extrato Bancário
  | 'FI_PAYMENT_ORDER'     // Ordem de Pagamento
  | 'FI_CREDIT_MEMO'       // Nota de Crédito
  | 'FI_DEBIT_MEMO'        // Nota de Débito
  | 'CO_COST_ALLOCATION'   // Imputação de Custos (CO)
  | 'MM_GOODS_RECEIPT'     // Entrada de Mercadoria (MM)
  | 'SD_CUSTOMER_ORDER'    // Ordem de Cliente (SD)
  | 'OTHER';

/** Integração Microsoft 365 */
export interface M365Integration {
  oneDriveUrl?: string;
  outlookMessageId?: string;
  sharePointSiteId?: string;
  teamsChannelId?: string;
  syncedAt?: string;
}

/** Metadados de reconciliação financeira */
export interface ReconciliationMeta {
  reconciledWith?: string[];    // IDs de documentos correspondentes
  reconciledAt?: string;
  reconciledBy?: string;
  variance?: number;             // Diferença encontrada em AOA
  status: 'pendente' | 'conciliado' | 'divergencia';
  notes?: string;
}

/** Representa uma pasta de organização de documentos */
export interface Folder {
  id: string;
  name: string;
  /** Cor hex da pasta (ex: '#0078d4') */
  color: string;
  /** Nome do ícone lucide-react */
  icon: string;
  /** Se true, é uma pasta de sistema (não pode ser eliminada) */
  isSystem: boolean;
  /** Descrição opcional */
  description?: string;
  /** Data de criação */
  createdAt: string;
}

/** Representa um documento financeiro no sistema */
export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  uploadedAt: string;
  uploadedBy: string;
  /** Tamanho em bytes */
  fileSize: number;
  pageCount: number;
  amount?: number;
  currency?: string;
  analysisId?: string;
  /** ID da pasta onde o documento está organizado */
  folderId?: string;
  /** Classificação contabilística SAP/PGC-A atribuída automaticamente */
  sapCategory?: SapDocumentCategory;
  /** Classe do plano de contas PGC-A */
  accountClass?: SapAccountClass;
  /** Número do documento SAP (ex: 4500012345) */
  sapDocNumber?: string;
  /** Centro de custo SAP */
  costCenter?: string;
  /** Data de vencimento */
  dueDate?: string;
  /** NIF do fornecedor/cliente */
  nif?: string;
  /** Integração M365 */
  m365?: M365Integration;
  /** Reconciliação */
  reconciliation?: ReconciliationMeta;
  /** Tags para organização */
  tags?: string[];
}

/** Resultado da análise IA de um documento */
export interface DocumentAnalysis {
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
  /** Valores financeiros extraídos */
  extractedAmounts?: {
    gross?: number;
    net?: number;
    tax?: number;
    currency?: string;
  };
  /** Conta contabilística sugerida pelo modelo */
  suggestedAccount?: string;
  /** Score de confiança da classificação automática (0-1) */
  classificationConfidence?: number;
}

/** Mensagem de conversa com o assistente IA */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources: DocumentSource[];
  createdAt: string;
  isStreaming?: boolean;
}

/** Fonte documental citada numa resposta do assistente */
export interface DocumentSource {
  documentId: string;
  documentName: string;
  excerpt: string;
  relevanceScore: number;
  page?: number;
}

/** Item de reconciliação bancária */
export interface ReconciliationItem {
  id: string;
  documentId: string;
  documentName: string;
  documentType: DocumentType;
  bookAmount: number;     // Valor em contabilidade
  bankAmount: number;     // Valor no extracto bancário
  variance: number;       // bookAmount - bankAmount
  date: string;
  description: string;
  status: 'matched' | 'unmatched' | 'partial' | 'adjusted';
  matchedDocumentId?: string;
}
