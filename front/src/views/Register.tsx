import { TextField, Button, Container } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { createUser } from 'src/services/users';

const Register = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, setPasswordConfirmation] = useState('');
  const { refetch } = useQuery('login', () => createUser({ username, password }), {
    enabled: false
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await refetch();
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
      <TextField
        onChange={(e): void => setPasswordConfirmation(e.target.value)}
        type="password"
        sx={{ m: 1 }}
        required
        label="Password confirmation"
        id="margin-dense"
      />
      <Button sx={{ m: 1 }} size="large" type="submit" variant="contained">
        Register
      </Button>
    </Container>
  );
};

export default Register;
