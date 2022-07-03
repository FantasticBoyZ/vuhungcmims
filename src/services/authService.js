import axios from 'axios';
import { toast } from 'react-toastify';
const LOCAL_API_URL = 'http://localhost:8080/api/';
const API_URL = process.env.REACT_APP_API_URL + 'auth/';
// const API_URL = LOCAL_API_URL + '/api/auth/';
const register = (username, email, password) => {
  return axios.post(API_URL + 'signup', {
    username,
    email,
    password,
  });
};
const login = (username, password) => {
  return axios
    .post(API_URL + 'signin', {
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
const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};
export default AuthService;
