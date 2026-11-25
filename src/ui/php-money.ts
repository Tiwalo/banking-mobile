const MAX_MINOR = '9223372036854775807';
const MIN_MINOR_MAGNITUDE = '9223372036854775808';

function isWithinMinorRange(digits: string, limit: string): boolean {
  return digits.length < limit.length || (digits.length === limit.length && digits <= limit);
}

/** Converts a completed, unsigned peso draft to a canonical centavo string. */
export function parsePesoDraft(draft: string): string | null {
  const value = draft.trim();
  // Accept the decimal separator shown by the device keyboard, without grouping.
  if (!/^(?:[0-9]+(?:[.,][0-9]{1,2})?|[.,][0-9]{1,2})$/.test(value)) {
    return null;
  }

  const [whole, fraction = ''] = value.split(/[.,]/);
  const minor = (whole + fraction.padEnd(2, '0')).replace(/^0+(?=[0-9])/, '');
  return isWithinMinorRange(minor, MAX_MINOR) ? minor : null;
}

/** Formats a canonical signed centavo string without converting it to a number. */
export function formatPesoMinor(minor: string): string | null {
  const negative = minor.startsWith('-');
  const magnitude = negative ? minor.slice(1) : minor;
  if (
    magnitude.length === 0 ||
    /[^0-9]/.test(magnitude) ||
    (magnitude.startsWith('0') && (negative || magnitude.length > 1)) ||
    !isWithinMinorRange(magnitude, negative ? MIN_MINOR_MAGNITUDE : MAX_MINOR)
  ) {
    return null;
  }

  const digits = magnitude.padStart(3, '0');
  const whole = digits.slice(0, -2).replace(/\B(?=(?:[0-9]{3})+$)/g, ',');
  return (negative ? '−' : '') + '₱' + whole + '.' + digits.slice(-2);
}
