import { Box, Button, Container, Grid, Link, Typography } from '@mui/material';
import { Formik } from 'formik';
import { ChangeEvent, FormEvent, useState, useRef } from 'react';
import FormikTextInput from 'src/components/FormikTextInput';
import ProgressBar from 'src/components/ProgressBar';
import useAppBarHeight from 'src/hooks/useAppBarHeight';
import { countStations, createStation, createStationsFromCSV } from 'src/services/stations';
import theme from 'src/theme';
import { Station } from 'src/types';
import { createTextFile } from 'src/util/helpers';
import * as yup from 'yup';

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
        const { count } = await countStations();
        const newProgress = (count / estimatedRows.current!) * 100;
        if (newProgress < 100) {
          setProgress(progress + newProgress);
        }
      }, 2000);

      const res = await createStationsFromCSV(file);

      if (progress < 100) {
        setProgress(100);
      }

      clearInterval(timer);
      setFaultyRows(res);
    }
  };

  const onSingleSubmit = async (values: Station): Promise<void> => {
    await createStation(values);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: Math.max(window.innerHeight - appBarHeight, 900),
        pt: 5,
        pb: 5
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
            sx={{ display: 'flex', flexDirection: 'column', mt: 8 }}
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
            <Button size="large" type="submit" variant="contained" id="add-station-button">
              Add
            </Button>
          </Box>
        )}
      </Formik>
    </Container>
  );
};

export default AddStations;
