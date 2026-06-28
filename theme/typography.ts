export const typography = {
  displayXL: { fontSize: 28, fontWeight: '800' as const, lineHeight: 34, letterSpacing: -0.5 },
  displayL:  { fontSize: 22, fontWeight: '700' as const, lineHeight: 28, letterSpacing: -0.3 },

  h1: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26 },
  h2: { fontSize: 17, fontWeight: '700' as const, lineHeight: 22 },
  h3: { fontSize: 15, fontWeight: '600' as const, lineHeight: 20 },

  bodyL:  { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyM:  { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodyS:  { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },

  label:    { fontSize: 11, fontWeight: '600' as const, lineHeight: 14, letterSpacing: 0.8, textTransform: 'uppercase' as const },
  caption:  { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button:   { fontSize: 15, fontWeight: '700' as const, lineHeight: 20 },
  buttonSm: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
} as const;
