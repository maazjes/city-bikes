import { Box, Checkbox, Link, Typography } from '@mui/material';
import { GridColDef, GridFilterModel } from '@mui/x-data-grid';
import { useState } from 'react';
import { useQuery } from 'react-query';
import DataTable from 'src/components/DataTable';
import StationsMap from 'src/components/StationsMap';
import { deleteStations, getStations } from 'src/services/stations';
import { Operator, Station } from 'src/types';
import { createComparator } from 'src/util/helpers';

const columns: (Omit<GridColDef<Station>, 'field'> & { field: keyof Station })[] = [
  {
    field: 'id',
    headerName: 'ID',
    type: 'number',
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => <Link href={`stations/${row.id}`}>{row.id}</Link>
  },
  { field: 'name', headerName: 'Name', flex: 1, align: 'center', headerAlign: 'center' },
  { field: 'address', headerName: 'Address', flex: 1, align: 'center', headerAlign: 'center' },
  {
    field: 'city',
    headerName: 'City',
    flex: 1,
    align: 'center',
    headerAlign: 'center'
  },
  { field: 'operator', headerName: 'Operator', flex: 1, align: 'center', headerAlign: 'center' },
  {
    field: 'capacity',
    headerName: 'Capacity',
    type: 'number',
    flex: 1,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'latitude',
    headerName: 'Latitude',
    type: 'number',
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => row.latitude
  },
  {
    field: 'longitude',
    headerName: 'Longitude',
    type: 'number',
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => row.longitude
  }
];

const Stations = (): JSX.Element => {
  const { data, isLoading } = useQuery('Stations', () => getStations());
  const [filteredData, setFilteredData] = useState<Station[]>();
  const [mapViewOpen, setMapViewOpen] = useState(false);

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
      <Checkbox sx={{ pr: 0 }} onChange={(): void => setMapViewOpen(!mapViewOpen)} />
    </div>
  );

  const rows = filteredData || data || [];

  return (
    <Box
      pt={2}
      pl={{ xs: 2, sm: 2.5, md: 3 }}
      pr={{ xs: 2, sm: 2.5, md: 3 }}
      pb={{ xs: 2, sm: 2.5, md: 3 }}
    >
      <DataTable<Station>
        loading={isLoading}
        hide={mapViewOpen}
        title="Stations"
        columns={columns}
        data={rows}
        onFilterModelChange={onFilterModelChange}
        toolbarItemRight={mapViewCheckBox}
        onItemDelete={(selected: number[]): Promise<void> => deleteStations(selected)}
        queryKey="Stations"
      />
      {mapViewOpen && <StationsMap stations={rows} />}
    </Box>
  );
};

export default Stations;
