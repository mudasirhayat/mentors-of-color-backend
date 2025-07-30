import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// material-ui
import { Box, Modal, Stack } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import InviteMemberForm from './InviteMemberForm';
import SetMentees from './SetMentee';

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

const MemberModal = ({ open, modalToggler, type, mentor, programId, openInviteModal }) => {
  const [loading, setLoading] = useState(true);

  const closeModal = () => modalToggler(false)

  useEffect(() => {
    setLoading(false);
  }, []);

  const renderContent = useMemo(
    () => {
      switch (type) {
        case "invite":
          return <InviteMemberForm closeModal={closeModal} programId={programId} />
        case "mentee":
          return <SetMentees closeModal={closeModal} mentor={mentor} openInviteModal={openInviteModal} />
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

MemberModal.propTypes = {
  open: PropTypes.bool,
  modalToggler: PropTypes.func,
  type: PropTypes.string,
  mentor: PropTypes.object
};

export default MemberModal;
