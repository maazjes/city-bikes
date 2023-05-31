import Box from '@mui/material/Box';
import {
  IconButton,
  Toolbar,
  AppBar,
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
import TokenContext from 'src/context/token';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ loggedIn }: { loggedIn: boolean }): JSX.Element => {
  const { setToken } = useContext(TokenContext)!;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = (): void => {
    setMobileOpen((prevState) => !prevState);
  };

  const onLogout = (): void => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  const navItems = [
    { title: 'Home', onClick: () => navigate('/') },
    { title: 'Stations', onClick: () => navigate('stations') },
    { title: 'Journeys', onClick: () => navigate('journeys') },
    {
      title: 'Add stations',
      onClick: () => navigate('add-stations')
    },
    { title: 'Add journeys', onClick: () => navigate('add-journeys') },
    {
      title: loggedIn ? 'Log out' : 'Log in',
      onClick: loggedIn ? onLogout : (): void => navigate('login')
    },
    {
      ...(!loggedIn && {
        title: 'Register',
        onClick: (): void => navigate('register')
      })
    }
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        <ListItem key="spacing" />
        {navItems.map((item) => (
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
      <AppBar component="nav" sx={{ display: 'flex', justifyCOntent: 'space-between' }}>
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
      </AppBar>
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
              width: { xs: '50%', sm: '25%' }
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Header;
