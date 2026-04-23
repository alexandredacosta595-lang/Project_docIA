import type {
  DocumentStatus,
  DocumentType,
  ConfidentialityLevel,
  SapDocumentCategory,
  SapAccountClass,
} from './types/document';

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatCurrency(amount: number, currency = 'AOA'): string {
  return `${currency} ${amount.toLocaleString('pt-PT')}`;
}

export function formatDate(dateString: string): string {
  const d = new Date(dateString);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export function formatDateTime(dateString: string): string {
  const d = new Date(dateString);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function getTypeName(type: DocumentType): string {
  const map: Record<DocumentType, string> = {
    fatura: 'Fatura',
    fatura_pro_forma: 'Fatura Pro-Forma',
    nota_debito: 'Nota de Débito',
    nota_credito: 'Nota de Crédito',
    recibo: 'Recibo',
    extrato_bancario: 'Extrato Bancário',
    ordem_pagamento: 'Ordem de Pagamento',
    relatorio: 'Relatório',
    balanco: 'Balanço',
    dre: 'DRE',
    contrato: 'Contrato',
    outro: 'Outro',
  };
  return map[type] ?? type;
}

export function getStatusName(status: DocumentStatus): string {
  const map: Record<DocumentStatus, string> = {
    pendente: 'Pendente',
    processando: 'A Processar',
    analisado: 'Analisado',
    erro: 'Erro',
  };
  return map[status] ?? status;
}

export function getStatusColors(status: DocumentStatus): { bg: string; text: string } {
  const map: Record<DocumentStatus, { bg: string; text: string }> = {
    pendente: { bg: '#fff4ce', text: '#835b00' },
    processando: { bg: '#eff6fc', text: '#0078d4' },
    analisado: { bg: '#dff6dd', text: '#107c10' },
    erro: { bg: '#fde7e9', text: '#d13438' },
  };
  return map[status] ?? { bg: '#f3f2f1', text: '#605e5c' };
}

export function getConfidentialityName(level: ConfidentialityLevel): string {
  const map: Record<ConfidentialityLevel, string> = {
    publico: 'Público',
    interno: 'Interno',
    confidencial: 'Confidencial',
    restrito: 'Restrito',
  };
  return map[level] ?? level;
}

export function getConfidentialityColors(level: ConfidentialityLevel): { bg: string; text: string } {
  const map: Record<ConfidentialityLevel, { bg: string; text: string }> = {
    publico: { bg: '#dff6dd', text: '#107c10' },
    interno: { bg: '#eff6fc', text: '#0078d4' },
    confidencial: { bg: '#fff4ce', text: '#835b00' },
    restrito: { bg: '#fde7e9', text: '#d13438' },
  };
  return map[level] ?? { bg: '#f3f2f1', text: '#605e5c' };
}

export function getSapCategoryLabel(cat: SapDocumentCategory): string {
  const map: Record<SapDocumentCategory, string> = {
    FI_SUPPLIER_INVOICE: 'FI — Fat. Fornecedor',
    FI_CUSTOMER_INVOICE: 'FI — Fat. Cliente',
    FI_BANK_STATEMENT: 'FI — Extrato Bancário',
    FI_PAYMENT_ORDER: 'FI — Ordem Pag.',
    FI_CREDIT_MEMO: 'FI — Nota Crédito',
    FI_DEBIT_MEMO: 'FI — Nota Débito',
    CO_COST_ALLOCATION: 'CO — Imputação',
    MM_GOODS_RECEIPT: 'MM — Entrada Merc.',
    SD_CUSTOMER_ORDER: 'SD — Ordem Cliente',
    OTHER: 'Outro',
  };
  return map[cat] ?? cat;
}

export function getAccountClassName(cls: SapAccountClass): string {
  const map: Record<SapAccountClass, string> = {
    '1_activo_imobilizado': 'Cl.1 — Activo Imob.',
    '2_existencias': 'Cl.2 — Existências',
    '3_terceiros': 'Cl.3 — Terceiros',
    '4_terceiros_financeiros': 'Cl.4 — Fin. Bancos',
    '5_capital_reservas': 'Cl.5 — Capital',
    '6_custos_perdas': 'Cl.6 — Custos',
    '7_proveitos_ganhos': 'Cl.7 — Proveitos',
    '8_resultados': 'Cl.8 — Resultados',
  };
  return map[cls] ?? cls;
}
