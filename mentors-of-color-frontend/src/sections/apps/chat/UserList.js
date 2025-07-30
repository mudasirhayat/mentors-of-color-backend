import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Stack, Typography } from '@mui/material';

// third-party
import { Chance } from 'chance';

// project imports
import UserAvatar from './UserAvatar';
import Dot from 'components/@extended/Dot';
import { useGetUsers, useGetUsersBE } from 'api/chat';

// assets
import { CheckOutlined } from '@ant-design/icons';
import useAuth from 'hooks/useAuth';
import userJson from "utils/locales/user.json"
import { textAlign } from '@mui/system';
import { type } from '@testing-library/user-event/dist/type';

const chance = new Chance();

function UserList({ setUser, search, selectedUser, users }) {

  const theme = useTheme();
  const [data, setData] = useState([]);
  const user = useAuth();

  useEffect(() => {
    if (users?.length) {
      let result = users;
      if (search) {
        result = users.filter((row) => {
          let matches = true;

          const properties = ['room_name'];
          let containsQuery = false;

          properties.forEach((property) => {
            if (row[property]?.toString()?.toLowerCase()?.trim()?.includes(search.toString().toLowerCase().trim())) {
              containsQuery = true;
            }
          });

          if (!containsQuery) {
            matches = false;
          }
          return matches;
        });
      }
      setData(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, users]);

  const renderUserType = (types) => {
    if (types?.length <= 0) return "DM"

    const userType = user?.user?.user_type;
    if (userType === 'mentee') return "Mentor"
    if (userType === 'mentor') return "Mentee"
    if (userType === 'moderator') return "Mentee & Mentor"
 
    // switch (userType) {
    //   case "mentor":
    //     return userJson["Mentee"];  // Assuming mentors view mentee info
    //   case "mentee":
    //     return userJson["Mentor"];  // Assuming mentees view mentor info
    //   case "is_moderator":
    //     return userJson["Mentor & Mentee"];  // For moderators handling both roles
    //   default:
    //     return userJson["n/a"];  // Fallback for undefined or unknown user types
    // }
  }

  if (!users?.length)
    return (
      <Box sx={{textAlign: 'center'}}>No sessions available!</Box>
    );

  return (
    <List component="nav">
      {data.map((chat, idx) => (
        <Fragment key={chat.roomId}>
          <ListItemButton
            sx={{ pl: 1 }}
            onClick={() => {
              setUser(chat);
            }}
            divider
            selected={chat.roomId === selectedUser}
          >
            <ListItemAvatar>
              <UserAvatar user={chat} avatarId={idx % 10} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Stack component="span" direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <Typography
                    variant="h5"
                    color="text.primary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                  {chat.room_name}
                  </Typography>
                  <Typography component="span" color="textSecondary" variant="caption">
                    {chat.lastMessageTime || "2h ago"}
                  </Typography>
                </Stack>
              }
              secondary={
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <>{renderUserType(chat?.member_details) || "N/A"}</>
                  <>
                    {chat.unReadChatCount ? (
                      <Dot color="primary" />
                    ) : (
                      // chance.bool() - use for last send msg was read or unread
                      <CheckOutlined style={{ color: chance.bool() ? theme.palette.grey[400] : theme.palette.primary.main }} />
                    )}
                  </>
                </Typography>
              }
            />
          </ListItemButton>
        </Fragment>
      ))}
    </List>
  );
}

UserList.propTypes = {
  setUser: PropTypes.func,
  search: PropTypes.string,
  selectedUser: PropTypes.number
};

export default UserList;
