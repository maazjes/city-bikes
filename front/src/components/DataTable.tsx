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
import { useMutation, useQuery } from 'react-query';
import { GetPaginatedSortedFilteredData, Operator, PaginatedSortedFilteredQuery } from 'src/types';
import queryClient from 'src/util/queryClient';
import TableToolbar from './TableToolbar';
import Alert from './Alert';

interface DataTableBaseProps<T extends GridValidRowModel> {
  hide?: boolean;
  title: string;
  columns: GridColDef<T>[];
  queryKey: string;
  onFilterModelChange?: (model: GridFilterModel) => void;
  onSortModelChange?: (model: GridSortModel) => void;
  toolbarItemRight?: JSX.Element;
  onItemDelete: (selected: number[]) => Promise<void>;
}

interface ServerModeProps<T extends GridValidRowModel> extends DataTableBaseProps<T> {
  getData: GetPaginatedSortedFilteredData<T>;
  data?: never;
}

interface ClientModeProps<T extends GridValidRowModel> extends DataTableBaseProps<T> {
  getData?: never;
  data: T[];
}

const hideSlots = {
  panel: (): null => null,
  footer: (): null => null,
  columnHeaders: (): null => null,
  noResultsOverlay: (): null => null
};

const hideSX = {
  '& .MuiDataGrid-virtualScrollerContent': {
    height: '0px !important'
  }
};

const initialState = {
  pagination: {
    paginationModel: { page: 0, pageSize: 10 },
    sortModel: { field: 'id', sort: 'asc' }
  }
};

// Requires a generic type to work.

const DataTable = <T extends GridValidRowModel & { id: number }>({
  hide = false,
  title,
  getData,
  columns,
  queryKey,
  onFilterModelChange = undefined,
  data = undefined,
  toolbarItemRight = undefined,
  onItemDelete
}: ServerModeProps<T> | ClientModeProps<T>): JSX.Element => {
  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'id', sort: 'asc' }]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>();
  const [clientModeData, setClientModeData] = useState<T[]>(data || []);
  const [alertVisible, setAlertVisible] = useState(false);

  const initialQuery: PaginatedSortedFilteredQuery<T> = {
    sort: 'asc',
    sortBy: 'id' as Extract<keyof T, string>,
    limit: 10,
    offset: 0
  };

  const [query, setQuery] = useState<PaginatedSortedFilteredQuery<T>>(initialQuery);
  const [selected, setSelected] = useState<number[]>([]);

  const finalQueryKey = useMemo(() => [queryKey, query], [query]);

  const { data: serverModeData, isLoading } = useQuery(
    finalQueryKey,
    () => getData && getData(query),
    {
      enabled: !!getData
    }
  );

  const { mutate: deleteItems } = useMutation<unknown, unknown, number[]>(
    `delete ${queryKey}`,
    (ids) => onItemDelete(ids),
    {
      onSuccess: () => {
        if (getData) {
          queryClient.setQueryData<T[] | undefined>(finalQueryKey, (oldData) => [
            ...oldData!.filter((item) => !selected.includes(item.id))
          ]);
        } else {
          setClientModeData([...clientModeData.filter((item) => !selected.includes(item.id))]);
        }
      }
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
    () => (serverModeData ? serverModeData.rows.flat(0) : !getData ? clientModeData : []),
    [serverModeData, clientModeData]
  );

  const rowCount = serverModeData
    ? serverModeData.count
    : clientModeData
    ? clientModeData.length
    : 0;

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

  return (
    <>
      <TableToolbar
        title={title}
        itemRight={toolbarItemRight}
        selected={selected}
        onDeleteIconClick={(): void => setAlertVisible(true)}
      />
      <DataGrid
        {...(!!getData && serverModeProps)}
        autoHeight
        checkboxSelection
        onRowSelectionModelChange={(model): void => {
          setSelected(model as number[]);
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
      <Alert
        visible={alertVisible}
        setVisible={setAlertVisible}
        title={`Are you sure you want to delete ${selected.length} items?`}
        content=""
        handleYes={(): void => {
          setAlertVisible(false);
          deleteItems(selected);
        }}
      />
    </>
  );
};

export default DataTable;
