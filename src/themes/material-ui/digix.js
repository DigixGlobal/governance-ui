const uiCreator = require('@material-ui/core/styles');

module.exports = uiCreator.createMuiTheme({
  palette: {
    primary: {
      main: '#29395e',
    },
    secondary: {
      main: '#C4A159',
    },
  },
  status: {
    danger: 'red',
  },

  typography: {
    color: '#fff',
    fontFamily: ['futura-pt', '"Futura PT"', 'Roboto', 'Arial', 'sans-serif'].join(','),
    fontSize: 18,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    display4: {
      fontSize: '3.2em',
      color: '#fff',
      fontWeight: 500,
    },
    display3: {
      fontSize: '2.5',
      color: '#fff',
      fontWeight: 500,
    },

    subheading: {
      color: '#fff',
      fontWeight: '300',
    },

    body1: {
      color: '#fff',
      fontWeight: '300',
    },
  },
});
