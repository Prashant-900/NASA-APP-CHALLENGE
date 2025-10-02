import { createTheme } from '@mui/material/styles';

const shapeOverrides = {
  shape: {
    borderRadius: 0,
  },
};

// PURE WHITE THEME
const lightTheme = createTheme({
  ...shapeOverrides,
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
      light: '#333333',
      dark: '#000000',
    },
    secondary: {
      main: '#666666',
      light: '#999999',
      dark: '#333333',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
    grey: {
      50: '#ffffff',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--bg-paper': '#ffffff',
          '--border-color': '#e0e0e0',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: '#ffffff',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#bdbdbd',
        },
      },
    },
  },
});

// PURE DARK THEME
const darkTheme = createTheme({
  ...shapeOverrides,
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#cccccc',
    },
    secondary: {
      main: '#999999',
      light: '#cccccc',
      dark: '#666666',
    },
    background: {
      default: '#000000',
      paper: '#000000',
    },
    text: {
      primary: '#ffffff',
      secondary: '#999999',
    },
    grey: {
      50: '#121212',
      100: '#1a1a1a',
      200: '#2a2a2a',
      300: '#3a3a3a',
      400: '#4a4a4a',
      500: '#5a5a5a',
      600: '#6a6a6a',
      700: '#7a7a7a',
      800: '#8a8a8a',
      900: '#9a9a9a',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--bg-paper': '#000000',
          '--border-color': '#333333',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: '#000000',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#333333',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#555555',
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
