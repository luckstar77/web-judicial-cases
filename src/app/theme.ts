import { alpha, createTheme } from '@mui/material/styles';

export const BRAND_COLORS = {
  primary: '#0E5E6F',
  primaryDark: '#0A4653',
  primaryLight: '#E6F1F3',
  accent: '#E9A23B',
  accentDark: '#9A5B00',
  accentLight: '#FDF4E6',
  error: '#D64545',
  success: '#2E8B57',
  background: '#F6F7F9',
  paper: '#FFFFFF',
  textPrimary: '#1A2027',
  textSecondary: '#5A6473',
  border: '#E3E6EA',
} as const;

const FONT_FAMILY = '"PingFang TC","Noto Sans TC","Microsoft JhengHei",system-ui,-apple-system,"Segoe UI",sans-serif';
const BASE_RADIUS = 12;
const CARD_RADIUS = 16;
const FOCUS_RING_WIDTH = 3;

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: BRAND_COLORS.primary, dark: BRAND_COLORS.primaryDark, light: '#3F8796', contrastText: '#FFFFFF' },
    secondary: { main: BRAND_COLORS.accent, dark: BRAND_COLORS.accentDark, contrastText: BRAND_COLORS.textPrimary },
    warning: { main: BRAND_COLORS.accent, dark: BRAND_COLORS.accentDark, light: BRAND_COLORS.accentLight, contrastText: BRAND_COLORS.textPrimary },
    error: { main: BRAND_COLORS.error },
    success: { main: BRAND_COLORS.success },
    background: { default: BRAND_COLORS.background, paper: BRAND_COLORS.paper },
    text: { primary: BRAND_COLORS.textPrimary, secondary: BRAND_COLORS.textSecondary },
    divider: BRAND_COLORS.border,
  },
  shape: { borderRadius: BASE_RADIUS },
  spacing: 8,
  typography: {
    fontFamily: FONT_FAMILY,
    h1: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '0.01em' },
    h2: { fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.35 },
    h3: { fontSize: '1.375rem', fontWeight: 700, lineHeight: 1.4 },
    h4: { fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.4 },
    h5: { fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.45 },
    h6: { fontSize: '1rem', fontWeight: 700, lineHeight: 1.5 },
    subtitle1: { fontSize: '1rem', fontWeight: 600 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 600 },
    body1: { fontSize: '1rem', lineHeight: 1.75 },
    body2: { fontSize: '0.875rem', lineHeight: 1.7 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.02em' },
    caption: { fontSize: '0.8125rem', lineHeight: 1.6 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: BRAND_COLORS.background, WebkitFontSmoothing: 'antialiased' },
        '::selection': { backgroundColor: alpha(BRAND_COLORS.accent, 0.35) },
        mark: { backgroundColor: alpha(BRAND_COLORS.accent, 0.35), color: 'inherit', borderRadius: 4, padding: '0 2px' },
        a: { color: BRAND_COLORS.primary },
      },
    },
    MuiButtonBase: {
      defaultProps: { disableRipple: false },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 18,
          '&.Mui-focusVisible': { outline: `${FOCUS_RING_WIDTH}px solid ${alpha(BRAND_COLORS.primary, 0.35)}`, outlineOffset: 2 },
        },
        sizeLarge: { minHeight: 48, fontSize: '1rem' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': { outline: `${FOCUS_RING_WIDTH}px solid ${alpha(BRAND_COLORS.primary, 0.35)}` },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        outlined: { borderColor: BRAND_COLORS.border },
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: { borderRadius: CARD_RADIUS, borderColor: BRAND_COLORS.border },
      },
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': { outline: `${FOCUS_RING_WIDTH}px solid ${alpha(BRAND_COLORS.primary, 0.35)}`, outlineOffset: -FOCUS_RING_WIDTH },
        },
        focusHighlight: { backgroundColor: BRAND_COLORS.primary },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: { backgroundColor: alpha(BRAND_COLORS.paper, 0.92), backdropFilter: 'blur(8px)', borderBottom: `1px solid ${BRAND_COLORS.border}` },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: BRAND_COLORS.paper },
        notchedOutline: { borderColor: BRAND_COLORS.border },
      },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: '0.8125rem', backgroundColor: BRAND_COLORS.textPrimary },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: CARD_RADIUS },
      },
    },
    MuiAccordion: {
      defaultProps: { disableGutters: true, elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${BRAND_COLORS.border}`,
          borderRadius: BASE_RADIUS,
          '&:before': { display: 'none' },
          '&:not(:last-of-type)': { marginBottom: 12 },
        },
      },
    },
    MuiSkeleton: {
      defaultProps: { animation: 'wave' },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: { minWidth: 0, paddingInline: 4 },
        label: { fontSize: '0.75rem', '&.Mui-selected': { fontSize: '0.75rem', fontWeight: 600 } },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem' },
      },
    },
  },
});
