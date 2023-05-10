import { createTheme, responsiveFontSizes } from '@mui/material';

const theme = responsiveFontSizes(
  createTheme({
    typography: {
      h3: {
        fontSize: 25
      }
    }
  })
);

export default theme;
