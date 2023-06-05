import Box from '@mui/material/Box';
import {
  IconButton,
  Toolbar,
  AppBar as MUIAppBar,
  Typography,
  CssBaseline,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { setAuthToken } from 'src/util/authToken';
import LoggedInContext from 'src/context/loggedIn';

const AppBar = (): JSX.Element => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { loggedIn, setLoggedIn } = useContext(LoggedInContext);

  const handleDrawerToggle = (): void => {
    setMobileOpen((prevState) => !prevState);
  };

  const onLogout = (): void => {
    localStorage.removeItem('token');
    setAuthToken('');
    setLoggedIn(false);
    navigate('/');
  };

  const loggedInItems = [
    {
      title: 'Add stations',
      onClick: () => navigate('add-stations')
    },
    { title: 'Add journeys', onClick: () => navigate('add-journeys') },
    {
      title: 'Log out',
      onClick: onLogout
    }
  ];

  const loggedOutItems = [
    { title: 'Log in', onClick: (): void => navigate('login') },
    {
      title: 'Register',
      onClick: (): void => navigate('register')
    }
  ];

  const finalItems = [
    { title: 'Stations', onClick: () => navigate('stations') },
    { title: 'Journeys', onClick: () => navigate('journeys') },
    ...(loggedIn ? loggedInItems : loggedOutItems)
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        <ListItem key="spacing" />
        {finalItems.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={item.onClick}>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MUIAppBar component="nav" sx={{ display: 'flex', justifyCOntent: 'space-between' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            CITY-BIKES
          </Typography>
          <IconButton edge="end" sx={{ ml: 2 }}>
            <MenuIcon sx={{ height: 0 }} />
          </IconButton>
        </Toolbar>
      </MUIAppBar>
      <Toolbar />
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: { xs: '60%', sm: '25%' }
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default AppBar;
