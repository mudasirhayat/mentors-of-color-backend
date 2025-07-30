import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertCustomerDelete from './AlertCustomerDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { openSnackbar } from 'api/snackbar';
import { updateCustomer } from 'api/customer';
import { ThemeMode } from 'config';

// assets
import { CameraOutlined, DeleteFilled } from '@ant-design/icons';
import useAuth from 'hooks/useAuth';

const avatarImage = require.context('assets/images/users', true);


// constant
const getInitialValues = (customer) => {
  const newCustomer = {
    first_name: '',
    last_name: '',
    user_contact_number: '',
    user_type: ''
  };

  if (customer) {
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

const allUserTypes = [
  'Account User',
  'Program User',
];

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

const FormCustomerAdd = ({ customer, closeModal }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { id: loginUserID, account_id: accountID } = user

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState(
    avatarImage(`./avatar-${customer && customer !== null && customer?.avatar ? customer.avatar : 1}.png`)
  );

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const CustomerSchema = Yup.object().shape({
    first_name: Yup.string().max(255).required('First Name is required'),
    last_name: Yup.string().max(255).required('Last Name is required'),
    user_email: Yup.string().max(255).required('Email is required').email('Must be a valid email'),
    user_type: Yup.string().required('User Type is required'),
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: getInitialValues(customer),
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newCustomer = values
        newCustomer.user_full_name = newCustomer.first_name + " " + newCustomer.last_name

        await updateCustomer(newCustomer.id, loginUserID, accountID, newCustomer)
        openSnackbar({
          open: true,
          message: 'User update successfully.',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        });
        setSubmitting(false);
        closeModal();

      } catch (error) {
        console.error(error);
        openSnackbar({
          open: true,
          message: 'Some Error occurred please try again later.',
          variant: 'alert',
          alert: {
            color: 'error'
          }
        });
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
            <DialogTitle>{customer ? 'Edit User' : 'New Customer'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                    <FormLabel
                      htmlFor="change-avtar"
                      sx={{
                        position: 'relative',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        '&:hover .MuiBox-root': { opacity: 1 },
                        cursor: 'pointer'
                      }}
                    >
                      <Avatar alt="Avatar 1" src={avatar} sx={{ width: 72, height: 72, border: '1px dashed' }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Stack spacing={0.5} alignItems="center">
                          <CameraOutlined style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }} />
                          <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                        </Stack>
                      </Box>
                    </FormLabel>
                    <TextField
                      type="file"
                      id="change-avtar"
                      placeholder="Outlined"
                      variant="outlined"
                      sx={{ display: 'none' }}
                      onChange={(e) => setSelectedImage(e.target.files?.[0])}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-firstName">First Name</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-firstName"
                          placeholder="Enter First Name"
                          {...getFieldProps('first_name')}
                          error={Boolean(touched.first_name && errors.first_name)}
                          helperText={touched.first_name && errors.first_name}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-lastName">Last Name</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-lastName"
                          placeholder="Enter Last Name"
                          {...getFieldProps('last_name')}
                          error={Boolean(touched.last_name && errors.last_name)}
                          helperText={touched.last_name && errors.last_name}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-email">Email</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-email"
                          placeholder="Enter Customer Email"
                          inputProps={{ readOnly: true }}
                          {...getFieldProps('user_email')}
                          error={Boolean(touched.user_email && errors.user_email)}
                          helperText={touched.user_email && errors.user_email}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-status">Status</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('user_type')}
                            onChange={(event) => setFieldValue('user_type', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">User Type</Typography>;
                              }

                              return (
                                <Typography variant="subtitle2">
                                  {selected}
                                </Typography>
                              );
                            }}
                          >
                            {allUserTypes.map((type, idx) => (
                              <MenuItem key={idx} value={type}>
                                <ListItemText primary={type} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.user_type && errors.user_type && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.user_type}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-contact">Contact</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-contact"
                          placeholder="Enter Contact"
                          {...getFieldProps('user_contact_number')}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {customer && (
                    <Tooltip title="Delete Customer" placement="top">
                      <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                        <DeleteFilled />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      {customer ? 'Edit' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {customer && <AlertCustomerDelete id={customer.id} title={customer.name} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
};

FormCustomerAdd.propTypes = {
  customer: PropTypes.object,
  closeModal: PropTypes.func
};

export default FormCustomerAdd;
