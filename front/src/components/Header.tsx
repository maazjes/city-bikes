import Box from '@mui/material/Box';
import { Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import TokenContext from 'src/context/token';

const Header = ({ loggedIn }: { loggedIn: boolean }): JSX.Element => {
  const { setToken } = useContext(TokenContext)!;
  const navigate = useNavigate();
  const onLogout = (): void => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'flex-end',
        padding: 2
      }}
    >
      {!loggedIn ? (
        <>
          <Link href="/login" sx={{ minWidth: 100 }}>
            Login
          </Link>
          <Link href="/register" sx={{ minWidth: 100 }}>
            Register
          </Link>
        </>
      ) : (
        <>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link onClick={onLogout} component="button" sx={{ minWidth: 100 }}>
            Logout
          </Link>
        </>
      )}
    </Box>
  );
};

export default Header;
