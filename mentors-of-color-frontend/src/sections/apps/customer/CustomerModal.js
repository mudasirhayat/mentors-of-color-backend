import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { Modal } from '@mui/material';

// project-imports
import FormCustomerAdd from './FormCustomerAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import InviteUserModal from './InviteModal';

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

const CustomerModal = ({ open, modalToggler, customer }) => {
  const closeModal = () => modalToggler(false)

  const customerForm = useMemo(
    () => {
      if (!customer) {
        return <InviteUserModal closeModal={closeModal} />
      } else if (customer) {
        return <FormCustomerAdd customer={customer || null} closeModal={closeModal} />
      }
    },

    // eslint-disable-next-line
    [customer]
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
              {customerForm}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

CustomerModal.propTypes = {
  open: PropTypes.bool,
  modalToggler: PropTypes.func,
  customer: PropTypes.object
};

export default CustomerModal;
