import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import userJson from "utils/locales/user.json";

// project import
import Avatar from "components/@extended/Avatar";
import useAuth from "hooks/useAuth";
import { useGetMenuMaster } from "api/menu";

// assets
import { RightOutlined } from "@ant-design/icons";

const avatarImage = require.context("assets/images/users", true);

const ExpandMore = styled(IconButton, {
  shouldForwardProp: (prop) =>
    prop !== "theme" && prop !== "expand" && prop !== "drawerOpen",
})(({ theme, expand, drawerOpen }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(-90deg)",
  marginLeft: "auto",
  color: theme.palette.secondary.dark,
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  ...(!drawerOpen && {
    opacity: 0,
    width: 50,
    height: 50,
  }),
}));

// ==============================|| DRAWER - USER ||============================== //

const NavUser = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(`/login`, {
        state: {
          from: "",
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        p: 1.25,
        px: !drawerOpen ? 1.25 : 3,
        borderTop: `2px solid ${theme.palette.divider}`,
      }}
    >
      <List disablePadding>
        <ListItem
          disablePadding
          secondaryAction={
            <ExpandMore
              size="small"
              expand={open.toString()}
              drawerOpen={drawerOpen}
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              aria-label="show more"
            >
              <RightOutlined style={{ fontSize: "0.625rem" }} />
            </ExpandMore>
          }
          sx={{
            "& .MuiListItemSecondaryAction-root": {
              right: !drawerOpen ? -20 : -16,
            },
          }}
        >
          <ListItemAvatar>
            <Avatar
              alt="Avatar"
              src={avatarImage(`./avatar-1.png`)}
              sx={{ ...(drawerOpen && { width: 46, height: 46 }) }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={`${user?.user_profile?.first_name}  ${user?.user_profile?.last_name}`}
            secondary={userJson[user?.user_type]}
          />
        </ListItem>
      </List>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <MenuItem
          component={Link}
          to="/profile/edit/personal"
          onClick={handleClose}
        >
          View Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default NavUser;
