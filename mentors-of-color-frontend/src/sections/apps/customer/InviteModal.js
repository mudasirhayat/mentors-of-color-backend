import PropTypes from "prop-types";
import { useEffect, useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
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
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// third-party
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

// project imports
import Avatar from "components/@extended/Avatar";
import CircularWithPath from "components/@extended/progress/CircularWithPath";

import { openSnackbar } from "api/snackbar";
import { inviteUser } from "api/customer";
import { ThemeMode } from "config";

// assets
import { CameraOutlined } from "@ant-design/icons";
import useAuth from "hooks/useAuth";

const avatarImage = require.context("assets/images/users", true);

// constant
const getInitialValues = () => {
  const newCustomer = {
    email: "",
    about: "",
    types: {},
    user_type: "",
    password1: "Test@123",
    password2: "Test@123",
  };

  return newCustomer;
};

const allUserTypes = [{ value: "account_user", label: "Account User" }];

// ==============================|| CUSTOMER ADD ||============================== //

const InviteUserModal = ({ closeModal }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { id: loginUserID, account_id: accountID } = user;

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState(avatarImage(`./avatar-1.png`));

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const CustomerSchema = Yup.object().shape({
    email: Yup.string()
      .max(255)
      .required("Email is required")
      .email("Must be a valid email"),
    user_type: Yup.string().required("User type is required"),
  });

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newCustomer = { ...values };
        newCustomer.account_id = accountID;
        delete newCustomer.types;

        await inviteUser(newCustomer, loginUserID, accountID).then(() => {
          openSnackbar({
            open: true,
            message: "Invite email sent successfully.",
            variant: "alert",
            alert: {
              color: "success",
            },
          });
          setSubmitting(false);
          closeModal();
        });
      } catch (error) {
        console.error(error);
        openSnackbar({
          open: true,
          message: error?.response?.data?.error || "Something went wrong!",
          variant: "alert",
          alert: {
            color: "error",
          },
        });
        setSubmitting(false);
        closeModal();
      }
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    setFieldValue,
  } = formik;

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
            <DialogTitle>Invite User</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                    <FormLabel
                      htmlFor="change-avtar"
                      sx={{
                        position: "relative",
                        borderRadius: "50%",
                        overflow: "hidden",
                        "&:hover .MuiBox-root": { opacity: 1 },
                        cursor: "pointer",
                      }}
                    >
                      <Avatar
                        alt="Avatar 1"
                        src={avatar}
                        sx={{ width: 72, height: 72, border: "1px dashed" }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          backgroundColor:
                            theme.palette.mode === ThemeMode.DARK
                              ? "rgba(255, 255, 255, .75)"
                              : "rgba(0,0,0,.65)",
                          width: "100%",
                          height: "100%",
                          opacity: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Stack spacing={0.5} alignItems="center">
                          <CameraOutlined
                            style={{
                              color: theme.palette.secondary.lighter,
                              fontSize: "2rem",
                            }}
                          />
                          <Typography sx={{ color: "secondary.lighter" }}>
                            Upload
                          </Typography>
                        </Stack>
                      </Box>
                    </FormLabel>
                    <TextField
                      type="file"
                      id="change-avtar"
                      placeholder="Outlined"
                      variant="outlined"
                      sx={{ display: "none" }}
                      onChange={(e) => setSelectedImage(e.target.files?.[0])}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-email">Email</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-email"
                          placeholder="Enter User Email"
                          {...getFieldProps("email")}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-status">
                          User Type
                        </InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps("types")}
                            onChange={(event) => {
                              setFieldValue("types", event.target.value);
                              setFieldValue(
                                "user_type",
                                event.target.value.value
                              );
                            }}
                            input={
                              <OutlinedInput
                                id="select-column-hiding"
                                placeholder="Sort by"
                              />
                            }
                            renderValue={(selected) => {
                              if (!selected?.value) {
                                return (
                                  <Typography variant="subtitle1">
                                    Select User Type
                                  </Typography>
                                );
                              }
                              return (
                                <Typography variant="subtitle2">
                                  {selected?.label}
                                </Typography>
                              );
                            }}
                          >
                            {allUserTypes.map((column) => (
                              <MenuItem key={column.value} value={column}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.user_type && errors.user_type && (
                          <FormHelperText
                            error
                            id="standard-weight-helper-text-email-login"
                            sx={{ pl: 1.75 }}
                          >
                            {errors.user_type}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-about">
                          Invite Message
                        </InputLabel>
                        <TextField
                          fullWidth
                          id="customer-about"
                          multiline
                          rows={2}
                          placeholder="Enter an invite message for user"
                          {...getFieldProps("about")}
                          error={Boolean(touched.about && errors.about)}
                          helperText={touched.about && errors.about}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item></Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                    >
                      Invite
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

InviteUserModal.propTypes = {
  closeModal: PropTypes.func,
};

export default InviteUserModal;
