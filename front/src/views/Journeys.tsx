import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from 'src/components/DataTable';
import { deleteJourneys, getPaginatedJourneys } from 'src/services/journeys';
import { Journey } from 'src/types';

const columns: (Omit<GridColDef<Journey>, 'field'> & { field: keyof Journey })[] = [
  {
    field: 'id',
    headerName: 'ID',
    type: 'number',
    flex: 1,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'departureTime',
    headerName: 'Departure time',
    flex: 1,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'returnTime',
    headerName: 'Return time',
    flex: 1,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'departureStationId',
    headerName: 'Departure station id',
    type: 'number',
    flex: 1,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'returnStationId',
    headerName: 'Return station id',
    type: 'number',
    flex: 1,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'distance',
    headerName: 'Distance',
    type: 'number',
    flex: 1,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'duration',
    headerName: 'Duration',
    type: 'number',
    flex: 1,
    align: 'center',
    headerAlign: 'center'
  }
];

const Journeys = (): JSX.Element => (
  <Box pt={2} pl={3} pr={3} pb={3}>
    <DataTable<Journey>
      title="Journeys"
      columns={columns}
      getData={getPaginatedJourneys}
      queryKey="PaginatedJourneys"
      onItemDelete={(selected): Promise<void> => deleteJourneys(selected)}
    />
  </Box>
);

export default Journeys;
