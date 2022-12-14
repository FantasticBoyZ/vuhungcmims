import { API_URL } from '@/constants/apiUrl';
import authHeader from '@/services/authHeader';
import axiosClient from '@/utils/axiosCient';
import axios from 'axios';

// const API_URL = 'http://localhost:8080/api'
// const API_URL = process.env.REACT_APP_API_URL
const ManufactorService = {
  getManufactorList: (params) => {
    const url = '/manufacturer';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getAllManufacturer: (params) => {
    const url = '/manufacturer/notPaging';
    return axiosClient.get(url, { params, headers: authHeader() });
  },
  
  getManufacturerById: (params) => {
    const url = `/manufacturer/${params.manufacturerId}`;
    return axiosClient.get(url, {params ,headers: authHeader() });
  },
  saveManufacturer: (manufacturer) => {
    const url = API_URL + '/manufacturer/add';
    // const url = process.env.REACT_APP_API_URL + '/manufacturer/add'

    return axios
      .post(url, {
        id: manufacturer.id,
        name: manufacturer.name,
        email: manufacturer.email,
        phone: manufacturer.phone,
        provinceId: manufacturer.provinceId,
        districtId: manufacturer.districtId,
        wardId: manufacturer.wardId,
        addressDetail: manufacturer.addressDetail
      }, { headers: authHeader() })
  },
};

export default ManufactorService;
