declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    back: Palette['primary'];
    accent: Palette['primary'];
  }
  interface PaletteOptions {
    back: PaletteOptions['primary'];
    accent: PaletteOptions['primary'];
  }
}

import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    type: 'light',
    back: {
      main: '#c7d3df'
    },
    primary: {
      main: '#5273a0'
    },
    secondary: {
      main: '#f44336'
    },
    accent: {
      main: '#ffab40',
    },
  },
});
