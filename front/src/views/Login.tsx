import { Button, Container } from '@mui/material';
import { useContext } from 'react';
import { login } from 'src/services/login';
import { useNavigate } from 'react-router-dom';
import TokenContext from 'src/context/token';
import { Formik } from 'formik';
import FormikTextInput from 'src/components/FormikTextInput';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Minimum length of username is 3')
    .max(30, 'Maximum length of email is 30')
    .required('Username is required'),
  password: yup
    .string()
    .min(8, 'Minimum length of password is 8')
    .max(30, 'Maximum length of password is 30')
    .required('Password is required')
});

const initialValues = {
  username: '',
  password: ''
};

const Login = (): JSX.Element => {
  const { setToken } = useContext(TokenContext)!;
  const navigate = useNavigate();

  const onSubmit = async (values: typeof initialValues): Promise<void> => {
    const { token } = await login(values);
    localStorage.setItem('token', token);
    setToken(token);
    navigate('/');
  };

  return (
    <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={onSubmit}>
      {({ handleSubmit }): JSX.Element => (
        <Container
          onSubmit={(e): void => {
            e.preventDefault();
            handleSubmit();
          }}
          component="form"
          maxWidth="xs"
          sx={{ display: 'flex', flexDirection: 'column', marginTop: '10%' }}
        >
          <FormikTextInput required type="text" label="Username" name="username" />
          <FormikTextInput required type="password" label="Password" name="password" />
          <Button size="large" type="submit" variant="contained">
            Login
          </Button>
        </Container>
      )}
    </Formik>
  );
};

export default Login;
