import { Checkbox, Typography } from '@mui/material';
import { GridColDef, GridFilterModel } from '@mui/x-data-grid';
import { useState } from 'react';
import { useQuery } from 'react-query';
import DataTable from 'src/components/DataTable';
import StationsMap from 'src/components/StationsMap';
import { getStations } from 'src/services/stations';
import { Operator, Station } from 'src/types';
import { createComparator } from 'src/util/helpers';

const columns: (Omit<GridColDef, 'field'> & { field: keyof Station })[] = [
  { field: 'id', headerName: 'ID', type: 'number', flex: 1, align: 'left', headerAlign: 'left' },
  { field: 'name', headerName: 'Name', flex: 1, align: 'left', headerAlign: 'left' },
  { field: 'address', headerName: 'Address', flex: 1, align: 'left', headerAlign: 'left' },
  {
    field: 'city',
    headerName: 'City',
    flex: 1,
    align: 'left',
    headerAlign: 'left'
  },
  { field: 'operator', headerName: 'Operator', flex: 1, align: 'left', headerAlign: 'left' },
  {
    field: 'capacity',
    headerName: 'Capacity',
    type: 'number',
    flex: 1,
    align: 'left',
    headerAlign: 'left'
  },
  { field: 'y', headerName: 'Latitude', flex: 1, align: 'left', headerAlign: 'left' },
  { field: 'x', headerName: 'Longitude', flex: 1, align: 'left', headerAlign: 'left' }
];

const Stations = (): JSX.Element => {
  const { data, isLoading } = useQuery('Stations', () => getStations());
  const [filteredData, setFilteredData] = useState<Station[]>();
  const [mapView, setMapView] = useState(false);

  const onFilterModelChange = (model: GridFilterModel): void => {
    if (!data) {
      return;
    }
    const filterBy = model.items[0].field as keyof Station;
    const operator = model.items[0].operator as Operator;
    const value = model.items[0].value as string;

    if (!value) {
      setFilteredData(data);
    } else {
      const newData = data.filter((station) =>
        createComparator(station[filterBy], value, operator)
      );

      setFilteredData(newData);
    }
  };

  const mapViewCheckBox = (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Typography variant="body1">Map view</Typography>
      <Checkbox onChange={(): void => setMapView(!mapView)} />
    </div>
  );

  if (!data || isLoading) {
    return <div />;
  }

  return (
    <>
      <DataTable<Station>
        hide={mapView}
        title="Stations"
        columns={columns}
        data={filteredData || data}
        onFilterModelChange={onFilterModelChange}
        toolbarItemRight={mapViewCheckBox}
      />
      {mapView && <StationsMap stations={filteredData || data} />}
    </>
  );
};

export default Stations;
