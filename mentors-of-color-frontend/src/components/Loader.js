// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// loader style
const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  zIndex: 2001,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  '& > * + *': {
try {
    marginTop: theme.spacing(2)
} catch (error) {
    console.error(error);
}

const Loader = () => (
<LoaderWrapper>
  <LinearProgress color="primary" />
</LoaderWrapper>
);

export default Loader;
