import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    // mode: 'dark',
    background: {
        default: '#ffffff',
    },
    primary: {
        main: 'rgb(5, 31, 26)',
        contrastText: '#ffffff',
    },
    secondary: {
        main: 'rgb(32, 114, 98)',
    },
    success: {
        main: '#ffb16b',
    }
  },
  typography: {
    fontFamily: [
        'Sentient-Regular',
        'Roboto',
        'sans-serif',
        'Poppins'
    ].join(','),
    body1: {
        fontFamily: 'Sentient-Regular',
        fontSize: '1rem' // 17.6px
    },
    body2: {
        fontFamily: 'Sentient-Regular',
        fontSize: '0.8rem' // 17.6px
    },
    caption: {
        fontFamily: 'Sentient-Regular',
        fontSize: '0.7rem' // 17.6px
    },
    h1: {
        fontFamily: 'Teko-Light',
        fontSize: '2.5rem' // 56px
    },
    button: {
        fontFamily: 'Teko-Light',
        color: "#ffffff",
        fontSize: '1.5rem'
    }
  },
});