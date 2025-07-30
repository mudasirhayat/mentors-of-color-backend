import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { openSnackbar } from 'api/snackbar';


// assets
import { createProgram } from 'api/program';
import useAuth from 'hooks/useAuth';


const AddProgramForm = ({ closeModal }) => {
  const [loading, setLoading] = useState(true);
  const { user: { id: loginUserID, user_profile: { first_name, last_name }, account_id } } = useAuth()

  const getInitialValues = () => {
    const newProgram = {
      name: '',
      administrator: `${first_name} ${last_name}`,
      unique_name: '',
      invite_message: ""
    };

    return newProgram;
  };

  const administrators = [
    `${first_name} ${last_name}`
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

  const ProgramSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Name is required'),
    // administrator: Yup.object().required('administrator for program is required'),
    unique_name: Yup.string().required('Unique name is required for program')
  });

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: ProgramSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { name, unique_name, invite_message } = values;
        const newProgram = {
          name, unique_name, invite_message,
          program_administrator_id: loginUserID,
          account_id: account_id
        }
        await createProgram(newProgram)
        openSnackbar({
          open: true,
          message: 'Program added successfully.',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        });
      } catch (error) {
        openSnackbar({
          open: true,
          message: error?.message || 'Some Error occurred please try again later.',
          variant: 'alert',
          alert: {
            color: 'error'
          }
        });
      } finally {
        setSubmitting(false);
        closeModal();
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

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
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>Add Program</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid md={1}></Grid>
                <Grid item xs={12} md={10}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1} >
                        <InputLabel htmlFor="program-name">Program Name</InputLabel>
                        <TextField
                          fullWidth
                          id="program-name"
                          placeholder="Enter Program Name"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1} >
                        <InputLabel htmlFor="program-unique-name">Program Unique Name</InputLabel>
                        <TextField
                          fullWidth
                          id="program-unique-name"
                          placeholder="Enter Program Unique Name"
                          {...getFieldProps('unique_name')}
                          error={Boolean(touched.unique_name && errors.unique_name)}
                          helperText={touched.unique_name && errors.unique_name}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="program-administrator">Program Administrator</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="program-administrator"
                            displayEmpty
                            {...getFieldProps('administrator')}
                            onChange={(event) => setFieldValue('administrator', event.target.value)}
                            input={<OutlinedInput id="select-program-administrator" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">Select Program Administrator</Typography>;
                              }
                              return (
                                <Typography variant="subtitle2">
                                  {selected}
                                </Typography>
                              );
                            }}
                          >
                            {administrators.map((administrator, idx) => (
                              <MenuItem key={idx} value={administrator}>
                                <ListItemText primary={administrator} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="invite-msg">Invite Message</InputLabel>
                        <TextField
                          fullWidth
                          id="invite-msg"
                          multiline
                          rows={2}
                          placeholder="Enter an invite message for user"
                          {...getFieldProps('invite_message')}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid md={1}></Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      Add
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

AddProgramForm.propTypes = {
  closeModal: PropTypes.func
};

export default AddProgramForm;
