import PropTypes from "prop-types";
import * as React from "react";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
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
  Radio,
  Typography,
} from "@mui/material";

// project imports
import CircularWithPath from "components/@extended/progress/CircularWithPath";
import { useParams } from "react-router-dom";
import { setMenteesForMentor, restructureData } from "api/program";
import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { axiosServices1 } from "utils/axios";

// ==============================|| CUSTOMER ADD ||============================== //

const SetMentees = ({ closeModal, mentor, openInviteModal }) => {
  const { id: programId } = useParams();
  const {
    user: { associated_user_id },
  } = useAuth();

  const [selectedMentee, setSelectedMentee] = useState(null);
  const [mentees, setMentees] = useState([]);
  const [menteeIds, setMenteeIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [menteeToUnset, setMenteeToUnset] = useState(null);

  useEffect(() => {
    axiosServices1
      .get(`program/${programId}/mentee/${mentor?.id}/`)
      .then((res) => {
        const menteesList = restructureData(res?.data);
        setMentees(menteesList);
        const menteesIdsList = menteesList.map((mentee) => mentee.id);
        setMenteeIds(menteesIdsList);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [programId, mentor?.id]);

  if (loading)
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );

  const handleChangeState = (userId) => (event) => {
    setSelectedMentee(userId);
  };

  const showToaster = (message, type, time) => {
    return openSnackbar({
      open: true,
      message: message,
      variant: "alert",
      alert: {
        color: type,
      },
      autoHideDuration: time,
    });
  };

  const handleClickOpen = (mentee) => {
    setMenteeToUnset(mentee);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUnset = async () => {
    try {
      const menteeId = menteeToUnset.id;

      const data = {
        mentee_id: menteeId,
        mentor_id: mentor?.id,
        program_id: programId,
      };

      await axiosServices1.post("program/unset/mentee/", data);
      showToaster("Mentee unset successfully", "success");

      setMentees((prevMentees) =>
        prevMentees.map((mentee) =>
          mentee.id === menteeId ? { ...mentee, matched: false } : mentee
        )
      );

      handleClose();
    } catch (err) {
      showToaster(err.message, "error", 3000);
      handleClose();
    }
  };

  const handleClick = async () => {
    try {
      if (!selectedMentee)
        return showToaster(
          "Please select at least one mentee for creating session",
          "error",
          2000
        );

      const data = {
        mentor_id: mentor?.id,
        mentee_ids: [selectedMentee],
        account_user: associated_user_id,
      };
      await setMenteesForMentor(data);
      showToaster("Session created successfully", "success");
      closeModal();
    } catch (err) {
      showToaster(err.message, "error", 3000);
      closeModal();
    }
  };

  return (
    <>
      <DialogTitle>Set Mentees for {mentor?.name} mentor</DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2.5 }}>
        <Grid container spacing={3}>
          <Grid md={1}></Grid>
          {mentees?.length ? (
            <Grid
              key={`${selectedMentee}`}
              item
              xs={12}
              md={10}
              sx={{ display: "grid", gap: 2 }}
            >
              {mentees?.map((user) => (
                <Grid item xs={12} key={user.id}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <FormControlLabel
                        control={
                          <Radio
                            checked={selectedMentee === user.id}
                            onChange={handleChangeState(user.id)}
                            name={user.name}
                            color="primary"
                            disabled={
                              menteeIds.includes(user.id) && user.matched
                            }
                          />
                        }
                        label=""
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1">{user.name}</Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography color="text.secondary" sx={{wordBreak: 'break-word'}}>
                        {user.email}
                      </Typography>
                    </Grid>
                    {menteeIds.includes(user.id) && user.matched && (
                      <Grid item>
                        <Button
                          color="error"
                          size="small"
                          variant="contained"
                          sx={{ minWidth: "max-content", padding: "8px 10px" }}
                          onClick={() => handleClickOpen(user)}
                        >
                          Unset
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid md={10} width="100%">
              <Stack
                width="100%"
                justifyContent="center"
                alignItems="center"
                p={3}
              >
                <Box width="100%" maxWidth="400px">
                  <Typography>
                    There are no mentees available for this program. Please
                    Invite mentees for this program before assigning to{" "}
                    <b>{mentor?.name}</b> mentor.
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          )}
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
              <Button variant="contained" onClick={openInviteModal}>
                Invite Mentees
              </Button>
              {mentees?.length > 0 && (
                <Button type="submit" variant="contained" onClick={handleClick}>
                  Set
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </DialogActions>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Are you sure to Unset this Mentee?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to unset {menteeToUnset?.name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="error" onClick={handleUnset} autoFocus>
            Unset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

SetMentees.propTypes = {
  closeModal: PropTypes.func,
  mentor: PropTypes.object,
};

export default SetMentees;
