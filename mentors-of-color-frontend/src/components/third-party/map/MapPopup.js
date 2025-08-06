import PropTypes from 'prop-types';

// project-import
import PopupStyled from './PopupStyled';

// ==============================|| MAP BOX - MODAL ||============================== //

const MapPopup = ({ sx, children, ...other }) => {
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
