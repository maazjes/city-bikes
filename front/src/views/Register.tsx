import { Button, Container } from '@mui/material';
import { Formik } from 'formik';
import { useState } from 'react';
import FormikTextInput from 'src/components/FormikTextInput';
import { createUser } from 'src/services/users';
import * as yup from 'yup';
import Notification from 'src/components/Notification';
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
    .required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required')
});

const initialValues = {
  username: '',
  password: '',
  passwordConfirmation: ''
};

const Register = (): JSX.Element => {
  const [notification, setNotification] = useState({ text: '', error: false });
  const appBarHeight = useAppBarHeight();

  const onSubmit = async ({ username, password }: typeof initialValues): Promise<void> => {
    try {
      await createUser({ username, password });
      setNotification({ error: false, text: 'Successfully registered. You can now login!' });
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
          <FormikTextInput required type="text" label="Username" name="username" />
          <FormikTextInput required type="password" label="Password" name="password" />
          <FormikTextInput
            required
            type="password"
            label="Password confirmation"
            name="passwordConfirmation"
          />
          <Button size="large" type="submit" variant="contained">
            Register
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

export default Register;
