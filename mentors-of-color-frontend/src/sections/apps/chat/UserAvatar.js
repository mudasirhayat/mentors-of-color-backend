import PropTypes from 'prop-types';

// material-ui
import { Badge } from '@mui/material';

// project imports
import AvatarStatus from './AvatarStatus';
import Avatar from 'components/@extended/Avatar';

// assets
const avatarImage = require.context('assets/images/users', true);

// ==============================|| CHAT USER AVATAR WITH STATUS ICON ||============================== //

const UserAvatar = ({ user, avatarId }) => (
  <Badge
    overlap="circular"
    badgeContent={<AvatarStatus status={user.online_status ? "available" : "offline"} />}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    sx={{ '& .MuiBox-root': { width: 6, height: 6 }, padding: 0, minWidth: 12, '& svg': { background: '#fff', borderRadius: '50%' } }}
  >
    <Avatar alt={user.room_name} src={avatarId ? avatarImage(`./avatar-${avatarId}.png`) : user.avatar && avatarImage(`./${user.avatar}`)} />
  </Badge>
);

UserAvatar.propTypes = {
  user: PropTypes.object
};

export default UserAvatar;
