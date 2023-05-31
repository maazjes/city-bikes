import { Box, SxProps, Typography } from '@mui/material';

type NotificationProps = {
  text: string;
  visible: boolean;
  error?: boolean;
  sx?: SxProps;
};

const Notification = ({
  text,
  visible,
  error = false,
  sx = undefined
}: NotificationProps): JSX.Element =>
  visible ? (
    <Box
      borderRadius={1}
      pl={2}
      pr={2}
      pt={1.2}
      pb={1.2}
      sx={{ backgroundColor: '#D3D3D3', ...sx }}
    >
      <Typography color={error ? 'red' : 'green'} variant="body1">
        {text}
      </Typography>
    </Box>
  ) : (
    <Box />
  );

export default Notification;
