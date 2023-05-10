import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { ChangeEvent, useRef, useState } from 'react';
import { createStationsFromCSV } from 'src/services/stations';

const Upload = (): JSX.Element => {
  const journeys = useRef<File>();
  const stations = useRef<File>();
  const [faultyRows, setFaultyRows] = useState();

  const onChange = (e: ChangeEvent<HTMLInputElement>, type: 'journeys' | 'stations'): void => {
    if (e.target.files) {
      if (type === 'stations') {
        [stations.current] = e.target.files;
      }
      if (type === 'journeys') {
        [journeys.current] = e.target.files;
      }
    }
  };

  const onSubmit = async (): Promise<void> => {
    if (stations.current) {
      await createStationsFromCSV(stations.current);
    }
    /* const longestRow = str.reduce((a, b) => (a.length > b.length ? a : b), '');
    setLongestFaultyRow(longestRow); */
  };

  return (
    <Grid
      lineHeight={5}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      container
      component="form"
      onSubmit={onSubmit}
    >
      <Box alignItems="center" justifyContent="center">
        <Grid alignItems="center" justifyContent="space-between" container>
          <Grid item>
            <Typography variant="h3" mr={6}>
              Stations
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" component="label">
              Select File
              <input onChange={(e): void => onChange(e, 'stations')} type="file" hidden />
            </Button>
          </Grid>
        </Grid>
        <Grid alignItems="center" justifyContent="space-between" container>
          <Grid item>
            <Typography variant="h3" mr={6}>
              Journeys
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" component="label">
              Select File
              <input onChange={(e): void => onChange(e, 'journeys')} type="file" hidden />
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Grid item>
        <Button type="submit" variant="outlined">
          Upload
        </Button>
      </Grid>

      {faultyRows && (
        <Grid
          width="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          container
        >
          <Typography sx={{ mt: 5, mb: 2 }} align="center" variant="h3">
            Faulty rows
          </Typography>
          <TextField sx={{ maxWidth: '80%' }} fullWidth multiline />
        </Grid>
      )}
    </Grid>
  );
};

export default Upload;
