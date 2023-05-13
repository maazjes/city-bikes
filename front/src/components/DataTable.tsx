import {
  DataGrid,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
  GridColDef,
  GridValidRowModel,
  DataGridProps,
  GridFilterPanel
} from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { GetPaginatedSortedFilteredData, Operator, PaginatedSortedFilteredQuery } from 'src/types';
import TableToolbar from './TableToolbar';

interface DataTableBaseProps<T extends GridValidRowModel> {
  hide?: boolean;
  title: string;
  columns: GridColDef<T>[];
  onFilterModelChange?: (model: GridFilterModel) => void;
  onSortModelChange?: (model: GridSortModel) => void;
  toolbarItemRight?: JSX.Element;
}

interface ServerModeProps<T extends GridValidRowModel> extends DataTableBaseProps<T> {
  getData: GetPaginatedSortedFilteredData<T>;
  queryKey: string;
  data?: never;
}

interface ClientModeProps<T extends GridValidRowModel> extends DataTableBaseProps<T> {
  getData?: never;
  queryKey?: never;
  data: T[];
}

// Requires a generic type to work.

const DataTable = <T extends GridValidRowModel>({
  hide = false,
  title,
  getData,
  columns,
  queryKey,
  onFilterModelChange = undefined,
  data = undefined,
  toolbarItemRight = undefined
}: ServerModeProps<T> | ClientModeProps<T>): JSX.Element => {
  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'id', sort: 'asc' }]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>();

  const initialQuery: PaginatedSortedFilteredQuery<T> = {
    sort: 'asc',
    sortBy: 'id' as Extract<keyof T, string>,
    limit: 10,
    offset: 0
  };

  const [query, setQuery] = useState<PaginatedSortedFilteredQuery<T>>(initialQuery);

  const [numSelected, setNumSelected] = useState<number>(0);

  const { data: serverModeData, isLoading } = useQuery(
    [queryKey || '', query],
    () => getData && getData(query),
    {
      enabled: !!getData
    }
  );

  const onPaginationModelChange = async (model: GridPaginationModel): Promise<void> => {
    setPaginationModel(model);
    const { pageSize: newPageSize, page: newPage } = model;
    setQuery({ ...query, offset: newPage * newPageSize, limit: newPageSize });
  };

  const onFilterModelChanged = (model: GridFilterModel): void => {
    if (onFilterModelChange) {
      onFilterModelChange(model);
    }

    setFilterModel(model);

    const newQuery = {
      ...query,
      filterBy: model.items[0].field as Extract<keyof T, string>,
      operator: model.items[0].operator as Operator,
      value: model.items[0].value as string,
      offset: 0
    };

    if (getData) {
      setQuery(newQuery);
    }
  };

  const onSortModelChanged = (model: GridSortModel): void => {
    setSortModel([model[0]]);

    const newQuery = {
      ...query,
      sort: model[0].sort ?? undefined,
      sortBy: model[0].field as Extract<keyof T, string>,
      offset: 0
    };
    setQuery(newQuery);
  };

  const rows = useMemo(
    () => (serverModeData ? serverModeData.rows.flat(0) : !getData ? data! : []),
    [data, serverModeData]
  );

  const rowCount = serverModeData ? serverModeData.count : data ? data.length : 0;

  const initialState = {
    pagination: {
      paginationModel: { page: 0, pageSize: 10 },
      sortModel: { field: 'id', sort: 'asc' }
    }
  };

  const serverModeProps: Partial<DataGridProps> = {
    paginationMode: 'server',
    paginationModel,
    onPaginationModelChange,
    sortingMode: 'server',
    sortModel,
    onSortModelChange: onSortModelChanged,
    filterMode: 'server',
    filterModel,
    onFilterModelChange: onFilterModelChanged,
    loading: isLoading
  };

  const hideSlots = {
    panel: () => null,
    footer: () => null,
    columnHeaders: () => null,
    noResultsOverlay: () => null
  };

  const hideSX = {
    '& .MuiDataGrid-virtualScrollerContent': {
      height: '0px !important'
    }
  };

  return (
    <>
      <TableToolbar title={title} itemRight={toolbarItemRight} numSelected={numSelected} />
      <DataGrid
        {...(!!getData && serverModeProps)}
        checkboxSelection
        onRowSelectionModelChange={(model): void => {
          setNumSelected(model.length);
        }}
        slots={{
          toolbar: GridFilterPanel,
          loadingOverlay: () => null,
          loadIcon: () => null,
          ...(hide && hideSlots)
        }}
        filterModel={onFilterModelChange && filterModel}
        onFilterModelChange={onFilterModelChange && onFilterModelChanged}
        filterMode="client"
        sortingMode="client"
        paginationMode="client"
        sx={hide ? hideSX : undefined}
        rows={rows}
        rowCount={rowCount}
        columns={columns}
        initialState={initialState}
        pageSizeOptions={[10, 20, 30]}
      />
    </>
  );
};

export default DataTable;
