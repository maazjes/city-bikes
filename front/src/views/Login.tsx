import { TextField, Button, Container } from '@mui/material';
import { useState, useContext } from 'react';
import { login } from 'src/services/login';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import TokenContext from 'src/context/token';

const Login = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useContext(TokenContext)!;
  const navigate = useNavigate();
  const { refetch } = useQuery('login', () => login({ username, password }), {
    enabled: false
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { data } = await refetch();
    if (data) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }
    navigate('/');
  };

  return (
    <Container
      onSubmit={onSubmit}
      component="form"
      maxWidth="xs"
      sx={{ display: 'flex', flexDirection: 'column', marginTop: '10%' }}
    >
      <TextField
        onChange={(e): void => setUsername(e.target.value)}
        type="text"
        sx={{ m: 1 }}
        required
        label="Username"
        id="margin-dense"
      />
      <TextField
        onChange={(e): void => setPassword(e.target.value)}
        type="password"
        sx={{ m: 1 }}
        required
        label="Password"
        id="margin-dense"
      />
      <Button sx={{ m: 1 }} size="large" type="submit" variant="contained">
        Login
      </Button>
    </Container>
  );
};

export default Login;
