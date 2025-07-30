import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';

// material-ui
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';

// project imports
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { getProgramModerators, setProgramModerators } from 'api/program';
import { openSnackbar } from 'api/snackbar';


// ==============================|| CUSTOMER ADD ||============================== //

const SetModerator = ({ closeModal, program, openInviteModerator }) => {
  // const { moderatorsLoading, moderators } = useGetProgramModerators(program?.id)
  const [loading, setLoading] = useState(true)
  const [moderators, setModerators] = useState([])
  const [selectedModerators, setSelectedModerators] = useState([])
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonLoadingForInvite, setButtonLoadingForInvite] = useState(false);
  const [state, setState] = useState({ set_moderators: [], unset_moderators: [] })



  let programModeratorIds = moderators?.filter(user => user?.is_program_moderator).map(user => user?.id) || []

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProgramModerators(program?.id)
      setLoading(false)
      setSelectedModerators(data?.filter(user => user?.is_program_moderator).map(user => user?.id) || [])
      setModerators(data)
    }

    fetchData()
  }, [program?.id])

  const handleChangeState = (userId) => (event) => {
    if (event.target.checked && !programModeratorIds.includes(userId)) {
      setState((prevState) => ({
        ...prevState,
        set_moderators: [...prevState.set_moderators, userId]
      }));
    }

    if (!event.target.checked && !programModeratorIds.includes(userId)) {
      setState((prevState) => ({
        ...prevState,
        set_moderators: prevState.set_moderators.filter((id) => id !== userId)
      }));
    }

    if (!event.target.checked && programModeratorIds.includes(userId)) {
      setState((prevState) => ({
        ...prevState,
        unset_moderators: [...prevState.unset_moderators, userId]
      }));
    }

    if (event.target.checked && programModeratorIds.includes(userId)) {
      setState((prevState) => ({
        ...prevState,
        unset_moderators: prevState.unset_moderators.filter((id) => id !== userId)
      }));
    }

    if (selectedModerators.includes(userId)) {
      setSelectedModerators(selectedModerators.filter((id) => id !== userId));
    } else {
      setSelectedModerators([...selectedModerators, userId]);
    }
  };

  const handleClick = async () => {
    try {
      await setProgramModerators(program?.id, state)

      openSnackbar({
        open: true,
        message: 'Moderators has been updated successfully',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
    } catch (err) {
      openSnackbar({
        open: true,
        message: err?.message || 'Some error occurred while updating moderators.',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    } finally {
      closeModal()
    }
  }

  if (loading)
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );

  return (
    <>
      <DialogTitle>Set Moderator for {program?.name} program</DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2.5 }}>
        <Grid container spacing={3}>
          <Grid md={1}></Grid>
          {moderators?.length ? <Grid item xs={12} md={10} sx={{ display: 'grid', gap: 2 }}>
            {moderators.map((user) => (
              <Grid item xs={12} key={user.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedModerators.includes(user.id)}
                      onChange={handleChangeState(user.id)}
                      name={user.name}
                      color="primary"
                    />
                  }
                  label={<Stack spacing={0}>
                    <Typography variant="subtitle1">{user.first_name + ' ' + user.last_name}</Typography>
                    <Typography color="text.secondary">{user.email}</Typography>
                  </Stack>}
                />
              </Grid>
            ))
            }
          </Grid> :
            <Grid md={10} width="100%">
              <Stack width="100%" justifyContent="center" alignItems="center" p={3}>
                <Box width="100%" maxWidth="320px" >
                  <Typography>
                    There are no moderators for <b>{program?.name}</b>  program. Please Invite moderator for this program
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          }

          <Grid md={1}></Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Button color="error" onClick={closeModal}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={2} alignItems="center">
              <LoadingButton loading={buttonLoading} variant="contained" onClick={openInviteModerator}>
                Invite Moderator
              </LoadingButton>
              {
                moderators?.length !== 0 &&
                <LoadingButton loading={buttonLoading} type="submit" variant="contained" onClick={handleClick}>
                  Set
                </LoadingButton>
              }
            </Stack>
          </Grid>
        </Grid>
      </DialogActions>
    </>
  );
};

SetModerator.propTypes = {
  closeModal: PropTypes.func,
  program: PropTypes.object
};

export default SetModerator;
