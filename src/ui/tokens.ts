export const palette = {
  brand: {
    navy: '#092C62',
    pesoBlue: '#1F618D',
    skyBlue: '#5DADE2',
    softTeal: '#76B5C5',
  },
  violet: { primary: '#6A3D9A', soft: '#A882C8', cool: '#7A94CC' },
  green: { primary: '#2E8B57', soft: '#8BC34A', cool: '#6BB5B5' },
  yellow: { primary: '#E6B800', soft: '#F4D03F', muted: '#B8A85A' },
  orange: { primary: '#E86A24', soft: '#F5B041', cool: '#8FA8BE' },
  red: { primary: '#C83232', soft: '#E87A7A', cool: '#B5658A' },
  surface: { paper: '#FFFFFF', ivory: '#FAF8F3', blueGray: '#EEF4F9' },
  border: { default: '#DCE5EF' },
  text: { muted: '#64748B', deepInk: '#172B4D' },
} as const;

export const colors = {
  surface: {
    app: palette.surface.ivory,
    card: palette.surface.paper,
    subtle: palette.surface.blueGray,
    balance: palette.brand.pesoBlue,
  },
  text: {
    body: palette.text.deepInk,
    heading: palette.brand.navy,
    mutedOnCard: palette.text.muted,
    onPrimary: palette.surface.paper,
    error: palette.red.primary,
  },
  action: {
    primary: palette.brand.pesoBlue,
    pressed: palette.brand.navy,
    disabled: palette.surface.blueGray,
  },
  border: {
    divider: palette.border.default,
    control: palette.brand.pesoBlue,
    focus: palette.brand.navy,
    error: palette.red.primary,
  },
  status: {
    info: { background: palette.violet.primary, foreground: palette.surface.paper },
    success: { background: palette.green.soft, foreground: palette.text.deepInk },
    pending: { background: palette.yellow.soft, foreground: palette.brand.navy },
    warning: { background: palette.orange.soft, foreground: palette.text.deepInk },
    error: { background: palette.red.primary, foreground: palette.surface.paper },
  },
} as const;

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radius = { control: 8, card: 16, badge: 999 } as const;
export const touchTarget = 48;

export const fontFamily = { regular: 'InterRegular', semibold: 'InterSemiBold' } as const;

export const typography = {
  caption: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: fontFamily.semibold, fontSize: 16, lineHeight: 24 },
  heading: { fontFamily: fontFamily.semibold, fontSize: 20, lineHeight: 28 },
  title: { fontFamily: fontFamily.semibold, fontSize: 24, lineHeight: 32 },
  display: { fontFamily: fontFamily.semibold, fontSize: 32, lineHeight: 40 },
} as const;
