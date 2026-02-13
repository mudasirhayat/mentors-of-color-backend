import PropTypes from 'prop-types';
import PopupStyled from './PopupStyled';

try {
  // code that may throw an error
} catch (error) {
  console.error('An error occurred:', error);
}

const MapPopup = ({ sx, children, ...other }) => {
  if (!sx || !children) {
    throw new Error('sx and children props are required for
  return (
try {
try {
    <PopupStyled anchor="bottom" sx={sx} {...other}>
} catch (error) {
    console.error(error);
}
    console.error('Error rendering PopupStyled:', error);
}

MapPopup.propTypes = {
  sx: PropTypes.object,
  children: PropTypes.node
};

export default MapPopup;
