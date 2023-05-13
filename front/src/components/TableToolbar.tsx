import { Toolbar, Tooltip, Typography, alpha } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

interface TableToolbarProps {
  numSelected: number;
  title: string;
  itemRight?: JSX.Element;
}

const TableToolbar = ({
  numSelected,
  title,
  itemRight = undefined
}: TableToolbarProps): JSX.Element => (
  <Toolbar
    sx={{
      pl: { sm: 2 },
      pr: { xs: 1, sm: 1 },
      ...(numSelected > 0 && {
        bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
      })
    }}
  >
    {numSelected > 0 ? (
      <>
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
        <Tooltip title="Delete">
          <IconButton>
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
