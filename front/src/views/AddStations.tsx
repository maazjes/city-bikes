import { Box, Button, Container, Grid, Link, Typography } from '@mui/material';
import { Formik } from 'formik';
import { ChangeEvent, FormEvent, useState } from 'react';
import FormikTextInput from 'src/components/FormikTextInput';
import ProgressBar from 'src/components/ProgressBar';
import { countStations, createStation, createStationsFromCSV } from 'src/services/stations';
import theme from 'src/theme';
import { Station } from 'src/types';
import { createTextFile } from 'src/util/helpers';
import * as yup from 'yup';
import Notification from 'src/components/Notification';
import queryClient from 'src/util/queryClient';
import { useMutation } from 'react-query';

const validationSchema = yup.object().shape({
  id: yup.number().required(),
  name: yup.string().required(),
  address: yup.string(),
  city: yup.string(),
  operator: yup.string(),
  capacity: yup.number().min(0),
  latitude: yup.number(),
  longitude: yup.number()
});

const initialValues = {
  id: undefined,
  name: undefined,
  address: undefined,
  city: undefined,
  operator: undefined,
  capacity: undefined,
  latitude: undefined,
  longitude: undefined
} as unknown as Station;

const AddStations = (): JSX.Element => {
  const [file, setFile] = useState<File>();
  const [faultyRows, setFaultyRows] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState({ text: '', error: false });
  const [notification1, setNotification1] = useState({ text: '', error: false });

  const { mutateAsync: mutateStationsCSV } = useMutation<string[], unknown, File>(
    'createStationsFromCSV',
    (stations) => createStationsFromCSV(stations),
    {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: 'Stations', exact: true });
      }
    }
  );

  const { mutateAsync: mutateStation } = useMutation<unknown, unknown, Station>(
    'createStation',
    (station) => createStation(station),
    {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: 'Stations', exact: true });
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
        const { count: initialCount } = await countStations();
        const estimatedRows = file.size / 88;

        timer = setInterval(async () => {
          const { count } = await countStations();
          const newProgress = ((count - initialCount) / estimatedRows!) * 100;
          if (newProgress < 100) {
            setProgress(progress + newProgress);
          }
        }, 2000);

        const res = await mutateStationsCSV(file);
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

  const onSingleSubmit = async (values: Station): Promise<void> => {
    try {
      await mutateStation(values);
      setNotification({ error: false, text: 'Successfully created a new station!' });
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
          <Typography variant="h3">Add stations from file</Typography>
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
          <Grid item>
            <Link href={createTextFile(faultyRows.join('\n'))}>
              <Typography variant="body1">Download faulty rows</Typography>
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
              Add a single station
            </Typography>
            <FormikTextInput required type="text" label="Id" name="id" id="id" />
            <FormikTextInput required type="text" label="Name" name="name" id="name" />
            <FormikTextInput type="text" label="Address" name="address" id="address" />
            <FormikTextInput type="text" label="City" name="city" id="city" />
            <FormikTextInput type="text" label="Operator" name="operator" id="operator" />
            <FormikTextInput type="text" label="Capacity" name="capacity" id="capacity" />
            <FormikTextInput type="text" label="Latitude" name="latitude" id="latitude" />
            <FormikTextInput type="text" label="Longitude" name="longitude" id="longitude" />
            <Button size="large" type="submit" variant="contained" id="add-station">
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

export default AddStations;
