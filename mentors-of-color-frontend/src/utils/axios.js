import axios from 'axios';

const axiosServices = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080' 
});

axiosServices.interceptors.response.use(
  response => {
    return response;
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080'
});

axiosInstance.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem('serviceToken1');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices1.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('serviceToken');
    if (accessToken) {
      config.headers['Authorization'] = `1`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
if (error.response.status === 401 && !window.location.href.includes('/login')) {
      // window.location = '/login';
try {
  console.log(error.response);
  return Promise.reject((error.response && error.response.data) || 'Wrong Services');
} catch (error) {
  console.error('An error occurred:', error);
} finally {
  console.log('Error handling

export { axiosServices1 }

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcher1 = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices1.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.post(url, { ...config });

  return res.data;
};
