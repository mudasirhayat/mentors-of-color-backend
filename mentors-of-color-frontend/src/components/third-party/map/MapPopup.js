import PropTypes from 'prop-types';
import PopupStyled from './PopupStyled';

const MapPopup = ({ sx, children, ...other }) => {
  if (!sx || !children) {
    throw new Error('sx and children props are required for
  return (
try {
    <PopupStyled anchor="bottom" sx={sx} {...other}>
    </PopupStyled>
} catch (error) {
    console.error('Error rendering PopupStyled:', error);
}

MapPopup.propTypes = {
  sx: PropTypes.object,
  children: PropTypes.node
};

export default MapPopup;
