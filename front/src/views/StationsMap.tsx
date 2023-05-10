import { GOOGLE_API_KEY } from 'src/util/config';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { getStations } from 'src/services/stations';

const StationsMap = (): JSX.Element => {
  const [visibleStations, setVisibleStations] = useState<number[]>([]);
  const { data, isLoading } = useQuery('stations', getStations);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY
  });

  const center = useMemo(() => ({ lat: 60.2134209918355, lng: 24.9437964005667 }), []);

  const onMarkerClick = (stationId: number): void => {
    setVisibleStations([...visibleStations, stationId]);
  };

  if (isLoading || !data) {
    return false;
  }

  return (
    <Box flex={1}>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '1000px'
          }}
          mapContainerClassName="map-container"
          center={center}
          zoom={10}
        >
          {data.map((station) => (
            <MarkerF
              onClick={(): void => onMarkerClick(station.id)}
              position={{ lat: station.y, lng: station.x }}
            >
              {visibleStations.includes(station.id) && (
                <InfoWindowF position={center} key="infowindow">
                  <div>
                    <Typography variant="body1">{station.name}</Typography>
                    {station.address}
                  </div>
                </InfoWindowF>
              )}
            </MarkerF>
          ))}
        </GoogleMap>
      )}
    </Box>
  );
};

export default StationsMap;
