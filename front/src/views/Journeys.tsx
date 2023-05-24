import { GridColDef } from '@mui/x-data-grid';
import DataTable from 'src/components/DataTable';
import { getPaginatedJourneys } from 'src/services/journeys';
import { Journey } from 'src/types';

const columns: (Omit<GridColDef, 'field'> & { field: keyof Journey })[] = [
  { field: 'id', headerName: 'ID', type: 'number', flex: 1, align: 'left', headerAlign: 'left' },
  {
    field: 'departureTime',
    headerName: 'Departure time',
    flex: 1,
    align: 'left',
    headerAlign: 'left'
  },
  { field: 'returnTime', headerName: 'Return time', flex: 1, align: 'left', headerAlign: 'left' },
  {
    field: 'departureStationId',
    headerName: 'Departure station id',
    flex: 1,
    align: 'left',
    headerAlign: 'left'
  },
  {
    field: 'returnStationId',
    headerName: 'Return station id',
    flex: 1,
    align: 'left',
    headerAlign: 'left'
  },
  {
    field: 'distance',
    headerName: 'Distance',
    type: 'number',
    flex: 1,
    align: 'left',
    headerAlign: 'left'
  },
  { field: 'duration', headerName: 'Duration', flex: 1, align: 'left', headerAlign: 'left' }
];

const Journeys = (): JSX.Element => (
  <DataTable<Journey>
    title="Journeys"
    columns={columns}
    getData={getPaginatedJourneys}
    queryKey="PaginatedJourneys"
  />
);

export default Journeys;
