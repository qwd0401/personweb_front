import { createTheme, ThemeOptions } from '@mui/material/styles';

const commonThemeSettings: ThemeOptions = {
  typography: {
    fontFamily: "'Roboto', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      letterSpacing: '-0.022em',
      lineHeight: 1.2,
      background: 'linear-gradient(135deg, #6200EA 0%, #B388FF 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.021em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.019em',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02857em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.9375rem',
          fontWeight: 600,
          lineHeight: 1.75,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          background: 'linear-gradient(135deg, #6200EA 0%, #B388FF 100%)',
          boxShadow: '0 8px 16px rgba(98, 0, 234, 0.15)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5000D6 0%, #A370FF 100%)',
            boxShadow: '0 12px 20px rgba(98, 0, 234, 0.2)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
};

const lightPalette = {
  mode: 'light' as const,
  primary: {
    main: '#6200EA',
    light: '#B388FF',
    dark: '#4A00B0',
  },
  secondary: {
    main: '#00BFA5',
    light: '#64FFDA',
    dark: '#008975',
  },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
  },
  divider: 'rgba(0, 0, 0, 0.08)',
};

const darkPalette = {
  mode: 'dark' as const,
  primary: {
    main: '#B388FF',
    light: '#E7B9FF',
    dark: '#7C4DFF',
  },
  secondary: {
    main: '#64FFDA',
    light: '#9EFFFF',
    dark: '#14CBA8',
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
  },
  divider: 'rgba(255, 255, 255, 0.08)',
};

export const lightTheme = createTheme({
  ...commonThemeSettings,
  palette: lightPalette,
} as ThemeOptions);

export const darkTheme = createTheme({
  ...commonThemeSettings,
  palette: darkPalette,
} as ThemeOptions); 