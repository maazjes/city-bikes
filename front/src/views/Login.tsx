import { Button, Container } from '@mui/material';
import { useContext, useState } from 'react';
import { login } from 'src/services/login';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import FormikTextInput from 'src/components/FormikTextInput';
import * as yup from 'yup';
import Notification from 'src/components/Notification';
import { setAuthToken } from 'src/util/authToken';
import LoggedInContext from 'src/context/loggedIn';
import useAppBarHeight from 'src/hooks/useAppBarHeight';

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Minimum length of username is 3')
    .max(20, 'Maximum length of username is 20')
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
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ text: '', error: false });
  const { setLoggedIn } = useContext(LoggedInContext);
  const appBarHeight = useAppBarHeight();

  const onSubmit = async (values: typeof initialValues): Promise<void> => {
    try {
      const { token } = await login(values);
      setLoggedIn(true);
      localStorage.setItem('token', token);
      setAuthToken(token);
      navigate('/stations');
    } catch (error) {
      if (error instanceof Error) {
        setNotification({ error: true, text: error.message });
      }
    }
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
          sx={{
            display: 'flex',
            height: window.innerHeight - appBarHeight,
            pb: `${appBarHeight}px`,
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <FormikTextInput required type="text" label="Username" name="username" id="username" />
          <FormikTextInput
            required
            type="password"
            label="Password"
            name="password"
            id="password"
          />
          <Button size="large" type="submit" variant="contained" id="login-button">
            Login
          </Button>
          <Notification
            error={notification.error}
            sx={{ mt: 1.5 }}
            text={notification.text}
            visible={!!notification.text}
          />
        </Container>
      )}
    </Formik>
  );
};

export default Login;
