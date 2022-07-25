import axiosClient from '@/utils/axiosCient';
import authHeader from '@/services/authHeader';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
// const API_URL = process.env.REACT_APP_API_URL
const staffService = {
  getStaffList: (params) => {
    const url = '/staff/list';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getStaffById: (staffId) => {
    const url = `/staff/detail/${staffId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },

  setActiveForStaff: (params) => {
    const { staffId, isActive } = params;
    const url = `/staff/update-status/${staffId}`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  updateRoleForStaff: (params) => {
    const { staffId, roleId } = params;
    const url = API_URL + `/staff/update-role/${staffId}`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  signUpStaff: (staff) => {
    const url = API_URL + '/auth/signup';
    return axios.post(url, staff);
  },

  updateStaff: (staff) => {
    const url = API_URL + `/staff/update`;
    return axios.put(url, staff);
  },

  uploadImageNewStaff: (formData) => {
    const url = API_URL + '/staff/add/image';
    // const url = process.env.REACT_APP_API_URL + '/staff/add/image';

    axios.post(url, formData).then(
      (response) => {
        return response;
      },
      (error) => {
        console.log(error);
      },
    );
  },

  updateImageStaff: (staffId, formData) => {
    const url = API_URL + `/staff/update/image/${staffId}`;
    // const url = process.env.REACT_APP_API_URL + `/staff/update/image/${staffId}`;

    return axios
      .put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
  },
};

export default staffService;
