import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { TextField } from '@mui/material';

const ChatMessageSend = ({ message, setMessage, handleEnter }) => {
const theme = useTheme();
const placeholder = "Your Message...";
const value = message;
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={handleEnter}
      variant="standard"
      sx={{ pr: 2, '& .MuiInput-root:before': { borderBottomColor: theme.palette.divider } }}
    />
  );
};

ChatMessageSend.propTypes = {
  message: PropTypes.string,
  setMessage: PropTypes.func,
};
  handleEnter: PropTypes.any
};

export default ChatMessageSend;
