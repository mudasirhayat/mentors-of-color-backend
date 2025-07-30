import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { openSnackbar } from 'api/snackbar';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { resetUserPassword } from 'api/auth';

// ============================|| STATIC - RESET PASSWORD ||============================ //

const AuthResetPassword = () => {
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  const { uuid, token } = useParams();

  const { isLoggedIn } = useAuth();

  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <Formik
      initialValues={{
        new_password1: '',
        new_password2: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        new_password1: Yup.string().max(255).required('Password is required'),
        new_password2: Yup.string()
          .required('Confirm Password is required')
          .test('new_password2', 'Both Password must be match!', (new_password2, yup) => yup.parent.new_password1 === new_password2)
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // password reset
          const data = { ...values }
          data.uid = uuid
          data.token = token
          await resetUserPassword(data)
          setStatus({ success: true });
          setSubmitting(false);
          openSnackbar({
            open: true,
            message: 'Password has been set successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            }
          });
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 100);
        } catch (err) {
          console.log(err);

          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-reset">Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.new_password1 && errors.new_password1)}
                  id="password-reset"
                  type={showPassword ? 'text' : 'password'}
                  value={values.new_password1}
                  name="new_password1"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter password"
                />
              </Stack>
              {touched.new_password1 && errors.new_password1 && (
                <FormHelperText error id="helper-text-password-reset">
                  {errors.new_password1}
                </FormHelperText>
              )}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" fontSize="0.75rem">
                      {level?.label}
                    </Typography>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="confirm-password-reset">Confirm Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.new_password2 && errors.new_password2)}
                  id="confirm-password-reset"
                  type="password"
                  value={values.new_password2}
                  name="new_password2"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter confirm password"
                />
              </Stack>
              {touched.new_password2 && errors.new_password2 && (
                <FormHelperText error id="helper-text-confirm-password-reset">
                  {errors.new_password2}
                </FormHelperText>
              )}
            </Grid>

            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Reset Password
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default AuthResetPassword;
