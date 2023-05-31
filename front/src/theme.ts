import { createTheme, responsiveFontSizes } from '@mui/material';

const theme = responsiveFontSizes(
  createTheme({
    typography: {
      h3: {
        fontSize: 25
      },
      body1: {
        fontSize: 16
      }
    }
  })
);

export default theme;
