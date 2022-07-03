import axios from 'axios';
import queryString from 'query-string';

const LOCAL_API_URL = 'http://localhost:8080/api/'

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : LOCAL_API_URL,
  // baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'applicaion/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

// // Add a request interceptor
// axiosClient.interceptors.request.use(
//   function (config) {
//     // Do something before request is sent
//     return config;
//   },
//   function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   },
// );

// // Add a response interceptor
// axiosClient.interceptors.response.use(
//   function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     if (response && response.data) {
//       return response.data;
//     }
//     return response;
//   },
//   function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error);
//   },
// );

axiosClient.interceptors.request.use(
  (req) => {
    return req;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    const errResponse = error.response;
    if (!errResponse) {
      return Promise.reject(error);
    }
    if (errResponse.status === 403) {
      alert('Phiên làm việc hết hạn');
      localStorage.clear();
      window.location = '/';
    }
    if (errResponse.status === 401) {
      alert('Bạn chưa đăng nhập');
      window.location = '/';
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
