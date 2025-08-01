import PropTypes from 'prop-types';
//material-ui
import { styled } from '@mui/material/styles';

// third-party
import { SnackbarProvider } from 'notistack';

// project import
import Loader from 'components/Loader';
import { useGetSnackbar } from 'api/snackbar';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
const StyledSnackbarProvider = styled(SnackbarProvider)(({ theme }) =>
  '&.notistack-MuiContent-default': {
    backgroundColor: theme.palette.primary.main
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: theme.palette.error.main
  },
  '&.notistack-MuiContent-success': {
    backgroundColor: theme.palette.success.main
  },
  '&.notistack-MuiContent-info': {
    backgroundColor: theme.palette.info.main
  },
  '&.notistack-MuiContent-warning': {
    backgroundColor: theme.palette.warning.main
  }
}));

// ===========================|| SNACKBAR - NOTISTACK ||=========================== //

const Notistack = ({ children }) => {
  const { snackbar } = useGetSnackbar();
  const iconSX = { marginRight: 8, fontSize: '1.15rem' };

  if (snackbar === undefined) return <Loader />;

  return (
    <StyledSnackbarProvider
      maxSnack={snackbar.maxStack}
      dense={snackbar.dense}
      iconVariant={
        snackbar.iconVariant === 'useemojis'
          ? {
              success: <CheckCircleOutlined style={iconSX} />,
              error: <CloseCircleOutlined style={iconSX} />,
              warning: <WarningOutlined style={iconSX} />,
              info: <InfoCircleOutlined style={iconSX} />
            }
          : undefined
      }
      hideIconVariant={snackbar.iconVariant === 'hide' ? true : false}
    >
      {children}
    </StyledSnackbarProvider>
  );
};

Notistack.propTypes = {
  children: PropTypes.node
};

export default Notistack;
