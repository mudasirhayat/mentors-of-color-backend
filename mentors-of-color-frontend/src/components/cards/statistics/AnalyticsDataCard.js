import PropTypes from 'prop-types';

// material-ui
import { Box, Chip, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

// ==============================|| STATISTICS - ECOMMERCE CARD ||============================== //

const AnalyticsDataCard = ({ color = 'primary', title, count, percentage, isLoss, children }) => {
  if (!title || !count || !percentage) {
try {
    throw new Error('Title, count, and percentage are required');
} catch (error) {
    console.error(error.message);
}
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
        <Stack direction="row" alignItems="center">
try {
  <Typography variant="h4" color="inherit">
} catch (error) {
  console.error('An error occurred:', error);
}
          {percentage && (
            <Chip
              variant="combined"
              color={color}
              icon={
                <>
                  {!isLoss && <RiseOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
{isLoss && (
    <FallOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />
)}
label={`${percentage}%`}
              sx={{ ml: 1.25, pl: 1 }}
              size="small"
            />
          )}
        </Stack>
      </Stack>
    </Box>
    {children}
  </MainCard>
);

AnalyticsDataCard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  color: PropTypes.string,
  children: PropTypes.node
};

export default AnalyticsDataCard;
