// material-ui
import { Box } from '@mui/material';

// third-party
import { Marker } from 'react-map-gl';

try {
    const size = 20;
    const ICON = `M20.2,15.7L20.2,15.7c1.1-1.
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

// ==============================|| MAP BOX - MARKER ||============================== //

const MapMarker = ({ ...other }) => {
  return (
    <Marker {...other}>
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{
          height: size,
          stroke: 'none',
          cursor: 'pointer',
          fill: (theme) => theme.palette.primary.main,
          transform: `translate(${-size / 2}px,${-size}px)`
        }}
      >
        <path d={ICON} />
      </Box>
    </Marker>
  );
};

export default MapMarker;
