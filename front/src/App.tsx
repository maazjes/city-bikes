import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ThemeProvider } from '@mui/material';
import Login from './views/Login';
import Register from './views/Register';
import AppBar from './components/AppBar';
import theme from './theme';
import Journeys from './views/Journeys';
import Stations from './views/Stations';
import SingleStation from './views/SingleStation';
import AddStations from './views/AddStations';
import AddJourneys from './views/AddJourneys';
import queryClient from './util/queryClient';
import { setAuthToken } from './util/authToken';
import { LoggedInContext as LoggedInContextType } from './types';
import LoggedInContext from './context/loggedIn';
import { refreshToken, verifyToken } from './services/tokens';

const App = (): JSX.Element => {
  const [loggedIn, setLoggedIn] = useState(false);
  const timer = useRef<NodeJS.Timer>();

  const loggedInContext = useMemo(
    (): LoggedInContextType => ({
      loggedIn,
      setLoggedIn
    }),
    [loggedIn, setLoggedIn]
  );

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    const initialize = async (): Promise<void> => {
      try {
        const { valid } = await verifyToken({ token });
        if (valid) {
          setLoggedIn(true);
          setAuthToken(token);
        }
      } catch {}
    };
    initialize();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!timer.current && loggedIn && token) {
      timer.current = setInterval(async () => {
        try {
          const { token: newToken } = await refreshToken({ token });
          setAuthToken(newToken);
        } catch {
          setLoggedIn(false);
          setAuthToken('');
        }
      }, 7180000);
    }

    return () => clearInterval(timer.current);
  }, [loggedIn]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <BrowserRouter>
          <LoggedInContext.Provider value={loggedInContext}>
            <ThemeProvider theme={theme}>
              <AppBar />
              {!loggedIn ? (
                <Routes>
                  <Route path="journeys" element={<Journeys />} />
                  <Route path="stations" element={<Stations />} />
                  <Route path="stations/:id" element={<SingleStation />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route index element={<Stations />} />
                </Routes>
              ) : (
                <Routes>
                  <Route path="journeys" element={<Journeys />} />
                  <Route path="stations" element={<Stations />} />
                  <Route path="stations/:id" element={<SingleStation />} />
                  <Route path="add-stations" element={<AddStations />} />
                  <Route path="add-journeys" element={<AddJourneys />} />
                  <Route index element={<Stations />} />
                </Routes>
              )}
            </ThemeProvider>
          </LoggedInContext.Provider>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
};

export default App;
