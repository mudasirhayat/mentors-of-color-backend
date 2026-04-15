// material-ui
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const MapContainerStyled = styled(Box)({
  // Add your styles here
});
  zIndex: 0,
  height: 576,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: 4,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none'
  }
});

export default MapContainerStyled;
