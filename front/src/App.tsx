import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material';
import Login from './views/Login';
import Register from './views/Register';
import TokenContext from './context/token';
import { TokenContext as TokenContextType } from './types';
import Header from './components/Header';
import Upload from './views/Upload';
import theme from './theme';

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
              <Header loggedIn={!!token} />
              <Routes>
                <Route path="/">
                  {!token ? (
                    <>
                      <Route path="login" element={<Login />} />
                      <Route path="register" element={<Register />} />
                    </>
                  ) : (
                    <Route path="upload" element={<Upload />} />
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
