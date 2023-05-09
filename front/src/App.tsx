import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useEffect, useMemo, useState } from 'react';
import Login from './views/Login';
import Register from './views/Register';
import TokenContext from './context/token';
import { TokenContext as TokenContextType } from './types';
import Header from './components/Header';

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

  console.log(token);

  return (
    <QueryClientProvider client={new QueryClient()}>
      <div className="App">
        <BrowserRouter>
          <TokenContext.Provider value={tokenContext}>
            <Header loggedIn={!!token} />
            <Routes>
              <Route path="/">
                {!token && (
                  <>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                  </>
                )}
              </Route>
            </Routes>
          </TokenContext.Provider>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
};

export default App;
