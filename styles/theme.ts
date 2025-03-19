import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Create a theme instance
const baseTheme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#8B4513', // Warm Brown
          light: '#A0522D', // Lighter Brown
          dark: '#654321', // Darker Brown
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: '#4D8076', // Muted Teal
          light: '#5E9E92', // Lighter Teal
          dark: '#3D655E', // Darker Teal
          contrastText: '#FFFFFF',
        },
        background: {
          default: '#F8F8F8',
          paper: '#FFFFFF',
        },
        text: {
          primary: '#333333',
          secondary: '#555555',
        },
        error: {
          main: '#F44336',
        },
        warning: {
          main: '#FFC107',
        },
        info: {
          main: '#2196F3',
        },
        success: {
          main: '#4CAF50',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#A0522D', // Lighter Brown for dark mode
          light: '#B5734E', // Even lighter for dark mode
          dark: '#8B4513', // Original brown as dark in dark mode
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: '#5E9E92', // Lighter Teal for dark mode
          light: '#6FAFA3', // Even lighter teal for dark mode
          dark: '#4D8076', // Original teal as dark in dark mode
          contrastText: '#FFFFFF',
        },
        background: {
          default: '#121212',
          paper: '#1E1E1E',
        },
        text: {
          primary: '#E0E0E0',
          secondary: '#AAAAAA',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
        }),
        contained: {
          padding: '0.5rem 1.25rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 8,
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
        },
      },
    },
  },
});

// Apply responsive typography
const theme = responsiveFontSizes(baseTheme);

export default theme; 