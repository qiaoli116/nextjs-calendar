import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

declare module '@mui/material/styles' {
  interface TypographyVariants {
    lable: React.CSSProperties;
    value: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    lable?: React.CSSProperties;
    value?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    lable: true;
    value: true;
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    lable: {
      fontSize: '.75rem',
      color: grey[500],
    },
    value: {
      fontSize: '1rem',
    },
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => {
          switch (ownerState.severity) {
            case 'error':
              return { backgroundColor: 'rgb(253, 237, 237)' };
            case 'info':
              return { backgroundColor: 'rgb(229, 246, 253)' };
            case 'success':
              return { backgroundColor: 'rgb(237, 247, 237)' };
            case 'warning':
              return { backgroundColor: 'rgb(255, 244, 229)' };
            default:
              return {};
          }
        },
      },
    },
  },
});

export default theme;
