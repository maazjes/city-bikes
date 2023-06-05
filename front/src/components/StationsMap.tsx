import { GOOGLE_API_KEY } from 'src/util/config';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import { Box, Link, Typography } from '@mui/material';
import { Station } from 'src/types';

const StationsMap = ({ stations }: { stations: Station[] }): JSX.Element => {
  const [visibleStations, setVisibleStations] = useState<number[]>([]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY
  });

  const center = useMemo(() => ({ lat: 60.2134209918355, lng: 24.9437964005667 }), []);

  const onMarkerClick = (stationId: number): void => {
    setVisibleStations([...visibleStations, stationId]);
  };

  if (!isLoaded) {
    return <div />;
  }

  return (
    <Box flex={1}>
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '80vh'
        }}
        mapContainerClassName="map-container"
        center={center}
        zoom={10}
      >
        {stations.map(
          (station) =>
            station.latitude &&
            station.longitude && (
              <MarkerF
                key={station.id}
                onClick={(): void => onMarkerClick(station.id)}
                position={{ lat: station.latitude, lng: station.longitude }}
              >
                {visibleStations.includes(station.id) && (
                  <InfoWindowF position={center} key="infowindow">
                    <div>
                      <Link href={`stations/${station.id}`}>
                        <Typography variant="body1">{station.name}</Typography>
                      </Link>
                      {station.address}
                    </div>
                  </InfoWindowF>
                )}
              </MarkerF>
            )
        )}
      </GoogleMap>
    </Box>
  );
};

export default StationsMap;
