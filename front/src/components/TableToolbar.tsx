import { Toolbar, Tooltip, Typography, alpha } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

interface TableToolbarProps {
  selected: number[];
  title: string;
  itemRight?: JSX.Element;
  onDeleteIconClick: (selected: number[]) => void;
}

const TableToolbar = ({
  selected,
  title,
  itemRight = undefined,
  onDeleteIconClick
}: TableToolbarProps): JSX.Element => (
  <Toolbar
    sx={{
      pl: { sm: 2 },
      pr: { xs: 1, sm: 1 },
      ...(selected.length > 0 && {
        bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
      })
    }}
  >
    {selected.length > 0 ? (
      <>
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {selected.length} selected
        </Typography>
        <Tooltip title="Delete">
          <IconButton
            onClick={(e): void => {
              e.preventDefault();
              onDeleteIconClick(selected);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </>
    ) : (
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h6" id="tableTitle" component="div">
          {title}
        </Typography>
        {itemRight}
      </div>
    )}
  </Toolbar>
);

export default TableToolbar;
