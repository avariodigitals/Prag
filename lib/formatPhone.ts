export function formatPhone(raw: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, '');

  if (!digits) return trimmed;

  // Nigerian number normalization
  let normalized = digits;
  if (normalized.startsWith('234') && normalized.length === 13) {
    return `+234 ${normalized.slice(3, 6)} ${normalized.slice(6, 9)} ${normalized.slice(9)}`;
  }
  if (normalized.startsWith('0') && normalized.length === 11) {
    normalized = '234' + normalized.slice(1);
    return `+234 ${normalized.slice(3, 6)} ${normalized.slice(6, 9)} ${normalized.slice(9)}`;
  }
  if (normalized.length === 10 && !normalized.startsWith('234')) {
    normalized = '234' + normalized;
    return `+234 ${normalized.slice(3, 6)} ${normalized.slice(6, 9)} ${normalized.slice(9)}`;
  }

  return trimmed;
}
