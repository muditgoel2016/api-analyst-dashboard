import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Function to call the hello-world endpoint
export const postHelloWorld = async (userId) => {
  try {
    const response = await axiosInstance.post('/hello-world', { user_id: userId });
    return response.data;
  } catch (error) {
    console.error('Error posting hello world', error);
    throw error;
  }
};

// Function to fetch activity data
export const getActivityData = async (startTime, endTime, limit) => {
  try {
    const response = await axiosInstance.get('/activity', { params: { startTime, endTime, limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching activity data', error);
    throw error;
  }
};

// Function to fetch combined analytics data
export const getCombinedAnalytics = async (startTime, endTime, firstId) => {
  try {
    const response = await axiosInstance.get('/combined-analytics', { params: { startTime, endTime, firstId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching combined analytics', error);
    throw error;
  }
};
