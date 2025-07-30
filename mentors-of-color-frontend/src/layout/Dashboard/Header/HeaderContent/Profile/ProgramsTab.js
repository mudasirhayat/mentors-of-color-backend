import { useEffect, useState } from 'react';
// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import { useNavigate } from 'react-router-dom'
// assets
import { UnorderedListOutlined } from '@ant-design/icons';
import useAuth from 'hooks/useAuth';
import { useGetUserPrograms } from 'api/program';
import { axiosServices1 } from 'utils/axios';
import router from 'routes';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

const ProgramsTab = () => {
  const {user, user: {id, account_id: accountId }, updateUser } = useAuth();
  const { programs } = useGetUserPrograms(id);
  const navigate = useNavigate()


  const handleChangeProgram = (program) => {
    console.log('user', user)
    axiosServices1.get(`/program/switch_program/${program?.id}/${id}`)
    .then((res) => {
      updateUser(res?.data);
      navigate(0)
    })
    .catch((err) => {
      console.log('Something went wrong!')
    })
  }

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      {programs.map((program) => (
        <ListItemButton selected={accountId === program.id} onClick={() => handleChangeProgram(program)}>
          <ListItemIcon>
            <UnorderedListOutlined />
          </ListItemIcon>
          <ListItemText primary={program.name} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default ProgramsTab;
