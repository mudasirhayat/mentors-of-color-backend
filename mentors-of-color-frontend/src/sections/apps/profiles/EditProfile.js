import { useNavigate, useOutletContext } from "react-router";
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import * as Yup from "yup";
import { Formik } from "formik";
import userJson from "utils/locales/user.json";
import { openSnackbar } from "api/snackbar";
import MainCard from "components/MainCard";
import useAuth from "hooks/useAuth";

function useInputRef() {
  return useOutletContext();
}

const TabPersonal = () => {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const inputRef = useInputRef();

  const {
    user: {
      user_profile: { first_name, last_name, username, phone, birth_date },
      email,
      user_type,
      id: loginUserID,
    },
  } = useAuth();

  return (
    <MainCard
      content={false}
      title="Personal Information"
      sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}
    >
      <Formik
        initialValues={{
          first_name: first_name || "N/A",
          last_name: last_name || "N/A",
          username: username || "N/A",
          email: email,
          birth_date: new Date(birth_date),
          phone: phone,
          type: userJson[user_type] || "N/A",
          address: "3801 Chalk Butte Rd, Cut Bank, MT 59427, United States",
          address1: "301 Chalk Butte Rd, Cut Bank, NY 96572, New York",
          country: "US",
          state: "California",
          note: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`,
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          first_name: Yup.string().max(255).required("First Name is required."),
          last_name: Yup.string().max(255).required("Last Name is required."),
          username: Yup.string().max(255).required("User Name is required."),
          email: Yup.string()
            .email("Invalid email address.")
            .max(255)
            .required("Email is required."),
            phone: Yup.string()
            .matches(
                /^\+?[1-9]\d{9,14}$/,
                "Phone number is not valid. It should start with a + (optional) and be followed by 10 to 15 digits."
            )
            .required("Phone number is required."),
          birth_date: Yup.date().required("Birth date is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (values.first_name.trim().toLowerCase() === "n/a") {
              setStatus({ success: false });
              setErrors({
                first_name:
                  "First name can not be empty or 'N/A'. Please provide first name",
              });
              setSubmitting(false);
              return;
            }

            if (values.birth_date >= new Date()) {
              setStatus({ success: false });
              setErrors({
                birth_date:
                  "Date of birth can not be in future!",
              });
              setSubmitting(false);
              return;
            }

            const { first_name, last_name, username, birth_date, phone } = values;
            const formatDate = birth_date?.toISOString()?.split("T")[0];
            const data = {
              first_name,
              last_name,
              username,
              phone,
              birth_date: formatDate,
            };

            await updateProfile(loginUserID, data);
            openSnackbar({
              open: true,
              message: "Personal profile updated successfully.",
              variant: "alert",
              alert: {
                color: "success",
              },
            });
            setStatus({ success: false });
            setSubmitting(false);
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: "Some error occurred while updating profile" });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-first-name">
                      First Name
                    </InputLabel>
                    <TextField
                      fullWidth
                      id="personal-first-name"
                      value={values.first_name}
                      name="first_name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="First Name"
                      autoFocus
                      inputRef={inputRef}
                    />
                  </Stack>
                  {touched.first_name && errors.first_name && (
                    <FormHelperText error id="personal-first-name-helper">
                      {errors.first_name}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-last-name">
                      Last Name
                    </InputLabel>
                    <TextField
                      fullWidth
                      id="personal-last-name"
                      value={values.last_name}
                      name="last_name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />
                  </Stack>
                  {touched.last_name && errors.last_name && (
                    <FormHelperText error id="personal-last-name-helper">
                      {errors.last_name}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-first-name">
                      User Name
                    </InputLabel>
                    <TextField
                      fullWidth
                      id="personal-username"
                      value={values.username}
                      name="username"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="User Name"
                      autoFocus
                      inputRef={inputRef}
                    />
                  </Stack>
                  {touched.username && errors.username && (
                    <FormHelperText error id="personal-user-name-helper">
                      {errors.username}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-email">
                      Email Address
                    </InputLabel>
                    <TextField
                      type="email"
                      fullWidth
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      id="personal-email"
                      placeholder="Email Address"
                      inputProps={{ readOnly: true }}
                    />
                  </Stack>
                  {touched.email && errors.email && (
                    <FormHelperText error id="personal-email-helper">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-birth-date">
                      Date of Birth
                    </InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={values.birth_date}
                        onChange={(newValue) => {
                          setFieldValue("birth_date", newValue);
                        }}
                        disableFuture
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                      />
                    </LocalizationProvider>
                  </Stack>
                  {touched.birth_date && errors.birth_date && (
                    <FormHelperText error id="personal-birth-date-helper">
                      {errors.birth_date}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-phone">
                      Phone Number
                    </InputLabel>
                    <TextField
                      fullWidth
                      id="personal-phone"
                      value={values.phone}
                      name="phone"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Phone Number"
                    />
                  </Stack>
                  {touched.phone && errors.phone && (
                    <FormHelperText error id="personal-phone-helper">
                      {errors.phone}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-designation">
                      User Type
                    </InputLabel>
                    <TextField
                      fullWidth
                      id="personal-designation"
                      value={values.type}
                      name="designation"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Designation"
                    />
                  </Stack>
                  {touched.type && errors.type && (
                    <FormHelperText error id="personal-designation-helper">
                      {errors.type}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ p: 2.5 }}>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={2}
                sx={{ mt: 2.5 }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/profile/view")}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isSubmitting || Object.keys(errors).length !== 0}
                  type="submit"
                  variant="contained"
                >
                  Save
                </Button>
              </Stack>
            </Box>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default TabPersonal;
