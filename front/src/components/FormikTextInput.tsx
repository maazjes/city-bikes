import { useField } from 'formik';
import { TextField, TextFieldProps, Typography } from '@mui/material';

type FormikTextInputProps = TextFieldProps & {
  name: string;
  style?: TextFieldProps['style'];
};

const FormikTextInput = ({ name, style = {}, ...props }: FormikTextInputProps): JSX.Element => {
  const [field, meta, helpers] = useField<string>(name);
  const { error, touched } = meta;
  const showError = (touched && error !== undefined) || error === 'Username already exists';

  return (
    <>
      <TextField
        sx={[{ mb: 1.5 }, style]}
        onChange={(e): void => helpers.setValue(e.target.value)}
        onBlur={(): void => helpers.setTouched(true)}
        value={field.value}
        error={showError}
        {...props}
      />
      {showError && (
        <Typography
          variant="body1"
          sx={{
            color: 'red',
            mb: 1,
            mt: -0.5
          }}
        >
          {error}
        </Typography>
      )}
    </>
  );
};

export default FormikTextInput;
