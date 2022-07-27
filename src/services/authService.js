import axios from 'axios';
import { toast } from 'react-toastify';
import authHeader from '@/services/authHeader';

// const API_URL = process.env.REACT_APP_API_URL;
const API_URL = 'http://localhost:8080/api';
const register = (username, email, password) => {
  return axios.post(API_URL + '/auth/signup', {
    username,
    email,
    password,
  });
};
const login = (username, password) => {
  return axios
    .post(API_URL + '/auth/signin', {
      username,
      password,
    })
    .then(
      (response) => {
        if (response.data.accessToken) {
          // runLogoutTimer(response.data.timer)
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      },
      (error) => {
        const errResponse = error.response;
        if (!errResponse) {
          return Promise.reject(error);
        }
        // if (errResponse.status === 403) {
        //   toast.error('Phiên làm việc hết hạn');
        //   localStorage.clear();
        //   window.location = '/';
        // }
        if (errResponse.status === 401) {
          toast.error('Tên đăng nhập hoặc mật khẩu không chính xác');
          // window.location = '/';
        }

        return Promise.reject(error);
      },
    );
};
const logout = () => {
  localStorage.removeItem('user');
};

const runLogoutTimer = (timer) => {
  setTimeout(() => {
    logout();
  }, timer);
};
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const forgotPassword = (username) => {
  const url = API_URL + `/user/forgot_password`;

  return axios.post(url, username, {
    headers: authHeader(),
  }) .then(
    (response) => {
      if (response.data) {
        return response.data;
      }
      
    },
    (error) => {
      const errResponse = error.message;
      if (!errResponse) {
        return Promise.reject(error);
      }

      return Promise.reject(error);
    },
  );
};

const checkOtp = (userInfo) => {
  const url = API_URL + `/user/check_otp`;

  return axios.post(url, userInfo, {
    headers: authHeader(),
  }) .then(
    (response) => {
      if (response.data) {
        return response.data;
      }
      
    },
    (error) => {
      const errResponse = error.message;
      if (!errResponse) {
        return Promise.reject(error);
      }

      return Promise.reject(error);
    },
  );
};

const setNewPassword = (userInfo) => {
  const url = API_URL + `/user/create-password`;

  return axios.post(url, userInfo, {
    headers: authHeader(),
  }) .then(
    (response) => {
      if (response.data) {
        return response.data;
      }
      
    },
    (error) => {
      const errResponse = error.message;
      if (!errResponse) {
        return Promise.reject(error);
      }

      return Promise.reject(error);
    },
  );
};
const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  checkOtp,
  setNewPassword,
};
export default AuthService;
