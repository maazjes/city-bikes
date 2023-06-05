import { Box, Button, Container, Grid, Link, Typography } from '@mui/material';
import { Formik } from 'formik';
import { ChangeEvent, FormEvent, useState } from 'react';
import FormikTextInput from 'src/components/FormikTextInput';
import Notification from 'src/components/Notification';
import ProgressBar from 'src/components/ProgressBar';
import { countJourneys, createJourney, createJourneysFromCSV } from 'src/services/journeys';
import theme from 'src/theme';
import { Journey } from 'src/types';
import { createTextFile } from 'src/util/helpers';
import * as yup from 'yup';
import { useMutation } from 'react-query';
import queryClient from 'src/util/queryClient';

const validationSchema = yup.object().shape({
  departureTime: yup.date().required(),
  returnTime: yup.date().required(),
  departureStationId: yup.number().required(),
  returnStationId: yup.number().required(),
  distance: yup.number().required().min(10),
  duration: yup.number().required().min(10)
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
  const [notification, setNotification] = useState({ text: '', error: false });
  const [notification1, setNotification1] = useState({ text: '', error: false });

  const { mutateAsync: mutateJourneysCSV } = useMutation<string[], unknown, File>(
    'createStationsFromCSV',
    (journeys) => createJourneysFromCSV(journeys),
    {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ['PaginatedJourneys'], exact: false });
      }
    }
  );

  const { mutateAsync: mutateJourney } = useMutation<unknown, unknown, Omit<Journey, 'id'>>(
    'createStation',
    (journey) => createJourney(journey),
    {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ['PaginatedJourneys'], exact: false });
      }
    }
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setProgress(0);
      setFaultyRows([]);
      setFile(e.target.files[0]);
    }
  };

  const onFileSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (file) {
      let timer;

      try {
        const { count: initialCount } = await countJourneys();
        const estimatedRows = file.size / 88;

        timer = setInterval(async () => {
          const { count } = await countJourneys();
          const newProgress = ((count - initialCount) / estimatedRows) * 100;
          if (newProgress < 100) {
            setProgress(progress + newProgress);
          }
        }, 3000);

        const res = await mutateJourneysCSV(file);
        setFaultyRows(res);

        if (progress < 100) {
          setProgress(100);
        }
      } catch (error) {
        setProgress(0);
        if (error instanceof Error) {
          setNotification1({ error: true, text: error.message });
        }
      }

      clearInterval(timer);
    }
  };

  const onSingleSubmit = async (values: Omit<Journey, 'id'>): Promise<void> => {
    try {
      await mutateJourney(values);
      setNotification({ error: false, text: 'Successfully created a new journey!' });
    } catch (error) {
      if (error instanceof Error) {
        setNotification({ error: true, text: error.message });
      }
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        pt: 7,
        pb: 7
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
              <Button variant="contained" component="label" id="select-file">
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
              <Button type="submit" variant="outlined" id="upload-file">
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
        <Notification
          error={notification1.error}
          sx={{ mt: 1.5 }}
          visible={!!notification1.text}
          text={notification1.text}
        />
        {faultyRows.length > 0 && (
          <Grid item width="100%">
            <Link href={createTextFile(faultyRows.join('\n'))}>
              <Typography align="center" variant="body1">
                Download faulty rows
              </Typography>
            </Link>
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
            sx={{ display: 'flex', flexDirection: 'column', mt: 7 }}
          >
            <Typography mb={3} align="center" variant="h3">
              Add a single journey
            </Typography>
            <FormikTextInput
              required
              type="text"
              label="Departure time"
              name="departureTime"
              id="departureTime"
            />
            <FormikTextInput
              required
              type="text"
              label="Return time"
              name="returnTime"
              id="returnTime"
            />
            <FormikTextInput
              required
              type="text"
              label="Departure station ID"
              name="departureStationId"
              id="departureStationId"
            />
            <FormikTextInput
              required
              type="text"
              label="Return station ID"
              name="returnStationId"
              id="returnStationId"
            />
            <FormikTextInput required type="text" label="Distance" name="distance" id="distance" />
            <FormikTextInput required type="text" label="Duration" name="duration" id="duration" />
            <Button size="large" type="submit" variant="contained" id="add-journey">
              Add
            </Button>
            <Notification
              error={notification.error}
              sx={{ mt: 1.5 }}
              visible={!!notification.text}
              text={notification.text}
            />
          </Box>
        )}
      </Formik>
    </Container>
  );
};

export default AddJourneys;
