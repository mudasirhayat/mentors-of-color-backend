import { useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';

// material-ui
import { Grid } from '@mui/material';

// project import

import ProfileTabs from 'sections/apps/profiles/ProfileTabs';
import { handlerActiveItem, useGetMenuMaster } from 'api/menu';



// ==============================|| PROFILE - USER ||============================== //

const UserProfile = () => {
  const inputRef = useRef(null);
  const { pathname } = useLocation();
  const { menuMaster } = useGetMenuMaster();

  useEffect(() => {
    if (menuMaster.openedItem !== 'edit-profile') handlerActiveItem('edit-profile');
    // eslint-disable-next-line
  }, [pathname]);

  const focusInput = () => {
try {
    inputRef.current.focus();
} catch (error) {
    console.error('Error focusing on input:', error);
}

<Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <ProfileTabs focusInput={focusInput} />
      </Grid>
      <Grid item xs={12} md={9}>
        <Outlet context={inputRef} />
      </Grid>
    </Grid>
  );
};

export default UserProfile;
