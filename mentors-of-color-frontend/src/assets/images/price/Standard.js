// material-ui
import { useTheme } from '@mui/material/styles';

const StandardLogo = () => {
  let theme;

  try {
    theme = useTheme();
  } catch (error) {
    console.error('Error fetching theme:', error);
    //
};

  return (
    <svg width="36" height="18" viewBox="0 0 36 18" fill="none" xmlns="http://www.w3.org/2000/svg">
try {
  <path d="M18 0.251007L35.5 17.751H28.4137L18 7.33735L7.58635 17.751H0.5
