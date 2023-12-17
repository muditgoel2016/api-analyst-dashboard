import { Button, Box } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import PropTypes from 'prop-types';
import React from 'react';

dayjs.extend(utc);

const CustomMobileActionBar = (props) => {
  const { setDateRange, closePicker, className } = props;

  const handleAction = (action) => {
    switch (action) {
      case 'last24Hours':
        setDateRange([dayjs().utc().subtract(24, 'hour'), dayjs().utc()]);
        break;
      case 'last7Days':
        setDateRange([dayjs().utc().subtract(7, 'day'), dayjs().utc()]);
        break;
      case 'reset':
        setDateRange([null, null]);
        break;
      case 'accept':
      default:
        break;
    }
    closePicker();
  };

  return (
    <DialogActions className={className}>
      <Box display='flex' flexDirection='row' alignItems='center' justifyContent='flex-start'>
        <Button color='primary' onClick={() => handleAction('last24Hours')} style={{ textTransform: 'none', marginRight: '10px' }}>
          24h
        </Button>
        <Button color='primary' onClick={() => handleAction('last7Days')} style={{ textTransform: 'none', marginRight: '10px' }}>
          7d
        </Button>
        <Button color='primary' onClick={() => handleAction('reset')} style={{ textTransform: 'none' }}>
          Reset
        </Button>
        <Button color='primary' onClick={() => handleAction('accept')} style={{ textTransform: 'none' }}>
          OK
        </Button>
      </Box>
    </DialogActions>
  );
};

// Add prop types validation
CustomMobileActionBar.propTypes = {
  setDateRange: PropTypes.func.isRequired,
  closePicker: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

export default CustomMobileActionBar;
