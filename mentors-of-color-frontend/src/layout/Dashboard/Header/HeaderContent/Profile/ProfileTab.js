import PropTypes from "prop-types";
import { useState } from "react";

// material-ui
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// assets
import {
  EditOutlined,
  ProfileOutlined,
  LogoutOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useGetUserPrograms } from "api/program";
import useAuth from "hooks/useAuth";

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProgramsTab = ({ handleLogout, handleToggle }) => {
  const navigate = useNavigate();
  const handleListItemClick = (path) => {
    navigate(path);
  };

  return (
    <List
      component="nav"
      sx={{ p: 0, "& .MuiListItemIcon-root": { minWidth: 32 } }}
    >
      <ListItemButton
        onClick={() => {
          handleListItemClick("profile/edit/personal");
          handleToggle();
        }}
      >
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="Edit Profile" />
      </ListItemButton>
      <ListItemButton
        onClick={() => {
          handleListItemClick("profile/view");
          handleToggle();
        }}
      >
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="View Profile" />
      </ListItemButton>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
};

ProgramsTab.propTypes = {
  handleLogout: PropTypes.func,
};

export default ProgramsTab;
