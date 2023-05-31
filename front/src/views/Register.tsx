import { Button, Container } from '@mui/material';
import { Formik } from 'formik';
import FormikTextInput from 'src/components/FormikTextInput';
import { createUser } from 'src/services/users';
import * as yup from 'yup';

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
  const onSubmit = async ({ username, password }: typeof initialValues): Promise<void> => {
    await createUser({ username, password });
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
          <FormikTextInput
            required
            type="password"
            label="Password confirmation"
            name="passwordConfirmation"
          />
          <Button size="large" type="submit" variant="contained">
            Register
          </Button>
        </Container>
      )}
    </Formik>
  );
};

export default Register;
