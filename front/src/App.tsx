import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material';
import Login from './views/Login';
import Register from './views/Register';
import TokenContext from './context/token';
import { TokenContext as TokenContextType } from './types';
import AppBar from './components/AppBar';
import theme from './theme';
import Journeys from './views/Journeys';
import Stations from './views/Stations';
import SingleStation from './views/SingleStation';
import AddStations from './views/AddStations';
import AddJourneys from './views/AddJourneys';

const App = (): JSX.Element => {
  const [token, setToken] = useState<string | null>(null);
  const tokenContext = useMemo(
    (): TokenContextType => ({
      token,
      setToken
    }),
    [token, setToken]
  );

  useEffect(() => {
    const freshToken = localStorage.getItem('token');
    if (freshToken) {
      setToken(freshToken);
    }
  }, []);

  return (
    <QueryClientProvider client={new QueryClient()}>
      <div className="App">
        <BrowserRouter>
          <TokenContext.Provider value={tokenContext}>
            <ThemeProvider theme={theme}>
              <AppBar loggedIn={!!token} />
              <Routes>
                <Route path="/">
                  <Route path="journeys" element={<Journeys />} />
                  <Route path="stations" element={<Stations />} />
                  <Route path="stations/:id" element={<SingleStation />} />
                  <Route path="login" element={<Login />} />
                  {!token ? (
                    <>
                      <Route path="login" element={<Login />} />
                      <Route path="register" element={<Register />} />
                    </>
                  ) : (
                    <>
                      <Route path="add-stations" element={<AddStations />} />
                      <Route path="add-journeys" element={<AddJourneys />} />
                    </>
                  )}
                </Route>
              </Routes>
            </ThemeProvider>
          </TokenContext.Provider>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
};

export default App;
