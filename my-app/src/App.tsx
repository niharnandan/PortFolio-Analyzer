import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ButtonAppBar from './components/button-app-bar';
import Home from './pages/Home';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
    width: '80vw',
    maxWidth: '100vw',
    boxSizing: 'border-box',
  },
});

const App: React.FC = () => {
  const storedTheme = localStorage.getItem('theme');
  const initialTheme = storedTheme
    ? JSON.parse(storedTheme)
    : window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [theme, setTheme] = useState<boolean>(initialTheme);
  const classes = useStyles();

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1d1d1d',
      },
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#f48fb1',
      },
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <ButtonAppBar toggleTheme={toggleTheme} />
        <Container className={classes.root}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
