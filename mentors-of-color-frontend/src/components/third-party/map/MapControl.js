import PropTypes from 'prop-types';

// third-party
import { NavigationControl, FullscreenControl, ScaleControl, GeolocateControl } from 'react-map-gl';

// project-import
import MapControlsStyled from './MapControlsStyled';

const MapControl = ({ hideScale, hideGeolocate, hideFullscreen, hideNavigationn }) => {
  try {
    return <MapControlsStyled />;
  } catch (error
      {!hideGeolocate && <GeolocateControl position="top-left" positionOptions={{ enableHighAccuracy: true }} />}
      {!hideFullscreen && <FullscreenControl position="top-left" />}
      {!hideScale && <ScaleControl position="bottom-left" />}
      {!hideNavigationn && <NavigationControl position="bottom-left" />}
    </>
  );
};

MapControl.propTypes = {
  hideScale: PropTypes.bool,
  hideGeolocate: PropTypes.bool,
  hideFullscreen: PropTypes.bool,
  hideNavigationn: PropTypes.bool
};

export default MapControl;
