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
    align: 'left',
    headerAlign: 'left',
    renderCell: ({ row }) => <Link href={`stations/${row.id}`}>{row.id}</Link>
  },
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
  { field: 'latitude', headerName: 'Latitude', flex: 1, align: 'left', headerAlign: 'left' },
  { field: 'longitude', headerName: 'Longitude', flex: 1, align: 'left', headerAlign: 'left' }
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
      <Checkbox onChange={(): void => setMapViewOpen(!mapViewOpen)} />
    </div>
  );

  if (!data || isLoading) {
    return <div />;
  }

  return (
    <Box pt={2} pl={3} pr={3} pb={3}>
      <DataTable<Station>
        hide={mapViewOpen}
        title="Stations"
        columns={columns}
        data={filteredData || data}
        onFilterModelChange={onFilterModelChange}
        toolbarItemRight={mapViewCheckBox}
        onItemDelete={(selected): Promise<void> => deleteStations(selected)}
        queryKey="stations"
      />
      {mapViewOpen && <StationsMap stations={filteredData || data} />}
    </Box>
  );
};

export default Stations;
