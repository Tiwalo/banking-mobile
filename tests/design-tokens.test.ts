import { colors } from '../src/ui/tokens';

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((index) => {
    const channel = Number.parseInt(hex.slice(index, index + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test.each([
  ['body on ivory', colors.text.body, colors.surface.app],
  ['body on paper', colors.text.body, colors.surface.card],
  ['headings on ivory', colors.text.heading, colors.surface.app],
  ['headings on paper', colors.text.heading, colors.surface.card],
  ['headings on subtle surfaces', colors.text.heading, colors.surface.subtle],
  ['body on subtle surfaces', colors.text.body, colors.surface.subtle],
  ['metadata on paper', colors.text.mutedOnCard, colors.surface.card],
  ['error text on ivory', colors.text.error, colors.surface.app],
  ['error text on paper', colors.text.error, colors.surface.card],
  ['balance content', colors.text.onPrimary, colors.surface.balance],
  ['primary button', colors.text.onPrimary, colors.action.primary],
  ['pressed primary button', colors.text.onPrimary, colors.action.pressed],
  ...Object.entries(colors.status).map(([role, pair]) => [role, pair.foreground, pair.background]),
])('%s meets AA normal-text contrast', (_role, foreground, background) => {
  expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
});

test.each([
  ['field boundary on ivory', colors.border.control, colors.surface.app],
  ['field boundary on paper', colors.border.control, colors.surface.card],
  ['invalid field on ivory', colors.border.error, colors.surface.app],
  ['invalid field on paper', colors.border.error, colors.surface.card],
  ['focus outline on ivory', colors.border.focus, colors.surface.app],
  ['focus outline on paper', colors.border.focus, colors.surface.card],
  ['focus outline on subtle surfaces', colors.border.focus, colors.surface.subtle],
])('%s meets AA control contrast', (_role, foreground, background) => {
  expect(contrast(foreground, background)).toBeGreaterThanOrEqual(3);
});
