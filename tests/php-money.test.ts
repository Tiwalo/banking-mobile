import { formatPesoMinor, parsePesoDraft } from '../src/ui/php-money';

describe('peso draft parsing', () => {
  test.each([
    ['0', '0'],
    ['.5', '50'],
    ['0001,20', '120'],
    [' 42 ', '4200'],
    ['90071992547409.93', '9007199254740993'],
    ['92233720368547758.07', '9223372036854775807'],
  ])('converts %s to %s centavos', (draft, minor) => {
    expect(parsePesoDraft(draft)).toBe(minor);
  });

  test.each([
    '', '.', '1.', '-1', '+1', '₱1', '0.001', '1,234', '1,234.50', '1e3',
    '5 0', '92233720368547758.08',
  ])('rejects incomplete, malformed, or overflowing draft %j', (draft) => {
    expect(parsePesoDraft(draft)).toBeNull();
  });
});

describe('centavo formatting', () => {
  test.each([
    ['0', '₱0.00'],
    ['1', '₱0.01'],
    ['123450', '₱1,234.50'],
    ['-100', '−₱1.00'],
    ['9223372036854775807', '₱92,233,720,368,547,758.07'],
    ['-9223372036854775808', '−₱92,233,720,368,547,758.08'],
  ])('formats the lossless amount %s', (minor, expected) => {
    expect(formatPesoMinor(minor)).toBe(expected);
  });

  test.each([
    '', '-', '01', '-0', '+1', '0.0', '100\n', ' 1', '9223372036854775808',
    '-9223372036854775809',
  ])('rejects invalid centavo string %j', (minor) => {
    expect(formatPesoMinor(minor)).toBeNull();
  });
});
