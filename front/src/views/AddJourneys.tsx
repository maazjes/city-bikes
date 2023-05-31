import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import { ChangeEvent, FormEvent, useState, useRef } from 'react';
import FormikTextInput from 'src/components/FormikTextInput';
import ProgressBar from 'src/components/ProgressBar';
import useAppBarHeight from 'src/hooks/useAppBarHeight';
import { countJourneys, createJourney, createJourneysFromCSV } from 'src/services/journeys';
import theme from 'src/theme';
import { Journey } from 'src/types';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  departureTime: yup.date().required(),
  returnTime: yup.date().required(),
  departureStationId: yup.number().required(),
  returnStationId: yup.number().required(),
  distance: yup.number().required().min(0),
  duration: yup.number().required().min(0)
});

const initialValues = {
  departureTime: undefined,
  returnTime: undefined,
  departureStationId: undefined,
  returnStationId: undefined,
  distance: undefined,
  duration: undefined
} as unknown as Journey;

const AddJourneys = (): JSX.Element => {
  const [file, setFile] = useState<File>();
  const [faultyRows, setFaultyRows] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const estimatedRows = useRef<number>();
  const appBarHeight = useAppBarHeight();

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      estimatedRows.current = e.target.files[0].size / 88;
      setProgress(0);
      setFaultyRows([]);
      setFile(e.target.files[0]);
    }
  };

  const onFileSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (file) {
      const timer = setInterval(async () => {
        const { count } = await countJourneys();
        const newProgress = (count / estimatedRows.current!) * 100;
        if (newProgress < 100) {
          setProgress(progress + newProgress);
        }
      }, 2000);

      const res = await createJourneysFromCSV(file);

      if (progress < 100) {
        setProgress(100);
      }

      clearInterval(timer);
      setFaultyRows(res);
    }
  };

  const onSingleSubmit = async (values: Omit<Journey, 'id'>): Promise<void> => {
    await createJourney(values);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        minHeight: Math.max(window.innerHeight - appBarHeight, 760)
      }}
    >
      <Grid
        component="form"
        onSubmit={onFileSubmit}
        spacing={2.5}
        container
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h3">Add journeys from file</Typography>
        </Grid>
        <Grid item>
          <Grid
            container
            spacing={2.5}
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Button variant="contained" component="label">
                Select File
                <input onChange={(e): void => onChange(e)} type="file" hidden />
              </Button>
            </Grid>
            {file && (
              <Grid item width="100%" sx={{ [theme.breakpoints.up(269)]: { display: 'none' } }}>
                <Box>
                  <Typography align="center" variant="body1">
                    {decodeURIComponent(file.name)}
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item>
              <Button type="submit" variant="outlined">
                Upload
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {file && (
          <Grid item sx={{ [theme.breakpoints.down(269)]: { display: 'none' } }}>
            <Box>
              <Typography variant="body1">{decodeURIComponent(file.name)}</Typography>
            </Box>
          </Grid>
        )}
        {progress > 0 && (
          <Grid item width="100%">
            <ProgressBar value={progress} />
          </Grid>
        )}
        {faultyRows.length > 0 && (
          <Grid item width="100%">
            <Typography sx={{ mb: 2 }} align="center" variant="body1">
              These rows didn&apos;t pass the validation
            </Typography>
            <TextField contentEditable={false} value={faultyRows.join('\n')} fullWidth multiline />
          </Grid>
        )}
      </Grid>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSingleSubmit}
      >
        {({ handleSubmit }): JSX.Element => (
          <Box
            onSubmit={(e): void => {
              e.preventDefault();
              handleSubmit();
            }}
            component="form"
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <Typography mb={3} align="center" variant="h3">
              Add a single journey
            </Typography>
            <FormikTextInput required type="text" label="Departure time" name="departureTime" />
            <FormikTextInput required type="text" label="Return time" name="returnTime" />
            <FormikTextInput
              required
              type="text"
              label="Departure station ID"
              name="departureStationId"
            />
            <FormikTextInput
              required
              type="text"
              label="Return station ID"
              name="returnStationId"
            />
            <FormikTextInput required type="text" label="Distance" name="distance" />
            <FormikTextInput required type="text" label="Duration" name="duration" />
            <Button size="large" type="submit" variant="contained">
              Add
            </Button>
          </Box>
        )}
      </Formik>
    </Container>
  );
};

export default AddJourneys;
