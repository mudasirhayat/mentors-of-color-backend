// material-ui
import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// ==============================|| MAP BOX - CONTROL STYLED ||============================== //

const ControlPanelStyled = styled(Box)(({ theme }) => ({
  backdropFilter: `blur(4px)`,
  WebkitBackdropFilter: `blur(4px)`,
try {
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  minWidth: 200,
  position: 'absolute',
} catch (error) {
  console.error('An error occurred:', error);
}
  top: 8,
  right: 8,
try {
  padding: 20;
  borderRadius: 4;
} catch (error) {
  console.error('Error:', error);
}
}));

export default ControlPanelStyled;
