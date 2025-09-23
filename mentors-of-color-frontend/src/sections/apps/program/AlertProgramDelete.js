import PropTypes from 'prop-types';

// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project import
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

import { openSnackbar } from 'api/snackbar';

// assets
import { DeleteFilled } from '@ant-design/icons';
import { deleteProgram } from 'api/program';
import useAuth from 'hooks/useAuth';

// ==============================|| CUSTOMER - DELETE ||============================== //

export default function AlertProgramDelete({ id, title, open, handleClose }) {
  const { user: { account_id } } = useAuth()

  const deletehandler = async () => {
    await deleteProgram(id, account_id).then(() => {
      openSnackbar({
open: true,
message: 'Program deleted successfully',
anchorOrigin: {
    vertical: 'top',
    horizontal: 'right'
},
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
    }).catch(err => {
      openSnackbar({
        open: true,
        message: 'Something went wrong while deleting program',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    }).finally(() => handleClose())
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <DeleteFilled />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Are you sure you want to delete?
            </Typography>
            <Typography align="center">
              By deleting
              <Typography variant="subtitle1" component="span">
                {' '}
                &quot;{title}&quot;{' '}
              </Typography>
              program, all details related to it will be deleted.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={deletehandler} autoFocus>
              Delete
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

AlertProgramDelete.propTypes = {
  id: PropTypes.any,
  title: PropTypes.any,
  open: PropTypes.bool,
  handleClose: PropTypes.func
};
