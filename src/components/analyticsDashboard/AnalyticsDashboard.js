import {
  TextField, Button, Typography, Container, Box, Paper,
  useMediaQuery, Grid,
} from '@mui/material';
import 'chart.js/auto'; // Ensure this is also imported if not already
import { DataGrid } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';

import { postHelloWorld, getActivityData, getCombinedAnalytics } from '../../services/apiService';

import CustomMobileActionBar from './CustomMobileActionBar';

const AnalyticsDashboard = () => {
  const [userId, setUserId] = useState('');
  const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);
  const [activityData, setActivityData] = useState([]);
  const [combinedAnalytics, setCombinedAnalytics] = useState({ logs: [], total: {} });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDateRangePicker, setOpenDateRangePicker] = useState(false);

  const mapPageToNextCursor = useRef({});
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10, // Take 10 as page size
  });

  // DateRangePicker close handler
  const handleCloseDateRangePicker = () => {
    setOpenDateRangePicker(false);
  };

  const desktopModeMediaQuery = '@media (min-width: 600px), @media (pointer: fine)';
  const isDesktop = useMediaQuery(desktopModeMediaQuery);

  const shortcutsItems = isDesktop ? [
    { label: 'Last 24 Hours', getValue: () => [dayjs().subtract(24, 'hour'), dayjs()] },
    { label: 'Last 7 Days', getValue: () => [dayjs().subtract(7, 'day'), dayjs()] },
    { label: 'Reset', getValue: () => [null, null] },
  ] : [];

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      fetchActivityData();
      fetchCombinedAnalytics();
    }
  }, [dateRange]);

  const handleHelloWorldSubmit = async () => {
    try {
      await postHelloWorld(userId);
    } catch (err) {
      setError(`Error in Hello World API: ${err.message}`);
    }
  };

  const fetchActivityData = async () => {
    try {
      const utcStartTime = dateRange[0].toISOString();
      const utcEndTime = dateRange[1].toISOString();
      const data = await getActivityData(utcStartTime, utcEndTime, paginationModel.pageSize);
      setActivityData(data.map((item) => ({
        ...item,
        date: dayjs(item.date).format('MMM D, YYYY'), // Format the date without time
      })));
    } catch (err) {
      setError(`Error fetching activity data: ${err.message}`);
    }
  };

  const fetchCombinedAnalytics = async (page = 0) => {
    setLoading(true);
    try {
      const utcStartTime = dateRange[0].toISOString();
      const utcEndTime = dateRange[1].toISOString();
      const firstId = mapPageToNextCursor.current[page - 1]; // Get cursor for next page
      const data = await getCombinedAnalytics(utcStartTime, utcEndTime, firstId, paginationModel.pageSize);
      setCombinedAnalytics({ logs: data.logs, total: data.total });
      mapPageToNextCursor.current[page] = data.next_first_id; // Update cursor mapping
    } catch (err) {
      setError(`Error fetching combined analytics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationModelChange = (newPaginationModel) => {
    if (newPaginationModel.page === 0 || mapPageToNextCursor.current[newPaginationModel.page - 1]) {
      setPaginationModel(newPaginationModel);
      fetchCombinedAnalytics(newPaginationModel.page);
    }
  };

  // Columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'user_id', headerName: 'User ID', width: 150 },
    { field: 'status', headerName: 'Status', width: 110 },
    { field: 'timestamp', headerName: 'Timestamp', width: 200 },
    {
      field: 'request',
      headerName: 'Request',
      width: 300,
    },
    {
      field: 'response',
      headerName: 'Response',
      width: 300,
    },
    { field: 'error_message', headerName: 'Error Message', width: 200 },
  ];

  // Styles for Paper components
  const paperStyle = {
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
    borderRadius: '15px',
  };

  // Prepare the data for the line graph
  const lineGraphData = {
    labels: activityData.map((data) => data.date),
    datasets: [
      {
        label: 'Total Calls',
        data: activityData.map((data) => data.total_calls),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Unique Users',
        data: activityData.map((data) => data.unique_users),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Total Failures',
        data: activityData.map((data) => data.total_failures),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <Container maxWidth='100%' style={{ backgroundColor: 'rgb(239, 242, 245)', padding: '20px' }}>
      <Grid container spacing={2}>
        {/* Dashboard Title */}
        <Grid item xs={12}>
          <Paper style={paperStyle}>
            <Typography variant='h4' gutterBottom>
              Analytics Dashboard
            </Typography>
            <Typography variant='subtitle1' style={{ marginBottom: '20px' }}>
              Note: All times are considered in UTC.
            </Typography>
            {error && <Typography color='error'>{error}</Typography>}
          </Paper>
        </Grid>

        {/* Time Filter Section */}
        <Grid item xs={12} md={6}>
          <Paper style={paperStyle}>
            <Box my={4}>
              <Typography variant='h6'>Time Filter</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateRangePicker
                  open={openDateRangePicker}
                  value={dateRange}
                  onChange={(newValue) => {
                    setDateRange(newValue);
                  }}
                  onOpen={() => setOpenDateRangePicker(true)}
                  onClose={() => setOpenDateRangePicker(false)}
                  desktopModeMediaQuery={desktopModeMediaQuery}
                  slotProps={{
                    shortcuts: { items: shortcutsItems },
                    actionBar: {
                      setDateRange: isDesktop ? undefined : setDateRange,
                      closePicker: handleCloseDateRangePicker,
                    },
                  }}
                  slots={{ actionBar: isDesktop ? undefined : CustomMobileActionBar }}
                  calendars={2}/>
              </LocalizationProvider>
            </Box>
          </Paper>
        </Grid>

        {/* Hello World API Test Section */}
        <Grid item xs={12} md={6}>
          <Paper style={paperStyle}>
            <Box my={4}>
              <Typography variant='h6'>Hello World API Test</Typography>
              <TextField
                label='User ID'
                type='text'
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                style={{ marginRight: '10px' }}/>
              <Button variant='contained' onClick={handleHelloWorldSubmit}>
                Send Hello World
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Aggregate Metrics Section */}
        <Grid item xs={12}>
          <Paper style={paperStyle}>
            <Box p={3}>
              <Typography variant='h6' gutterBottom>
                Aggregate Metrics
              </Typography>
              <Typography variant='body1'>
                Total Calls:
                {' '}
                {combinedAnalytics.total.calls}
              </Typography>
              <Typography variant='body1'>
                Total Failures:
                {' '}
                {combinedAnalytics.total.failures || 0}
              </Typography>
              <Typography variant='body1'>
                Unique Users:
                {' '}
                {combinedAnalytics.total.unique_users}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Activity Data Graph Section */}
        <Grid item xs={12}>
          <Paper style={paperStyle}>
            <Typography variant='h6' gutterBottom>Activity Data Graph</Typography>
            <Line data={lineGraphData}/>
          </Paper>
        </Grid>
        {/* Combined Analytics Section with Cursor-Based Pagination */}
        <Grid item xs={12}>
          <Paper style={paperStyle}>
            <Typography variant='h6' gutterBottom>Combined Analytics</Typography>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={combinedAnalytics.logs}
                columns={columns}
                pageSize={paginationModel.pageSize}
                rowCount={combinedAnalytics.total.total_logs}
                paginationMode='server'
                onPaginationModelChange={handlePaginationModelChange}
                paginationModel={paginationModel}
                pageSizeOptions={[paginationModel.pageSize]}
                loading={loading}/>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsDashboard;
