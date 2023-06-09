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
import { useContext, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { GetPaginatedSortedFilteredData, Operator, PaginatedSortedFilteredQuery } from 'src/types';
import queryClient from 'src/util/queryClient';
import LoggedInContext from 'src/context/loggedIn';
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
  loading?: boolean;
}

interface ServerModeProps<T extends GridValidRowModel> extends DataTableBaseProps<T> {
  getData: GetPaginatedSortedFilteredData<T>;
  data?: never;
}

interface ClientModeProps<T extends GridValidRowModel> extends DataTableBaseProps<T> {
  getData?: never;
  data: T[];
}

const hideSX = {
  '& .MuiDataGrid-virtualScrollerContent': {
    height: '0px !important'
  },
  '& .MuiDataGrid-columnHeaders': { display: 'none' },
  '& .MuiDataGrid-footerContainer': { display: 'none' }
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
  onItemDelete,
  loading = undefined
}: ServerModeProps<T> | ClientModeProps<T>): JSX.Element => {
  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'id', sort: 'asc' }]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
    initialState.pagination.paginationModel
  );
  const [alertVisible, setAlertVisible] = useState(false);
  const { loggedIn } = useContext(LoggedInContext);

  const initialQuery: PaginatedSortedFilteredQuery<T> = {
    sort: 'asc',
    sortBy: 'id' as Extract<keyof T, string>,
    limit: 10,
    offset: 0
  };

  const [query, setQuery] = useState<PaginatedSortedFilteredQuery<T>>(initialQuery);
  const [selected, setSelected] = useState<number[]>([]);

  const finalQueryKey = [queryKey, query];

  const { data: serverModeData, isLoading } = useQuery(
    finalQueryKey,
    () => (getData ? getData(query) : undefined),
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
    let newModel = model;

    if (model.length === 0) {
      newModel = [
        { field: sortModel[0].field, sort: sortModel[0].sort === 'asc' ? 'desc' : 'asc' }
      ];
    }

    setSortModel([newModel[0]]);

    const newQuery = {
      ...query,
      sort: newModel[0].sort ?? undefined,
      sortBy: newModel[0].field as Extract<keyof T, string>,
      offset: 0
    };
    setQuery(newQuery);
  };

  const rows = useMemo(
    () => (serverModeData ? serverModeData.rows.flat(0) : data || []),
    [serverModeData, data]
  );

  const { mutate: deleteItems } = useMutation<unknown, unknown, number[]>(
    `Delete ${queryKey}`,
    (ids) => onItemDelete(ids),
    {
      onSuccess: () => {
        if (getData) {
          queryClient.refetchQueries(finalQueryKey);
        } else {
          queryClient.setQueryData(queryKey, () => [
            ...rows.filter((item) => !selected.includes(item.id))
          ]);
        }
      }
    }
  );

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
    loading: isLoading,
    rowCount: serverModeData ? serverModeData.count : 0
  };

  const loggedInProps: Partial<DataGridProps> = {
    checkboxSelection: true,
    onRowSelectionModelChange: (model): void => {
      setSelected(model as number[]);
    }
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
        loading={loading}
        autoHeight
        slots={{ toolbar: GridFilterPanel }}
        filterModel={onFilterModelChange && filterModel}
        onFilterModelChange={onFilterModelChange && onFilterModelChanged}
        filterMode="client"
        sortingMode="client"
        paginationMode="client"
        sx={hide ? hideSX : undefined}
        rows={rows}
        columns={columns}
        initialState={initialState}
        pageSizeOptions={[10, 20, 30]}
        {...(!!getData && serverModeProps)}
        {...(loggedIn && loggedInProps)}
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
