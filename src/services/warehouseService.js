import { API_URL } from '@/constants/apiUrl';
import authHeader from '@/services/authHeader';
import axiosClient from '@/utils/axiosCient';
import axios from 'axios';

const WarehouseService = {
  getWarehouseList: (params) => {
    const url = '/warehouse';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getAllWarehouse: (params) => {
    const url = '/warehouse/notPaging';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getWarehouseDetail: (params) => {
    const url = `/warehouse/${params}`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  addWarehouse: (params) => {
    const url = API_URL + `/warehouse/add`;
    return axios.post(url, params, { headers: authHeader() });
  },

  updateWarehouse: (params) => {
    const url = API_URL + `/warehouse/update`;
    return axios.put(url, params, { headers: authHeader() });
  },

  deleteWarehouse: (params) => {
    const url = API_URL + `/warehouse/delete/${params}`;
    return axios.delete(url, { params, headers: authHeader() });
  },

  getProvince: (params) => {
    const url = `/province`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getDistrict: (params) => {
    const url = `/district/${params.provinceId}`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getWard: (params) => {
    const url = `/ward/${params.districtId}`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },
};

export default WarehouseService;
