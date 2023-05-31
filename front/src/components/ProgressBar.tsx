import { Box, LinearProgress, LinearProgressProps, Typography } from '@mui/material';

const ProgressBar = ({ value, ...props }: LinearProgressProps & { value: number }): JSX.Element => (
  <Box sx={{ display: 'flex', alignItems: 'center', mt: -1, mb: -1, mr: -1 }}>
    <Box sx={{ width: '100%', mr: 1 }}>
      <LinearProgress variant="determinate" value={value} {...props} />
    </Box>
    <Box sx={{ minWidth: 35 }}>
      <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
    </Box>
  </Box>
);

export default ProgressBar;
