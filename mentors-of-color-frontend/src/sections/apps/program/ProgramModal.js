import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// material-ui
import { Box, Modal, Stack } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import AddProgramForm from './AddProgramForm';
import SetModerator from './SetModerator';
import InviteModeratorForm from './InviteModerator';

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

const AddProgramModal = ({ open, modalToggler, type,
  program, setProgram, openInviteModerator }) => {
  const [loading, setLoading] = useState(true);

  const closeModal = () => {
    modalToggler(false)
    program && setProgram(null)
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  const renderContent = useMemo(
    () => {
      switch (type) {
        case "add":
          return <AddProgramForm closeModal={closeModal} />
        case "moderator":
          return <SetModerator closeModal={closeModal} program={program} openInviteModerator={openInviteModerator} />
        case "inviteModerator":
          return <InviteModeratorForm closeModal={closeModal} program={program} />
        default:
          return <></>
      }
    },

    // eslint-disable-next-line
    [type]
  );

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-customer-add-label"
          aria-describedby="modal-customer-add-description"
          sx={{
            '& .MuiPaper-root:focus': {
              outline: 'none'
            }
          }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar
              sx={{
                maxHeight: `calc(100vh - 48px)`,
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }}
            >
              {loading ? (
                <Box sx={{ p: 5 }}>
                  <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                  </Stack>
                </Box>
              ) : (
                renderContent
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

AddProgramModal.propTypes = {
  open: PropTypes.bool,
  modalToggler: PropTypes.func,
};

export default AddProgramModal;
