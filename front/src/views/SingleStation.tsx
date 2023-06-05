import { Box, Container, Grid, Link, List, ListItem, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getSingleStation } from 'src/services/stations';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { GOOGLE_API_KEY } from 'src/util/config';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import { Dayjs } from 'dayjs';

const SingleStation = (): JSX.Element => {
  const { id } = useParams();
  const [before, setBefore] = useState<Dayjs | null>();
  const [after, setAfter] = useState<Dayjs | null>();
  const { data: station } = useQuery(
    ['SingleStation', before, after],
    () =>
      getSingleStation(id!, {
        before: before ? before.toISOString() : undefined,
        after: after ? after.toISOString() : undefined
      }),
    { keepPreviousData: true }
  );
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY
  });

  if (!station || !isLoaded) {
    return <Box />;
  }

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        mt: 4
      }}
      disableGutters
      maxWidth={false}
    >
      <Box sx={{ pl: 3, pr: 3 }}>
        <Typography mb={3} textAlign="center" align="center" variant="h2">
          {station.name}
        </Typography>
        <Typography lineHeight={2.2} variant="body1">
          Address: {station.address ?? 'unknown'}
        </Typography>
        <Typography lineHeight={2.2} variant="body1">
          Total journeys from this station: {station.totalJourneysFrom}
        </Typography>
        <Typography lineHeight={2.2} variant="body1">
          Total journeys to this station: {station.totalJourneysTo}
        </Typography>
        <Typography lineHeight={2.2} variant="body1">
          Average distance of journey from this station:{' '}
          {(station.averageDistanceFrom &&
            `${(station.averageDistanceFrom / 1000).toFixed(2)} km`) ||
            'null'}
        </Typography>
        <Typography lineHeight={2.2} variant="body1">
          Average distance of journey to this station:{' '}
          {(station.averageDistanceTo && `${(station.averageDistanceTo / 1000).toFixed(2)} km`) ||
            'null'}
        </Typography>
      </Box>
      <Box component="div" sx={{ mt: 3.5, mb: 5, pr: 3, pl: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid
            spacing={2}
            container
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <DatePicker
                onAccept={(value: Dayjs | null): void => setAfter(value)}
                label="Start date"
              />
            </Grid>
            <Grid item>
              <DatePicker
                onAccept={(value: Dayjs | null): void => setBefore(value)}
                label="End date"
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Box>
      {station.latitude && station.longitude && (
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '500px'
          }}
          mapContainerClassName="map-container"
          center={{ lat: station.latitude, lng: station.longitude }}
          zoom={12}
        >
          <MarkerF position={{ lat: station.latitude, lng: station.longitude }} />
        </GoogleMap>
      )}
      <Grid
        mt={2}
        mb={4}
        pl={3}
        pr={3}
        spacing={4}
        container
        alignItems="space-evenly"
        justifyContent="space-evenly"
      >
        <Grid item direction="column" spacing={10}>
          <Typography mb={1.5} variant="h3">
            Top return stations from this station
          </Typography>
          <List>
            {station.topStationsTo.map((s, i) => (
              <ListItem>
                <Typography sx={{ whiteSpace: 'pre-wrap' }} variant="body1">
                  {i + 1}.{'    '}
                  <Link href={`${s.id}`}>{s.name}</Link>
                </Typography>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item direction="column">
          <Typography mb={1.5} variant="h3">
            Top departure stations from this station
          </Typography>
          <List>
            {station.topStationsFrom.map((s, i) => (
              <ListItem>
                <Typography sx={{ whiteSpace: 'pre-wrap' }} variant="body1">
                  {i + 1}.{'    '}
                  <Link href={`${s.id}`}>{s.name}</Link>
                </Typography>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SingleStation;
