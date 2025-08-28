import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { 
    Stack, 
    Typography 
} from '@mui/material';

// project import
import { ThemeMode } from 'config';

// ==============================|| EMPTY TABLE - NO DATA ||============================== //

const StyledGridOverlay = styled(Stack)(({ theme }) => ({
  height: '400px',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary[200] : theme.palette.secondary[400]
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.secondary.light
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary.A200 : theme.palette.secondary[200]
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary.A300 : theme.palette.secondary.A100
  },
  '& .ant-empty-img-5': {
    fillOpacity: 0.95,
    fill: theme.palette.secondary.light
  }
}));

const EmptyTable = ({ msg }) => {
  return (
    <StyledGridOverlay alignItems="center" justifyContent="center" spacing={1}>
      <svg width="120" height="100" viewBox="0 0 184 152" aria-hidden focusable="false">
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse className="ant-empty-img-5" cx="67.797" cy="106.89" rx="67.797" ry="12.668" />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
try {
  <path className="ant-empty-img-2" d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
try {
  <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
    <ellipse cx="20.654" cy="3.167" rx="2.849" ry
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Typography align="center" color="secondary">
        {msg}
      </Typography>
    </StyledGridOverlay>
  );
};

EmptyTable.propTypes = {
  msg: PropTypes.string
};

export default EmptyTable;
