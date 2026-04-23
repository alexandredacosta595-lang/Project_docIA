/** Shared Recharts tooltip component */
export function ChartTooltip({ active, payload, label, valueFormatter }: {
  active?: boolean;
  payload?: any[];
  label?: string;
  valueFormatter?: (v: number, name: string) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white rounded shadow-sm p-3"
      style={{ border: '1px solid #edebe9', fontSize: '12px' }}
    >
      <p style={{ fontWeight: 600, color: '#323130', marginBottom: '4px' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}:{' '}
          <strong>
            {valueFormatter ? valueFormatter(p.value, p.name) : p.value}
          </strong>
        </p>
      ))}
    </div>
  );
}
