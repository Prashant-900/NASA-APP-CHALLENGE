import { createTheme } from '@mui/material/styles';

const shapeOverrides = {
  shape: {
    borderRadius: 0,
  },
};

const lightTheme = createTheme({
  ...shapeOverrides,
  palette: {
    mode: 'light',
    primary: {
      main: '#f8f9fa',
      light: '#ffffff',
      dark: '#e9ecef',
    },
    secondary: {
      main: '#6c757d',
      light: '#adb5bd',
      dark: '#495057',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212529',
      secondary: '#495057',
    },
    grey: {
      50: '#fafafa',
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
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#a8a8a8',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  ...shapeOverrides,
  palette: {
    mode: 'dark',
    primary: {
      main: '#343a40',
      light: '#495057',
      dark: '#212529',
    },
    secondary: {
      main: '#adb5bd',
      light: '#dee2e6',
      dark: '#6c757d',
    },
    background: {
      default: '#212529',
      paper: '#343a40',
    },
    text: {
      primary: '#f8f9fa',
      secondary: '#ced4da',
    },
    grey: {
      50: '#fafafa',
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
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: '#2d3338',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#495057',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#6c757d',
        },
      },
    },
  },
});

export { lightTheme, darkTheme };