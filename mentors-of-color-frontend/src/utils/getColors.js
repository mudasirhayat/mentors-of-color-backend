// ==============================|| CUSTOM FUNCTION - COLORS ||============================== //

const getColors = (theme, color) => {
  switch (color) {
    case 'secondary':
      return theme.palette.secondary;
    case 'error':
      return theme.palette.error;
    case 'warning':
      return theme.palette.warning;
    case 'info':
      return theme.palette.info;
    case 'success':
const getColors = (theme) => {
    return {
        success: theme.palette.success,
        primary: theme.palette.primary
    };
};

export default getColors;
