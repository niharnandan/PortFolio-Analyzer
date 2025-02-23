import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline, Button, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ButtonAppBar from './components/button-app-bar';
import Home from './pages/Home';
import { makeStyles } from '@mui/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleAuth from './components/authButton';

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
  loginMessage: {
    marginTop: '20px',
  },
});

const App: React.FC = () => {
  const storedTheme = localStorage.getItem('theme');
  const initialTheme = storedTheme
    ? JSON.parse(storedTheme)
    : window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [theme, setTheme] = useState<boolean>(initialTheme);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);  // Store user info after login
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

  const handleLoginSuccess = (response: any) => {
    const credential = response.credential;
    if (credential) {
      // Fetch the user's info using the ID token
      fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${credential}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.email === process.env.REACT_APP_ALLOWED_EMAIL) {
            setUser(data);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(data));  // Store user info in localStorage
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem('user'); // Clear any user info from localStorage
          }
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
          setIsAuthenticated(false);
        });
    }
  };
  

  const handleLoginFailure = () => {
    console.error('Login failed');
    setIsAuthenticated(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <ThemeProvider theme={theme ? darkTheme : lightTheme}>
      <CssBaseline />
      <GoogleOAuthProvider clientId="609771139985-a0a6s5irafoivv3tslc3etd744d1s48b.apps.googleusercontent.com">
        <Router>
          <ButtonAppBar 
          toggleTheme={toggleTheme} 
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          />
          <Container className={classes.root}>
            {!isAuthenticated && (
              <>
                <Typography variant="h6" className={classes.loginMessage}>
                <Typography sx={{paddingBottom: "20px"}}>
                  Please log in to access the homepage.
                  </Typography>
                </Typography>
                <GoogleAuth 
                onLoginSuccess={handleLoginSuccess} 
                onLoginFailure={handleLoginFailure} />
                <Navigate to="/" />
              </>
            )}
          </Container>
        </Router>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
};

export default App;
