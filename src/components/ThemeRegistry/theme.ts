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
        root: ({ ownerState }) => ({
          ...(ownerState.severity === 'info' && {
            backgroundColor: '#60a5fa',
          }),
        }),
      },
    },
  },
});

export default theme;
