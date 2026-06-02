export function formatINR(value: number, compact = false): string {
  if (!Number.isFinite(value)) return '₹0';
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (compact) {
    if (abs >= 1_00_00_000) {
      return `${sign}₹${(abs / 1_00_00_000).toFixed(2)} Cr`;
    }
    if (abs >= 1_00_000) {
      return `${sign}₹${(abs / 1_00_000).toFixed(2)} L`;
    }
    if (abs >= 1_000) {
      return `${sign}₹${(abs / 1_000).toFixed(1)}K`;
    }
  }

  return `${sign}₹${abs.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function parseINRInput(raw: string): number {
  const cleaned = raw.replace(/[₹,\s]/g, '').trim();
  if (!cleaned) return 0;
  const lower = cleaned.toLowerCase();
  const num = parseFloat(lower.replace(/[^\d.]/g, '')) || 0;
  if (lower.includes('cr')) return num * 1_00_00_000;
  if (lower.includes('l') || lower.includes('lac')) return num * 1_00_000;
  if (lower.includes('k')) return num * 1_000;
  return num;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
