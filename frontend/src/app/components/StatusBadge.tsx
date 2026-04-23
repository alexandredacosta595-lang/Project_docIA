import type { DocumentStatus, ConfidentialityLevel } from '../types/document';
import { getStatusName, getStatusColors, getConfidentialityName, getConfidentialityColors } from '../utils';

interface StatusBadgeProps {
  status: DocumentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { bg, text } = getStatusColors(status);
  return (
    <span
      className="inline-flex items-center rounded"
      style={{
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: bg,
        color: text,
        padding: '2px 8px',
        whiteSpace: 'nowrap',
      }}
    >
      {getStatusName(status)}
    </span>
  );
}

interface ConfidentialityBadgeProps {
  level: ConfidentialityLevel;
}

export function ConfidentialityBadge({ level }: ConfidentialityBadgeProps) {
  const { bg, text } = getConfidentialityColors(level);
  return (
    <span
      className="inline-flex items-center rounded"
      style={{
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: bg,
        color: text,
        padding: '2px 8px',
        whiteSpace: 'nowrap',
      }}
    >
      {getConfidentialityName(level)}
    </span>
  );
}
