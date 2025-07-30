// material-ui
import {
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  Typography,
  useMediaQuery,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';

import userJson from 'utils/locales/user.json'
// third-party
import { PatternFormat } from 'react-number-format';

// project import
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// assets
import { AimOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import useAuth from 'hooks/useAuth';
import { Box } from '@mui/system';

const avatarImage = require.context('assets/images/users', true);

// consts


// ==============================|| ACCOUNT PROFILE - BASIC ||============================== //

const TabProfile = () => {
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const matchDown380 = useMediaQuery((theme) => theme.breakpoints.down('380'));

  const { user } = useAuth();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={4} xl={3}>
        <Grid container spacing={3}>
          {matchDownSM && <Grid item xs={12}>
            <Stack alignItems="center" >
              <Box width="100%" maxWidth={matchDown380 ? "100%" : "120px"}>
                <Button
                  component={Link}
                  variant={matchDown380 ? "contained" : "outlined"}
                  to="/profile/edit/personal"
                  sx={{
                    width: matchDown380 ? "inherit" : "100%",
                    textDecoration: 'none',
                    borderRadius: "5px",
                    padding: "8px 16px",
                    marginBottom: "5px",
                    transition: "background-color 0.3s, color 0.3s",
                    "&:hover": {
                      backgroundColor: "#1677ff",
                      color: "#ffffff",
                    }
                  }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Stack>

          </Grid>}
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end">
                    <Chip label={userJson[user?.user_type]} size="small" color="primary" />
                  </Stack>
                  <Stack spacing={2.5} alignItems="center">
                    <Avatar alt="Avatar 1" size="xl" src={avatarImage(`./default.png`)} />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{user?.user_profile?.first_name} {user?.user_profile?.last_name}</Typography>
                      <Typography color="secondary">{userJson[user?.user_type]}</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                    <ListItem>
                      <ListItemIcon>
                        <MailOutlined />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{user?.email}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneOutlined />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right"><PatternFormat displayType="text" format="(###) ###-####" mask="_" defaultValue={user?.user_profile?.phone} /></Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AimOutlined />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">New York</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EnvironmentOutlined />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Link align="right" href="https://google.com" target="_blank">
                          https://test.url.com
                        </Link>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={7} md={8} xl={9}>
        <Grid container spacing={2}>
          {!matchDownSM && <Grid item xs={12}>
            <Stack alignItems="flex-end">
              <Box width="100%" maxWidth="120px">
                <Button
                  component={Link}
                  variant="outlined"
                  to="/profile/edit/personal"
                  sx={{
                    textDecoration: 'none',
                    borderRadius: "5px",
                    padding: "8px 16px",
                    marginBottom: "5px",
                    transition: "background-color 0.3s, color 0.3s",
                    "&:hover": {
                      backgroundColor: "#1677ff",
                      color: "#ffffff",
                    }
                  }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Stack>

          </Grid>}

          <Grid item xs={12}>
            <MainCard title="Personal Details">
              <List sx={{ py: 0 }}>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Full Name</Typography>
                        <Typography>{user?.user_profile?.first_name} {user?.user_profile?.last_name}</Typography>
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">User Name</Typography>
                        <Typography>{user?.user_profile?.username}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">User Type</Typography>
                        <Typography>{userJson[user?.user_type] || "N/A"}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Phone</Typography>
                        <Typography>
                          <PatternFormat displayType="text" format="(###) ###-####" mask="_" defaultValue={user?.user_profile?.phone} />
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Country</Typography>
                        <Typography>New York</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Email</Typography>
                        <Typography>{user?.email}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Zip Code</Typography>
                        <Typography>956 754</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </MainCard>
          </Grid>

        </Grid>
      </Grid>
    </Grid >
  );
};

export default TabProfile;
